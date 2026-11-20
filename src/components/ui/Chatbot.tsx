"use client";

import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  AudioLines,
  Ban,
  Bell,
  BellOff,
  Download,
  Headset,
  Mic,
  MicOff,
  Minus,
  PhoneOff,
  Send,
  Volume2,
  VolumeX,
  X,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { BACKEND_URL, getComponentContent, getImageUrl } from "@/lib/api/api";
import logoFallback from "@/assets/logo.webp";
import LottieChatbotAvatar from "@/components/ui/LottieChatbotAvatar";
import { isAbusive } from "@/lib/chatGuards";
import { canCall, openCall, type Call } from "@/lib/chatCall";
import { prepareVoices, speak, stopSpeaking, unlockVoice } from "@/lib/chatVoice";

/* The conversation itself lives on the backend (/api/chatbot): it answers from Ensis Panchkarma
   and Wellness equipment catalogue, handles inquiries, blocks abusive visitors, and saves every
   chat with its IP. Opening the chat can start a spoken call over WebRTC. Typing works seamlessly
   during a call or standalone, with spoken natural voice replies. */

type Lang = "en" | "hi" | "bn" | "pa";

const COPY = {
  en: {
    title: "Ensis Assist",
    subtitle: "Panchkarma & Wellness Specialist",
    placeholder: "Ask about Panchkarma tables, steam chambers, quotes...",
    blockedPlaceholder: "This chat is temporarily blocked",
    blockedNote: "Chat blocked for offensive language",
    blockedOpensIn: "It opens again in",
    blockedByTeam: "Please call +91 98111 63983 or email info@ensis.in for genuine enquiries.",
    abuseHint: "Please avoid offensive words. Sending this counts as a warning.",
    footer: "AI Assistant • Inquiries and IP address are saved for follow-up",
    online: "Online",
    typing: "typing…",
    soundOn: "Notification sound on",
    soundOff: "Notification sound off",
    voiceOn: "Voice replies on",
    voiceOff: "Voice replies off",
    callStart: "Talk to me",
    callEnd: "End the call",
    chatEnded: "This chat has ended.",
    resume: "Resume chat",
    callMute: "Mute your mic",
    callUnmute: "Unmute your mic",
    connecting: "Connecting...",
    listening: "I'm listening, just speak...",
    interruptHint: "Speak any time, I'll stop and listen",
    muted: "Your mic is muted",
    micDenied: "Microphone access is blocked. Allow mic in browser address bar, or just type here.",
    micNoSpeech: "I can't hear anything. Please check your microphone.",
    micNotFound: "No microphone was found on this device. You can type here.",
    micBusy: "Another app is using the microphone. Close it and try again, or type here.",
    callFailed: "Voice call couldn't connect. You can type here.",
    callUnavailable: "Voice calls aren't available right now. You can type here and I'll reply.",
    callDropped: "The call ended. Tap the mic to talk again.",
    callEnding: "This call is reaching its limit. You can carry on by typing here.",
    goodbye: "Namaskar! I hope you find me helpful. If not, please contact us at +91 9810242841 or +91 9654900525 for more help. Have a wonderful and healthy day ahead!",
    callIdle: "I ended the call because it was quiet for a while. Tap the mic to talk again.",
    didntCatch: "Sorry, I didn't catch that. Could you say it again?",
    noise: "Noise cancellation",
    noiseOnHint: "On: background noise and ambient voices are filtered out",
    noiseOffHint: "Off: your mic is heard as it is",
    teamTitle: "Ensis Wellness Team",
    teamSubtitle: "You're chatting with our team",
    teamName: "Ensis Team",
    teamJoined: "A specialist from the Ensis team has joined the chat",
    teamLeft: "The team has left the chat. Ensis Assist will reply from here.",
    teamPlaceholder: "Message our team...",
    teamFooter: "You're chatting with an Ensis representative",
  },
  hi: {
    title: "Ensis Assist",
    subtitle: "Panchkarma & Wellness Specialist",
    placeholder: "Panchkarma equipment, quotation ke baare mein poochhiye...",
    blockedPlaceholder: "Ye chat block hai",
    blockedNote: "Galat bhasha ki wajah se chat block hai",
    blockedOpensIn: "Chat phir se active hogi",
    blockedByTeam: "Sach mein koi inquiry ho toh +91 98111 63983 par call kijiye.",
    abuseHint: "Please galat shabd use na kijiye. Bhejne par warning milegi.",
    footer: "AI Assistant • Chat aur IP address follow-up ke liye save hote hain",
    online: "Online",
    typing: "likh rahi hai…",
    soundOn: "Notification sound on",
    soundOff: "Notification sound off",
    voiceOn: "Bolkar jawab on",
    voiceOff: "Bolkar jawab off",
    callStart: "Mujhse baat kijiye",
    callEnd: "Call band kijiye",
    chatEnded: "Ye chat band ho gayi hai.",
    resume: "Chat phir shuru kijiye",
    callMute: "Apna mic band kijiye",
    callUnmute: "Apna mic chalu kijiye",
    connecting: "Jod rahi hoon...",
    listening: "Sun rahi hoon, bas boliye...",
    interruptHint: "Kabhi bhi boliye, main rukkar sunungi",
    muted: "Aapka mic band hai",
    micDenied: "Microphone permission allow kijiye ya yahan likh dijiye.",
    micNoSpeech: "Kuch sunai nahi de raha. Microphone check kar lijiye.",
    micNotFound: "Microphone nahi mila. Aap yahan likh sakte hain.",
    micBusy: "Doosra app mic use kar raha hai. Use band kijiye ya yahan likhiye.",
    callFailed: "Maaf kijiye, call jud nahi payi. Aap yahan likh sakte hain.",
    callUnavailable: "Abhi voice call available nahi hai. Aap yahan likhiye.",
    callDropped: "Call band ho gayi. Baat karni ho toh mic dabaiye.",
    callEnding: "Call ka time poora hone wala hai. Aap chat mein likhkar continue kar sakte hain.",
    goodbye: "नमस्कार! आशा है यह बातचीत आपके लिए उपयोगी रही। यदि नहीं, तो अधिक सहायता के लिए आप हमारे हेल्पलाइन नंबर +91 9810242841 या +91 9654900525 पर कभी भी संपर्क कर सकते हैं। आपका दिन शुभ और मंगलमय हो!",
    callIdle: "Kaafi der se koi awaaz nahi aayi, isliye call band kar di. Dobara baat karni ho toh mic dabaiye.",
    didntCatch: "Maaf kijiye, main theek se samajh nahi paayi. Kya aap dobara bata sakte hain?",
    noise: "Noise cancellation",
    noiseOnHint: "On: aas-paas ka shor aur door ki awaazein filter hoti hain",
    noiseOffHint: "Off: aapka mic jaisa hai waisa suna jata hai",
    teamTitle: "Ensis Wellness Team",
    teamSubtitle: "Aap hamari team se baat kar rahe hain",
    teamName: "Ensis Team",
    teamJoined: "Ensis team se koi chat mein jud gaye hain",
    teamLeft: "Team chat se chali gayi. Ab Ensis Assist jawab degi.",
    teamPlaceholder: "Hamari team ko likhiye...",
    teamFooter: "Aap Ensis ki team se baat kar rahe hain",
  },
  bn: {
    title: "এনসিস অ্যাসিস্ট",
    subtitle: "আয়ুর্বেদিক ও পঞ্চকর্ম বিশেষজ্ঞ",
    placeholder: "পঞ্চকর্ম টেবিল, স্টিম বাথ বা কোটেশন সম্পর্কে জিজ্ঞাসা করুন...",
    blockedPlaceholder: "এই চ্যাটটি সাময়িক স্থগিত আছে",
    blockedNote: "অনুচিত ভাষার জন্য চ্যাট স্থগিত করা হয়েছে",
    blockedOpensIn: "আবার খোলা হবে",
    blockedByTeam: "জরুরি সহায়তার জন্য +91 9810242841 নম্বরে যোগাযোগ করুন।",
    abuseHint: "দয়া করে ভদ্র ভাষা ব্যবহার করুন।",
    offline: "ক্ষমা করবেন, চ্যাটটি এই মুহূর্তে উপলব্ধ নেই। +91 9810242841 নম্বরে কল করুন।",
    footer: "এনসিস এআই অ্যাসিস্ট্যান্ট • পঞ্চকর্ম ও ওয়েলনেস সরঞ্জাম",
    online: "অনলাইন",
    typing: "টাইপ করছে…",
    soundOn: "শব্দ চালু",
    soundOff: "শব্দ বন্ধ",
    voiceOn: "ভয়েস উত্তর চালু",
    voiceOff: "ভয়েস উত্তর বন্ধ",
    callStart: "কথা বলুন",
    callEnd: "কল শেষ করুন",
    chatEnded: "চ্যাটটি শেষ হয়েছে।",
    resume: "আবার শুরু করুন",
    callMute: "মাইক বন্ধ করুন",
    callUnmute: "মাইক চালু করুন",
    connecting: "সংযুক্ত হচ্ছে...",
    listening: "শুনছি, বলুন...",
    interruptHint: "যেকোনো সময় বলুন, আমি শুনব",
    muted: "মাইক বন্ধ আছে",
    micDenied: "মাইক্রোফোন অনুমতি দেওয়া হয়নি। ব্রাউজারে অনুমতি দিন।",
    micNoSpeech: "কিছু শুনতে পাইনি। অনুগ্রহ করে আবার বলুন।",
    micNotFound: "কোনো মাইক্রোফোন পাওয়া যায়নি।",
    micBusy: "মাইক্রোফোন অন্য কোনো অ্যাপ ব্যবহার করছে।",
    callFailed: "কল সংযোগ করা যায়নি।",
    callUnavailable: "ভয়েস পরিষেবা এই মুহূর্তে উপলব্ধ নেই।",
    callDropped: "কল বিচ্ছিন্ন হয়েছে। কথা বলতে মাইকে চাপ দিন।",
    callEnding: "কলের সময়সীমা শেষ হচ্ছে।",
    goodbye: "এনসিস-এর সাথে যোগাযোগ করার জন্য ধন্যবাদ। আপনার দিনটি শুভ হোক!",
    callIdle: "কিছুক্ষণ কোনো শব্দ না পাওয়ায় কলটি শেষ হয়েছে।",
    didntCatch: "ক্ষমা করবেন, বুঝতে পারিনি। আরেকবার বলবেন কি?",
    noise: "নয়েজ রিডাকশন",
    noiseOnHint: "চালু: চারপাশের অতিরিক্ত শব্দ ফিল্টার হয়",
    noiseOffHint: "বন্ধ: স্বাভাবিক মাইক",
    teamTitle: "এনসিস বিশেষজ্ঞ দল",
    teamSubtitle: "সরাসরি সহায়তা",
    teamName: "এনসিস টিম",
    teamJoined: "এনসিস দল থেকে একজন যুক্ত হয়েছেন",
    teamLeft: "দল চ্যাট থেকে প্রস্থান করেছে। এনসিস অ্যাসিস্ট উত্তর দেবে।",
    teamPlaceholder: "এনসিস দলকে লিখুন...",
    teamFooter: "আপনি এনসিস প্রতিনিধির সাথে চ্যাট করছেন",
  },
  pa: {
    title: "ਐਨਸਿਸ ਅਸਿਸਟ",
    subtitle: "ਆਯੁਰਵੇਦਿਕ ਅਤੇ ਪੰਚਕਰਮਾ ਮਾਹਿਰ",
    placeholder: "ਪੰਚਕਰਮਾ ਟੇਬਲ, ਸਟੀਮ ਚੈਂਬਰ ਜਾਂ ਕੋਟੇਸ਼ਨ ਬਾਰੇ ਪੁੱਛੋ...",
    blockedPlaceholder: "ਇਹ ਚੈਟ ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਬਲਾਕ ਹੈ",
    blockedNote: "ਗਲਤ ਭਾਸ਼ਾ ਕਾਰਨ ਚੈਟ ਬਲਾਕ ਹੈ",
    blockedOpensIn: "ਦੁਬਾਰਾ ਖੁੱਲ੍ਹੇਗੀ",
    blockedByTeam: "ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ ਲਈ +91 9810242841 'ਤੇ ਕਾਲ ਕਰੋ ਜੀ।",
    abuseHint: "ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਿਸ਼ਟਾਚਾਰ ਵਾਲੀ ਭਾਸ਼ਾ ਵਰਤੋ।",
    offline: "ਮਾਫ਼ ਕਰਨਾ, ਇਸ ਸਮੇਂ ਚੈਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। +91 9810242841 'ਤੇ ਸੰਪਰਕ ਕਰੋ ਜੀ।",
    footer: "ਐਨਸਿਸ ਏਆਈ ਅਸਿਸਟੈਂਟ • ਪੰਚਕਰਮਾ ਅਤੇ ਵੈੱਲਨੈੱਸ ਉਪਕਰਨ",
    online: "ਆਨਲਾਈਨ",
    typing: "ਟਾਈਪ ਕਰ ਰਹੀ ਹੈ…",
    soundOn: "ਆਵਾਜ਼ ਚਾਲੂ",
    soundOff: "ਆਵਾਜ਼ ਬੰਦ",
    voiceOn: "ਵੌਇਸ ਉੱਤਰ ਚਾਲੂ",
    voiceOff: "ਵੌਇਸ ਉੱਤਰ ਬੰਦ",
    callStart: "ਗੱਲ ਕਰੋ ਜੀ",
    callEnd: "ਕਾਲ ਸਮਾਪਤ ਕਰੋ",
    chatEnded: "ਇਹ ਗੱਲਬਾਤ ਸਮਾਪਤ ਹੋ ਚੁੱਕੀ ਹੈ।",
    resume: "ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ",
    callMute: "ਮਾਈਕ ਬੰਦ ਕਰੋ",
    callUnmute: "ਮਾਈਕ ਚਾਲੂ ਕਰੋ",
    connecting: "ਕਨੈਕਟ ਹੋ ਰਹੀ ਹੈ...",
    listening: "ਸੁਣ ਰਹੀ ਹਾਂ, ਬੋਲੋ ਜੀ...",
    interruptHint: "ਕਿਸੇ ਵੀ ਸਮੇਂ ਬੋਲੋ, ਮੈਂ ਸੁਣਾਂਗੀ",
    muted: "ਤੁਹਾਡਾ ਮਾਈਕ ਬੰਦ ਹੈ",
    micDenied: "ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਇਜਾਜ਼ਤ ਦਿਓ ਜੀ।",
    micNoSpeech: "ਕੁਝ ਸੁਣਾਈ ਨਹੀਂ ਦਿੱਤਾ ਜੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਬੋਲੋ।",
    micNotFound: "ਕੋਈ ਮਾਈਕ੍ਰੋਫੋਨ ਨਹੀਂ ਮਿਲਿਆ।",
    micBusy: "ਕੋਈ ਹੋਰ ਐਪ ਮਾਈਕ੍ਰੋਫੋਨ ਵਰਤ ਰਹੀ ਹੈ।",
    callFailed: "ਕਾਲ ਕਨੈਕਟ ਨਹੀਂ ਹੋ ਸਕੀ।",
    callUnavailable: "ਵੌਇਸ ਕਾਲ ਇਸ ਸਮੇਂ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਤੁਸੀਂ ਇੱਥੇ ਲਿਖ ਸਕਦੇ ਹੋ।",
    callDropped: "ਕਾਲ ਕੱਟ ਗਈ ਹੈ। ਗੱਲ ਕਰਨ ਲਈ ਮਾਈਕ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    callEnding: "ਕਾਲ ਦਾ ਸਮਾਂ ਪੂਰਾ ਹੋ ਰਿਹਾ ਹੈ।",
    goodbye: "ਐਨਸਿਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਲਈ ਬਹੁਤ-ਬਹੁਤ ਧੰਨਵਾਦ ਜੀ! ਤੁਹਾਡਾ ਦਿਨ ਸ਼ੁਭ ਰਹੇ।",
    callIdle: "ਕਾਫੀ ਦੇਰ ਕੋਈ ਆਵਾਜ਼ ਨਾ ਆਉਣ ਕਾਰਨ ਕਾਲ ਸਮਾਪਤ ਕੀਤੀ ਗਈ।",
    didntCatch: "ਮਾਫ਼ ਕਰਨਾ ਜੀ, ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ ਦੱਸ ਸਕਦੇ ਹੋ?",
    noise: "ਨੌਇਸ ਰਿਡਕਸ਼ਨ",
    noiseOnHint: "ਚਾਲੂ: ਪਿੱਛੇ ਦੀ ਆਵਾਜ਼ ਫਿਲਟਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ",
    noiseOffHint: "ਬੰਦ: ਸਾਧਾਰਨ ਮਾਈਕ",
    teamTitle: "ਐਨਸਿਸ ਮਾਹਿਰ ਟੀਮ",
    teamSubtitle: "ਸਿੱਧੀ ਸਹਾਇਤਾ",
    teamName: "ਐਨਸਿਸ ਟੀਮ",
    teamJoined: "ਐਨਸਿਸ ਟੀਮ ਤੋਂ ਇੱਕ ਮਾਹਿਰ ਜੁੜ ਚੁੱਕੇ ਹਨ",
    teamLeft: "ਟੀਮ ਚੈਟ ਤੋਂ ਚਲੀ ਗਈ ਹੈ। ਹੁਣ ਐਨਸਿਸ ਅਸਿਸਟ ਜਵਾਬ ਦੇਵੇਗੀ।",
    teamPlaceholder: "ਸਾਡੀ ਟੀਮ ਨੂੰ ਸੰਦੇਸ਼ ਭੇਜੋ...",
    teamFooter: "ਤੁਸੀਂ ਐਨਸਿਸ ਪ੍ਰਤੀਨਿਧੀ ਨਾਲ ਗੱਲ ਕਰ ਰਹੇ ਹੋ",
  },
};

