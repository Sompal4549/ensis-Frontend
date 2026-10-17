"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { DotLottieReact } from "@/lib/dotLottie";

export default function LottieChatbotAvatar({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let active = true;
    fetch("/chatbot.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json) setData(json);
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      style={style}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    >
      {data ? (
        <DotLottieReact
          data={data}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <DotLottieReact
          src="/chatbot.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
