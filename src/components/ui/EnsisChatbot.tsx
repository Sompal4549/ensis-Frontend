"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  User,
  ArrowRight,
} from "lucide-react";
import { API_URL } from "@/lib/api/api";
import lotusImg from "@/assets/about/lotus.webp";
import logoImg from "@/assets/logo.webp";
import LottieChatbotAvatar from "./LottieChatbotAvatar";
import Link from "next/link";
import { getComponentContent, getImageUrl } from "@/lib/api/api";

/** Bot text with [label](url) links, bare URLs and **bold**; product links open in the same tab */
function BotText({ text }: { text: string }) {
  const clean = text.replace(/^\s*[*-]\s+/gm, "• ");
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(clean))) {
    if (match.index > last) parts.push(clean.slice(last, match.index));
    const [, label, href, bold, url] = match;
    const key = match.index;
    const linkClass = "font-semibold text-[#8a6a2f] underline underline-offset-2 hover:text-[#263016]";
    if (label && href) {
      parts.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className={linkClass}>{label}</Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{label}</a>
        )
      );
    } else if (bold) {
      parts.push(<strong key={key} className="font-semibold text-slate-800">{bold}</strong>);
    } else if (url) {
      parts.push(<a key={key} href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>{url}</a>);
    }
    last = match.index + match[0].length;
  }
  if (last < clean.length) parts.push(clean.slice(last));
  return <>{parts}</>;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  options?: string[];
  isLeadForm?: boolean;
}

const PILLS_EN = [
  "✦ Turnkey Clinic Setup",
  "✦ Panchkarma Tables & Droni",
  "✦ Doctor & Setup Consultancy",
  "✦ 2026 Catalog & Pricing",
  "✦ Request Expert Callback",
];

const PILLS_HI = [
  "✦ टर्नकी क्लिनिक सेटअप",
  "✦ पंचकर्म टेबल व द्रोणी",
  "✦ डॉक्टर एवं सेटअप कंसल्टेंसी",
  "✦ 2026 कैटलॉग व मूल्य",
  "✦ कॉल बैक का अनुरोध",
];

const SESSION_KEY = "ensis_chat_session";

