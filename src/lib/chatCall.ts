/* A spoken call with the website chat's assistant (components/ui/Chatbot.tsx), over WebRTC to OpenAI's Realtime voice
   model. The backend opens the call, so no key is in the browser; after that sound goes straight between the browser
   and OpenAI, and events (what was said, what the assistant wants done) come over a data channel.

   Before the mic's sound goes out it passes a gate, so the assistant hears the person at the microphone and not the
   room. Whoever is talking to the chat is the loudest voice at the mic: the gate learns how loud they are and stays
   shut for anything much quieter (a fan, a TV, people further away).

   Noise cancellation (the chat's switch, on by default) makes the gate stricter, and OpenAI's filter keep only the voice
   close to the mic. There is deliberately no third filter here: a neural one (GTCRN) on top of the browser's and
   OpenAI's mangled speech into words of other languages, and kept out no more of the room than the gate does. */

// Sound levels (RMS, 0 to 1). Laptop mics can be quiet.
const SPEECH_LEVEL = 0.008;
const QUIETEST_ROOM = 0.002;
const NOISE_MARGIN = 3; // speech is this many times louder than the room's background noise
const MAIN_VOICE_SHARE = 0.35; // anything quieter than this part of the visitor's own voice isn't them...
const MAIN_VOICE_SHARE_STRICT = 0.45; // ...with noise cancellation on
const MAIN_VOICE_BAR_LIMIT = 0.08; // ...up to this level, so one loud moment can't shut a normal voice out
const OVER_THE_ASSISTANT = 0.012; // while the assistant talks, sound must be at least this loud...
const OVER_ECHO_MARGIN = 2; // ...and this many times louder than its voice coming back through the speakers...
const ECHO_BAR_LIMIT = 0.06; // ...up to this level, so a wrong guess about the echo can't lock the visitor out
const GOOD_VOICE_LEVEL = 0.12; // a quiet mic is turned up towards this before the sound goes out...
const MOST_TURNED_UP = 5; // ...by at most this much

// Times in milliseconds
const WARM_UP_MS = 300; // mics click when they switch on
const ROOM_WINDOW_MS = 2000; // speech always has small gaps within this time: sound with no gap at all is the room
const OPEN_AFTER_MS = 60;
const LEARN_ECHO_MS = 400; // when the assistant starts talking: how loud does it come back?
const AFTER_ASSISTANT_MS = 350; // the room still rings for a moment after it stops
const KEEP_OPEN_MS = 700; // the small pauses inside a sentence
const LOOK_AHEAD_S = 0.16; // the sound waits this long, so the gate opens before the first word goes through
const MAIN_VOICE_FORGET_PER_MS = 0.00001; // it fades (half in about a minute), for someone moving away or a new speaker

/** Decides from sound levels alone whether to let the mic's sound through. Separate from the mic, so it can be tested. */
export const createVoiceGate = () => {
  const recentLevels: number[] = [];
  let warmUp = WARM_UP_MS;
  let voiced = 0;
  let keepOpen = 0;
  let open = false;
  let mainVoice = 0;
  let echo = 0;
  let assistantTalking = false;
  let learnEcho = 0;
  let afterAssistant = 0;
  let mainVoiceShare = MAIN_VOICE_SHARE;

  const room = () => Math.max(QUIETEST_ROOM, Math.min(...recentLevels));

  return {
    /** Noise cancellation on: voices much quieter than the visitor's are shut out more firmly */
    setStrict(on: boolean) {
      mainVoiceShare = on ? MAIN_VOICE_SHARE_STRICT : MAIN_VOICE_SHARE;
    },

    setAssistantTalking(on: boolean) {
      if (on && !assistantTalking) learnEcho = LEARN_ECHO_MS;
      if (!on && assistantTalking) afterAssistant = AFTER_ASSISTANT_MS;
      assistantTalking = on;
    },

    /** One short piece of sound: its level, and how long it lasted. Returns whether the gate is open. */
    frame(level: number, ms: number) {
      recentLevels.push(level);
      if (recentLevels.length * ms > ROOM_WINDOW_MS) recentLevels.shift();
      if (warmUp > 0) {
        warmUp -= ms;
        return false;
      }

      const assistantHeard = assistantTalking || afterAssistant > 0;
      if (afterAssistant > 0) afterAssistant -= ms;
      // How loud its voice comes back. Anything louder than the limit is a person, not the speakers.
      // Not while the gate is open: that is the visitor talking over it, and learning their voice as "echo" shut them out
      if (assistantTalking && !open && level < ECHO_BAR_LIMIT) echo += (level - echo) * (level > echo ? 0.1 : 0.002);

      const echoBar = assistantHeard ? Math.min(ECHO_BAR_LIMIT, Math.max(OVER_THE_ASSISTANT, echo * OVER_ECHO_MARGIN)) : 0;
      const bar = Math.max(SPEECH_LEVEL, room() * NOISE_MARGIN, Math.min(MAIN_VOICE_BAR_LIMIT, mainVoice * mainVoiceShare), echoBar);

      if (learnEcho > 0) {
        learnEcho -= ms;
        if (!open) return false;
      }

      if (level > bar) {
        voiced = Math.min(voiced + ms, OPEN_AFTER_MS * 2);
        if (voiced >= OPEN_AFTER_MS) open = true;
        if (open) {
          keepOpen = KEEP_OPEN_MS;
          mainVoice += (level - mainVoice) * (level > mainVoice ? 0.08 : 0.01);
        }
      } else {
        voiced = Math.max(0, voiced - ms);
        if (open) {
          keepOpen -= ms;
          if (keepOpen <= 0) open = false;
        }
      }
      mainVoice *= 1 - MAIN_VOICE_FORGET_PER_MS * ms;
      return open;
    },

    /** How much to turn the sound up, so that a quiet mic still reaches the assistant clearly */
    volume() {
      return mainVoice > 0 ? Math.min(MOST_TURNED_UP, Math.max(1, GOOD_VOICE_LEVEL / mainVoice)) : 1;
    },
  };
};

