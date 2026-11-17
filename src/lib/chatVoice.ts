/* Typed chat replies read aloud (components/ui/Chatbot.tsx; in a spoken call the assistant has its own voice).
   They are read by a natural voice generated on the backend (OpenAI). If that can't play, the browser's own voice
   (Web Speech API) reads them instead, so a reply is never silently skipped. */

type Lang = "en" | "hi";

const VOICE_START_TIMEOUT_MS = 10000; // no sound by then: use the browser's voice
const VOICE_MAX_MS = 120000; // never hold the chat up longer than this

/* ─────────────────────────────────── Natural voice (audio from the backend) ─────────────────────────────────── */

// A tiny silent clip: playing it during a click lets Safari play later replies through the same element
const SILENCE = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

let player: HTMLAudioElement | null = null;
let stopPlayer: (() => void) | null = null;

/** Call inside a click, so replies that arrive later are allowed to play. */
export function unlockVoice() {
  if (player || typeof Audio === "undefined") return;
  player = new Audio(SILENCE);
  void player.play().catch(() => {});
}

// "failed" means nothing was heard, so another voice should read it
const playClip = (url: string) =>
  new Promise<"finished" | "failed">((resolve) => {
    const audio = (player ??= new Audio());
    let started = false;
    let settled = false;

    const finish = (how: "finished" | "failed") => {
      if (settled) return;
      settled = true;
      clearTimeout(startGuard);
      clearTimeout(endGuard);
      audio.onplaying = audio.onended = audio.onerror = null;
      stopPlayer = null;
      audio.pause();
      // Also ends the download, so the backend stops generating (and paying for) audio nobody will hear
      audio.removeAttribute("src");
      audio.load();
      resolve(how);
    };

    const startGuard = setTimeout(() => finish("failed"), VOICE_START_TIMEOUT_MS);
    const endGuard = setTimeout(() => finish("finished"), VOICE_MAX_MS);
    stopPlayer = () => finish("finished");

    audio.onplaying = () => {
      started = true;
      clearTimeout(startGuard);
    };
    audio.onended = () => finish("finished");
    audio.onerror = () => finish(started ? "finished" : "failed");

    audio.src = url;
    // AbortError: it was stopped, which isn't a failure
    audio.play().catch((error: DOMException) => {
      if (error.name !== "AbortError") finish("failed");
    });
  });

/* ─────────────────────────────────── Browser voice (the fallback) ─────────────────────────────────── */

const browserVoiceSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let voices: SpeechSynthesisVoice[] = [];
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

/** Starts loading the browser's voices (they arrive asynchronously in Chrome/Edge). */
export function prepareVoices(): () => void {
  if (!browserVoiceSupported()) return () => {};
  loadVoices();
  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
}

// Indian English first, then other English; Hindi for हिं. Natural/online voices sound best.
const pickVoice = (lang: Lang): SpeechSynthesisVoice | undefined => {
  const codes = lang === "hi" ? ["hi-in"] : ["en-in", "en-gb", "en-us"];
  for (const code of codes) {
    const matches = voices.filter((v) => v.lang.replace("_", "-").toLowerCase() === code);
    if (matches.length) {
      return (
        matches.find((v) => /natural|online/i.test(v.name) && /neerja|swara|heera|kalpana|female|aria|jenny|sonia/i.test(v.name)) ??
        matches.find((v) => /natural|online|google/i.test(v.name)) ??
        matches[0]
      );
    }
  }
  return voices.find((v) => v.lang.toLowerCase().startsWith(lang));
};

const DIGITS_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const DIGITS_HI = ["शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ"];

const spellPhone = (number: string, isHindi = false): string => {
  const digits = number.replace(/\D/g, "").slice(-10);
  const words = digits.split("").map((d) => (isHindi ? DIGITS_HI[Number(d)] : DIGITS_EN[Number(d)]));
  const prefix = isHindi ? "प्लस नौ एक, " : "plus nine one, ";
  return prefix + words.slice(0, 5).join(", ") + ", " + words.slice(5).join(", ");
};

const spellOtp = (code: string, isHindi = false): string => {
  const digits = code.replace(/\D/g, "");
  return digits.split("").map((d) => (isHindi ? DIGITS_HI[Number(d)] : DIGITS_EN[Number(d)])).join(", ");
};

// What is written for the eye, rewritten for the ear (the backend has already done this for its own replies)
const forSpeech = (text: string, lang: Lang) => {
  const isHi = lang === "hi";
  return text
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "") // emoji
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links [text](url) -> text
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // strip markdown bold/italics
    .replace(/\*+/g, " ") // strip stray asterisks to prevent "तारंकन" (tarankan) pronunciation
    .replace(/[•●▪■◆★☆✓✔☑]/g, " ") // strip bullets
    .replace(/\bEnsis Assist\b/gi, isHi ? "एन्सिस असिस्ट" : "En-sis Assist")
    .replace(/\bEnsis\b/gi, isHi ? "एन्सिस" : "En-sis")
    .replace(/(?:\+?91[\s-]*)?\b[6-9]\d{9}\b|(?:\+?91[\s-]*)?\b[6-9]\d{4}[\s-]?\d{5}\b/g, (m) => spellPhone(m, isHi))
    .replace(/\b\d{6}\b/g, (m) => spellOtp(m, isHi))
    .replace(/(\d)\s*[–-]\s*(\d)/g, isHi ? "$1 से $2" : "$1 to $2") // "1–2 months"
    .replace(/(\d)\+/g, isHi ? "$1 से ज़्यादा" : "$1 plus") // "5000+"
    .replace(/\s&\s/g, isHi ? " और " : " and ")
    .replace(/\n+/g, ". ")
    .replace(/([.!?।])\s*\.(\s|$)/g, "$1$2") // "Namaste! . I'm" (emoji removed) → "Namaste! I'm"
    .replace(/\s{2,}/g, " ")
    .trim();
};

const speakWithBrowser = (text: string) => {
  const lang: Lang = /[अ-ह]/.test(text) ? "hi" : "en";
  const spoken = forSpeech(text, lang);
  if (!browserVoiceSupported() || !spoken) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(spoken);
    // The Hindi voice for English too: its Indian accent is the one that sounds right
    const voice = pickVoice("hi") ?? pickVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "hi-IN";
    utterance.rate = lang === "hi" ? 0.95 : 1;
    utterance.pitch = 1.05;

    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(guard);
      resolve();
    };
    utterance.onend = done;
    utterance.onerror = done;
    // Some browsers never fire "end" (or the voice is missing): don't hold the chat up
    const guard = setTimeout(done, Math.min(4000 + spoken.length * 90, 30000));

    window.speechSynthesis.speak(utterance);
  });
};

/* ─────────────────────────────────── Used by the chat ─────────────────────────────────── */

/**
 * Reads `text` aloud and resolves when it has been spoken (or straight away if speech is unavailable).
 * `audioUrl` is the natural voice's audio for the same text, when the backend has one. Never rejects.
 */
export async function speak(text: string, audioUrl?: string): Promise<void> {
  if (audioUrl && (await playClip(audioUrl)) === "finished") return;
  await speakWithBrowser(text);
}

/** Stops anything being read out (closing the chat, the visitor sending a new message, muting). */
export function stopSpeaking() {
  stopPlayer?.();
  if (browserVoiceSupported()) window.speechSynthesis.cancel();
}