/** One id per visitor's chat, so the conversation is saved and shows up in the admin */
function getChatSessionId(): string {
  const fresh = () => `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved && /^[A-Za-z0-9_-]{8,100}$/.test(saved)) return saved;
    const id = fresh();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return fresh();
  }
}

function resetChatSessionId() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export default function EnsisChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  // User Identity & Onboarding State
  const [userName, setUserName] = useState<string>("");
  const [isAskingName, setIsAskingName] = useState<boolean>(true);

  // Lead form state inside chat
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  // Callback form step 2: the WhatsApp OTP
  const [leadOtpSent, setLeadOtpSent] = useState(false);
  const [leadOtp, setLeadOtp] = useState("");
  const [leadError, setLeadError] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getPills = (lang: "en" | "hi") => (lang === "hi" ? PILLS_HI : PILLS_EN);

  const initChat = (overrideName?: string, overrideLang?: "en" | "hi") => {
    const activeLang = overrideLang || language;
    const existingName =
      overrideName !== undefined
        ? overrideName
        : typeof window !== "undefined"
        ? localStorage.getItem("ensis_chat_username") || ""
        : "";

    if (existingName) {
      setUserName(existingName);
      setLeadName(existingName);
      setIsAskingName(false);
      setMessages([
        {
          id: "msg-welcome-back",
          sender: "bot",
          text:
            activeLang === "hi"
              ? `नमस्ते ${existingName} जी! Ensis में आपका पुनः स्वागत है। 🙏\n\nआज हम आपके आयुर्वेदिक क्लिनिक, वेलनेस स्पेस या पंचकर्म उपकरणों के सेटअप में क्या सहायता कर सकते हैं?`
              : `Namaste ${existingName} ji! Welcome back to Ensis. 🙏\n\nHow can I assist your Ayurvedic clinic, wellness space, or equipment setup today?`,
          time: getCurrentTime(),
          options: getPills(activeLang),
        },
      ]);
    } else {
      setUserName("");
      setIsAskingName(true);
      setMessages([
        {
          id: "msg-ask-name",
          sender: "bot",
          text:
            activeLang === "hi"
              ? "नमस्ते! 🙏 मैं Ensis सलाहकार हूँ।\n\nकृपया अपना नाम बताएं?"
              : "Namaste! 🙏 I'm Ensis Advisor, your wellness space assistant.\n\nMay I know your name?",
          time: getCurrentTime(),
        },
      ]);
    }
  };

  const [botLogo, setBotLogo] = useState<any>(logoImg);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ensis_chat_lang") as "en" | "hi" | null;
      if (savedLang === "en" || savedLang === "hi") {
        setLanguage(savedLang);
        initChat(undefined, savedLang);
        return;
      }
    } catch {}
    initChat();
  }, []);

  useEffect(() => {
    let active = true;
    getComponentContent<{ logo?: { imageUrl?: string; alt?: string } }>("layout.header", {})
      .then((data) => {
        if (!active || !data?.logo?.imageUrl) return;
        setBotLogo(getImageUrl(data.logo.imageUrl, 200));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
    try {
      localStorage.setItem("ensis_chat_lang", nextLang);
    } catch {}
    initChat(userName, nextLang);
  };

  const handleResetName = () => {
    try {
      localStorage.removeItem("ensis_chat_username");
    } catch {}
    // A new visitor name starts a new conversation in the admin
    resetChatSessionId();
    initChat("", language);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  // Ensis Knowledge Base fallback (English + Hindi)
  const resolveEnsisQuery = (
    query: string
  ): { reply: string; options?: string[]; isLeadForm?: boolean } => {
    const q = query.toLowerCase().trim();
    const isHi = language === "hi";

    // Turnkey solutions
    if (
      q.includes("turnkey") ||
      q.includes("clinic setup") ||
      q.includes("hospital") ||
      q.includes("resort") ||
      q.includes("टर्नकी") ||
      q.includes("क्लिनिक")
    ) {
      return {
        reply: isHi
          ? "Ensis 100% एंड-टू-एंड टर्नकी पंचकर्म क्लिनिक एवं वेलनेस सेंटर सेटअप प्रदान करता है:\n\n• आर्किटेक्चरल स्पेस प्लानिंग व NABH कंप्लायंस\n• हस्तनिर्मित बर्मा टीक द्रोणी व ट्रीटमेंट टेबल्स\n• स्वचालित शिरोधारा व स्वेदन स्टीम चैंबर्स\n• संपूर्ण इंटीरियर एवं वेंटिलेशन सेटअप (30-45 दिन)\n\nक्या आप अपने स्पेस के लिए 2D लेआउट व प्रस्ताव चाहते हैं?"
          : "Ensis provides 100% End-to-End Turnkey Panchkarma Setups:\n\n• Architectural Space Planning & NABH Compliance\n• Heritage Burma Teak Treatment Tables & Dronis\n• Automated Shirodhara & Swedana Chambers\n• Complete Interior Ambience & HVAC Ventilation\n• Typical Project Timeline: 30-45 Days\n\nWould you like a customized layout proposal for your space?",
        options: isHi
          ? ["📞 कॉल बैक का अनुरोध", "📦 मूल्य एवं PDF कैटलॉग", "📋 डॉक्टर एवं सेटअप कंसल्टेंसी"]
          : ["📞 Request Expert Callback", "📦 Pricing & PDF Catalog", "📋 Doctor & Setup Consultancy"],
      };
    }

    // Equipment, Droni, Shirodhara
    if (
      q.includes("droni") ||
      q.includes("table") ||
      q.includes("shirodhara") ||
      q.includes("steam") ||
      q.includes("equipment") ||
      q.includes("द्रोणी") ||
      q.includes("शिरोधारा")
    ) {
      return {
        reply: isHi
          ? "Ensis भारत के सर्वश्रेष्ठ हस्तनिर्मित आयुर्वेदिक उपकरण बनाता है:\n\n1. पारंपरिक व मोटराइज्ड टीक द्रोणी (ठोस बर्मा टीक लकड़ी, आयुर्वेदिक तेल-प्रतिरोधी कोटिंग)\n2. परिशुद्ध शिरोधारा स्टैंड व पीतल/तांबे के पात्र\n3. देवदार लकड़ी व फाइबर स्वेदन स्टीम चैंबर्स\n\nसभी उपकरणों पर 5 वर्ष की संरचनात्मक वारंटी और पूरे भारत में ऑन-साइट डिलीवरी उपलब्ध है।"
          : "Ensis manufactures India's finest handcrafted Ayurvedic equipment:\n\n1. Traditional & Motorized Teak Droni (Solid Burma teak wood, hand-carved, medical oil-resistant coating)\n2. Precision Shirodhara Stand & Brass/Copper Vessels\n3. Cedar Wood & Fiber Swedana Steam Chambers\n\nAll equipment comes with a 5-Year Structural Warranty and pan-India on-site delivery.",
        options: isHi
          ? ["📦 मूल्य एवं PDF कैटलॉग", "🏥 टर्नकी क्लिनिक सेटअप", "📞 कॉल बैक का अनुरोध"]
          : ["📦 Pricing & PDF Catalog", "🏥 Turnkey Clinic Setup", "📞 Request Expert Callback"],
      };
    }

    // Consultancy & doctors
    if (
      q.includes("consult") ||
      q.includes("doctor") ||
      q.includes("license") ||
      q.includes("nabh") ||
      q.includes("कंसल्टेंसी") ||
      q.includes("डॉक्टर")
    ) {
      return {
        reply: isHi
          ? "हमारा कंसल्टेंसी विंग डॉक्टरों, वैद्यों और उद्यमियों को संपूर्ण मार्गदर्शन देता है:\n\n• क्लिनिकल वर्कफ़्लो और रूम साइज प्लानिंग (न्यूनतम 400 वर्ग फुट से लेकर बड़े वेलनेस रिसॉर्ट्स)\n• NABH एवं आयुष एक्रीडिटेशन दिशा-निर्देश\n• पंचकर्म थेरेपिस्ट SOPs व स्टाफ ट्रेनिंग\n• बिजनेस एवं रेवेन्यू मॉडलिंग\n\nक्या आप हमारे वरिष्ठ वेलनेस आर्किटेक्ट से 1-on-1 कॉल शेड्यूल करना चाहते हैं?"
          : "Our Consultancy Wing assists Vaidyas, Doctors & Investors:\n\n• Clinical Workflow & Room Dimensions (minimum 400 sq.ft to multi-acre retreats)\n• NABH & Ayush Infrastructure Accreditation guidance\n• Therapist & Panchkarma Technician SOPs\n• Revenue & ROI Modeling for Wellness Centers\n\nWould you like to schedule a 1-on-1 discovery call with our senior wellness architect?",
        options: isHi
          ? ["📞 कॉल बैक का अनुरोध", "🏥 टर्नकी क्लिनिक सेटअप", "📦 मूल्य एवं PDF कैटलॉग"]
          : ["📞 Request Expert Callback", "🏥 Turnkey Clinic Setup", "📦 Pricing & PDF Catalog"],
      };
    }

    // Pricing, cost, catalog
    if (
      q.includes("price") ||
      q.includes("cost") ||
      q.includes("catalog") ||
      q.includes("catalogue") ||
      q.includes("quote") ||
      q.includes("rate") ||
      q.includes("मूल्य") ||
      q.includes("खर्च") ||
      q.includes("दाम") ||
      q.includes("कैटलॉग")
    ) {
      return {
        reply: isHi
          ? "Ensis आपकी आवश्यकता के अनुसार विभिन्न पैकेज प्रदान करता है:\n\n• स्टार्टर OPD / क्लिनिक सेटअप पैकेज\n• प्रीमियम मल्टी-रूम पंचकर्म सेंटर\n• लक्जरी 5-स्टार रिसॉर्ट वेलनेस सुइट्स\n\nअपना संपर्क विवरण नीचे साझा करें ताकि हम 2026 आर्किटेक्चर कैटलॉग व मूल्य सूची सीधे व्हाट्सएप/ईमेल पर भेज सकें।"
          : "Ensis offers scalable packages tailored to your vision:\n\n• Starter OPD / Clinic Setup Packages\n• Premium Multi-Room Panchkarma Centers\n• Luxury Resort & Retreat Wellness Suites\n\nShare your contact details below to receive our latest 2026 Product & Architecture Catalog with complete pricing directly on WhatsApp/Email.",
        isLeadForm: true,
      };
    }

    // Callback / Lead
    if (
      q.includes("callback") ||
      q.includes("call") ||
      q.includes("phone") ||
      q.includes("contact") ||
      q.includes("कॉल") ||
      q.includes("फोन") ||
      q.includes("संपर्क")
    ) {
      return {
        reply: isHi
          ? "हमारे वरिष्ठ तकनीकी सलाहकार सोमवार से शनिवार (प्रातः 9 से सायं 7 बजे) उपलब्ध हैं। तत्काल कॉल बैक के लिए कृपया नीचे अपना नाम और मोबाइल नंबर दर्ज करें:"
          : "Our senior technical consultants are available Mon-Sat (9 AM - 7 PM). Please share your Name & Mobile Number below for an immediate callback:",
        isLeadForm: true,
      };
    }

    // Default intelligent fallback
    return {
      reply: isHi
        ? "आपके प्रश्न के लिए धन्यवाद। Ensis टर्नकी पंचकर्म सेंटर सेटअप, हस्तनिर्मित टीक द्रोणी टेबल, स्वचालित शिरोधारा सिस्टम और आयुर्वेदिक क्लिनिक कंसल्टेंसी में विशेषज्ञ है।\n\nहम आपके प्रोजेक्ट में किस प्रकार सहायता कर सकते हैं?"
        : "Thank you for your question. Ensis specializes in Turnkey Panchkarma Center Setups, Handcrafted Teak Droni Tables, Automated Shirodhara Systems, and Ayurvedic Clinical Consultancy.\n\nHow can we best assist your project?",
      options: getPills(language),
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // If we are waiting for user's name
    if (isAskingName) {
      let cleanName = text.replace(/^(my name is|mera naam|i am|this is|naam|मेरा नाम)\s*/i, "").trim();
      if (!cleanName) cleanName = language === "hi" ? "मित्र" : "Friend";
      const formattedName = cleanName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      setUserName(formattedName);
      setLeadName(formattedName);
      setIsAskingName(false);
      try {
        localStorage.setItem("ensis_chat_username", formattedName);
      } catch {}

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-name-${Date.now()}`,
            sender: "bot",
            text:
              language === "hi"
                ? `नमस्ते ${formattedName} जी! Ensis में आपका हार्दिक स्वागत है। 🙏\n\nआज हम आपके आयुर्वेदिक क्लिनिक, वेलनेस रिसॉर्ट या पंचकर्म सेटअप में क्या सहायता कर सकते हैं?`
                : `Namaste ${formattedName} ji! A warm welcome to Ensis. 🙏\n\nHow can we assist your Ayurvedic clinic, wellness center, or equipment setup today?`,
            time: getCurrentTime(),
            options: getPills(language),
          },
        ]);
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text,
      }));

      const res = await fetch(`${API_URL}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          userName,
          language,
          sessionId: getChatSessionId(),
          pageUrl: window.location.pathname,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        const replyText = payload.data?.reply || payload.reply;
        if (replyText) {
          const resolution = resolveEnsisQuery(text);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: replyText,
              time: getCurrentTime(),
              options: resolution.options || getPills(language).slice(0, 3),
              // The AI asks for a callback when the visitor shows buying interest
              isLeadForm: Boolean(payload.data?.showLeadForm) || resolution.isLeadForm,
            },
          ]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback to client-side rule resolver
    }

    // Client-side fallback resolution
    const resolution = resolveEnsisQuery(text);
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: resolution.reply,
        time: getCurrentTime(),
        options: resolution.options,
        isLeadForm: resolution.isLeadForm,
      },
    ]);
    setIsTyping(false);
  };

  // Only the latest invitation shows the callback form, so the chat never holds two copies of it
  const lastLeadFormId = [...messages].reverse().find((m) => m.isLeadForm)?.id;

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  /** Sends (or resends) the WhatsApp OTP for the callback form */
  const sendLeadOtp = async () => {
    const res = await fetch(`${API_URL}/chatbot/lead/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: leadName.trim(), phone: leadPhone.trim() }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.message || (language === "hi" ? "OTP नहीं भेजा जा सका।" : "Could not send the OTP."));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setLeadSubmitting(true);
    setLeadError("");

    // Step 1: send the OTP on WhatsApp
    if (!leadOtpSent) {
      try {
        await sendLeadOtp();
        setLeadOtpSent(true);
      } catch (err) {
        setLeadError((err as Error).message);
      } finally {
        setLeadSubmitting(false);
      }
      return;
    }

    // Step 2: verify the OTP; the lead is saved only for a verified number
    try {
      // Saved on this chat and added to Website Enquiries (source "chatbot")
      const res = await fetch(`${API_URL}/chatbot/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          otp: leadOtp.trim(),
          language,
          sessionId: getChatSessionId(),
          pageUrl: window.location.pathname,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setLeadError(body?.message || (language === "hi" ? "OTP सही नहीं है।" : "That OTP is not correct."));
        setLeadSubmitting(false);
        return;
      }

      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-lead-${Date.now()}`,
          sender: "bot",
          text:
            language === "hi"
              ? `धन्यवाद, ${leadName} जी! 🙌\n\nआपका अनुरोध हमारे वरिष्ठ वेलनेस सलाहकार को भेज दिया गया है। हम शीघ्र ही ${leadPhone} पर 2026 आर्किटेक्चर कैटलॉग के साथ आपसे संपर्क करेंगे।`
              : `Thank you, ${leadName}! 🙌\n\nYour request has been forwarded to our Senior Wellness Consultant. We will call you on ${leadPhone} shortly with the architecture catalog and setup details.`,
          time: getCurrentTime(),
          options: getPills(language).slice(0, 2),
        },
      ]);
      setLeadPhone("");
      setLeadOtp("");
      setLeadOtpSent(false);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text:
            language === "hi"
              ? "धन्यवाद! आप हमारी टीम से सीधे +91 9654900525 पर या व्हाट्सएप द्वारा भी तत्काल संपर्क कर सकते हैं।"
              : "Thank you! You can also reach our team directly at +91 9654900525 or via WhatsApp for instant assistance.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================
          FLOATING TRIGGER BUTTON (Exact Bharat Organic Lottie Character Launcher)
      ========================================================= */}
      <div
        className={`fixed right-4 sm:right-6 bottom-[84px] sm:bottom-20 lg:bottom-8 z-[100] flex items-end gap-3 ${isOpen ? "max-[480px]:hidden" : ""}`}
        style={{ fontFamily: "var(--font-montserrat), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          aria-label={isOpen ? "Close Ensis Wellness chat" : "Chat with Ensis Wellness Advisor"}
          aria-expanded={isOpen}
          className="group relative block shrink-0"
        >
          {/* "May I help you?" speech bubble above the robot while closed (matches organic_frontend) */}
          {!isOpen && (
            <span className="pointer-events-none absolute bottom-full right-0 -mb-1 px-3 py-1.5 rounded-xl bg-white border border-[#c39a5c]/60 text-[#263016] text-[12px] lg:text-[13px] font-semibold whitespace-nowrap shadow-lg transition-transform duration-200 group-hover:-translate-y-1 animate-[mitra-pop_0.35s_ease-out]">
              {language === "hi" ? "क्या मैं आपकी सहायता करूँ?" : "May I help you?"}
              {/* Arrow pointing at the middle of the robot character */}
              <span className="absolute -bottom-[5px] right-[27px] sm:right-11 lg:right-[52px] w-2.5 h-2.5 rotate-45 bg-white border-r border-b border-[#c39a5c]/60" aria-hidden="true" />
            </span>
          )}

          {isOpen ? (
            <div className="relative w-11 h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-[#263016] to-[#3a4922] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-[#c39a5c]">
              <X className="w-5 h-5 lg:w-6 lg:h-6 text-[#c39a5c] relative z-10" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center transition-transform duration-300 hover:scale-110 cursor-pointer">
              <LottieChatbotAvatar className="absolute inset-0 w-full h-full" />
            </div>
          )}
        </button>
      </div>

      {/* =========================================================
          CHAT PANEL — same placement and size as the Organic Mitra panel, in the Ensis theme
      ========================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ensis Advisor chat"
          className="fixed z-[110] right-4 sm:right-6 inset-y-0 my-auto w-[380px] h-[580px] max-h-[calc(100svh-32px)] max-[480px]:inset-x-0 max-[480px]:top-auto max-[480px]:bottom-0 max-[480px]:my-0 max-[480px]:w-full max-[480px]:h-[88svh] max-[480px]:max-h-none flex flex-col bg-gradient-to-b from-[#fbf8f2] to-[#f3ede2] rounded-[20px] max-[480px]:rounded-b-none shadow-[0_30px_80px_-20px_rgba(27,35,16,0.55),0_0_0_1px_rgba(38,48,22,0.08)] overflow-clip text-[13.5px] leading-[1.55] animate-in fade-in slide-in-from-bottom-5 duration-200"
          style={{ fontFamily: "var(--font-montserrat), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
        >
          {/* ── Header ── */}
          <div className="relative shrink-0 overflow-clip bg-gradient-to-br from-[#33421f] via-[#263016] to-[#1b2310] text-white">
            <div className="pointer-events-none absolute -right-5 -bottom-8 w-28 h-28 opacity-[0.08] select-none" aria-hidden="true">
              <Image src={lotusImg} alt="" width={112} height={112} className="object-contain" />
            </div>
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#c39a5c] via-[#e2c684] to-[#c39a5c] opacity-90" aria-hidden="true" />

            <div className="relative flex items-center gap-2.5 pl-3.5 pr-2.5 py-3">
              <div className="relative h-[30px] w-[66px] shrink-0 rounded-md bg-white ring-1 ring-white/30 flex items-center justify-center shadow-md px-1">
                <Image src={botLogo} alt="ENSIS" width={60} height={24} onError={() => setBotLogo(logoImg)} className="h-auto w-full object-contain" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#4ade80] ring-2 ring-[#263016]" aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15.5px] leading-tight whitespace-nowrap">
                  {language === "hi" ? "Ensis सलाहकार" : "Ensis Advisor"}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/85 truncate">
                  {language === "hi" ? "Ensis वेलनेस सहायक" : "Ensis Wellness Assistant"}
                </p>
              </div>

              {/* Language switch */}
              <div className="shrink-0 flex items-center rounded-full bg-white/10 p-0.5 text-[10.5px]" role="group" aria-label="Language">
                {(["en", "hi"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => language !== l && toggleLanguage()}
                    aria-pressed={language === l}
                    className={`rounded-full px-2 py-0.5 font-semibold transition-colors ${
                      language === l ? "bg-white text-[#263016] shadow-sm" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {l === "en" ? "EN" : "हिं"}
                  </button>
                ))}
              </div>

              <div className="shrink-0 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => initChat()}
                  aria-label={language === "hi" ? "बातचीत पुनः प्रारंभ करें" : "Restart chat"}
                  title={language === "hi" ? "बातचीत पुनः प्रारंभ करें" : "Restart chat"}
                  className="w-7 h-7 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="w-7 h-7 shrink-0 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pt-3.5 pb-3 flex flex-col gap-3" data-lenis-prevent>
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                {m.sender === "bot" ? (
                  <div className="flex items-start gap-2.5 max-w-[88%]">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm ring-2 ring-[#c39a5c]/50 flex items-center justify-center overflow-hidden" aria-hidden="true">
                      <LottieChatbotAvatar className="w-7 h-7" style={{ transform: "scale(1.15)" }} />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-[#c39a5c]/15 px-3.5 py-2 text-[13.5px] text-slate-700 whitespace-pre-line break-words">
                      <BotText text={m.text} />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] bg-gradient-to-br from-[#33421f] to-[#263016] text-white rounded-2xl rounded-tr-md shadow-sm px-3.5 py-2 text-[13.5px] whitespace-pre-line">
                    {m.text}
                  </div>
                )}

                {/* Callback form (name, mobile, WhatsApp OTP) */}
                {m.isLeadForm && !leadSubmitted && m.id === lastLeadFormId && (
                  <form
                    onSubmit={handleLeadSubmit}
                    noValidate
                    className="mt-2 ml-[42px] w-[calc(100%-42px)] bg-white rounded-2xl border border-[#c39a5c]/20 shadow-sm px-3.5 pt-3 pb-3 flex flex-col gap-2.5"
                  >
                    <p className="font-semibold text-[#263016] flex items-center gap-1.5 text-[13px]">
                      <Sparkles className="h-3.5 w-3.5 text-[#c39a5c]" />
                      {language === "hi" ? "कॉल बैक व कैटलॉग प्राप्त करें" : "Get a callback & catalogue"}
                    </p>
                    <input
                      type="text"
                      placeholder={language === "hi" ? "आपका पूरा नाम" : "Your full name"}
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e6dcc8] text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#c39a5c] focus:ring-4 focus:ring-[#c39a5c]/15"
                    />
                    <input
                      type="tel"
                      placeholder={language === "hi" ? "व्हाट्सएप नंबर (10 अंक)" : "WhatsApp number (10 digits)"}
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      disabled={leadOtpSent}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e6dcc8] text-[14px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#c39a5c] focus:ring-4 focus:ring-[#c39a5c]/15 disabled:opacity-70"
                    />
                    {leadOtpSent && (
                      <>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={8}
                          placeholder={language === "hi" ? "व्हाट्सएप पर आया OTP" : "OTP sent on WhatsApp"}
                          value={leadOtp}
                          onChange={(e) => setLeadOtp(e.target.value.replace(/\D/g, ""))}
                          required
                          className="w-full px-3 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e6dcc8] text-[15px] tracking-[0.3em] text-slate-800 placeholder:tracking-normal placeholder:text-[14px] placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#c39a5c] focus:ring-4 focus:ring-[#c39a5c]/15"
                        />
                        <div className="flex justify-between text-[12px]">
                          <button
                            type="button"
                            onClick={() => {
                              setLeadOtpSent(false);
                              setLeadOtp("");
                              setLeadError("");
                            }}
                            className="font-medium text-[#a9742a] hover:underline"
                          >
                            {language === "hi" ? "नंबर बदलें" : "Change number"}
                          </button>
                          <button
                            type="button"
                            disabled={leadSubmitting}
                            onClick={async () => {
                              setLeadError("");
                              try {
                                await sendLeadOtp();
                                setLeadError(language === "hi" ? "नया OTP भेज दिया गया है।" : "A new OTP has been sent.");
                              } catch (err) {
                                setLeadError((err as Error).message);
                              }
                            }}
                            className="font-medium text-[#a9742a] hover:underline disabled:opacity-50"
                          >
                            {language === "hi" ? "OTP दोबारा भेजें" : "Resend OTP"}
                          </button>
                        </div>
                      </>
                    )}
                    {leadError && <p role="alert" className="text-[12px] font-medium text-red-600">{leadError}</p>}
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="h-11 rounded-full bg-gradient-to-br from-[#33421f] to-[#263016] hover:brightness-110 text-white font-medium text-[14px] flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-70"
                    >
                      {leadSubmitting ? (
                        <span>{language === "hi" ? "कृपया प्रतीक्षा करें..." : "Please wait..."}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#e2c684]" />
                          <span>
                            {leadOtpSent
                              ? language === "hi"
                                ? "सत्यापित करें व सबमिट करें"
                                : "Verify & Submit"
                              : language === "hi"
                                ? "व्हाट्सएप पर OTP भेजें"
                                : "Send OTP on WhatsApp"}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Quick replies */}
                {m.options && m.options.length > 0 && (
                  <div className={`mt-2 flex flex-wrap gap-1.5 ${m.sender === "bot" ? "ml-[42px]" : ""}`}>
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleOptionClick(opt)}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-[#263016] border border-[#e2d6bf] hover:border-[#263016] px-3.5 py-1.5 font-medium text-[12.5px] text-[#263016] hover:text-white shadow-[0_1px_2px_rgba(27,35,16,0.06)] transition-colors text-left"
                      >
                        <span>{opt.replace(/^[✦📞📦📋🏥]\s*/u, "")}</span>
                        <ArrowRight className="h-3 w-3 text-[#c39a5c]" />
                      </button>
                    ))}
                  </div>
                )}

                <span className={`mt-1 text-[11px] text-slate-400 px-1 ${m.sender === "bot" ? "ml-[42px]" : ""}`}>{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 shrink-0 rounded-full bg-white shadow-sm ring-2 ring-[#c39a5c]/50 flex items-center justify-center overflow-hidden" aria-hidden="true">
                  <LottieChatbotAvatar className="w-7 h-7" style={{ transform: "scale(1.15)" }} />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-[#c39a5c]/15 px-3.5 py-2.5 flex items-center gap-1" aria-label={language === "hi" ? "लिख रहा है" : "Typing"}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Composer ── */}
          <div className="shrink-0 px-3 pt-2 pb-2 border-t border-[#e6dcc8]/70 bg-white/60 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-white rounded-full border border-[#e6dcc8] shadow-[0_4px_14px_-8px_rgba(27,35,16,0.3)] pl-4 pr-1 py-1 transition focus-within:border-[#c39a5c] focus-within:ring-4 focus-within:ring-[#c39a5c]/15"
            >
              <input
                type="text"
                placeholder={
                  isAskingName
                    ? language === "hi"
                      ? "अपना नाम लिखें..."
                      : "Type your name..."
                    : language === "hi"
                      ? "अपना सवाल लिखें..."
                      : "Type your question..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                autoFocus={isAskingName}
                className="flex-1 min-w-0 bg-transparent text-[13.5px] text-slate-800 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#33421f] to-[#263016] text-white flex items-center justify-center shadow-md transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="w-4 h-4 -ml-0.5" strokeWidth={2.2} />
              </button>
            </form>
            <div className="mt-1.5 px-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{language === "hi" ? "स्वचालित सहायक" : "Automated assistant"}</span>
              {userName && (
                <button
                  type="button"
                  onClick={handleResetName}
                  className="inline-flex items-center gap-1 font-medium text-[#263016] underline underline-offset-2 hover:text-[#a9742a]"
                >
                  <User className="w-3 h-3" />
                  {language === "hi" ? "नाम बदलें" : "Change name"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
