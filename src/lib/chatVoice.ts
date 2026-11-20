/* Typed chat replies read aloud (components/ui/Chatbot.tsx; in a spoken call the assistant has its own voice).
   They are read by a natural voice generated on the backend (OpenAI/Sarvam). If that can't play, the browser's own voice
   (Web Speech API) reads them instead, so a reply is never silently skipped. */

export type Lang = "en" | "hi" | "bn" | "pa";

export const detectScriptLang = (text: string): Lang => {
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa"; // Punjabi / Gurmukhi
  if (/[\u0980-\u09FF]/.test(text)) return "bn"; // Bengali
  if (/[\u0900-\u097F]/.test(text)) return "hi"; // Hindi / Devanagari
  return "en";
};

const VOICE_START_TIMEOUT_MS = 4500; // no sound by then: use the browser's voice
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

// Indian English first, then other English; Hindi for हिं. Natural/online voices sound best (Design House standard).
const pickVoice = (lang: Lang): SpeechSynthesisVoice | undefined => {
  if (!voices.length && typeof window !== "undefined") {
    loadVoices();
  }
  const codes =
    lang === "pa"
      ? ["pa-in", "hi-in", "en-in", "en-gb", "en-us"]
      : lang === "bn"
      ? ["bn-in", "hi-in", "en-in", "en-gb", "en-us"]
      : lang === "hi"
      ? ["hi-in", "en-in", "en-gb", "en-us"]
      : ["en-in", "en-gb", "en-us", "hi-in"];

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
  return voices.find((v) => v.lang.toLowerCase().startsWith(lang)) || voices[0];
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
export const forSpeech = (text: string, lang: Lang = "en") => {
  const isPa = lang === "pa" || /[\u0A00-\u0A7F]/.test(text);
  const isBn = lang === "bn" || /[\u0980-\u09FF]/.test(text);
  const isHi = lang === "hi" || /[\u0900-\u097F]/.test(text);
  const hasProductLinks = /\[(?:ਡਿਟੇਲਸ ਦੇਖੋ|ਵੇਰਵਾ ਦੇਖੋ|डिटेल्स देखें|विवरण देखें|details dekhein|view details|learn more|details|click here|dekhein)\]\([^)]+\)/i.test(text);

  let spoken = text;
  // Deduplicate brand names like "एन्सिस (Ensis)" or "Ensis Ensis" so Ensis is NEVER spoken twice!
  const brandName = isPa ? "ਐਨਸਿਸ" : isBn ? "এনসিস" : isHi ? "एन्सिस" : "En-sis";
  const brandAssist = isPa ? "ਐਨਸਿਸ ਅਸਿਸਟ" : isBn ? "এনসিস অ্যাসিস্ট" : isHi ? "एन्सिस असिस्ट" : "En-sis Assist";

  spoken = spoken
    .replace(/(?:एन्सिस\s*असिस्ट|এনসিস\s*অ্যাসিস্ট|ਐਨਸਿਸ\s*ਅਸਿਸਟ|Ensis\s*Assist)\s*[\(\[]\s*(?:एन्सिस\s*असिस्ट|এনসিস\s*অ্যাসিস্ট|ਐਨਸਿਸ\s*ਅਸਿਸਟ|Ensis\s*Assist|Ensis|एन्सिस)\s*[\)\]]/gi, brandAssist)
    .replace(/(?:एन्सिस|এনসিস|ਐਨਸਿਸ|Ensis)\s*[\(\[]\s*(?:Ensis|एन्सिस|এনসিস|ਐਨਸਿਸ)\s*[\)\]]/gi, brandName)
    .replace(/[\(\[]\s*(?:Ensis|एन्सिस|এনসিস|ਐਨਸਿਸ)\s*[\)\]]/gi, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "") // emoji
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[(?:ਡਿਟੇਲਸ ਦੇਖੋ|ਵੇਰਵਾ ਦੇਖੋ|डिटेल्स देखें|विवरण देखें|details dekhein|view details|learn more|details|click here|dekhein)\]\([^)]+\)/gi, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // markdown links [text](url) -> text
    .replace(/https?:\/\/[^\s)]+/gi, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // strip markdown bold/italics
    .replace(/\*+/g, " ") // strip stray asterisks to prevent "तारंकन" (tarankan) pronunciation
    .replace(/[•●▪■◆★☆✓✔☑]/g, " ") // strip bullets
    .replace(/\s*[-–—]\s*(?=₹|Rs\b|\d)/gi, ", ")
    .replace(/(\p{L})\s*[-–—]\s*(\p{L})/gu, "$1, $2")
    .replace(/₹\s*([\d,]+)/g, isPa ? "$1 ਰੁਪਏ" : isBn ? "$1 টাকা" : isHi ? "$1 रुपये" : "$1 rupees")
    .replace(/\s*\+\s*(\d+)%\s*GST\b/gi, isPa ? " ਅਤੇ $1 ਫ਼ੀਸਦੀ ਜੀਐੱਸਟੀ" : isBn ? " এবং $1 শতাংশ জিএসটি" : isHi ? " और $1 प्रतिशत जीएसटी" : " plus $1 percent GST")
    .replace(/\s*\+\s*GST\b/gi, isPa ? " ਅਤੇ ਜੀਐੱਸਟੀ" : isBn ? " এবং জিএসটি" : isHi ? " और जीएसटी" : " plus GST")
    .replace(/\s*\+\s*(\d+)%\s*tax\b/gi, isPa ? " ਅਤੇ $1 ਫ਼ੀਸਦੀ tax" : isBn ? " এবং $1 শতাংশ tax" : isHi ? " और $1 प्रतिशत tax" : " plus $1 percent tax")
    .replace(/(\d+)%/g, isPa ? "$1 ਫ਼ੀਸਦੀ" : isBn ? "$1 শতাংশ" : isHi ? "$1 प्रतिशत" : "$1 percent")
    .replace(/\bGST\b/g, isPa ? "ਜੀਐੱਸਟੀ" : isBn ? "জিএসটি" : isHi ? "जीएसटी" : "GST")
    .replace(/\bEnsis Assist\b/gi, brandAssist)
    .replace(/\bEnsis\b/gi, brandName)
    .replace(/\bensis\b/gi, brandName);

  // Unicode deduplication of repeated brand words e.g. "एन्सिस एन्सिस", "एन्सिस Ensis"
  const dupRegex = /(^|[^\p{L}\p{M}])(एन्सिस|এনসিস|ਐਨਸਿਸ|En-sis|Ensis)(?:[\s,]+|\s*(?:या|or|मतलब)\s*)(?:एन्सिस|এনসিস|ਐਨਸਿਸ|En-sis|Ensis)(?=[^\p{L}\p{M}]|$)/giu;
  spoken = spoken.replace(dupRegex, "$1$2").replace(dupRegex, "$1$2");

  spoken = spoken
    .replace(/(?:\+?91[\s-]*)?\b[6-9]\d{9}\b|(?:\+?91[\s-]*)?\b[6-9]\d{4}[\s-]?[\d]{5}\b/g, (m) => spellPhone(m, isHi || isPa))
    .replace(/\b\d{6}\b/g, (m) => spellOtp(m, isHi || isPa))
    .replace(/(\d)\s*[–-]\s*(\d)/g, isPa ? "$1 ਤੋਂ $2" : isBn ? "$1 থেকে $2" : isHi ? "$1 से $2" : "$1 to $2") // "1–2 months"
    .replace(/(\d)\+/g, isPa ? "$1 ਤੋਂ ਵੱਧ" : isBn ? "$1-এর বেশি" : isHi ? "$1 से ज़्यादा" : "$1 plus") // "5000+"
    .replace(/\s&\s/g, isPa ? " ਅਤੇ " : isBn ? " এবং " : isHi ? " और " : " and ")
    .replace(/\s*\+\s*/g, isPa ? " ਅਤੇ " : isBn ? " এবং " : isHi ? " और " : " plus ")
    .replace(/\n+/g, ". ")
    .replace(/([.!?।])\s*\.(\s|$)/g, "$1$2") // "Namaste! . I'm" (emoji removed) → "Namaste! I'm"
    .replace(/\s{2,}/g, " ")
    .trim();

  if (hasProductLinks && !/ਸਕ੍ਰੀਨ|स्क्रीन|screen|লিঙ্ক/i.test(spoken)) {
    spoken += isPa
      ? ". ਵਿਸਤ੍ਰਿਤ ਜਾਣਕਾਰੀ ਅਤੇ ਲਿੰਕ ਸਕ੍ਰੀਨ ਤੇ ਦਿੱਤੇ ਗਏ ਹਨ।"
      : isBn
      ? ". বিস্তারিত বিবরণ এবং লিঙ্ক স্ক্রিনে দেওয়া আছে।"
      : isHi
      ? ". विस्तृत विवरण और लिंक्स स्क्रीन पर दिए गए हैं।"
      : ". Detailed links are displayed on screen.";
  }
  return spoken;
};

const speakWithBrowser = (text: string) => {
  const lang: Lang = detectScriptLang(text);
  const spoken = forSpeech(text, lang);
  if (!browserVoiceSupported() || !spoken) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(spoken);
    const voice = pickVoice(lang) ?? pickVoice("en") ?? voices[0];
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0; // Calm, steady, natural feminine voice (Saumya style - never high pitched or sharp)

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

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch {
      done();
    }
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
