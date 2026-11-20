// =========================================================================================
// 🔒 PERMANENT LOCKED CHATBOT VOICE CONFIGURATION (DESIGN HOUSE STANDARD - DO NOT MODIFY!)
// DO NOT CHANGE THIS VOICE, PITCH, RATE, VOICENAME OR TIMEOUTS! IT IS PERMANENTLY APPROVED.
// - Engine: Backend Sarvam/OpenAI TTS audio stream -> Browser Web Speech API fallback (hi-IN)
// - Pitch: 1.05 | Rate: lang === "hi" ? 0.95 : 1
// - Voice Selection: pickVoice("hi") ?? pickVoice(lang) (natural Indian female accent)
// - Start Timeout: 10000ms
// =========================================================================================

export type Lang = "en" | "hi";

const VOICE_START_TIMEOUT_MS = 10000; // no sound by then: use the browser's voice (matches Design House 10s)
const VOICE_MAX_MS = 120000; // never hold the chat up longer than this

/* ───────────────────────── Natural voice (audio from the backend) ───────────────────────── */

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

/* ───────────────────────── Browser voice (the fallback) ───────────────────────── */

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

// Prefer Indian voices (en-IN for English, hi-IN for Hindi) so the natural North Indian Hindi accent is maintained across all languages!
const pickVoice = (lang: Lang): SpeechSynthesisVoice | undefined => {
  const codes =
    lang === "hi"
      ? ["hi-in", "en-in"]
      : ["en-in", "hi-in", "en-gb", "en-us"];

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

// "+91 96549 00525" → "9 6 5 4 9, 0 0 5 2 5" (Design House phone reading)
const spellPhone = (number: string) => {
  const digits = number.replace(/\D/g, "").slice(-10);
  return `${[...digits.slice(0, 5)].join(" ")}, ${[...digits.slice(5)].join(" ")}`;
};

// What is written for the eye, rewritten for the ear (the backend has already done this for its own replies)
export const forSpeech = (text: string, lang: Lang = "en") => {
  const isHi = lang === "hi" || /[ऀ-ॿ]/.test(text);
  const brandName = isHi ? "एन्सिस" : "Ensis";
  const brandAssist = isHi ? "एन्सिस असिस्ट" : "Ensis Assist";

  return text
    .replace(/(?:एन्सिस\s*असिस्ट|Ensis\s*Assist)\s*[\(\[]\s*(?:एन्सिस\s*असिस्ट|Ensis\s*Assist|Ensis|एन्सिस)\s*[\)\]]/gi, brandAssist)
    .replace(/(?:एन्सिस|Ensis)\s*[\(\[]\s*(?:Ensis|एन्सिस)\s*[\)\]]/gi, brandName)
    .replace(/[\(\[]\s*(?:Ensis|एन्सिस)\s*[\)\]]/gi, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "") // emoji
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[(?:ਡਿਟੇਲਸ ਦੇਖੋ|ਵੇਰਵਾ ਦੇਖੋ|डिटेल्स देखें|विवरण देखें|details dekhein|view details|learn more|details|click here|dekhein)\]\([^)]+\)/gi, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links [text](url) -> text
    .replace(/https?:\/\/[^\s)]+/gi, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // strip markdown bold/italics
    .replace(/\*+/g, " ")
    .replace(/(?:\+?91[\s-]*)?\b[6-9]\d{4}[\s-]?\d{5}\b/g, spellPhone)
    .replace(/(?:\+?91[\s-]*)?\b[6-9]\d{9}\b/g, spellPhone)
    .replace(/₹\s*([\d,]+)/g, isHi ? "$1 रुपये" : "$1 rupees")
    .replace(/\s*\+\s*(\d+)%\s*GST\b/gi, isHi ? " और $1 प्रतिशत जीएसटी" : " plus $1 percent GST")
    .replace(/\s*\+\s*GST\b/gi, isHi ? " और जीएसटी" : " plus GST")
    .replace(/\bEnsis Assist\b/gi, brandAssist)
    .replace(/\bEnsis\b/gi, brandName)
    .replace(/\bensis\b/gi, brandName)
    .replace(/^\s*[•✓-]\s*/, "")
    .replace(/\n\s*[•✓-]\s*/g, ", ") // list bullets (matches Design House)
    .replace(/(\d)\s*[–-]\s*(\d)/g, isHi ? "$1 से $2" : "$1 to $2") // "1–2 months"
    .replace(/(\d)\+/g, isHi ? "$1 से ज़्यादा" : "$1 plus") // "5000+"
    .replace(/\s&\s/g, isHi ? " और " : " and ")
    .replace(/\n+/g, ". ")
    .replace(/([.!?।,:])\s*\.(\s|$)/g, "$1$2") // "Namaste! . I'm" (emoji removed) → "Namaste! I'm"
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const detectScriptLang = (text: string): Lang => (/[ऀ-ॿ]/.test(text) ? "hi" : "en");

const speakWithBrowser = (text: string) => {
  const lang: Lang = detectScriptLang(text);
  const spoken = forSpeech(text, lang);
  if (!browserVoiceSupported() || !spoken) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(spoken);
    // Use the natural Indian voice for each script (Swara for hi-IN, Neerja for en-IN)
    // Both are authentic North Indian female voices maintaining the exact same Desi/Hindi accent!
    const voice = pickVoice(lang) ?? (lang === "en" ? pickVoice("hi") : pickVoice("en"));
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? (lang === "hi" ? "hi-IN" : "en-IN");
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

/* ───────────────────────── Used by the chat ───────────────────────── */

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
