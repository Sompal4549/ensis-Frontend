"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import LottieChatbotAvatar from "@/components/ui/LottieChatbotAvatar";
import type { ChatbotProps } from "@/components/ui/Chatbot";

// The chat window and voice engine: loaded dynamically once the page is idle or clicked
const Chatbot = dynamic<ChatbotProps>(() => import("@/components/ui/Chatbot"), { ssr: false });

// Unified Lottie Chatbot Button (Phase 1 pop up, Phase 3 notification icon)
const RobotButton = ({
  onClick,
  label,
  hasNotification,
}: {
  onClick: () => void;
  label: string;
  hasNotification: boolean;
}) => {
  return (
    <>
      <style>{`
        @keyframes ensisBubble { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .ensis-bubble-float { animation: ensisBubble 2.8s ease-in-out infinite; }
      `}</style>
      <button
        type="button"
        onClick={onClick}
        className="group fixed bottom-2 right-2 sm:bottom-4 sm:right-6 z-50 flex flex-col items-center cursor-pointer select-none"
        aria-label="May I help you? Open Ensis chat"
      >
        <span className="ensis-bubble-float relative z-10 -mb-2 whitespace-nowrap rounded-[14px] border border-[#e2dfd9] bg-white px-3.5 py-1.5 text-[13px] sm:text-[14px] font-bold tracking-tight text-[#263016] shadow-[0_6px_20px_rgba(38,48,22,0.18)]">
          {label}
          <span className="absolute left-1/2 -bottom-[6px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-[#e2dfd9] bg-white" />
        </span>

        {/* Phase 1: Lottie Character with spring pop-up & Phase 3: Notification Badge */}
        <div className="relative flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#fffdf9] to-[#f4ebe0] p-1.5 shadow-[0_8px_25px_rgba(38,48,22,0.25)] ring-2 ring-[#D98E16]/60 transition-transform duration-300 group-hover:scale-108">
          <LottieChatbotAvatar
            popOnLoad
            showNotification={hasNotification}
            notificationType="sent"
            className="h-full w-full"
          />
        </div>
      </button>
    </>
  );
};

/* Unified Chatbot Launcher with persistent single icon and message notification events */
const ChatbotLauncher = ({ loadChat = true, initialLogo }: { loadChat?: boolean; initialLogo?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedEarly, setClickedEarly] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const openChat = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Listen for message events to show the notification badge on the chatbot icon
    const handleMessageSent = () => {
      setHasNotification(true);
    };

    window.addEventListener("ensis-chatbot-message-sent", handleMessageSent);
    return () => {
      window.removeEventListener("ensis-chatbot-message-sent", handleMessageSent);
    };
  }, []);

  const onRobotClick = () => {
    setHasNotification(false);
    if (openChat.current) openChat.current();
    else setClickedEarly(true);
  };

  const handleSetIsOpen = (open: boolean) => {
    if (open) setHasNotification(false);
    setIsOpen(open);
  };

  return (
    <>
      {!isOpen && (
        <RobotButton
          onClick={onRobotClick}
          label={clickedEarly && !openChat.current ? "Opening…" : "May I help you?"}
          hasNotification={hasNotification}
        />
      )}
      {(loadChat || clickedEarly) && (
        <Chatbot
          isOpen={isOpen}
          setIsOpen={handleSetIsOpen}
          openRef={openChat}
          openAtOnce={clickedEarly}
          initialLogo={initialLogo}
        />
      )}
    </>
  );
};

export default ChatbotLauncher;