/* ─── Messages Interfaces ─── */

export interface Reply {
  title?: string;
  text: string;
  link?: { href: string; label: string };
  files?: Array<{ href: string; label: string; type?: string; size?: number }>;
  speakId?: number;
  spoken?: string;
  greeting?: boolean;
}

export type From = "bot" | "user" | "agent";

export interface HistoryItem extends Reply {
  from: From;
  event?: "joined" | "left";
  at?: number;
}

export interface Message extends Reply {
  id: number;
  at?: number;
  from: From;
  event?: "joined" | "left";
  key?: string;
  live?: boolean;
}

export interface ChatResponse {
  sessionId: string;
  lang?: Lang;
  replies: Reply[];
  blocked: boolean;
  blockedFor?: number;
  flagged?: boolean;
  end?: boolean;
  history?: HistoryItem[];
  repeatGreeting?: Reply;
  agent?: boolean;
  serverTime?: number;
  needsOtp?: boolean;
  otpSent?: boolean;
  leadVerified?: boolean;
  phone?: string;
}

export interface TeamUpdates {
  agent: boolean;
  messages: Array<{ text: string; event?: "joined" | "left"; files?: Reply["files"]; at: number }>;
  serverTime: number;
}

export interface CallStart {
  blocked?: boolean;
  blockedFor?: number;
  unavailable?: boolean;
  agent?: boolean;
  serverTime?: number;
  sessionId: string;
  lang: Lang;
  sdp: string;
  greeting: string;
  choiceGreeting?: string;
  history: HistoryItem[];
  maxSeconds: number;
  knowsName?: boolean;
  voiceStyle?: string;
  goodbye?: { en: string; hi: string };
  voice?: "sarvam";
}

export interface CallEvent {
  type: string;
  item_id?: string;
  delta?: string;
  transcript?: string;
  logprobs?: Array<{ logprob: number }>;
  text?: string;
  item?: { id: string; type: string; role?: string; content?: Array<{ type: string }> };
  response?: { status?: string; output?: Array<{ type: string; id?: string; name?: string; call_id?: string; arguments?: string }> };
  error?: { code?: string; message?: string };
}

export interface ToolDone {
  output: unknown;
  files?: Reply["files"];
  link?: Reply["link"];
  end?: boolean;
  blocked?: boolean;
  blockedFor?: number;
  flagged?: boolean;
}

const SESSION_KEY = "ensis_chat_session";
const NOISE_KEY = "ensis_chat_noise";
const MUTED_KEY = "ensis_chat_muted";
const VOICE_KEY = "ensis_chat_voice_on";

const countdown = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

const MAX_NAME_ASKS = 5;
const NAME_STEP = `You are Ensis Assist, a warm young woman answering a call for Ensis (Panchkarma & Ayurvedic Wellness Equipment). You are a woman, so use feminine verbs for yourself (बताती हूँ, बताऊँगी). You don't know the visitor's name yet: you ask it when they ask you something, before answering it.
- If what the visitor just said is their name (like "Rahul", "mera naam Rahul hai", "I'm Priya"), call update_visitor with it and say nothing.
- If they would rather type than talk (like "typing", "type karunga", "likhkar", "I'll type"), call continue_typing and say nothing.
- If they just chose to talk (like "bolkar", "baat karni hai", "talk"), or only said hello, ok or thanks, say one short warm line asking how you can help with Ensis Panchkarma & wellness equipment, in their language, without asking their name: "जी ज़रूर! बताइए, मैं आपकी क्या मदद कर सकती हूँ?" or "Sure! Tell me, how can I help you with our Ayurvedic & Panchkarma equipment today?"
- If the talk is over and they want nothing more, call end_conversation and say nothing.
- Otherwise (they asked something or want something, even "tell me first"): do NOT answer it yet. In the EXACT language they are speaking (Punjabi in Punjabi Gurmukhi, Bengali in Bengali, Hindi in Hindi Devanagari, English in English - NEVER force Hindi if the visitor spoke Punjabi, Bengali or English), say one short warm line that you'll help right away, and ask their name. For example: Punjabi: "ਜੀ, ਮੈਂ ਹੁਣੇ ਦੱਸਦੀ ਹਾਂ, ਬਸ ਪਹਿਲਾਂ ਆਪਣਾ ਨਾਮ ਦੱਸ ਦਿਓ ਜੀ?", Hindi: "जी, मैं अभी बताती हूँ, बस पहले अपना नाम बता दीजिए?", English: "Sure, I'll tell you right away. May I know your name first?"
- If they clearly refuse to give a name, call update_visitor with name "Visitor" and say nothing.
- Insults or harassment: call report_abuse. Talk not meant for you (people around them talking to each other): call not_for_me and say nothing.`;

const WANTS_TO_TALK = /\b(talk|speak|voice|call|bol\w*|baat)\b|बोल|बात/i;
const botSaysGoodbye = (text: string) =>
  /have a (great|good|nice|lovely) day|good\s?bye|take care|din (accha|acha|achha|shubh)|दिन अच्छा|दिन शुभ|alvida|अलविदा/i.test(text) &&
  !/[?؟]\s*$/.test(text);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const CHAT_BG = "/assets/chatbot/bg.webp";

const fileUrl = (href: string) => (/^https?:\/\//.test(href) ? href : `${BACKEND_URL}${href}`);
const isPhoto = (file: { href: string; type?: string; label?: string }) =>
  (file.type || "").startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.label || file.href);

const FAINT_LEVEL = 0.004;
const MIC_SILENT_NOTE_MS = 10000;
const CALL_IDLE_MS = 60000; // 1 minute idle mic timeout
const INACTIVITY_TIMEOUT_MS = 300000; // 5 minutes inactivity chat closure
const CALL_ENDING_WARNING_S = 30;
const CHAT_END_AFTER_GOODBYE_MS = 10000;
const END_AFTER_GOODBYE_MS = 15000;
const TEAM_CHECK_MS = 4000;

const REWRITTEN_SCRIPTS = /[\u0900-\u097F\u0600-\u06FF\u0A00-\u0A7F]/;
const FOREIGN_LETTERS = new RegExp(
  "(?![\\p{Script=Latin}\\p{Script=Devanagari}\\p{Script=Arabic}\\p{Script=Gurmukhi}\\p{Script=Gujarati}\\p{Script=Bengali}\\p{Script=Tamil}\\p{Script=Telugu}\\p{Script=Kannada}\\p{Script=Malayalam}\\p{Script=Oriya}])\\p{L}",
  "u"
);
const LEAST_CONFIDENCE = -0.7;
const misheard = (text: string, logprobs?: Array<{ logprob: number }>) =>
  FOREIGN_LETTERS.test(text) ||
  Boolean(logprobs?.length && logprobs.reduce((sum, word) => sum + word.logprob, 0) / logprobs.length < LEAST_CONFIDENCE);
const SHORTEST_SPEECH_MS = 1200;

/* ─── End-to-End Ensis Overview & Domain Knowledge ─── */
const DEFAULT_ENSIS_OVERVIEW: Reply[] = [
  {
    title: "🌿 Namaste! Welcome to Ensis",
    text: "India's premier manufacturer of authentic **Ayurvedic Panchkarma equipment**, wellness furniture, and **turnkey clinic setups**.\n\nHow may I assist you today? Feel free to ask about our **Panchakarma Droni tables**, **Steam Bath Chambers**, **Shirodhara units**, or request a custom quotation.\n\n📞 **Call:** [+91 9810242841](tel:+919810242841) | [+91 9654900525](tel:+919654900525)\n✉️ **Email:** [info@ensis.in](mailto:info@ensis.in)",
    greeting: true,
    link: { href: "/products", label: "Browse Products" },
  },
];