// Runs apart from the page, so a busy page can't delay it. Hands over the sound about every 40 ms.
const TAP = `class DhMicTap extends AudioWorkletProcessor {
  constructor() { super(); this.sum = 0; this.count = 0; }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) {
      for (let i = 0; i < channel.length; i++) this.sum += channel[i] * channel[i];
      this.count += channel.length;
      if (this.count >= sampleRate * 0.04) {
        this.port.postMessage({ level: Math.sqrt(this.sum / this.count), ms: (this.count / sampleRate) * 1000 });
        this.sum = 0;
        this.count = 0;
      }
    }
    return true;
  }
}
registerProcessor("dh-mic-tap", DhMicTap);`;

export interface CallEvents {
  connect: (offer: string) => Promise<string>; // sends the connection offer to the backend, returns the answer
  onEvent: (event: { type: string; [key: string]: unknown }) => void;
  onLevel: (level: number) => void;
  onClosed: () => void; // the call dropped, or was ended from the other side
}

export interface Call {
  send: (event: object) => void;
  setAssistantTalking: (on: boolean) => void;
  setMuted: (on: boolean) => void;
  /** Turns noise cancellation on or off during the call */
  setNoiseCancel: (on: boolean) => void;
  stop: () => void;
}

/** True where the page can make a call (not on a plain http address, for one) */
export const canCall = () =>
  typeof RTCPeerConnection !== "undefined" &&
  typeof navigator.mediaDevices?.getUserMedia === "function" &&
  typeof AudioContext !== "undefined" &&
  "audioWorklet" in AudioContext.prototype;

const CONNECT_TIMEOUT_MS = 15000;

/** Asks for the mic and connects. Call it from a click. Rejects if the mic can't be opened or the call can't connect. */
export async function openCall(events: CallEvents, options: { noiseCancel: boolean } = { noiseCancel: true }): Promise<Call> {
  // Made before anything is awaited: browsers only allow sound to start during a click
  const ctx = new AudioContext();
  const speaker = new Audio();
  speaker.autoplay = true;

  let stream: MediaStream | null = null;
  let pc: RTCPeerConnection | null = null;
  let closed = false;
  let muted = false;

  const shutDown = () => {
    closed = true;
    pc?.close();
    stream?.getTracks().forEach((track) => track.stop());
    speaker.srcObject = null;
    void ctx.close();
  };

  try {
    // The browser's own filters first: they remove the assistant's voice from the speakers, and steady noise. Not its
    // automatic volume: that lifts distant voices, and how loud a voice really is tells the gate who is at the mic.
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false } });
    await ctx.resume();
    const script = URL.createObjectURL(new Blob([TAP], { type: "application/javascript" }));
    await ctx.audioWorklet.addModule(script);
    URL.revokeObjectURL(script);

    const source = ctx.createMediaStreamSource(stream);
    const tap = new AudioWorkletNode(ctx, "dh-mic-tap");
    source.connect(tap).connect(ctx.destination); // it outputs silence: the connection only keeps it running

    const delay = ctx.createDelay(1);
    delay.delayTime.value = LOOK_AHEAD_S;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const toCall = ctx.createMediaStreamDestination();
    source.connect(delay).connect(gain).connect(toCall);

    const gate = createVoiceGate();
    gate.setStrict(options.noiseCancel);
    tap.port.onmessage = ({ data }: MessageEvent<{ level: number; ms: number }>) => {
      events.onLevel(muted ? 0 : data.level);
      const open = gate.frame(data.level, data.ms);
      gain.gain.setTargetAtTime(open && !muted ? gate.volume() : 0, ctx.currentTime, 0.015);
    };

    const connection = new RTCPeerConnection();
    pc = connection;
    connection.ontrack = ({ streams }) => {
      speaker.srcObject = streams[0];
      void speaker.play().catch(() => {});
    };
    toCall.stream.getTracks().forEach((track) => connection.addTrack(track, toCall.stream));

    const channel = connection.createDataChannel("oai-events");
    channel.onmessage = ({ data }) => {
      try {
        events.onEvent(JSON.parse(data));
      } catch {
        // not an event
      }
    };

    const dropped = () => {
      if (closed) return;
      shutDown();
      events.onClosed();
    };
    connection.onconnectionstatechange = () => {
      if (connection.connectionState === "failed" || connection.connectionState === "closed") dropped();
    };

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    const answer = await events.connect(offer.sdp || "");
    await connection.setRemoteDescription({ type: "answer", sdp: answer });

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("The call didn't connect")), CONNECT_TIMEOUT_MS);
      channel.onopen = () => {
        clearTimeout(timer);
        resolve();
      };
    });
    channel.onclose = dropped;

    return {
      send: (event) => {
        if (channel.readyState === "open") channel.send(JSON.stringify(event));
      },
      setAssistantTalking: gate.setAssistantTalking,
      setNoiseCancel: gate.setStrict,
      setMuted: (on) => {
        muted = on;
        if (on) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
      },
      stop: () => {
        if (!closed) shutDown();
      },
    };
  } catch (error) {
    shutDown();
    throw error;
  }
}
