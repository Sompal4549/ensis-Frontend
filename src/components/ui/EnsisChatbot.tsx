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
  Languages,
  ArrowRight,
} from "lucide-react";
import { API_URL } from "@/lib/api/api";
import lotusImg from "@/assets/about/lotus.webp";
import logoImg from "@/assets/logo.webp";

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
              ? "नमो नमः! Ensis — भारत के प्रमुख पंचकर्म एवं वेलनेस स्पेस आर्किटेक्ट्स में आपका स्वागत है। 🙏\n\nबातचीत शुरू करने के लिए कृपया अपना शुभ नाम बताएं:"
              : "Namaste! Welcome to Ensis — India's Premier Panchkarma & Wellness Space Architects. 🙏\n\nBefore we begin, may I know your good name, please?\n(बातचीत शुरू करने के लिए कृपया अपना नाम बताएं)",
          time: getCurrentTime(),
        },
      ]);
    }
  };

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
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text,
      }));

      const res = await fetch(`${API_URL}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, userName, language }),
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
              isLeadForm: resolution.isLeadForm,
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

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    setLeadSubmitting(true);
    try {
      await fetch(`${API_URL}/enquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: leadName.trim(),
          mobileNumber: leadPhone.trim(),
          email: `${leadPhone.trim()}@ensis-lead.com`,
          projectType: "Chatbot Quick Inquiry",
          message: `Inquiry generated via Ensis Interactive Website Chatbot (${language.toUpperCase()}).`,
          agreeToContact: true,
        }),
      });

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
          FLOATING TRIGGER BUTTON (Theme Matched: Deep Forest #263016 & Warm Gold #c39a5c)
      ========================================================= */}
      <div className="fixed right-6 bottom-8 z-[100] flex flex-col items-end">
        {/* Tooltip bubble (Ensis Botanical Theme: #263016 + Gold Border #c39a5c) */}
        {!isOpen && showTooltip && (
          <div className="relative mb-3 flex items-center gap-2.5 rounded-xl bg-[#263016] px-4 py-2.5 text-xs font-medium text-[#faf7f2] shadow-[0_10px_25px_rgba(38,48,22,0.35)] border border-[#c39a5c]/70 animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-[#c39a5c] shrink-0" />
            <span>
              {language === "hi" ? (
                <>पंचकर्म व क्लिनिक सेटअप? <strong className="text-[#c39a5c]">Ensis AI से पूछें</strong></>
              ) : (
                <>Need Panchkarma setup help? <strong className="text-[#c39a5c]">Ask Ensis AI</strong></>
              )}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="ml-1 text-[#d8cdb8] hover:text-white transition-colors"
              aria-label="Close tooltip"
            >
              ✕
            </button>
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-[#263016] border-r border-b border-[#c39a5c]/70" />
          </div>
        )}

        {/* Main Floating Button - Ensis Deep Forest (#263016) & Metallic Gold (#c39a5c) */}
        <button
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          aria-label="Ensis Wellness Advisor Chat"
          className="group relative flex h-14 w-14 lg:h-15 lg:w-15 items-center justify-center rounded-full bg-[#263016] text-[#c39a5c] shadow-[0_8px_30px_rgba(38,48,22,0.45)] transition-all duration-300 hover:scale-108 hover:shadow-[0_12px_36px_rgba(195,154,92,0.45)] focus:outline-none border-2 border-[#c39a5c]"
        >
          {/* Outer Pulsing Golden Halo */}
          <div className="absolute -inset-1 rounded-full border border-[#c39a5c]/40 opacity-70 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-[#c39a5c]/50 animate-pulse" />

          {/* Online gold indicator dot */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 z-20">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c39a5c] opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#263016] bg-[#c39a5c]" />
          </span>

          {isOpen ? (
            <X className="h-6 w-6 text-[#c39a5c] transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center p-2.5">
              {/* Authentic Ensis Golden Lotus Asset */}
              <Image
                src={lotusImg}
                alt="Ensis Wellness"
                width={36}
                height={36}
                className="object-contain filter drop-shadow-[0_2px_8px_rgba(195,154,92,0.6)] group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
        </button>
      </div>

      {/* =========================================================
          EXPANDABLE CHAT WINDOW (Matched 100% to Ensis Website Theme)
      ========================================================= */}
      {isOpen && (
        <div className="fixed right-4 sm:right-6 bottom-24 z-[101] flex flex-col w-[390px] max-w-[calc(100vw-32px)] h-[580px] max-h-[82vh] rounded-2xl bg-[#faf7f2] shadow-[0_20px_50px_rgba(38,48,22,0.28)] border border-[#c39a5c]/60 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header - Ensis Deep Forest #263016 & Gold Trim #c39a5c with subtle lotus watermark */}
          <div className="relative flex items-center justify-between bg-[#263016] px-4 py-3.5 text-white border-b-2 border-[#c39a5c] overflow-hidden">
            {/* Watermark Lotus in header background */}
            <div className="pointer-events-none absolute -right-4 -bottom-6 opacity-10 select-none">
              <Image src={lotusImg} alt="" width={100} height={100} className="object-contain" />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              {/* Ensis Lotus Avatar Emblem */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b2310] border border-[#c39a5c] p-1.5 shadow-inner">
                <Image
                  src={lotusImg}
                  alt="Ensis"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-semibold tracking-wide text-white font-[family-name:var(--font-cormorant)]">
                    {language === "hi" ? "Ensis वेलनेस सलाहकार" : "Ensis Wellness Advisor"}
                  </h3>
                  <span className="flex h-2 w-2 rounded-full bg-[#c39a5c] animate-pulse" />
                </div>
                {userName ? (
                  <button
                    onClick={handleResetName}
                    title={language === "hi" ? "नाम बदलने के लिए क्लिक करें" : "Click to change name"}
                    className="flex items-center gap-1 text-[11px] text-[#c39a5c] hover:text-white transition-colors"
                  >
                    <User className="h-2.5 w-2.5" />
                    <span>{userName}</span>
                    <span className="text-[9px] text-[#faf7f2]/80 underline">
                      {language === "hi" ? "(बदलें)" : "(Change)"}
                    </span>
                  </button>
                ) : (
                  <p className="text-[10.5px] text-[#c39a5c] font-medium tracking-wide">
                    {language === "hi" ? "पंचकर्म एवं वेलनेस स्पेस विशेषज्ञ" : "Panchkarma & Wellness Space Architects"}
                  </p>
                )}
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-1.5">
              {/* Language Switcher Button [EN | हिंदी] */}
              <button
                onClick={toggleLanguage}
                title="Switch Language / भाषा बदलें"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1b2310] hover:bg-[#c39a5c] hover:text-[#1b2310] border border-[#c39a5c]/80 text-[11px] font-semibold text-[#c39a5c] transition-all shadow-xs"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </button>

              <button
                onClick={() => initChat()}
                title={language === "hi" ? "बातचीत पुनः प्रारंभ करें" : "Restart Chat"}
                className="rounded-lg p-1.5 text-[#d8cdb8] hover:bg-white/10 hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-lg p-1.5 text-[#d8cdb8] hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body (Ensis Website Background: #faf7f2 warm ivory) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf7f2] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                {m.sender === "bot" ? (
                  <div className="flex items-start gap-2 max-w-[90%]">
                    {/* Bot Lotus Avatar Icon */}
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#263016] border border-[#c39a5c] p-1 mt-0.5 shadow-2xs">
                      <Image
                        src={lotusImg}
                        alt="Ensis"
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs p-3.5 shadow-xs leading-relaxed whitespace-pre-line bg-white text-[#1f261b] border border-[#e2dfd9]">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs p-3.5 shadow-xs leading-relaxed whitespace-pre-line bg-[#263016] text-[#faf7f2] border border-[#1b2310]">
                    {m.text}
                  </div>
                )}

                {/* Lead Submission Form Card inside message - Ensis Enquiry Form Styled */}
                {m.isLeadForm && !leadSubmitted && (
                  <form
                    onSubmit={handleLeadSubmit}
                    className="mt-2.5 ml-8 w-[88%] rounded-xl bg-white p-4 border-2 border-[#c39a5c]/60 shadow-md space-y-3"
                  >
                    <p className="text-xs font-semibold text-[#1f261b] font-[family-name:var(--font-cormorant)] flex items-center gap-1.5 text-[13px]">
                      <Sparkles className="h-3.5 w-3.5 text-[#c39a5c]" />
                      {language === "hi" ? "कॉल बैक व 2026 PDF कैटलॉग प्राप्त करें" : "Request 2026 Architectural Catalog & Callback"}
                    </p>
                    <input
                      type="text"
                      placeholder={language === "hi" ? "आपका पूरा नाम" : "Your Full Name"}
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[#d8cdb8] bg-[#faf7f2] px-3.5 py-2 text-xs text-[#1f261b] placeholder:text-[#8f8777] focus:border-[#b1793d] focus:bg-white focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder={language === "hi" ? "व्हाट्सएप / फोन नंबर (10 अंक)" : "WhatsApp / Phone (10 Digits)"}
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      required
                      className="w-full rounded-lg border border-[#d8cdb8] bg-[#faf7f2] px-3.5 py-2 text-xs text-[#1f261b] placeholder:text-[#8f8777] focus:border-[#b1793d] focus:bg-white focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#c39a5c] via-[#d5ad6a] to-[#a9742a] text-[#1f261b] hover:brightness-105 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      {leadSubmitting ? (
                        <span>{language === "hi" ? "सबमिट हो रहा है..." : "Submitting..."}</span>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1f261b]" />
                          <span>{language === "hi" ? "अनुरोध सबमिट करें" : "Submit Request"}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Option Pills - Ensis Warm Gold & Deep Forest Styling */}
                {m.options && m.options.length > 0 && (
                  <div className={`mt-2 flex flex-wrap gap-1.5 max-w-[95%] ${m.sender === "bot" ? "ml-8" : ""}`}>
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(opt)}
                        className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-[#263016] border border-[#c39a5c]/60 shadow-2xs hover:bg-[#263016] hover:text-[#c39a5c] hover:border-[#263016] transition-all text-left flex items-center gap-1 group/pill"
                      >
                        <span>{opt}</span>
                        <ArrowRight className="h-2.5 w-2.5 opacity-0 -translate-x-1 group-hover/pill:opacity-100 group-hover/pill:translate-x-0 transition-all text-[#c39a5c]" />
                      </button>
                    ))}
                  </div>
                )}

                <span className={`mt-1 text-[9.5px] text-[#8f8777] px-1 ${m.sender === "bot" ? "ml-8" : ""}`}>{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-[#5a5248] text-xs px-2 py-1 ml-8">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-pulse" />
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-pulse delay-100" />
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#c39a5c] animate-pulse delay-200" />
                <span className="text-[11px] text-[#8f8777] ml-1 font-medium">
                  {language === "hi" ? "Ensis AI उत्तर लिख रहा है..." : "Ensis Advisor typing..."}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-[#e2dfd9]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={
                  isAskingName
                    ? language === "hi"
                      ? "कृपया अपना नाम लिखें..."
                      : "Please enter your name / अपना नाम लिखें..."
                    : userName
                    ? language === "hi"
                      ? `${userName} जी, कुछ भी पूछें...`
                      : `Ask anything, ${userName}...`
                    : language === "hi"
                    ? "क्लिनिक सेटअप, द्रोणी या मूल्य के बारे में पूछें..."
                    : "Ask about clinic setups, Droni, pricing..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                autoFocus={isAskingName}
                className="flex-1 rounded-xl bg-[#faf7f2] px-3.5 py-2.5 text-xs text-[#1f261b] placeholder:text-[#8f8777] border border-[#d8cdb8] focus:border-[#b1793d] focus:bg-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send Message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#263016] text-[#c39a5c] hover:bg-[#1b2310] border border-[#c39a5c]/50 disabled:opacity-40 disabled:hover:bg-[#263016] transition-colors shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <div className="mt-1.5 text-center text-[9px] tracking-widest text-[#8f8777] uppercase font-medium">
              Ensis • Premier Panchkarma & Wellness Spaces
            </div>
          </div>
        </div>
      )}
    </>
  );
}