/* Intelligent domain fallback with natural multilingual conversation (Hindi + English) and verified catalog specs */
const getLocalEnsisReply = (query: string, messagesHistory: Message[] = []): Reply[] => {
  const q = query.trim().toLowerCase();
  const isHi = /[अ-ह]/.test(query);
  const lastBotMsg = [...messagesHistory].reverse().find((m) => m.from === "bot")?.text?.toLowerCase() || "";

  // Pause / Wait / Hold on
  if (/^(pause|ruko|ruk\s*jao|ek\s*minute|hold\s*on|wait|stop|ठहरो|रुक|रुको)\b/i.test(q)) {
    return [
      {
        title: "⏸️ Paused",
        text: isHi
          ? "जी बिल्कुल, आप आराम से समय लीजिए। मैं यहीं हूँ, जब भी आप तैयार हों बताइएगा।"
          : /aap|ruko|kya|hai|ji|theek|samay/.test(q)
          ? "Ji bilkul, aap araam se time lijiye. Main yahin hoon, jab bhi aap continue karna chahein batayein!"
          : "Sure, take your time! I'm right here whenever you're ready to continue.",
      },
    ];
  }

  // Greetings & pleasantries
  if (
    /^(hi|hello|hey|namaste|namaskar|pranam|good\s*(morning|afternoon|evening)|kaise\s*ho|kya\s*haal|sunao|batao|halchal)\b/i.test(q) ||
    /नमस्ते|प्रणाम|हेलो|हाय|कैसा|हालचाल|शुभ\s*प्रभात/i.test(q)
  ) {
    return [
      {
        title: isHi ? "🌿 नमस्कार! एन्सिस में आपका स्वागत है" : "🌿 Namaste! Welcome to Ensis",
        text: isHi
          ? "नमस्कार! एन्सिस में आपका हार्दिक स्वागत है। हम भारत के प्रमुख आयुर्वेदिक पंचकर्म उपकरण और क्लिनिक सेटअप निर्माता हैं।\n\nआज मैं आपकी क्या सहायता कर सकती हूँ? आप हमारे **पंचकर्म द्रोणी टेबल्स**, **स्टीम बाथ चैंबर्स**, **शिरोधारा स्टैंड्स व पॉट्स** या **संपूर्ण क्लिनिक सेटअप** के बारे में पूछ सकते हैं!"
          : "Namaste! Welcome to Ensis. We are India's premier manufacturer and supplier of authentic **Ayurvedic Panchkarma equipment** and turnkey wellness clinic setups.\n\nHow may I assist you today? Feel free to ask about our **Panchakarma Droni Tables**, **Steam Bath Chambers**, **Shirodhara Sets**, or **Complete Clinic Consultation**!",
        link: { href: "/products", label: isHi ? "उत्पाद देखें" : "Browse Equipment" },
      },
    ];
  }

  // Farewell / Closing / Thanks
  if (
    /^(bye|goodbye|alvida|thank\s*you|thanks|dhanyawad|shukriya|ok\s*bye|bas|theek\s*hai\s*bye)\b/i.test(q) ||
    /धन्यवाद|शुक्रिया|अलविदा|बाय/i.test(q)
  ) {
    return [
      {
        title: isHi ? "🙏 धन्यवाद!" : "🙏 Namaskar!",
        text: isHi
          ? "एन्सिस से जुड़ने के लिए बहुत-बहुत धन्यवाद! आपका स्वास्थ्य और क्लिनिक हमेशा प्रगति करे। किसी भी सहायता के लिए आप हमें **+91 9810242841** या **+91 9654900525** पर संपर्क कर सकते हैं।"
          : "Thank you for reaching out to Ensis! Wishing you and your wellness practice great success. For any assistance, feel free to call or WhatsApp us at **+91 9810242841** or **+91 9654900525**.",
      },
    ];
  }

  // Affirmations & Conversational Continuations ("haan", "theek hai", "yes", "sure", "batao", "aur batao")
  if (
    /^(haan|ha|ji|yes|yeah|sure|theek\s*hai|ok|okay|accha|acha|batao|aur\s*batao|continue|hmm|sahi\s*hai|done)\b/i.test(q) ||
    /हाँ|जी|ठीक\s*है|बताओ|और\s*बताओ|अच्छा/i.test(q)
  ) {
    if (lastBotMsg.includes("droni") || lastBotMsg.includes("table") || lastBotMsg.includes("द्रोणी")) {
      return [
        {
          title: isHi ? "द्रोणी टेबल कस्टमाइज़ेशन" : "Droni Customization & Sizes",
          text: isHi
            ? "जी बिल्कुल! हमारी द्रोणी टेबल्स 100% सॉलिड बर्मा टीक वुड में तैयार होती हैं। क्या आप अपने क्लिनिक के लिए कस्टम साइज़ (लंबाई-चौड़ाई) चाहते हैं, या हमारी स्टैंडर्ड 8-फीट थेरेपी टेबल का विवरण देखना चाहेंगे?"
            : "Certainly! Our Panchakarma Droni tables are handcrafted from seasoned solid Burma Teak. Would you prefer custom dimensions tailored to your therapy room, or would you like to review our standard 8-foot clinic specification?",
          link: { href: "/products", label: isHi ? "टेबल्स देखें" : "View Tables" },
        },
      ];
    }
    if (lastBotMsg.includes("steam") || lastBotMsg.includes("स्टीम")) {
      return [
        {
          title: isHi ? "स्टीम बाथ फीचर्स" : "Steam Chamber Video Demo",
          text: isHi
            ? "बिल्कुल! हमारे स्टीम बाथ कैबिनेट्स में डिजिटल टेम्परेचर रेगुलेटर और फूड-ग्रेड SS 304 स्टीम पाइप्स होते हैं। क्या आप इसका वीडियो डेमो और 2026 कैटलॉग देखना चाहेंगे? आप अपना WhatsApp नंबर यहाँ साझा कर सकते हैं।"
            : "Wonderful! Our steam bath chambers feature digital temperature regulation and food-grade SS 304 steam pipelines. Would you like our technical team to share a video demonstration and 2026 catalogue on WhatsApp?",
          link: { href: "/products", label: isHi ? "स्टीम चैंबर देखें" : "View Steam Chambers" },
        },
      ];
    }
    if (lastBotMsg.includes("clinic") || lastBotMsg.includes("setup") || lastBotMsg.includes("क्लिनिक")) {
      return [
        {
          title: isHi ? "क्लिनिक स्पेस प्लानिंग" : "Clinic Space Planning & Layout",
          text: isHi
            ? "शानदार! टर्नकी क्लिनिक सेटअप में हम 2D/3D आर्किटेक्चरल लेआउट, ड्रेनेज पाइपलाइनिंग और मैचिंग टीक वुड फर्नीचर पैकेज प्रदान करते हैं। आप किस शहर में क्लिनिक शुरू करने जा रहे हैं?"
            : "Great! For turnkey clinic setups, we provide 2D/3D space layouts, specialized oil drainage engineering, and coordinated solid teak furniture packages. In which city or state are you planning your center?",
          link: { href: "/solutions", label: isHi ? "क्लिनिक समाधान देखें" : "Explore Clinic Setups" },
        },
      ];
    }
    return [
      {
        title: isHi ? "एन्सिस पंचकर्म विशेषज्ञ" : "Ensis Specialist Assistance",
        text: isHi
          ? "जी! कृपया बताएं कि आप किस विशेष उपकरण (पंचकर्म द्रोणी, स्टीम बाथ चैंबर, शिरोधारा स्टैंड) या क्लिनिक समाधान के बारे में और जानना चाहते हैं?"
          : "Certainly! Please let me know which specific equipment (Droni table, steam bath chamber, Shirodhara set) or clinic setup solution you would like to explore further.",
        link: { href: "/products", label: isHi ? "उत्पाद देखें" : "Browse Products" },
      },
    ];
  }

  // Customization & Dimensions
  if (/custom|size|dimension|length|width|height|lambai|chaudai|badi|choti|कस्टम|साइज़|साइज|लंबाई|चौड़ाई|नाप/i.test(q)) {
    return [
      {
        title: isHi ? "कस्टम डायमेंशन एवं निर्माण" : "Custom Dimensions & Bespoke Timber",
        text: isHi
          ? "जी हाँ! एन्सिस डायरेक्ट मैन्युफैक्चरर होने के नाते पूरी तरह **कस्टमाइज़्ड उपकरण** तैयार करता है:\n\n• **लंबाई व चौड़ाई**: आपकी क्लिनिक स्पेस और थेरेपिस्ट की सुविधा अनुसार 7.5 फीट से 8.5 फीट लंबाई।\n• **नक्काशी व डिज़ाइन**: क्लासिकल केरल स्टाइल नक्काशी या मॉडर्न क्लीनिकल मिनिमलिस्ट फिनिश।\n• **कस्टम ब्रैंडिंग**: क्लिनिक/हॉस्पिटल का लोगो या ब्रास नेमप्लेट इनले।\n\nक्या आपके पास कोई विशेष साइज़ या लेआउट है?"
          : "Yes, absolutely! As direct manufacturers, Ensis provides complete **customization services**:\n\n• **Custom Dimensions**: Tailored length (7.5 ft to 8.5 ft) and width according to your therapy suite and practitioner ergonomics.\n• **Artistic Detailing**: Traditional Kerala hand-carved floral motifs or sleek contemporary clinical lines.\n• **Institutional Branding**: Custom clinic logos and brass inlays.\n\nDo you have specific room dimensions or layout requirements in mind?",
        link: { href: "/contact", label: isHi ? "कस्टम विवरण भेजें" : "Send Custom Specs" },
      },
    ];
  }

  // Catalog, Brochure, Photos & Videos
  if (/catalog|catalogue|brochure|pdf|photo|image|video|demo|list|कैटलॉग|ब्रोशर|फोटो|वीडियो/i.test(q)) {
    return [
      {
        title: isHi ? "2026 संपूर्ण उपकरण कैटलॉग" : "2026 Equipment Catalogue (PDF)",
        text: isHi
          ? "निश्चिंत रहें! मैं हमारे सभी पंचकर्म उपकरणों (द्रोणी टेबल्स, स्टीम चैंबर्स, शिरोधारा स्टैंड्स) का **2026 हाई-रिज़ॉल्यूशन PDF कैटलॉग** और मूल्य सूची सीधे आपके WhatsApp पर भेज सकती हूँ।\n\nकृपया अपना 10-अंकों का मोबाइल नंबर साझा करें!"
          : "Certainly! Our technical team can send our comprehensive **2026 Equipment Catalogue (PDF)** with high-resolution imagery and dealer pricing directly to your WhatsApp.\n\nPlease share your 10-digit mobile number so we can share it right away!",
        link: { href: "/contact", label: isHi ? "संपर्क करें" : "Contact Team" },
      },
    ];
  }

  // Contact / Address / Phone / Email / Corporate Office only
  if (
    /contact|phone|call|email|address|office|location|where|sampark|pata|kahan|kaha/i.test(q) ||
    /संपर्क|फोन|फ़ोन|नंबर|पता|कार्यालय|कहाँ|कहा|ईमेल|कॉल/i.test(q)
  ) {
    return [
      {
        title: isHi ? "एन्सिस संपर्क एवं कॉर्पोरेट कार्यालय" : "Ensis Contact & Office Details",
        text: isHi
          ? "🌿 **एन्सिस संपर्क विवरण**:\n\n📍 **कॉर्पोरेट कार्यालय एवं फैक्ट्री**:\nPlot No. 12/29, Site-II Industrial Area, Mohan Nagar, Ghaziabad, UP – 201007\n\n📞 **फ़ोन / WhatsApp**: **+91 9810242841** / **+91 9654900525**\n✉️ **ईमेल**: **info@ensis.in**\n🌐 **वेबसाइट संपर्क पेज**: [ensis.in/contact](/contact)"
          : "🌿 **Ensis Contact Details**:\n\n📍 **Corporate Office & Factory**:\nPlot No. 12/29, Site-II Industrial Area, Mohan Nagar, Ghaziabad, UP – 201007\n\n📞 **Phone / WhatsApp**: **+91 9810242841** / **+91 9654900525**\n✉️ **Email**: **info@ensis.in**\n🌐 **Website Contact Page**: [ensis.in/contact](/contact)",
        link: { href: "/contact", label: isHi ? "संपर्क पेज खोलें" : "Open Contact Page" },
      },
    ];
  }

  // Steam bath chambers & cabinets (NO "Swedana chambers")
  if (
    /steam|bath|sauna|cabinet|box|स्टीम|बाथ|भाप|कैबिनेट|सॉना|स्वेदन/i.test(q)
  ) {
    return [
      {
        title: isHi ? "आयुर्वेदिक स्टीम बाथ चैंबर्स एवं कैबिनेट्स" : "Ayurvedic Steam Bath Chambers & Cabinets",
        text: isHi
          ? "एन्सिस सीजन की गई बर्मा टीक वुड और फूड-ग्रेड स्टेनलेस स्टील 304 से प्रामाणिक **स्टीम बाथ चैंबर्स** तैयार करता है:\n\n• **Seated Teak Steam Cabinet** (₹38,000) — एडजस्टेबल नेक कॉलर, डिजिटल टेम्परेचर रेगुलेटर और इनर वुडन स्लैटेड फ्लोर।\n• **Lying Ayurvedic Steam Box** (₹47,500) — संपूर्ण शरीर स्वेदन चिकित्सा, कॉपर डिस्पर्शन पाइप और बॉटम ड्रेनेज स्लोप।\n\nसभी यूनिट्स 100% आयुर्वेदिक औषधीय तैल-रोधी PU कोटिंग युक्त हैं।"
          : "Ensis designs and manufactures authentic, handcrafted **Steam Bath Chambers** built from seasoned teak wood and food-grade stainless steel:\n\n• **Seated Teak Steam Cabinet** (₹38,000) — Ergonomic seated chamber with adjustable neck collar, steam dispersion tubes, and drainage.\n• **Lying Ayurvedic Steam Box** (₹47,500) — Full body therapy with digital temperature regulator and copper dispersion system.\n\nAll units are treated with hot herbal oil-proof polyurethane coats for maximum clinic longevity.",
        link: { href: "/products", label: isHi ? "स्टीम चैंबर देखें" : "View Steam Chambers" },
      },
    ];
  }

  // Shirodhara & oil warming
  if (
    /shirodhara|pot|dhara|oil warmer|stand|शिरोधारा|पॉट|बर्तन|स्टैंड|वॉर्मर|तेल/i.test(q)
  ) {
    return [
      {
        title: isHi ? "शिरोधारा एवं तैल थेरेपी उपकरण" : "Shirodhara & Oil Therapy Equipment",
        text: isHi
          ? "हमारी शिरोधारा रेंज नैदानिक परिशुद्धता और पारंपरिक शिल्प कला का संगम है:\n\n• **Pure Brass Shirodhara Pot & Stand Set** (₹9,999) — हैंड-स्पून शुद्ध पीतल पॉट, प्रेसिजन ब्रास फ्लो कंट्रोल वाल्व और भारी बेस वाला एडजस्टेबल स्टैंड।\n• **Ayurvedic Oil Warmer** (₹5,499) — अभ्यंग एवं शिरोधारा तैल को सटीक तापमान पर रखने हेतु थर्मोस्टेटिक वॉर्मर।"
          : "Our Shirodhara range features traditional craftsmanship with clinical precision:\n\n• **Shirodhara Pot & Stand Set** (Pure Brass, ₹9,999) — Hand-spun brass pot with precision brass flow control valve and heavy-base height adjustable stand.\n• **Ayurvedic Oil Warmer** (₹5,499) — Thermostatically controlled warmer keeping Abhyanga and Shirodhara medicated oils at optimal body temperatures.",
        link: { href: "/products", label: isHi ? "शिरोधारा उपकरण देखें" : "Explore Shirodhara Gear" },
      },
    ];
  }

  // Massage tables / Droni / Abhyanga
  if (
    /table|droni|abhyanga|massage|bed|मेज़|मेज|टेबल|द्रोणी|अभ्यंग|मसाज/i.test(q)
  ) {
    return [
      {
        title: isHi ? "पंचकर्म मसाज टेबल्स (द्रोणी)" : "Panchkarma Massage Tables (Droni)",
        text: isHi
          ? "एन्सिस **अभ्यंग एवं पंचकर्म थेरेपी टेबल्स** पारंपरिक शास्त्रीय मानकों पर सॉलिड बर्मा टीक व महोगनी से बनती हैं:\n\n• **Panchakarma Massage Table** (₹24,999) — परिधीय ऑयल ड्रेनेज गटर, स्लॉप्ड सतह और 100% हर्बल ऑयल-प्रूफ फिनिश।\n• **Abhyanga Heavy-Duty Table** (₹32,999) — रीइन्फोर्स्ड फ्रेम, कस्टमाइजेबल हेडरेस्ट और क्लीनिकल डायमेंशन।"
          : "Ensis **Abhyanga & Panchkarma Therapy Tables** are crafted to authentic Shastra standards:\n\n• **Panchakarma Massage Table** (Mahogany / Teak, ₹24,999) — Ergonomic therapy surface with continuous peripheral oil drainage and sloped collection.\n• **Abhyanga Heavy-Duty Table** (₹32,999) — Sloped wood droni with reinforced frame, drainage outlet, and customizable headrests.",
        link: { href: "/products", label: isHi ? "थेरेपी टेबल्स देखें" : "View Therapy Tables" },
      },
    ];
  }

  // Clinic setup / turnkey / consultation
  if (
    /clinic|setup|hospital|room|interior|turnkey|architectural|layout|planning|क्लिनिक|हॉस्पिटल|सेटअप|टर्नकी|कमरा|इंटीरियर|लेआउट/i.test(q)
  ) {
    return [
      {
        title: isHi ? "आयुर्वेदिक क्लिनिक एवं हॉस्पिटल टर्नकी सेटअप" : "Ayurvedic Clinic & Hospital Setup Solutions",
        text: isHi
          ? "एन्सिस क्लिनिक, हॉस्पिटल्स और पंचकर्म केंद्रों के लिए संपूर्ण टर्नकी सेटअप प्रदान करता है:\n\n1. **2D/3D स्पेस प्लानिंग एवं रूम लेआउट**\n2. **मैचिंग सॉलिड टीक वुड थेरेपी फर्नीचर पैकेज**\n3. **ऑयल ड्रेनेज एवं प्लंबिंग इंजीनियरिंग**\n4. **अखिल भारतीय डिलीवरी, इंस्टॉलेशन व 5 वर्ष की वारंटी**\n\nहमारे विशेषज्ञ से सीधे +91 9810242841 / +91 9654900525 पर बात करें।"
          : "Ensis provides complete end-to-end setups for Ayurvedic clinics, hospitals, wellness resorts, and Panchkarma centres:\n\n1. **Room Layout & Space Planning**: Ergonomic positioning of Droni, Steam bath chambers, and Shirodhara stations.\n2. **Therapy Furniture Package**: Coordinated design in matching teak wood finishes.\n3. **Oil Management & Plumbing Consultation**: Custom drainage channels, easy-clean surfaces, and specialized partitions.\n4. **Pan-India Delivery & Installation**: White-glove setup and warranty support.\n\nCall our specialist directly at **+91 9810242841** / **+91 9654900525** or email **info@ensis.in**.",
        link: { href: "/solutions", label: isHi ? "क्लिनिक समाधान देखें" : "Explore Clinic Solutions" },
      },
    ];
  }

  // Pricing / Quote / Cost
  if (
    /price|cost|quote|quotation|rate|discount|budget|kitna|daam|paisa|कीमत|दाम|रेट|खर्च|कोटेशन|बजट/i.test(q)
  ) {
    return [
      {
        title: isHi ? "एन्सिस उत्पाद मूल्य एवं कोटेशन" : "Ensis Product Pricing & Quotation",
        text: isHi
          ? "हमारे उपकरणों की कीमतें ₹5,499 (ब्रास एक्सेसरीज़) से ₹47,500 (ऑटोमेटेड स्टीम कैबिनेट्स) तक हैं:\n\n• **1-रूम पंचकर्म पैकेज**: लगभग ₹1.10 लाख से शुरू (टेबल + स्टीम चैंबर + शिरोधारा सेट शामिल)।\n• क्लिनिक्स व हॉस्पिटल्स के लिए बल्क डिस्काउंट व GST बिलिंग उपलब्ध है।\n\nकोटेशन के लिए कृपया अपना मोबाइल नंबर यहाँ शेयर करें या संपर्क फॉर्म भरें।"
          : "Our equipment pricing ranges from **₹5,499** for brass accessories up to **₹47,500** for automated steam cabinets.\n\n• Complete 1-room Panchkarma package starts from approx **₹1.10 Lakh** (includes Table + Steam Chamber + Shirodhara Stand & Pot).\n• Bulk discounts & institutional GST billing available for clinics and hospitals.\n\nPlease share your **Phone Number** and required items here, or fill our quotation form for an instant invoice estimate.",
        link: { href: "/contact", label: isHi ? "कोटेशन फॉर्म खोलें" : "Request Official Quotation" },
      },
    ];
  }

  // Warranty, Wood & Quality
  if (
    /warranty|guarantee|wood|teak|mahogany|brass|quality|material|polish|durability|वारंटी|गारंटी|लकड़ी|सागवान|पीतल|मटेरियल|पॉलिश/i.test(q)
  ) {
    return [
      {
        title: isHi ? "लकड़ी की गुणवत्ता एवं 5-वर्षीय वारंटी" : "Wood Craftsmanship & 5-Year Warranty",
        text: isHi
          ? "एन्सिस के सभी उपकरण उच्चतम गुणवत्ता मानकों पर तैयार होते हैं:\n\n• **100% सीजन की गई बर्मा टीक एवं महोगनी लकड़ी** — कभी मुड़ती नहीं, दीमक-रोधी।\n• **हर्बल ऑयल-प्रूफ PU कोटिंग** — गर्म औषधीय तैल से लकड़ी का रंग व सतह सुरक्षित रहती है।\n• **5 वर्ष की संरचनात्मक वारंटी** (Structural Warranty)।\n• **शुद्ध भारी पीतल (Brass)** — शिरोधारा पॉट व एक्सेसरीज़ में कोई मिलावट नहीं।"
          : "All Ensis equipment meets rigorous Ayurvedic clinical durability standards:\n\n• **100% Seasoned Burma Teak & African Mahogany**: Anti-warping and termite-resistant.\n• **Hot Medicated Oil-Proof PU Finish**: Prevents oil absorption and stains.\n• **5-Year Structural Warranty**: Direct manufacturer guarantee on all timber frames.\n• **Pure Heavy Brass**: Handcrafted non-magnetic Shirodhara pots and fittings.",
        link: { href: "/products", label: isHi ? "कैटलॉग देखें" : "View Catalogue" },
      },
    ];
  }

  // Delivery & Dispatch
  if (
    /delivery|shipping|dispatch|transport|export|international|courier|packing|डिलीवरी|शिपिंग|भेजना|ट्रांसपोर्ट|एक्सपोर्ट|पैकिंग/i.test(q)
  ) {
    return [
      {
        title: isHi ? "अखिल भारतीय डिलीवरी एवं सुरक्षित पैकेजिंग" : "Pan-India Safe Delivery & Global Exports",
        text: isHi
          ? "एन्सिस संपूर्ण भारत एवं विदेशों में सुरक्षित डिलीवरी प्रदान करता है:\n\n• **शॉकप्रूफ एक्सपोर्ट-ग्रेड वुडन क्रेट पैकेजिंग** — ताकि परिवहन में खरोंच तक न आए।\n• **डोरस्टेप डिलीवरी** — भारत के सभी प्रमुख शहरों व जिलों में।\n• **अंतरराष्ट्रीय निर्यात** — फाइटो-सैनिटरी सर्टिफिकेट के साथ सुरक्षित डिस्पैच।\n\nडिलीवरी समय या फ्रेट दर जानने के लिए +91 9810242841 पर कॉल करें।"
          : "Ensis provides trusted nationwide delivery and international export services:\n\n• **Shockproof Export-Grade Wooden Crates**: Complete transit protection.\n• **Pan-India Doorstep Dispatch**: To all clinics, hospitals, and resorts.\n• **Global Exports**: International shipping with full phyto-sanitary compliance.\n\nCall our dispatch team directly at +91 9810242841 / +91 9654900525 for freight estimates.",
        link: { href: "/contact", label: isHi ? "संपर्क करें" : "Contact Logistics" },
      },
    ];
  }

  // Dynamic conversational fallback that invites the user to continue rather than repeating static text
  return [
    {
      title: isHi ? "एन्सिस पंचकर्म परामर्श" : "Ensis Ayurvedic Consultation",
      text: isHi
        ? "एन्सिस में हम विशेष रूप से प्रामाणिक आयुर्वेदिक पंचकर्म उपकरण और क्लिनिक इंफ्रास्ट्रक्चर तैयार करते हैं। आपके इस विषय पर हमारी टेक्निकल टीम आपको कस्टमाइज़्ड सलाह और 2026 कैटलॉग शेयर कर सकती है।\n\nक्या आप नया क्लिनिक सेटअप प्लान कर रहे हैं, या किसी विशेष उपकरण के बारे में जानना चाहते हैं? आप विस्तृत कोटेशन के लिए अपना नंबर भी साझा कर सकते हैं।"
        : "At Ensis, we specialize in authentic Ayurvedic Panchkarma therapy equipment and turnkey clinic infrastructure. Our technical specialist can provide detailed specifications, custom sizing, and our 2026 catalogue.\n\nAre you planning a new clinic setup, or looking for a specific therapy unit? Feel free to share your contact number for a direct WhatsApp consultation.",
      link: { href: "/products", label: isHi ? "सभी उत्पाद देखें" : "View All Products" },
    },
  ];
};

const SUGGESTIONS = [
  "🌿 Panchkarma Tables",
  "♨️ Steam Bath Chamber",
  "💧 Shirodhara Set",
  "🏥 Clinic Setup",
  "📋 Request Quotation",
  "📞 Contact Specialist",
];

