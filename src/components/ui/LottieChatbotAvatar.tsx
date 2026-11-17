"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { DotLottieReact } from "@/lib/dotLottie";
import { Bell, Send } from "lucide-react";

export interface LottieChatbotAvatarProps {
  className?: string;
  style?: CSSProperties;
  speaking?: boolean;
  popOnLoad?: boolean;
  showNotification?: boolean;
  notificationType?: "sent" | "alert";
  size?: number | string;
}

export default function LottieChatbotAvatar({
  className = "",
  style,
  popOnLoad = false,
  showNotification = false,
  notificationType = "sent",
}: LottieChatbotAvatarProps) {
  // Clear the pop-up transform once finished so the canvas renders on exact 1:1 hardware pixels without blur
  const [isPopping, setIsPopping] = useState(popOnLoad);

  useEffect(() => {
    if (popOnLoad) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 700);
      return () => clearTimeout(timer);
    }
  }, [popOnLoad]);

  return (
    <>
      <style>{`
        @keyframes ensisPopUp {
          0% { transform: scale(0.2) translateY(24px); opacity: 0; }
          60% { transform: scale(1.14) translateY(-5px); opacity: 1; }
          85% { transform: scale(0.96) translateY(2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .ensis-lottie-pop {
          animation: ensisPopUp 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Razor-sharp canvas rendering rules */
        .ensis-crisp-canvas canvas {
          width: 100% !important;
          height: 100% !important;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      <div
        style={style}
        className={`relative flex items-center justify-center ${
          isPopping ? "ensis-lottie-pop" : ""
        } ${className}`}
      >
        {/* Lottie character container with high-res crisp canvas */}
        <div className="ensis-crisp-canvas relative h-full w-full overflow-hidden rounded-full">
          <DotLottieReact
            src="/chatbot.lottie"
            loop
            autoplay
            speed={1.0}
            renderConfig={{
              autoResize: true,
              devicePixelRatio: typeof window !== "undefined" ? Math.max(window.devicePixelRatio || 1, 2) * 2 : 3,
              freezeOnOffscreen: false,
            }}
            layout={{
              fit: "contain",
              align: [0.5, 0.5],
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Notification Icon Badge (Phase 3) */}
        {showNotification && (
          <span className="absolute -top-1 -right-1 z-20 flex h-5 w-5 items-center justify-center pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white text-[9.5px] font-extrabold shadow-md ring-2 ring-white">
              {notificationType === "sent" ? (
                <Send className="h-2.5 w-2.5 stroke-[2.5]" />
              ) : (
                <Bell className="h-2.5 w-2.5 stroke-[2.5]" />
              )}
            </span>
          </span>
        )}
      </div>
    </>
  );
}