/* Robust API request helper: directly calls local backend or remote BACKEND_URL */
async function chatApi<T = any>(
  path: string,
  options?: { method?: string; body?: any; params?: Record<string, string | number> }
): Promise<T> {
  const method = options?.method || (options?.body !== undefined ? "POST" : "GET");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const fullPath = cleanPath.startsWith("/api") ? cleanPath : `/api${cleanPath}`;

  const tryUrls: string[] = [];
  if (isLocal) {
    tryUrls.push(`http://localhost:5000${fullPath}`);
  }
  if (BACKEND_URL && !BACKEND_URL.includes("localhost:5000")) {
    tryUrls.push(`${BACKEND_URL.replace(/\/$/, "")}${fullPath}`);
  }
  if (tryUrls.length === 0) {
    tryUrls.push(`http://localhost:5000${fullPath}`);
  }

  let lastError: Error | null = null;
  for (const baseUrl of tryUrls) {
    let url = baseUrl;
    if (options?.params) {
      const qs = new URLSearchParams();
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.set(k, String(v));
      });
      const queryString = qs.toString();
      if (queryString) url += (url.includes("?") ? "&" : "?") + queryString;
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          ...(options?.body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        throw new Error(json?.message || res.statusText || `Chat request failed (${res.status})`);
      }

      return (json?.data !== undefined ? json.data : json) as T;
    } catch (err) {
      lastError = err as Error;
    }
  }

  throw lastError || new Error("Failed to reach chatbot backend");
}

/* Progressive Server-Sent Events (SSE) streaming helper */
async function chatApiStream(
  path: string,
  body: any,
  onDelta: (delta: string) => void,
  onDone: (data: any) => void
): Promise<boolean> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  const fullPath = cleanPath.startsWith("/api") ? cleanPath : `/api${cleanPath}`;

  const tryUrls: string[] = [];
  if (isLocal) tryUrls.push(`http://localhost:5000${fullPath}`);
  if (BACKEND_URL && !BACKEND_URL.includes("localhost:5000")) {
    tryUrls.push(`${BACKEND_URL.replace(/\/$/, "")}${fullPath}`);
  }
  if (tryUrls.length === 0) tryUrls.push(`http://localhost:5000${fullPath}`);

  for (const url of tryUrls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok || !res.body) continue;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let isReading = true;

      while (isReading) {
        const { done, value } = await reader.read();
        if (done) {
          isReading = false;
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.type === "delta" && parsed.delta) {
              onDelta(parsed.delta);
            } else if (parsed.type === "done") {
              onDone(parsed);
            }
          } catch {}
        }
      }
      return true;
    } catch {
      // try next url or return false
    }
  }
  return false;
}

/** Markdown & link formatter for bot bubbles */
function BotText({ text }: { text: string }) {
  if (!text) return null;
  const clean = text.replace(/^\s*[*-]\s+/gm, "• ");
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  const toRelativeRoute = (rawUrl: string): string => {
    if (!rawUrl) return "/";
    if (rawUrl.startsWith("/")) return rawUrl;
    try {
      const u = new URL(rawUrl);
      if (
        u.hostname === "ensis.in" ||
        u.hostname === "www.ensis.in" ||
        u.hostname === "web.ensis.in" ||
        (typeof window !== "undefined" && u.hostname === window.location.hostname)
      ) {
        return (u.pathname || "/") + (u.search || "") + (u.hash || "");
      }
    } catch {}
    return rawUrl;
  };

  while ((match = pattern.exec(clean))) {
    if (match.index > last) parts.push(clean.slice(last, match.index));
    const [, label, rawHref, bold, rawUrl] = match;
    const key = match.index;
    const linkClass = "font-semibold text-[#8a6a2f] underline underline-offset-2 hover:text-[#263016]";
    if (label && rawHref) {
      const href = toRelativeRoute(rawHref);
      parts.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={linkClass}>
            {label}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {label}
          </a>
        )
      );
    } else if (bold) {
      parts.push(
        <strong key={key} className="font-semibold text-slate-900">
          {bold}
        </strong>
      );
    } else if (rawUrl) {
      const href = toRelativeRoute(rawUrl);
      parts.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={linkClass}>
            {rawUrl}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {rawUrl}
          </a>
        )
      );
    }
    last = match.index + match[0].length;
  }
  if (last < clean.length) parts.push(clean.slice(last));
  return <span className="whitespace-pre-line">{parts}</span>;
}

export interface ChatbotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openRef: RefObject<(() => void) | null>;
  openAtOnce: boolean;
  initialLogo?: string;
}

const resolveLogoUrl = (src?: string | StaticImageData): StaticImageData | string => {
  if (!src) return logoFallback;
  if (typeof src === "string") {
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
    return getImageUrl(src, 600);
  }
  return src;
};

const Chatbot = ({ isOpen, setIsOpen, openRef, openAtOnce, initialLogo }: ChatbotProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [logoSrc, setLogoSrc] = useState<StaticImageData | string>(() => resolveLogoUrl(initialLogo));

  useEffect(() => {
    if (initialLogo) {
      setLogoSrc(resolveLogoUrl(initialLogo));
      return;
    }
    let active = true;
    getComponentContent<{ logo?: { imageUrl?: string; alt?: string } }>("layout.header", {})
      .then((data) => {
        if (!active || !data?.logo?.imageUrl) return;
        setLogoSrc(resolveLogoUrl(data.logo.imageUrl));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [initialLogo]);

  const [lang, setLang] = useState<Lang>("en");
  const [noiseOn, setNoiseOn] = useState(() => (typeof window !== "undefined" ? localStorage.getItem(NOISE_KEY) !== "0" : true));
  const noiseOnRef = useRef(noiseOn);
  noiseOnRef.current = noiseOn;

  const [muted, setMuted] = useState(() => (typeof window !== "undefined" ? localStorage.getItem(MUTED_KEY) === "1" : false));
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messageSentBadge, setMessageSentBadge] = useState(false);
  const messageSentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [blockedTill, setBlockedTill] = useState<number | null>(null);
  const [, setClock] = useState(() => Date.now());

  const blockChat = (forMs?: number) => {
    setBlocked(true);
    setBlockedTill(forMs && forMs > 0 ? Date.now() + forMs : null);
    setClock(Date.now());
  };

  const [voiceOn, setVoiceOn] = useState(() => (typeof window !== "undefined" ? localStorage.getItem(VOICE_KEY) !== "0" : true));
  const [speaking, setSpeaking] = useState(false);
  const [callState, setCallState] = useState<"off" | "connecting" | "on">("off");
  const [micMuted, setMicMuted] = useState(false);
  const [canTalk] = useState(canCall);
  const [voiceNote, setVoiceNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const latestSpeechTextRef = useRef("");
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechSafetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const micIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentBotSpokenTextRef = useRef("");
  const lastSentTextRef = useRef<string>("");
  const lastSentTimeRef = useRef<number>(0);
  const isSendingRef = useRef<boolean>(false);
  const interruptedRef = useRef<boolean>(false);

  // Lead & WhatsApp OTP Verification State
  const [otpCardOpen, setOtpCardOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [otpName, setOtpName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [leadVerified, setLeadVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpStatusMsg, setOtpStatusMsg] = useState("");
  const [otpStatusError, setOtpStatusError] = useState("");

  const requestLeadOtp = async (phoneToUse?: string, nameToUse?: string) => {
    const rawDigits = (phoneToUse || otpPhone).replace(/\D/g, "").slice(-10);
    if (rawDigits.length !== 10) {
      setOtpStatusError(langRef.current === "hi" ? "कृपया 10-अंकों का मान्य मोबाइल नंबर दर्ज करें" : "Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpLoading(true);
    setOtpStatusError("");
    setOtpStatusMsg("");
    try {
      await chatApi("/chatbot/lead/otp", {
        body: {
          phone: rawDigits,
          name: nameToUse || otpName || "Valued Client",
          sessionId: sessionIdRef.current,
        },
      });
      setOtpSent(true);
      setOtpStatusMsg(langRef.current === "hi" ? `WhatsApp पर OTP भेज दिया गया है (+91 ${rawDigits})` : `OTP sent to WhatsApp (+91 ${rawDigits})`);
    } catch (err) {
      setOtpStatusError((err as Error).message || "Could not send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const submitLeadOtp = async () => {
    const code = otpCode.trim();
    if (code.length < 4) {
      setOtpStatusError(langRef.current === "hi" ? "कृपया सही OTP कोड दर्ज करें" : "Please enter the valid OTP code");
      return;
    }
    setOtpLoading(true);
    setOtpStatusError("");
    try {
      await chatApi("/chatbot/lead", {
        body: {
          phone: otpPhone.replace(/\D/g, "").slice(-10),
          name: otpName || "Valued Client",
          otp: code,
          sessionId: sessionIdRef.current,
        },
      });
      setLeadVerified(true);
      setOtpCardOpen(false);
      await botSay([
        {
          text: langRef.current === "hi"
            ? `✅ धन्यवाद! आपका मोबाइल नंबर +91 ${otpPhone.replace(/\D/g, "").slice(-10)} सत्यापित हो गया है। हमारी टेक्निकल टीम जल्द ही WhatsApp पर आपसे संपर्क करेगी।`
            : `✅ Thank you! Your mobile number +91 ${otpPhone.replace(/\D/g, "").slice(-10)} has been verified. Our technical specialist is preparing your quotation and will connect on WhatsApp shortly.`,
        },
      ]);
    } catch (err) {
      setOtpStatusError((err as Error).message || "Invalid OTP code. Please check and try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const [teamLive, setTeamLive] = useState(false);
  const teamLiveRef = useRef(false);
  const teamSinceRef = useRef(0);
  const teamSeenRef = useRef(new Set<number>());
  const voiceOnRef = useRef(voiceOn);
  const callRef = useRef<Call | null>(null);
  const micRingRef = useRef<HTMLSpanElement>(null);
  const openingCallRef = useRef(false);
  const callCleanupRef = useRef<(() => void) | null>(null);
  const endedByHandRef = useRef(false);
  const greetingNextRef = useRef(false);
  const endAfterSpeechRef = useRef(false);
  const lastActivityRef = useRef(0);
  const speakingRef = useRef(false);
  const callPostsRef = useRef<Promise<unknown>>(Promise.resolve());
  const endCallRef = useRef<(note?: string) => void>(() => {});

  const t = COPY[lang];
  const inputIsAbusive = input.trim().length > 0 && isAbusive(input);
  const inCall = callState === "on";
  const langRef = useRef<Lang>(lang);
  const mutedRef = useRef(muted);
  const idRef = useRef(0);
  const aliveRef = useRef(true);
  const openingChatRef = useRef(false);
  const chatLoadedRef = useRef(false);
  const greetAgainRef = useRef(false);
  const sessionIdRef = useRef(typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) || "" : "");
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const audioRef = useRef<AudioContext | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const continuousVoiceActiveRef = useRef(false);
  const isPausedRef = useRef(false);
  const isTypingRef = useRef(false);

  isTypingRef.current = isTyping;

  langRef.current = lang;
  mutedRef.current = muted;
  voiceOnRef.current = voiceOn;
  const activeRef = useRef(false);
  activeRef.current = isOpen && !isMinimized;

  useEffect(() => {
    aliveRef.current = true;
    const forgetVoices = prepareVoices();
    return () => {
      aliveRef.current = false;
      forgetVoices();
      stopSpeaking();
      endCallRef.current();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (speechSafetyTimerRef.current) clearTimeout(speechSafetyTimerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
      void audioRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isOpen || isMinimized) {
      stopSpeaking();
      endCallRef.current();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (speechSafetyTimerRef.current) clearTimeout(speechSafetyTimerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
      setIsRecording(false);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden || !callRef.current) return;
      endCallRef.current();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!voiceNote) return;
    const timer = setTimeout(() => setVoiceNote(""), 6000);
    return () => clearTimeout(timer);
  }, [voiceNote]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen || isMinimized || typeof window === "undefined" || !window.matchMedia("(max-width: 639px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen, isMinimized]);

  /* ─── Browser Sound Effects ─── */
  const audio = () => {
    try {
      if (typeof window === "undefined") return null;
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      const ctx = (audioRef.current ??= new Ctx());
      if (ctx.state === "suspended") void ctx.resume();
      return ctx;
    } catch {
      return null;
    }
  };

  const chime = (notes: Array<[freq: number, at: number]>, volume: number, ring: number) => {
    if (mutedRef.current) return;
    const ctx = audio();
    if (!ctx) return;
    const now = ctx.currentTime + 0.01;
    const out = ctx.createDynamicsCompressor();
    out.connect(ctx.destination);
    notes.forEach(([freq, at]) => {
      [
        { type: "sine" as OscillatorType, mult: 1, level: volume },
        { type: "triangle" as OscillatorType, mult: 2, level: volume * 0.25 },
      ].forEach(({ type, mult, level }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq * mult;
        gain.gain.setValueAtTime(0.0001, now + at);
        gain.gain.exponentialRampToValueAtTime(level, now + at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + ring);
        osc.connect(gain).connect(out);
        osc.start(now + at);
        osc.stop(now + at + ring + 0.05);
      });
    });
  };

  const playIncoming = () => chime([[880, 0], [1318.5, 0.13]], 0.32, 0.55);
  const playSent = () => {
    if (mutedRef.current) return;
    const ctx = audio();
    if (!ctx) return;
    const now = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  };

  const getBackendBaseUrl = (): string => {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return "http://localhost:5000";
    }
    return BACKEND_URL || "https://api.ensis.in";
  };

  /* ─── Typed replies: queued so they appear one after another, each after a short "typing..." (Design House) ─── */
  const readOut = async (line: Reply) => {
    if (!voiceOnRef.current || !activeRef.current || callRef.current) return;
    await sleep(150);
    if (!activeRef.current || callRef.current) return;
    const spoken = line.spoken || [line.title, line.text].filter(Boolean).join(". ");
    currentBotSpokenTextRef.current = spoken;
    const audioUrl =
      line.speakId !== undefined && sessionIdRef.current
        ? `${getBackendBaseUrl()}/api/chatbot/speak?session=${sessionIdRef.current}&message=${line.speakId}`
        : `${getBackendBaseUrl()}/api/chatbot/speak?text=${encodeURIComponent(spoken.slice(0, 1000))}`;

    // PAUSE/STOP SPEECH RECOGNITION WHILE ASSISTANT SPEAKS!
    // This completely eliminates acoustic echo feedback and prevents the assistant from muting itself!
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
      setIsRecording(false);
    }

    speakingRef.current = true;
    setSpeaking(true);
    try {
      await speak(spoken, audioUrl);
    } finally {
      speakingRef.current = false;
      setSpeaking(false);
    }
  };

  const botSay = (lines: Reply[]) => {
    queueRef.current = queueRef.current
      .catch(() => {})
      .then(async () => {
        for (const line of lines) {
          if (!aliveRef.current) return;
          setIsTyping(true);
          await sleep(60 + Math.min((line.text || "").length * 0.5, 120));
          if (!aliveRef.current) return;
          setIsTyping(false);
          const bubble: Message = { id: ++idRef.current, from: "bot", at: Date.now(), ...line };
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return line.greeting && last?.from === "bot" && last.greeting ? [...prev.slice(0, -1), bubble] : [...prev, bubble];
          });
          if (activeRef.current) playIncoming();
          try {
            await readOut(line);
          } catch (speechErr) {
            console.warn("readOut failed:", speechErr);
          }
          await sleep(100);
        }

        // All replies in this turn have finished speaking! If continuous listening is active, resume listening
        if (continuousVoiceActiveRef.current && !isPausedRef.current && !callRef.current && !closingModeRef.current) {
          if (!recognitionRef.current && !speakingRef.current) {
            startSpeechDictation();
          }
        }
      })
      .catch(() => {});
    return queueRef.current;
  };

  const userSay = (text: string) => {
    const id = ++idRef.current;
    stopSpeaking();
    setMessageSentBadge(true);
    if (messageSentTimeoutRef.current) clearTimeout(messageSentTimeoutRef.current);
    messageSentTimeoutRef.current = setTimeout(() => setMessageSentBadge(false), 3500);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ensis-chatbot-message-sent"));
    }
    setMessages((prev) => [...prev, { id, from: "user", text, at: Date.now() }]);
    playSent();
    return id;
  };

  const showHistory = (history?: HistoryItem[]) => {
    history?.forEach((m) => m.from === "agent" && m.at && teamSeenRef.current.add(m.at));
    if (!chatLoadedRef.current && history?.length) setMessages(history.map((m) => ({ ...m, id: ++idRef.current })));
    chatLoadedRef.current = true;
  };

  const setTeam = (on: boolean) => {
    if (teamLiveRef.current === on) return;
    teamLiveRef.current = on;
    setTeamLive(on);
    if (on) {
      stopSpeaking();
      setIsTyping(false);
      if (callRef.current) endCallRef.current();
    }
  };

  const syncTeam = (data: { agent?: boolean; serverTime?: number }) => {
    if (data.agent !== undefined) setTeam(data.agent);
    if (data.serverTime && !teamSinceRef.current) teamSinceRef.current = data.serverTime - 10000;
  };

  const rememberChat = (sessionId: string, chatLang?: Lang) => {
    if (sessionId) {
      sessionIdRef.current = sessionId;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    if (chatLang) {
      langRef.current = chatLang;
      setLang(chatLang);
    }
  };

  const applyResponse = (data: ChatResponse) => {
    rememberChat(data.sessionId, data.lang);
    if (data.blocked) blockChat(data.blockedFor);
    else {
      setBlocked(false);
      setBlockedTill(null);
    }
    if (data.leadVerified) {
      setLeadVerified(true);
      setOtpCardOpen(false);
    } else if (data.otpSent) {
      setOtpSent(true);
      setOtpCardOpen(true);
      if (data.phone) setOtpPhone(data.phone);
    } else if (data.needsOtp) {
      setOtpCardOpen(true);
      if (data.phone) setOtpPhone(data.phone);
    }
    syncTeam(data);
  };

  useEffect(() => {
    if (blockedTill === null) return;
    const tick = setInterval(() => {
      const now = Date.now();
      setClock(now);
      if (now >= blockedTill) {
        setBlocked(false);
        setBlockedTill(null);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [blockedTill]);

  /* Poll for team staff messages */
  useEffect(() => {
    if (!isOpen) return;
    let busy = false;
    const check = async () => {
      if (busy || document.hidden || !sessionIdRef.current || !teamSinceRef.current) return;
      busy = true;
      try {
        const data = await chatApi<TeamUpdates>("/chatbot/updates", {
          params: { session: sessionIdRef.current, since: teamSinceRef.current },
        });
        const fresh = data.messages?.filter((m) => !teamSeenRef.current.has(m.at)) || [];
        if (fresh.length) {
          fresh.forEach((m) => teamSeenRef.current.add(m.at));
          teamSinceRef.current = Math.max(teamSinceRef.current, ...fresh.map((m) => m.at));
          setMessages((prev) => [
            ...prev,
            ...fresh.map((m): Message => ({ id: ++idRef.current, from: "agent", text: m.text, event: m.event, files: m.files, at: m.at })),
          ]);
          if (activeRef.current) playIncoming();
        }
        setTeam(data.agent);
      } catch {
        // Retry next interval
      } finally {
        busy = false;
      }
    };
    const timer = setInterval(() => {
      void check();
      // 5-minute inactivity chat closure
      if (
        !speakingRef.current &&
        !visitorSpeakingRef.current &&
        !isTypingRef.current &&
        lastActivityRef.current > 0 &&
        Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT_MS
      ) {
        if (callRef.current) endCallRef.current();
        if (continuousVoiceActiveRef.current) stopContinuousDictation();
        setChatEnded(true);
        setIsOpen(false);
        activeRef.current = false;
      }
    }, TEAM_CHECK_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ─── Start Chat: NEVER show offline dead message! ─── */
  const startChat = async () => {
    setVoiceNote("");
    if (openingChatRef.current) {
      greetAgainRef.current = true;
      return;
    }
    openingChatRef.current = true;
    setIsTyping(true);
    try {
      const data = await chatApi<ChatResponse>("/chatbot/session", {
        body: {
          sessionId: sessionIdRef.current || undefined,
          lang: langRef.current,
          pageUrl: typeof window !== "undefined" ? window.location.pathname : "/",
        },
      });
      applyResponse(data);
      setIsTyping(false);
      showHistory(data.history);
      if (data.repeatGreeting) {
        const line = data.repeatGreeting;
        queueRef.current = queueRef.current.then(() => readOut(line));
        await queueRef.current;
      } else if (data.replies?.length) {
        await botSay(data.replies);
      } else if (!chatLoadedRef.current) {
        chatLoadedRef.current = true;
        await botSay(DEFAULT_ENSIS_OVERVIEW);
      }
    } catch {
      setIsTyping(false);
      // Fallback seamlessly to rich, comprehensive Ensis overview
      if (!chatLoadedRef.current) {
        chatLoadedRef.current = true;
        await botSay(DEFAULT_ENSIS_OVERVIEW);
      }
    } finally {
      openingChatRef.current = false;
      if (greetAgainRef.current) {
        greetAgainRef.current = false;
        void startChat();
      }
    }
  };

  /* ─── Spoken Call Flow ─── */
  const callPost = <T,>(path: string, body: object) => {
    const sent = callPostsRef.current.then(() =>
      chatApi<T>(`/chatbot/call/${path}`, { body: { sessionId: sessionIdRef.current, ...body } })
    );
    callPostsRef.current = sent.catch(() => {});
    return sent;
  };

  const dropBubble = (key: string) => {
    droppedRef.current.add(key);
    setMessages((prev) => prev.filter((m) => m.key !== key));
  };

  const heardRef = useRef(new Map<string, string>());
  const botTextRef = useRef(new Map<string, string>());
  const rewritingRef = useRef(new Set<string>());
  const unansweredRef = useRef<string[]>([]);
  const droppedRef = useRef(new Set<string>());
  const nameKnownRef = useRef(false);
  const nameAsksRef = useRef(0);
  const voiceStyleRef = useRef("");
  const choosingRef = useRef(false);
  const goingToTypingRef = useRef(false);
  const awaitingWordsRef = useRef(false);
  const typingAckRef = useRef(false);
  const typedTurnRef = useRef(false);
  const replyHow = () => (typedTurnRef.current ? { output_modalities: ["text"] } : {});
  const closeAfterSpeechRef = useRef(false);
  const closingAtRef = useRef<number | null>(null);
  const closingModeRef = useRef(false);
  const goodbyeSaidRef = useRef(false);
  const goodbyeRef = useRef({
    en: "Namaskar! I hope you find me helpful. If not, please contact us at +91 9810242841 or +91 9654900525 for more help. Have a wonderful and healthy day ahead!",
    hi: "नमस्कार! आशा है यह बातचीत आपके लिए उपयोगी रही। यदि नहीं, तो अधिक सहायता के लिए आप हमारे हेल्पलाइन नंबर +91 9810242841 या +91 9654900525 पर कभी भी संपर्क कर सकते हैं। आपका दिन शुभ और मंगलमय हो!",
  });

  const sarvamVoiceRef = useRef(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceTurnRef = useRef(0);
  const voiceQueueRef = useRef<Promise<void>>(Promise.resolve());

  const voiceEnded = () => {
    assistantTalking(false);
    if (endAfterSpeechRef.current) endCallRef.current();
    if (closeAfterSpeechRef.current || closingModeRef.current) startClosing();
  };

  const stopVoice = () => {
    voiceTurnRef.current += 1;
    const aud = voiceAudioRef.current;
    voiceAudioRef.current = null;
    aud?.pause();
    if (aud && speakingRef.current) voiceEnded();
  };

  const speakVoice = (text: string) => {
    const turn = voiceTurnRef.current;
    const clip = fetch(`${getBackendBaseUrl()}/api/chatbot/call/say`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionIdRef.current, text }),
    }).then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`speech ${res.status}`))));

    voiceQueueRef.current = voiceQueueRef.current.then(async () => {
      let blob: Blob;
      try {
        blob = await clip;
      } catch {
        return;
      }
      if (turn !== voiceTurnRef.current || !callRef.current) return;
      const url = URL.createObjectURL(blob);
      const aud = new Audio(url);
      voiceAudioRef.current = aud;
      await new Promise<void>((resolve) => {
        aud.onplay = () => assistantTalking(true);
        aud.onended = () => resolve();
        aud.onpause = () => resolve();
        aud.onerror = () => resolve();
        aud.play().catch(() => resolve());
      });
      URL.revokeObjectURL(url);
      if (voiceAudioRef.current === aud) {
        voiceAudioRef.current = null;
        voiceEnded();
      }
    });
  };

  const visitorSpeakingRef = useRef(false);
  const speechStartedAtRef = useRef(0);
  const lastSpeechMsRef = useRef(0);
  const resumeByVoiceRef = useRef(false);
  const finishChatRef = useRef<() => void>(() => {});
  const [chatEnded, setChatEnded] = useState(false);

  const startClosing = () => {
    closingModeRef.current = true;
    closeAfterSpeechRef.current = false;
    closingAtRef.current = Date.now() + CHAT_END_AFTER_GOODBYE_MS;
  };

  const lastVisitorWordsRef = useRef("");
  const withVoiceStyle = (instructions: string) => [voiceStyleRef.current, instructions].filter(Boolean).join("\n\n");

  const nameDone = () => {
    if (nameKnownRef.current) return;
    nameKnownRef.current = true;
    callRef.current?.send({
      type: "session.update",
      session: {
        type: "realtime",
        audio: { input: { turn_detection: { type: "semantic_vad", eagerness: "medium", create_response: true, interrupt_response: true } } },
      },
    });
  };

  const updateBubble = (key: string, from: Message["from"], change: (bubble: Message) => Partial<Message>) =>
    setMessages((prev) => {
      if (droppedRef.current.has(key)) return prev;
      const bubble = prev.find((m) => m.key === key) ?? { id: ++idRef.current, key, from, text: "", live: true };
      const updated = { ...bubble, ...change(bubble) };
      return prev.some((m) => m.key === key) ? prev.map((m) => (m.key === key ? updated : m)) : [...prev, updated];
    });

  const assistantTalking = (on: boolean) => {
    speakingRef.current = on;
    setSpeaking(on);
    callRef.current?.setAssistantTalking(on);
    if (on) lastActivityRef.current = Date.now();
  };

  const sayInstead = (line: string) => {
    const call = callRef.current;
    if (!call) return;
    if (sarvamVoiceRef.current) stopVoice();
    if (speakingRef.current) {
      call.send({ type: "response.cancel" });
      call.send({ type: "output_audio_buffer.clear" });
    }
    call.send({
      type: "response.create",
      response: { instructions: withVoiceStyle(`Say exactly this and nothing else: "${line}"`), tool_choice: "none", ...replyHow() },
    });
  };

  const sayGoodbye = () => {
    closeAfterSpeechRef.current = true;
    if (goodbyeSaidRef.current) return;
    goodbyeSaidRef.current = true;
    const call = callRef.current;
    if (!call) return;
    call.send({ type: "response.cancel" });
    call.send({ type: "output_audio_buffer.clear" });
    call.send({
      type: "response.create",
      response: {
        instructions: withVoiceStyle(
          `You are Ensis Assist, a warm young woman answering for Ensis (Panchkarma & Wellness Equipment). The visitor has finished. Their last words were: "${lastVisitorWordsRef.current.slice(
            0,
            200
          )}". Reply in the same language as those words, and say only a short warm goodbye. In English: "${
            goodbyeRef.current.en
          }" In Hindi, written in Devanagari: "${goodbyeRef.current.hi}" Don't ask anything. Say nothing else.`
        ),
        tool_choice: "none",
        ...replyHow(),
      },
    });
  };

  const ignoreMisheard = (itemId: string) => {
    dropBubble(itemId);
    heardRef.current.delete(itemId);
    unansweredRef.current = unansweredRef.current.filter((id) => id !== itemId);
    const call = callRef.current;
    if (!call) return;
    call.send({ type: "conversation.item.delete", item_id: itemId });
    call.send({ type: "response.cancel" });
    call.send({ type: "output_audio_buffer.clear" });
    if (lastSpeechMsRef.current >= SHORTEST_SPEECH_MS) sayInstead(COPY[langRef.current].didntCatch);
  };

  const onAbuse = (
    { say: abusiveSay, blocked: nowBlocked, blockedFor }: { say?: string; blocked?: boolean; blockedFor?: number },
    itemId?: string
  ) => {
    if (itemId) {
      dropBubble(itemId);
      callRef.current?.send({ type: "conversation.item.delete", item_id: itemId });
    }
    if (nowBlocked) {
      blockChat(blockedFor);
      endAfterSpeechRef.current = true;
    }
    if (abusiveSay) sayInstead(abusiveSay);
  };

  const visitorSaid = async (itemId: string, text: string) => {
    choosingRef.current = false;
    heardRef.current.delete(itemId);
    const waits = REWRITTEN_SCRIPTS.test(text);
    if (!waits) updateBubble(itemId, "user", () => ({ text, live: false }));
    try {
      const saved = await callPost<{ flagged?: boolean; say?: string; blocked?: boolean; blockedFor?: number; text?: string; lang?: Lang; finished?: boolean }>(
        "turn",
        { role: "user", text }
      );
      if (saved?.lang) rememberChat("", saved.lang);
      if (saved?.finished) sayGoodbye();
      if (saved?.flagged) onAbuse(saved, itemId);
      else if (waits) updateBubble(itemId, "user", () => ({ text: saved.text || text, live: false }));
      else if (saved?.text && saved.text !== text) updateBubble(itemId, "user", () => ({ text: saved.text, live: false }));
    } catch {
      if (waits) updateBubble(itemId, "user", () => ({ text, live: false }));
    }
  };

  const assistantSaid = async (itemId: string, text: string, greeting: boolean) => {
    updateBubble(itemId, "bot", () => ({ text, live: false }));
    try {
      const saved = await callPost<{ text?: string }>("turn", { role: "assistant", text, greeting });
      if (saved?.text && saved.text !== text) {
        updateBubble(itemId, "bot", () => ({ text: saved.text, live: false }));
      }
    } catch {
      // Keep original text
    }
  };

  const goToTyping = async (callId: string | undefined, alreadySpoke: boolean) => {
    const call = callRef.current;
    if (!call) return;
    const output = { type: "conversation.item.create", item: { type: "function_call_output", call_id: callId, output: '{"ok":true}' } };
    if (goingToTypingRef.current) {
      call.send(output);
      return;
    }
    goingToTypingRef.current = true;
    endedByHandRef.current = true;
    lastActivityRef.current = Date.now();
    call.setMuted(true);
    call.send({ type: "session.update", session: { type: "realtime", audio: { input: { turn_detection: null } } } });
    void callPost("tool", { name: "continue_typing", args: {} }).catch(() => {});
    call.send(output);

    for (let waited = 0; awaitingWordsRef.current && waited < 15; waited++) await sleep(100);
    if (callRef.current !== call) return;
    typingAckRef.current = true;

    const next = "asking how you can help with Ensis Panchkarma equipment";
    const line = alreadySpoke
      ? `You have already told them they can type. Now write only one short warm sentence ${next}.`
      : `Write one short warm sentence telling them to type here in the chat and ${next}.`;

    call.send({
      type: "response.create",
      response: {
        instructions: withVoiceStyle(
          `You are Ensis Assist, a warm young woman answering for Ensis (Panchkarma & Wellness Equipment). The visitor wants to type instead of talk. Their last words were: "${lastVisitorWordsRef.current.slice(
            0,
            200
          )}". Reply in the same language as those words. Write Hindi in Devanagari. ${line} Write nothing else.`
        ),
        tool_choice: "none",
        output_modalities: ["text"],
      },
    });
  };

  const runCallTools = async (requested: NonNullable<NonNullable<CallEvent["response"]>["output"]>, spoke: boolean) => {
    const overheard = requested.filter((item) => item.name === "not_for_me");
    if (overheard.length) {
      unansweredRef.current.forEach((itemId) => {
        dropBubble(itemId);
        callRef.current?.send({ type: "conversation.item.delete", item_id: itemId });
      });
      unansweredRef.current = [];
      overheard.forEach((item) => item.id && callRef.current?.send({ type: "conversation.item.delete", item_id: item.id }));
    }
    requested = requested.filter((item) => item.name !== "not_for_me");
    if (!requested.length) return;

    const toTyping = requested.find((item) => item.name === "continue_typing");
    if (toTyping) {
      void goToTyping(toTyping.call_id, spoke);
      return;
    }

    let replyAfterwards = false;
    for (const { name, call_id: callId, arguments: rawArgs } of requested) {
      const reportsName = (name === "update_visitor" || name === "submit_enquiry") && /"name"\s*:\s*"[^"]+"/.test(rawArgs || "");
      if (reportsName) for (let waited = 0; awaitingWordsRef.current && waited < 15; waited++) await sleep(100);

      let done: ToolDone;
      try {
        done = await callPost<ToolDone>("tool", { name, args: JSON.parse(rawArgs || "{}") });
      } catch {
        done = { output: { problem: "That didn't work just now. Don't guess: say you'll have the Ensis team assist them." } };
      }

      if (reportsName && !(done.output as { nameRejected?: boolean })?.nameRejected) {
        nameDone();
        callRef.current?.send({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "system",
            content: [
              {
                type: "input_text",
                text: `The visitor just gave their name (if it was "Visitor", they didn't want to). Thank them by name, then answer what they had asked before about Ensis Panchkarma products. If they only chose to talk and asked nothing, simply ask how you can help. Their last words were: "${lastVisitorWordsRef.current.slice(
                  0,
                  200
                )}". Reply in the language of those words.`,
              },
            ],
          },
        });
      }

      if (done.files?.length || done.link) setMessages((prev) => [...prev, { id: ++idRef.current, from: "bot", text: "", files: done.files, link: done.link }]);
      if (done.flagged) setMessages((prev) => prev.filter((m, i) => !(i === prev.length - 1 && m.from === "user")));
      if (done.blocked) blockChat(done.blockedFor);

      if (done.end) {
        if (done.blocked) endAfterSpeechRef.current = true;
        else closeAfterSpeechRef.current = true;
      }

      callRef.current?.send({ type: "conversation.item.create", item: { type: "function_call_output", call_id: callId, output: JSON.stringify(done.output) } });
      if (name !== "end_conversation") replyAfterwards = true;
    }

    if (replyAfterwards) callRef.current?.send({ type: "response.create", response: replyHow() });
    else if (endAfterSpeechRef.current && !spoke) sayInstead(COPY[langRef.current].goodbye);
    else if (closeAfterSpeechRef.current && !spoke) sayGoodbye();
    else if (endAfterSpeechRef.current && !speakingRef.current) endCallRef.current();
    else if (closeAfterSpeechRef.current && !speakingRef.current) startClosing();
  };

  const onCallEvent = (event: CallEvent) => {
    switch (event.type) {
      case "conversation.item.added": {
        const { item } = event;
        if (item?.type !== "message" || item.content?.some((part) => part.type === "input_text")) break;
        if (item.role === "user") {
          unansweredRef.current.push(item.id);
          updateBubble(item.id, "user", () => ({}));
        } else if (item.role === "assistant") {
          unansweredRef.current = [];
          updateBubble(item.id, "bot", () => ({}));
        }
        break;
      }
      case "input_audio_buffer.committed":
        awaitingWordsRef.current = true;
        typedTurnRef.current = false;
        if (goingToTypingRef.current) break;
        if (!nameKnownRef.current) {
          if (!choosingRef.current) nameAsksRef.current += 1;
          if (nameAsksRef.current > MAX_NAME_ASKS) {
            nameDone();
            callRef.current?.send({ type: "response.create" });
          } else callRef.current?.send({ type: "response.create", response: { instructions: withVoiceStyle(NAME_STEP) } });
        }
        break;
      case "input_audio_buffer.speech_started":
        if (sarvamVoiceRef.current && voiceAudioRef.current) stopVoice();
        stopSpeaking();
        if (speakingRef.current) {
          callRef.current?.send({ type: "response.cancel" });
          callRef.current?.send({ type: "output_audio_buffer.clear" });
          assistantTalking(false);
        }
        lastActivityRef.current = Date.now();
        visitorSpeakingRef.current = true;
        speechStartedAtRef.current = Date.now();
        break;
      case "input_audio_buffer.speech_stopped":
        visitorSpeakingRef.current = false;
        lastSpeechMsRef.current = Date.now() - speechStartedAtRef.current;
        if (closingModeRef.current) startClosing();
        break;
      case "conversation.item.input_audio_transcription.delta": {
        if (!event.item_id) break;
        const heard = (heardRef.current.get(event.item_id) || "") + (event.delta || "");
        heardRef.current.set(event.item_id, heard);
        // Suppress live delta if it contains Arabic/Urdu, Devanagari or Gurmukhi scripts so raw non-Latin scripts don't flash in chat
        if (!REWRITTEN_SCRIPTS.test(heard) && !FOREIGN_LETTERS.test(heard)) {
          updateBubble(event.item_id, "user", () => ({ text: heard }));
        }
        break;
      }
      case "conversation.item.input_audio_transcription.completed": {
        lastActivityRef.current = Date.now();
        awaitingWordsRef.current = false;
        const text = (event.transcript || "").trim();
        if (!event.item_id) break;
        if (text && misheard(text, event.logprobs)) {
          ignoreMisheard(event.item_id);
          break;
        }
        if (text) {
          lastVisitorWordsRef.current = text;
          void visitorSaid(event.item_id, text);
        } else dropBubble(event.item_id);
        break;
      }
      case "conversation.item.input_audio_transcription.failed":
        awaitingWordsRef.current = false;
        if (event.item_id) {
          heardRef.current.delete(event.item_id);
          dropBubble(event.item_id);
        }
        break;
      case "response.output_item.added":
        if (event.item?.role === "assistant") {
          lastActivityRef.current = Date.now();
          assistantTalking(true);
        }
        break;
      case "response.output_audio_transcript.delta":
      case "response.audio_transcript.delta":
      case "response.output_text.delta":
      case "response.text.delta": {
        if (!event.item_id) break;
        const delta = event.delta || "";
        const text = (botTextRef.current.get(event.item_id) || "") + delta;
        botTextRef.current.set(event.item_id, text);
        updateBubble(event.item_id, "bot", () => ({ text }));
        break;
      }
      case "response.output_audio_transcript.done":
      case "response.audio_transcript.done":
      case "response.output_text.done":
      case "response.text.done": {
        lastActivityRef.current = Date.now();
        if (!event.item_id) break;
        const text = (event.transcript || event.text || botTextRef.current.get(event.item_id) || "").trim().replace(/^["“”']+|["“”']+$/g, "").trim();
        botTextRef.current.delete(event.item_id);
        const greeting = greetingNextRef.current;
        greetingNextRef.current = false;
        if (text) {
          updateBubble(event.item_id, "bot", () => ({ text, live: false }));
          if (sarvamVoiceRef.current) speakVoice(text);
          void assistantSaid(event.item_id, text, greeting);
          if (botSaysGoodbye(text)) {
            goodbyeSaidRef.current = true;
            closeAfterSpeechRef.current = true;
          }
        } else {
          updateBubble(event.item_id, "bot", () => ({ live: false }));
        }
        break;
      }
      case "response.done": {
        lastActivityRef.current = Date.now();
        const spoke = Boolean(event.response?.output?.some((i) => i.type === "message"));
        if (!sarvamVoiceRef.current && spoke) assistantTalking(false);
        const requested = event.response?.output?.filter((i) => i.type === "function_call") || [];
        if (requested.length) void runCallTools(requested, spoke);
        if (typingAckRef.current && !requested.length) endCallRef.current();
        if (endAfterSpeechRef.current && !sarvamVoiceRef.current) endCallRef.current();
        if ((closeAfterSpeechRef.current || closingModeRef.current) && !sarvamVoiceRef.current) startClosing();
        break;
      }
      case "error":
        console.warn("[chat] call error:", event.error?.code, event.error?.message);
        if (typingAckRef.current) endCallRef.current();
        break;
      default:
        break;
    }
  };

  const endCall = (note?: string) => {
    voiceTurnRef.current += 1;
    voiceAudioRef.current?.pause();
    voiceAudioRef.current = null;
    sarvamVoiceRef.current = false;
    callCleanupRef.current?.();
    callCleanupRef.current = null;
    choosingRef.current = false;
    goingToTypingRef.current = false;
    awaitingWordsRef.current = false;
    typingAckRef.current = false;
    typedTurnRef.current = false;
    closeAfterSpeechRef.current = false;
    closingAtRef.current = null;
    closingModeRef.current = false;
    goodbyeSaidRef.current = false;
    visitorSpeakingRef.current = false;

    const call = callRef.current;
    callRef.current = null;
    if (call) {
      call.stop();
      void chatApi("/chatbot/call/end", { body: { sessionId: sessionIdRef.current } }).catch(() => {});
    }

    endAfterSpeechRef.current = false;
    speakingRef.current = false;
    setSpeaking(false);
    setMicMuted(false);
    setCallState("off");
    setMessages((prev) => prev.filter((m) => m.text || m.files?.length || m.link).map((m) => (m.live ? { ...m, live: false } : m)));
    if (note) setVoiceNote(note);
  };
  endCallRef.current = endCall;

  const clearAllChats = async () => {
    stopSpeaking();
    if (callRef.current) endCall();
    continuousVoiceActiveRef.current = false;
    isPausedRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (speechSafetyTimerRef.current) clearTimeout(speechSafetyTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    const oldSessionId = sessionIdRef.current;
    sessionIdRef.current = "";
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
    setMessages(
      DEFAULT_ENSIS_OVERVIEW.map((item) => ({
        id: ++idRef.current,
        from: "bot" as const,
        at: Date.now(),
        ...item,
      }))
    );
    setVoiceNote(lang === "hi" ? "चैट रीसेट कर दी गई है" : "All chats deleted & reset");
    setTimeout(() => setVoiceNote(""), 3500);
    try {
      await chatApi("/chatbot/session/clear", { body: { sessionId: oldSessionId } });
    } catch {}
  };

  const stopContinuousDictation = () => {
    continuousVoiceActiveRef.current = false;
    isPausedRef.current = false;
    if (micIdleTimerRef.current) {
      clearTimeout(micIdleTimerRef.current);
      micIdleTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speechSafetyTimerRef.current) {
      clearTimeout(speechSafetyTimerRef.current);
      speechSafetyTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setVoiceNote("");
  };

  const finishDictation = async () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (speechSafetyTimerRef.current) {
      clearTimeout(speechSafetyTimerRef.current);
      speechSafetyTimerRef.current = null;
    }
    const text = (latestSpeechTextRef.current || inputRef.current?.value || "").trim();
    latestSpeechTextRef.current = "";

    // Silence any active speech immediately when user begins sending
    stopSpeaking();
    if (voiceAudioRef.current) stopVoice();
    speakingRef.current = false;
    setSpeaking(false);

    // CRITICAL DEDUPLICATION:
    // Drop empty text, or duplicate text sent within 4 seconds, or in-flight sends!
    if (!text || isSendingRef.current || (text === lastSentTextRef.current && Date.now() - lastSentTimeRef.current < 4000)) {
      return;
    }

    // Abort active recognition so Web Speech API doesn't re-emit final event for this utterance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    lastSentTextRef.current = text;
    lastSentTimeRef.current = Date.now();
    isSendingRef.current = true;

    try {
      setInput("");
      await sendToAssistant(text);
    } finally {
      isSendingRef.current = false;
    }
  };

  const startSpeechDictation = () => {
    unlockVoice();
    const SpeechRec =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    if (!SpeechRec) {
      setVoiceNote(COPY[langRef.current].callUnavailable);
      continuousVoiceActiveRef.current = false;
      return;
    }

    try {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (speechSafetyTimerRef.current) {
        clearTimeout(speechSafetyTimerRef.current);
        speechSafetyTimerRef.current = null;
      }
      if (micIdleTimerRef.current) {
        clearTimeout(micIdleTimerRef.current);
        micIdleTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }

      // 1 minute idle mic timeout matching Design House
      micIdleTimerRef.current = setTimeout(() => {
        if (continuousVoiceActiveRef.current) {
          stopContinuousDictation();
          setVoiceNote(langRef.current === "hi" ? "Kaafi der se koi awaaz nahi aayi, isliye mic band kar diya." : "Mic turned off due to 1 minute of inactivity.");
        }
      }, 60000);

      latestSpeechTextRef.current = "";
      const recognition = new SpeechRec();
      // Dynamically select native transcription acoustic model for Punjabi (pa-IN), Bengali (bn-IN), Hindi (hi-IN) or Indian English (en-IN)
      const getSpeechCode = (l: Lang): string => {
        if (l === "pa") return "pa-IN";
        if (l === "bn") return "bn-IN";
        if (l === "hi") return "hi-IN";
        return "en-IN";
      };
      recognition.lang = getSpeechCode(langRef.current);
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      continuousVoiceActiveRef.current = true;
      setVoiceNote(
        isPausedRef.current
          ? (langRef.current === "pa" ? "⏸️ ਗੱਲਬਾਤ ਰੋਕੀ ਹੋਈ ਹੈ (ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਬੋਲੋ)" : langRef.current === "bn" ? "⏸️ কথোপকথন বিরতিতে আছে (শুরু করতে বলুন)" : langRef.current === "hi" ? "⏸️ बातचीत पॉज़ है (शुरू करने के लिए बोलें)" : "⏸️ Paused (speak to resume)")
          : (langRef.current === "pa" ? "🎙️ ਸੁਣ ਰਹੀ ਹਾਂ, ਬੋਲੋ ਜੀ... ('ਰੁਕੋ' ਕਹਿਣ 'ਤੇ ਰੁਕ ਜਾਵਾਂਗੀ)" : langRef.current === "bn" ? "🎙️ শুনছি, বলুন... ('পজ' বললে থেমে যাব)" : langRef.current === "hi" ? "🎙️ सुन रही हूँ, बोलिए... ('पॉज़' बोलने पर रुक जाऊँगी)" : "🎙️ Listening continuously... (say 'pause' to pause)")
      );

      recognition.onresult = (event: any) => {
        // While the assistant is speaking out loud or typing, ignore mic audio to avoid echo or self-interruption
        if (speakingRef.current || isTyping) {
          return;
        }

        let finalTranscript = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const heard = (finalTranscript || interim).trim();
        if (!heard) return;

        // Auto-detect language from script in real-time
        if (/[\u0A00-\u0A7F]/.test(heard)) {
          langRef.current = "pa";
        } else if (/[\u0980-\u09FF]/.test(heard)) {
          langRef.current = "bn";
        } else if (/[\u0900-\u097F]/.test(heard)) {
          langRef.current = "hi";
        }

        // Check for PAUSE command immediately!
        if (/^(pause|ruko|ruk\s*jao|ek\s*minute|hold\s*on|wait|stop|ठहरो|रुक|रुको)\b/i.test(heard)) {
          stopSpeaking();
          if (voiceAudioRef.current) stopVoice();
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          isPausedRef.current = true;
          latestSpeechTextRef.current = "";
          setInput("");
          setVoiceNote(langRef.current === "hi" ? "⏸️ पॉज़ किया गया (बोलना जारी रखने के लिए फिर से बोलें)" : "⏸️ Paused (speak anytime to resume)");
          return;
        }

        isPausedRef.current = false;
        latestSpeechTextRef.current = heard;
        setInput(heard);
        lastActivityRef.current = Date.now();

        // Reset 1 minute idle mic timeout
        if (micIdleTimerRef.current) clearTimeout(micIdleTimerRef.current);
        micIdleTimerRef.current = setTimeout(() => {
          if (continuousVoiceActiveRef.current) {
            stopContinuousDictation();
            setVoiceNote(langRef.current === "hi" ? "Kaafi der se koi awaaz nahi aayi, isliye mic band kar diya." : "Mic turned off due to 1 minute of inactivity.");
          }
        }, 60000);

        // Reset silence debounce timer: 1100ms after user pauses speaking, send!
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          void finishDictation();
        }, 1100);
      };

      recognition.onerror = (e: any) => {
        const errType = e?.error;
        if (errType === "not-allowed") {
          continuousVoiceActiveRef.current = false;
          setIsRecording(false);
          setVoiceNote(COPY[langRef.current].micDenied);
        } else if (errType !== "no-speech" && errType !== "aborted") {
          console.warn("[chatbot] speech recognition:", errType);
        }
      };

      recognition.onend = () => {
        if (!continuousVoiceActiveRef.current || isPausedRef.current || closingModeRef.current) {
          setIsRecording(false);
          return;
        }
        // Continuous Voice Mode: keep listening continuously across turns so user can speak/interrupt at any time!
        setTimeout(() => {
          if (continuousVoiceActiveRef.current && !isPausedRef.current && !closingModeRef.current) {
            startSpeechDictation();
          }
        }, 150);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      continuousVoiceActiveRef.current = false;
      setIsRecording(false);
      setVoiceNote("");
    }
  };

  const handleMicClick = () => {
    if (inCall) {
      endCallByHand();
      return;
    }
    // If dictation is currently recording, toggle it off
    if (isRecording || continuousVoiceActiveRef.current) {
      stopContinuousDictation();
      return;
    }
    // Match Design House behavior:
    // Clicking the mic button starts the WebRTC voice call if available, or dictation!
    if (canTalk) {
      void startCall();
    } else {
      startSpeechDictation();
    }
  };

  const startCall = async (askTalkOrType = false) => {
    if (callRef.current || openingCallRef.current) return;
    const copy = () => COPY[langRef.current];
    openingCallRef.current = true;
    endedByHandRef.current = false;
    closingAtRef.current = null;
    closingModeRef.current = false;
    setChatEnded(false);
    stopSpeaking();
    setVoiceNote("");
    setCallState("connecting");

    let start: CallStart | null = null;
    let heardAnything = false;
    let warnedSilent = false;
    let warnedEnding = false;
    const opened = Date.now();

    let call: Call;
    try {
      call = await openCall(
        {
          connect: async (offer) => {
            const data = await chatApi<CallStart>("/chatbot/call", {
              body: {
                sdp: offer,
                sessionId: sessionIdRef.current || undefined,
                lang: "en",
                pageUrl: typeof window !== "undefined" ? window.location.pathname : "/",
                noise: noiseOnRef.current,
              },
            });
            start = data;
            if (start.blocked) {
              blockChat(start.blockedFor);
              throw new DOMException("Blocked", "Blocked");
            }
            if (start.agent) throw new DOMException("The team has this chat", "Team");
            if (start.unavailable) throw new DOMException("No calls right now", "Unavailable");
            rememberChat(start.sessionId, start.lang);
            syncTeam(start);
            showHistory(start.history);
            return start.sdp;
          },
          onEvent: (event) => onCallEvent(event as unknown as CallEvent),
          onLevel: (level) => {
            if (micRingRef.current) micRingRef.current.style.transform = `scale(${1 + Math.min(level * 7, 0.9)})`;
            if (level > FAINT_LEVEL) heardAnything = true;
          },
          onClosed: () => {
            if (callRef.current) endCallRef.current(copy().callDropped);
          },
        },
        { noiseCancel: noiseOnRef.current }
      );
    } catch (error) {
      openingCallRef.current = false;
      setCallState("off");
      const name = (error as DOMException).name;
      if (name === "Blocked") setBlocked(true);
      else if (name === "Team") setTeam(true);
      else if (name === "NotAllowedError" || name === "SecurityError") {
        setVoiceNote(copy().micDenied);
      } else if (name === "NotFoundError") {
        setVoiceNote(copy().micNotFound);
      } else if (name === "NotReadableError") {
        setVoiceNote(copy().micBusy);
      } else {
        if (name !== "Unavailable") console.warn("[chatbot] voice call fallback to speech recognition:", error);
        const SpeechRec =
          typeof window !== "undefined"
            ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            : null;
        if (SpeechRec) {
          startSpeechDictation();
          return;
        }
        setVoiceNote(name === "Unavailable" ? copy().callUnavailable : copy().callFailed);
      }
      if (activeRef.current) void startChat();
      return;
    }
    openingCallRef.current = false;

    if (!activeRef.current || !start) {
      call.stop();
      void chatApi("/chatbot/call/end", { body: { sessionId: sessionIdRef.current } }).catch(() => {});
      setCallState("off");
      return;
    }

    const { greeting, choiceGreeting, maxSeconds, knowsName, voiceStyle, goodbye, voice } = start as CallStart;
    voiceStyleRef.current = voiceStyle || "";
    if (goodbye?.en) goodbyeRef.current = goodbye;
    nameKnownRef.current = Boolean(knowsName);
    nameAsksRef.current = 0;
    sarvamVoiceRef.current = voice === "sarvam";

    if (sarvamVoiceRef.current) {
      const send = call.send;
      call.send = (event) => {
        const { type } = event as { type?: string };
        if (type === "output_audio_buffer.clear" || type === "response.cancel") stopVoice();
        if (type !== "output_audio_buffer.clear") send(event);
      };
    }

    callRef.current = call;
    setCallState("on");
    lastActivityRef.current = Date.now();

    const tick = setInterval(() => {
      const now = Date.now();
      if (!heardAnything && !warnedSilent && now - opened > MIC_SILENT_NOTE_MS) {
        warnedSilent = true;
        setVoiceNote(copy().micNoSpeech);
      }
      if (!speakingRef.current && now - lastActivityRef.current > CALL_IDLE_MS) {
        endCall(copy().callIdle);
        return;
      }
      if (!warnedEnding && now - opened > (maxSeconds - CALL_ENDING_WARNING_S) * 1000) {
        warnedEnding = true;
        sayInstead(copy().callEnding);
      }
    }, 1000);

    const goodbyeGuard = setInterval(() => {
      if (endAfterSpeechRef.current && !speakingRef.current && Date.now() - lastActivityRef.current > END_AFTER_GOODBYE_MS) endCall();
      if (closeAfterSpeechRef.current && !speakingRef.current && Date.now() - lastActivityRef.current > END_AFTER_GOODBYE_MS) startClosing();
    }, 2000);

    callCleanupRef.current = () => {
      clearInterval(tick);
      clearInterval(goodbyeGuard);
    };

    const alreadyGreeted = messages.some((m) => m.from === "bot");
    if (!alreadyGreeted) {
      greetingNextRef.current = true;
      choosingRef.current = askTalkOrType && Boolean(choiceGreeting);
      call.send({
        type: "response.create",
        response: {
          instructions: withVoiceStyle(
            `Greet the visitor now, warmly and professionally, in your natural Indian English accent, by saying exactly this: "${
              choosingRef.current ? choiceGreeting : greeting
            }"`
          ),
          tool_choice: "none",
        },
      });
    } else {
      greetingNextRef.current = false;
      choosingRef.current = false;
    }
  };

  const endCallByHand = () => {
    endedByHandRef.current = true;
    endCall();
  };

  const toggleMic = () => {
    const next = !micMuted;
    setMicMuted(next);
    callRef.current?.setMuted(next);
  };

  const toggleNoise = () => {
    const next = !noiseOnRef.current;
    noiseOnRef.current = next;
    setNoiseOn(next);
    localStorage.setItem(NOISE_KEY, next ? "1" : "0");
    const call = callRef.current;
    if (!call) return;
    call.setNoiseCancel(next);
    call.send({
      type: "session.update",
      session: { type: "realtime", audio: { input: { noise_reduction: { type: next ? "near_field" : "far_field" } } } },
    });
  };

  const finishChat = () => {
    resumeByVoiceRef.current = Boolean(callRef.current);
    endedByHandRef.current = true;
    stopSpeaking();
    endCall();
    closingAtRef.current = null;
    setChatEnded(true);
  };

  const resumeChat = () => {
    unlockVoice();
    audio();
    setChatEnded(false);
    if (resumeByVoiceRef.current && canTalk) void startCall();
    else void startChat();
  };

  const open = () => {
    unlockVoice();
    audio();
    setIsOpen(true);
    setIsMinimized(false);
    activeRef.current = true;
    if (chatEnded) return;
    void startChat();
  };

  useEffect(() => {
    openRef.current = open;
    finishChatRef.current = finishChat;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const at = closingAtRef.current;
      if (!at || Date.now() < at) return;
      if (inputRef.current?.value.trim() || speakingRef.current || visitorSpeakingRef.current) closingAtRef.current = Date.now() + 500;
      else finishChatRef.current();
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const openedAtOnceRef = useRef(false);
  useEffect(() => {
    if (!openAtOnce || openedAtOnceRef.current) return;
    openedAtOnceRef.current = true;
    open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAtOnce]);

  /* ─── Sending Typed Messages ─── */
  const typeInCall = async (text: string) => {
    choosingRef.current = false;
    typedTurnRef.current = true;
    let finished = false;
    const bubbleId = isAbusive(text) ? null : userSay(text);
    try {
      const saved = await callPost<{ flagged?: boolean; say?: string; blocked?: boolean; blockedFor?: number; lang?: Lang; finished?: boolean }>(
        "turn",
        { role: "user", text }
      );
      finished = Boolean(saved.finished);
      if (saved.lang) rememberChat("", saved.lang);
      if (saved.flagged) {
        if (bubbleId !== null) setMessages((prev) => prev.filter((m) => m.id !== bubbleId));
        onAbuse(saved);
        return;
      }
    } catch {
      // Continue
    }

    const call = callRef.current;
    if (!call) return;
    if (speakingRef.current) {
      call.send({ type: "response.cancel" });
      call.send({ type: "output_audio_buffer.clear" });
    }
    call.send({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text }] } });

    if (finished) {
      lastVisitorWordsRef.current = text;
      goodbyeSaidRef.current = false;
      sayGoodbye();
      return;
    }

    if (!nameKnownRef.current && nameAsksRef.current < MAX_NAME_ASKS) {
      nameAsksRef.current += 1;
      call.send({ type: "response.create", response: { instructions: withVoiceStyle(NAME_STEP), ...replyHow() } });
    } else {
      nameDone();
      call.send({ type: "response.create", response: replyHow() });
    }
  };

  const sendToAssistant = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Reset interrupted flag for the new response turn
    interruptedRef.current = false;

    const bubbleId = isAbusive(cleanText) ? null : userSay(cleanText);
    if (!teamLiveRef.current) setIsTyping(true);

    // 1. Progressive SSE Streaming (word-by-word typing, first token in <500ms)
    let streamedText = "";
    let streamBubbleId: number | null = null;
    let streamDoneData: any = null;

    try {
      const streamed = await chatApiStream(
        "/chatbot/message/stream",
        {
          sessionId: sessionIdRef.current || undefined,
          text: cleanText,
          message: cleanText,
          query: cleanText,
          lang: langRef.current,
          language: langRef.current,
          pageUrl: typeof window !== "undefined" ? window.location.pathname : "/",
        },
        (delta) => {
          setIsTyping(false);
          streamedText += delta;
          if (streamBubbleId === null) {
            streamBubbleId = ++idRef.current;
            setMessages((prev) => [
              ...prev,
              { id: streamBubbleId!, from: "bot", at: Date.now(), text: streamedText },
            ]);
          } else {
            setMessages((prev) =>
              prev.map((m) => (m.id === streamBubbleId ? { ...m, text: streamedText } : m))
            );
          }
        },
        (doneData) => {
          streamDoneData = doneData;
          applyResponse(doneData);
        }
      );

      if (streamed && streamedText.trim()) {
        setIsTyping(false);
        if (activeRef.current) playIncoming();
        try {
          queueRef.current = queueRef.current.then(() =>
            readOut({
              text: streamedText,
              speakId: streamDoneData?.speakId,
            })
          );
          await queueRef.current;
        } catch (speechErr) {
          console.warn("readOut failed:", speechErr);
        }
        if (continuousVoiceActiveRef.current && !isPausedRef.current && !callRef.current && !closingModeRef.current) {
          if (!recognitionRef.current && !speakingRef.current) {
            startSpeechDictation();
          }
        }
        if (streamDoneData?.end || botSaysGoodbye(streamedText)) closingModeRef.current = true;
        if (closingModeRef.current) startClosing();
        return;
      }
    } catch {
      // streaming failed, seamlessly fall back to non-streaming endpoint
    }

    // 2. Non-streaming fallback
    try {
      const data = await chatApi<any>("/chatbot/message", {
        body: {
          sessionId: sessionIdRef.current || undefined,
          text: cleanText,
          message: cleanText,
          query: cleanText,
          lang: langRef.current,
          language: langRef.current,
          pageUrl: typeof window !== "undefined" ? window.location.pathname : "/",
        },
      });
      applyResponse(data);
      setIsTyping(false);
      if (data?.flagged && bubbleId !== null) setMessages((prev) => prev.filter((m) => m.id !== bubbleId));
      if (data?.replies && Array.isArray(data.replies) && data.replies.length > 0) {
        await botSay(data.replies);
      } else if (data?.reply) {
        await botSay([{ text: data.reply }]);
      } else {
        await botSay(getLocalEnsisReply(text, messages));
      }
      if (data?.end || data?.replies?.some((line: any) => botSaysGoodbye(line.text))) closingModeRef.current = true;
    } catch {
      setIsTyping(false);
      // Fallback seamlessly to rich, intelligent Ensis domain knowledge
      const replies = getLocalEnsisReply(text, messages);
      await botSay(replies);
    }
    if (closingModeRef.current) startClosing();
  };

  const onSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    unlockVoice();
    const text = input.trim();
    if (!text || blocked || (isTyping && !callRef.current)) return;
    setInput("");
    closingAtRef.current = null;

    if (callRef.current && (goingToTypingRef.current || (choosingRef.current && !WANTS_TO_TALK.test(text)))) {
      endedByHandRef.current = true;
      endCall();
      void callPostsRef.current.then(() => sendToAssistant(text));
      return;
    }

    if (callRef.current) void typeInCall(text);
    else void sendToAssistant(text);
  };

  const onSelectChip = (chip: string) => {
    unlockVoice();
    if (blocked || (isTyping && !callRef.current)) return;
    const cleanText = chip.replace(/^[^\w\s]+\s*/, ""); // remove leading emojis
    setInput("");
    if (callRef.current) void typeInCall(cleanText);
    else void sendToAssistant(cleanText);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    localStorage.setItem(MUTED_KEY, next ? "1" : "0");
    if (!next) playIncoming();
  };

  const toggleVoice = () => {
    unlockVoice();
    const next = !voiceOn;
    setVoiceOn(next);
    voiceOnRef.current = next;
    localStorage.setItem(VOICE_KEY, next ? "1" : "0");
    if (!next) stopSpeaking();
  };

  const [closing, setClosing] = useState(false);
  const closeChat = () => {
    if (closing) return;
    continuousVoiceActiveRef.current = false;
    stopContinuousDictation();
    stopSpeaking();
    if (callRef.current) endCall();
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setIsOpen(false);
    }, 240);
  };

  const timeOf = (at: number) =>
    new Date(at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  const showAvatar = (index: number) =>
    messages[index].from !== "user" &&
    (messages[index - 1]?.from !== messages[index].from || !!messages[index - 1]?.event);

  const placeholder = blocked
    ? t.blockedPlaceholder
    : teamLive
    ? t.teamPlaceholder
    : callState === "connecting"
    ? t.connecting
    : inCall
    ? micMuted
      ? t.muted
      : speaking
      ? t.interruptHint
      : t.listening
    : t.placeholder;

  const typingDots = [0, 0.15, 0.3].map((d) => (
    <span key={d} className="ensis-dot h-2 w-2 rounded-full bg-[#263016]" style={{ animationDelay: `${d}s` }} />
  ));

  return (
    <>
      <style>{`
        @keyframes ensisChatIn {
          0% { opacity: 0; transform: translate(18px, 36px) scale(.5); filter: blur(10px); border-radius: 48px; }
          55% { opacity: 1; filter: blur(0); }
          75% { transform: translate(0, -5px) scale(1.015); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes ensisChatOut {
          0% { opacity: 1; transform: none; }
          100% { opacity: 0; transform: translate(18px, 30px) scale(.55); filter: blur(8px); border-radius: 48px; }
        }
        @keyframes ensisHeadIn { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }
        @keyframes ensisBodyIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes ensisMsgIn {
          0% { opacity: 0; transform: translateY(10px) scale(.9); }
          65% { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes ensisDot { 0%, 80%, 100% { transform: translateY(0); opacity: .45; } 40% { transform: translateY(-4px); opacity: 1; } }
        .ensis-chat-in { animation: ensisChatIn .55s cubic-bezier(.2,.9,.25,1) both; transform-origin: bottom right; }
        .ensis-chat-out { animation: ensisChatOut .26s cubic-bezier(.5,0,.75,0) both; transform-origin: bottom right; }
        .ensis-head-in { animation: ensisHeadIn .45s .12s cubic-bezier(.2,.9,.3,1) both; }
        .ensis-body-in { animation: ensisBodyIn .45s .2s cubic-bezier(.2,.9,.3,1) both; }
        .ensis-msg-in { animation: ensisMsgIn .36s cubic-bezier(.2,.9,.3,1.2) both; transform-origin: bottom left; }
        .ensis-msg-in.ensis-mine { transform-origin: bottom right; }
        .ensis-dot { animation: ensisDot 1.1s infinite ease-in-out; }
      `}</style>

      {isOpen && (
        <>
          <section
            role="dialog"
            aria-label={`${t.title} chat`}
            className={`${closing ? "ensis-chat-out" : "ensis-chat-in"} fixed z-[1000] flex flex-col overflow-hidden bg-white shadow-[0_24px_60px_-12px_rgba(38,48,22,0.38),0_0_0_1px_rgba(38,48,22,0.08)] inset-x-2 bottom-2 rounded-[20px] sm:inset-x-auto sm:right-5 sm:bottom-[92px] sm:w-[396px] sm:rounded-[22px] ${
              isMinimized ? "" : "h-[82vh] sm:h-[590px] sm:max-h-[calc(100vh-120px)]"
            }`}
          >
            {/* Header */}
            <header className="ensis-head-in relative flex shrink-0 items-center gap-2.5 bg-gradient-to-r from-[#1c2410] via-[#263016] to-[#364320] px-3.5 py-3 border-b-[3px] border-[#D98E16]">
              <div className="relative shrink-0">
                <span className="flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-2 ring-[#D98E16]/80 shadow-md">
                  <LottieChatbotAvatar
                    className="h-full w-full"
                    speaking={speaking}
                    showNotification={messageSentBadge}
                    notificationType="sent"
                  />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5" title={t.online}>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80] opacity-60" />
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22c55e]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-bold leading-tight text-white">{teamLive ? t.teamTitle : t.title}</p>
                <p className={`truncate text-[11px] ${(isTyping && !inCall) || teamLive ? "font-semibold text-[#86efac]" : "text-white/80"}`}>
                  {teamLive ? t.teamSubtitle : isTyping && !inCall ? t.typing : t.subtitle}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {/* Language Switcher: EN | हिं | বাং */}
                <div className="flex items-center rounded-full bg-white/15 p-0.5 text-[10px] font-bold text-white">
                  {(["en", "hi", "bn"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        setLang(l);
                        langRef.current = l;
                        if (continuousVoiceActiveRef.current) {
                          stopContinuousDictation();
                          setTimeout(() => startSpeechDictation(), 200);
                        }
                      }}
                      className={`rounded-full px-1.5 py-0.5 transition cursor-pointer ${
                        lang === l ? "bg-white text-[#263016] shadow-xs" : "text-white/80 hover:text-white"
                      }`}
                      title={l === "en" ? "English" : l === "hi" ? "हिंदी" : "বাংলা"}
                    >
                      {l === "en" ? "EN" : l === "hi" ? "हिं" : "বাং"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={clearAllChats}
                  title={lang === "bn" ? "চ্যাট রিসেট করুন" : lang === "hi" ? "चैट रीसेट करें" : "Reset & clear chats"}
                  aria-label={lang === "bn" ? "চ্যাট রিসেট করুন" : lang === "hi" ? "चैट रीसेट करें" : "Reset & clear chats"}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized((v) => !v)}
                  aria-label="Minimise chat"
                  className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  aria-label="Close chat"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {!isMinimized && (
              <>
                {/* Messages Body */}
                <div
                  ref={scrollRef}
                  data-lenis-prevent
                  className="ensis-body-in relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-[#f9f8f5] bg-cover bg-bottom bg-no-repeat px-3.5 py-4"
                  style={{ backgroundImage: `url(${CHAT_BG})` }}
                >
                  {/* Subtle tint overlay so the architectural drawing is clearly visible yet text stays crisp */}
                  <div className="pointer-events-none absolute inset-0 bg-[#fbfaf7]/85 backdrop-blur-[0.5px]" />
                  <div className="relative space-y-2.5">
                    {messages.map((m, i) =>
                      m.event ? (
                        <div key={m.id} className="ensis-msg-in flex justify-center py-1">
                          <span className="flex items-center gap-1.5 rounded-full bg-[#f4ece1] px-3 py-1 text-center text-[11.5px] font-semibold text-[#8a6a2f] shadow-[0_1px_3px_rgba(38,48,22,0.08)] ring-1 ring-[#D98E16]/30">
                            <Headset className="h-3.5 w-3.5 shrink-0" />
                            {m.event === "joined" ? t.teamJoined : t.teamLeft}
                          </span>
                        </div>
                      ) : m.from === "agent" ? (
                        <div key={m.id} className="ensis-msg-in flex items-start gap-2">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c39a5c] to-[#a9742a] text-white shadow-sm ${
                              showAvatar(i) ? "" : "invisible"
                            }`}
                          >
                            <Headset className="h-[18px] w-[18px]" />
                          </span>
                          <div className="min-w-0 max-w-[85%]">
                            {showAvatar(i) && <p className="mb-0.5 pl-1 text-[10.5px] font-bold text-[#8a6a2f]">{t.teamName}</p>}
                            <div
                              className={`rounded-[16px] border border-[#c39a5c]/30 bg-[#fffdf9] px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-[#2c3328] shadow-[0_1px_3px_rgba(38,48,22,0.10)] ${
                                showAvatar(i) ? "rounded-tl-[4px]" : ""
                              }`}
                            >
                              {m.files?.map((file) =>
                                isPhoto(file) ? (
                                  <a key={file.href} href={fileUrl(file.href)} target="_blank" rel="noopener noreferrer" className="mb-2 block overflow-hidden rounded-xl last:mb-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={fileUrl(file.href)} alt={file.label} className="max-h-[220px] w-full object-cover" />
                                  </a>
                                ) : (
                                  <a
                                    key={file.href}
                                    href={fileUrl(file.href)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="mb-2 flex items-center gap-2 rounded-xl border border-[#D98E16]/40 bg-white px-3 py-2 text-[12.5px] font-semibold text-[#8a6a2f] transition last:mb-0 hover:bg-[#faf4ec]"
                                  >
                                    <Download className="h-4 w-4 shrink-0" />
                                    <span className="min-w-0 break-words">{file.label}</span>
                                  </a>
                                )
                              )}
                              {m.text && <BotText text={m.text} />}
                            </div>
                            {m.at && <p className="mt-1 pl-1 text-[10px] text-[#8e9882]">{timeOf(m.at)}</p>}
                          </div>
                        </div>
                      ) : m.from === "bot" ? (
                        <div key={m.id} className="ensis-msg-in flex items-start gap-2">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-[#D98E16]/50 shadow-sm ${
                              showAvatar(i) ? "" : "invisible"
                            }`}
                          >
                            <LottieChatbotAvatar
                              className="h-full w-full"
                              speaking={speaking && i === messages.length - 1}
                            />
                          </span>
                          <div className="min-w-0 max-w-[85%]">
                            <div
                              className={`relative rounded-[16px] bg-white px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-[#2c3328] shadow-[0_1px_4px_rgba(38,48,22,0.08)] border border-[#e8e5dc] ${
                                showAvatar(i) ? "rounded-tl-[4px]" : ""
                              }`}
                            >
                              {m.title && <p className="font-bold text-[#263016] text-[14px] mb-1">{m.title}</p>}
                              {m.text && <BotText text={m.text} />}
                              {(() => {
                                const rawLink = m.link as any;
                                const href = typeof rawLink === "string" ? rawLink : (rawLink?.href || rawLink?.url || "");
                                if (!href || typeof href !== "string") return null;
                                const label = typeof rawLink === "object" && rawLink?.label ? rawLink.label : (href.startsWith("/") ? href : "Learn More");
                                return (
                                  <p className="mt-2.5">
                                    <Link
                                      href={href}
                                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f4ece1] px-3 py-1 text-[12px] font-bold text-[#8a6a2f] ring-1 ring-[#D98E16]/40 hover:bg-[#ede1d1] transition"
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      {label} →
                                    </Link>
                                  </p>
                                );
                              })()}
                              {m.files?.map((file) =>
                                isPhoto(file) ? (
                                  <a key={file.href} href={fileUrl(file.href)} target="_blank" rel="noopener noreferrer" className="mt-2 block overflow-hidden rounded-xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={fileUrl(file.href)} alt={file.label} className="max-h-[220px] w-full object-cover" />
                                  </a>
                                ) : (
                                  <a
                                    key={file.href}
                                    href={fileUrl(file.href)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="mt-2 flex items-center gap-2 rounded-xl border border-[#D98E16]/30 bg-[#faf6f0] px-3 py-2 text-[12.5px] font-semibold text-[#8a6a2f] transition hover:bg-[#f4ebe0]"
                                  >
                                    <Download className="h-4 w-4 shrink-0" />
                                    <span className="min-w-0 break-words">{file.label}</span>
                                  </a>
                                )
                              )}
                            </div>
                            {m.at && <p className="mt-1 pl-1 text-[10px] text-[#8e9882]">{timeOf(m.at)}</p>}
                          </div>
                        </div>
                      ) : (
                        /* User Message */
                        <div key={m.id} className="ensis-msg-in ensis-mine flex justify-end">
                          <div className="min-w-0 max-w-[85%]">
                            <div className="rounded-[16px] rounded-tr-[4px] bg-gradient-to-br from-[#263016] to-[#1a220e] px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-white shadow-[0_2px_8px_rgba(38,48,22,0.22)]">
                              <p className="whitespace-pre-line break-words">{m.text}</p>
                            </div>
                            {m.at && <p className="mt-1 pr-1 text-right text-[10px] text-[#8e9882]">{timeOf(m.at)}</p>}
                          </div>
                        </div>
                      )
                    )}

                    {/* Typing dots */}
                    {isTyping && !inCall && (
                      <div className="ensis-msg-in flex items-start gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-[#D98E16]/50 shadow-sm">
                          <LottieChatbotAvatar className="h-full w-full" speaking={false} />
                        </span>
                        <div className="flex h-9 items-center gap-1.5 rounded-[16px] rounded-tl-[4px] bg-white px-3.5 shadow-[0_1px_3px_rgba(38,48,22,0.08)] border border-[#e8e5dc]">
                          {typingDots}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick suggestion chips */}
                {!inCall && !blocked && (
                  <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-1.5 bg-[#fbfaf8] border-t border-[#ede9e1] scrollbar-none">
                    {!leadVerified && (
                      <button
                        type="button"
                        onClick={() => setOtpCardOpen(true)}
                        className="whitespace-nowrap shrink-0 rounded-full border border-[#D98E16]/60 bg-[#fffdf9] px-2.5 py-1 text-[11px] font-bold text-[#8a6a2f] hover:bg-[#f4ece1] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>📱</span> {lang === "hi" ? "WhatsApp कोटेशन प्राप्त करें" : "Get WhatsApp Quote"}
                      </button>
                    )}
                    {SUGGESTIONS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => onSelectChip(chip)}
                        className="whitespace-nowrap shrink-0 rounded-full border border-[#dcd7cb] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#556149] hover:border-[#D98E16] hover:bg-[#f4ece1] hover:text-[#8a6a2f] transition cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Verified Lead Banner */}
                {leadVerified && (
                  <div className="flex items-center justify-between border-t border-emerald-200 bg-emerald-50/90 px-3.5 py-1.5 text-[11.5px] text-emerald-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      {lang === "hi"
                        ? `WhatsApp सत्यापित (+91 ${otpPhone.replace(/\D/g, "").slice(-10) || "Lead"}) • विशेषज्ञ असाइन किया गया`
                        : `Verified WhatsApp (+91 ${otpPhone.replace(/\D/g, "").slice(-10) || "Lead"}) • Specialist Assigned`}
                    </span>
                  </div>
                )}

                {/* Interactive WhatsApp Lead & OTP Verification Card */}
                {otpCardOpen && !leadVerified && (
                  <div className="border-t border-[#D98E16]/40 bg-gradient-to-b from-[#fffcf8] to-[#f7f2e8] p-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D98E16]/20">
                      <div className="flex items-center gap-1.5 text-[#263016] font-bold text-[12.5px]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D98E16] text-white text-[10px]">🌿</span>
                        <span>{lang === "hi" ? "WhatsApp पर आधिकारिक कोटेशन और कैटलॉग प्राप्त करें" : "Get Official Quote & Catalogue on WhatsApp"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCardOpen(false)}
                        className="text-[#8e9882] hover:text-[#263016] text-[13px] leading-none p-1 cursor-pointer"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    {!otpSent ? (
                      <div className="pt-2 space-y-2">
                        <p className="text-[11.5px] text-[#556149] leading-tight">
                          {lang === "hi"
                            ? "अपना 10-अंकों का मोबाइल नंबर दर्ज करें। हम आपको 2026 कैटलॉग और सर्वोत्तम मूल्य सूची WhatsApp पर भेजेंगे:"
                            : "Enter your 10-digit mobile number to receive our 2026 catalogue and best clinic quotation on WhatsApp:"}
                        </p>
                        <div className="flex gap-1.5">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#8a6a2f] select-none">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={otpPhone}
                              onChange={(e) => setOtpPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="9810242841"
                              className="w-full rounded-xl border border-[#dcd7cb] bg-white pl-10 pr-2.5 py-1.5 text-[13px] font-semibold text-[#2c3328] outline-none focus:border-[#D98E16] focus:ring-1 focus:ring-[#D98E16]"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={otpLoading || otpPhone.replace(/\D/g, "").length !== 10}
                            onClick={() => requestLeadOtp()}
                            className="rounded-xl bg-[#263016] hover:bg-[#1a220e] disabled:opacity-50 text-white px-3 py-1.5 text-[12px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            {otpLoading ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <span>{lang === "hi" ? "OTP भेजें" : "Send OTP"}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#556149]">
                          <span>{lang === "hi" ? `WhatsApp OTP (+91 ${otpPhone}):` : `WhatsApp OTP sent to +91 ${otpPhone}:`}</span>
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-[#8a6a2f] font-semibold hover:underline cursor-pointer"
                          >
                            {lang === "hi" ? "नंबर बदलें" : "Change"}
                          </button>
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="6-digit OTP"
                            className="flex-1 rounded-xl border border-[#dcd7cb] bg-white px-3 py-1.5 text-[14px] font-bold tracking-widest text-[#2c3328] text-center outline-none focus:border-[#D98E16] focus:ring-1 focus:ring-[#D98E16]"
                          />
                          <button
                            type="button"
                            disabled={otpLoading || otpCode.trim().length < 4}
                            onClick={() => submitLeadOtp()}
                            className="rounded-xl bg-[#0e8a8f] hover:bg-[#0c7377] disabled:opacity-50 text-white px-3.5 py-1.5 text-[12px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            {otpLoading ? (
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <span>{lang === "hi" ? "सत्यापित करें" : "Verify & Connect"}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {otpStatusError && (
                      <p className="mt-1.5 text-[11px] font-semibold text-red-600 leading-tight">{otpStatusError}</p>
                    )}
                    {otpStatusMsg && (
                      <p className="mt-1.5 text-[11px] font-semibold text-emerald-700 leading-tight">{otpStatusMsg}</p>
                    )}
                  </div>
                )}

                {/* Banner: chat ended / blocked */}
                {chatEnded && (
                  <div className="flex items-center justify-between border-t border-[#e5e1d7] bg-[#fbf9f4] px-3.5 py-2 text-[12px] text-[#556149]">
                    <span>{t.chatEnded}</span>
                    <button
                      type="button"
                      onClick={resumeChat}
                      className="inline-flex items-center gap-1 font-bold text-[#8a6a2f] hover:text-[#263016] cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      {t.resume}
                    </button>
                  </div>
                )}

                {blocked && (
                  <div className="border-t border-red-200 bg-red-50 px-3.5 py-2 text-[11.5px] text-red-800">
                    <p className="font-bold flex items-center gap-1">
                      <Ban className="h-3.5 w-3.5 text-red-600" />
                      {t.blockedNote}
                    </p>
                    {blockedTill !== null && (
                      <p className="mt-0.5 text-red-600">
                        {t.blockedOpensIn} {countdown(blockedTill - Date.now())}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-red-700">{t.blockedByTeam}</p>
                  </div>
                )}

                {/* Input form */}
                <form onSubmit={onSubmit} className="relative shrink-0 border-t border-[#e8e5dc] bg-white px-3.5 pt-2 pb-1.5">
                  {/* Noise cancellation for calls: on by default (Design House standard) */}
                  {canTalk && (
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#263016]" title={noiseOn ? t.noiseOnHint : t.noiseOffHint}>
                        <AudioLines className={`h-3.5 w-3.5 shrink-0 ${noiseOn ? "text-[#D98E16]" : "text-[#8a97ad]"}`} />
                        <span className="truncate">{t.noise}</span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={noiseOn}
                        aria-label={t.noise}
                        title={noiseOn ? t.noiseOnHint : t.noiseOffHint}
                        onClick={toggleNoise}
                        className={`relative flex h-[22px] w-[52px] shrink-0 items-center rounded-full px-1 text-[9px] font-bold transition cursor-pointer ${
                          noiseOn ? "bg-[#D98E16] text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <span className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${noiseOn ? "left-[33px]" : "left-[3px]"}`} />
                        <span className={noiseOn ? "pl-0.5" : "ml-auto pr-0.5"}>{noiseOn ? "ON" : "OFF"}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 rounded-full border border-[#dcd7cb] bg-[#fcfbf9] px-2 py-1 shadow-inner focus-within:border-[#D98E16] focus-within:ring-2 focus-within:ring-[#D98E16]/20 transition">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={blocked}
                      placeholder={placeholder}
                      className="min-w-0 flex-1 bg-transparent px-2.5 py-1 text-[13.5px] text-[#2c3328] outline-none placeholder:text-[#9ea794] disabled:opacity-50"
                    />

                    {/* Controls during call */}
                    {inCall ? (
                      <>
                        <button
                          type="button"
                          onClick={toggleMic}
                          title={micMuted ? t.callUnmute : t.callMute}
                          aria-label={micMuted ? t.callUnmute : t.callMute}
                          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
                            micMuted ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-[#f4ece1] text-[#8a6a2f] hover:bg-[#ede1d1]"
                          }`}
                        >
                          {!micMuted && <span ref={micRingRef} className="absolute inset-0 rounded-full border-2 border-[#D98E16]/40 transition-transform" />}
                          {micMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={endCallByHand}
                          title={t.callEnd}
                          aria-label={t.callEnd}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 cursor-pointer"
                        >
                          <PhoneOff className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Spoken voice readouts toggle */}
                        <button
                          type="button"
                          onClick={toggleVoice}
                          title={voiceOn ? t.voiceOn : t.voiceOff}
                          aria-label={voiceOn ? t.voiceOn : t.voiceOff}
                          aria-pressed={voiceOn}
                          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
                            voiceOn ? "bg-[#f4ece1] text-[#8a6a2f] hover:bg-[#ede1d1]" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {voiceOn && speaking && <span className="absolute inset-0 animate-ping rounded-full bg-[#D98E16]/25" />}
                          {voiceOn ? <Volume2 className="relative h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </button>

                        {/* Mic voice call / dictation button */}
                        {canTalk && !teamLive && (
                          <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={blocked || callState === "connecting"}
                            title={isRecording ? "Stop listening" : t.callStart}
                            aria-label={isRecording ? "Stop listening" : t.callStart}
                            className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition cursor-pointer ${
                              isRecording
                                ? "bg-red-500 text-white animate-pulse"
                                : "text-[#263016] hover:bg-[#f4ece1] disabled:opacity-40"
                            }`}
                          >
                            {isRecording && <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-60" />}
                            {isRecording ? <MicOff className="relative h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </button>
                        )}
                      </>
                    )}

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={!input.trim() || (isTyping && !inCall) || blocked}
                      aria-label="Send"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D98E16] text-white transition hover:bg-[#be7a0d] hover:scale-105 disabled:bg-[#f0d4a8] disabled:hover:scale-100 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 -translate-x-px translate-y-px" />
                    </button>
                  </div>

                  {inputIsAbusive && (
                    <p role="alert" className="mt-1 text-center text-[11px] font-semibold text-red-600">
                      {t.abuseHint}
                    </p>
                  )}
                  {!inputIsAbusive && voiceNote && (
                    <div className="mt-1 flex items-center justify-center gap-1.5 px-2">
                      <p role="status" className="text-center text-[11px] font-semibold text-[#8a6a2f]">
                        {voiceNote}
                      </p>
                      <button
                        type="button"
                        onClick={() => setVoiceNote("")}
                        className="text-[#8a6a2f]/70 hover:text-[#8a6a2f] text-sm leading-none cursor-pointer"
                        title="Dismiss"
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10.5px] text-[#7f8a74]">
                    <span>{teamLive ? t.teamFooter : t.footer}</span>
                    <button
                      type="button"
                      onClick={toggleMute}
                      title={muted ? t.soundOff : t.soundOn}
                      aria-label={muted ? t.soundOff : t.soundOn}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[#8a6a2f] transition hover:bg-[#f4ece1] cursor-pointer"
                    >
                      {muted ? <BellOff className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>

          {/* Desktop close button over the launcher button */}
          <button
            type="button"
            onClick={closeChat}
            aria-label="Close chat"
            className="ensis-chat-in fixed bottom-5 right-6 z-[1000] hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#263016] to-[#141a0b] text-white shadow-[0_8px_20px_rgba(38,48,22,0.35)] transition hover:scale-105 sm:flex cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </>
      )}
    </>
  );
};

export default Chatbot;
