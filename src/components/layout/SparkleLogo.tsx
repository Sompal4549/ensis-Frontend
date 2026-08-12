"use client";

import Image, { type StaticImageData } from "next/image";

type SparkleLogoProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
};

const sparkles = [
  { top: "-8%", left: "10%", size: 16, delay: "0s" },
  { top: "86%", left: "90%", size: 16, delay: "1.6s" },
  { top: "-6%", left: "52%", size: 13, delay: ".8s" },
  { top: "94%", left: "46%", size: 13, delay: "2.4s" },
];

export default function SparkleLogo({
  src,
  alt,
  className,
}: SparkleLogoProps) {
  return (
    <div className="logo-wrap relative inline-block">
      {/* Royal Card */}
      <div className="logo-card relative overflow-hidden">

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            className={className}
            priority
          />
        </div>
      </div>

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            top: s.top,
            left: s.left,
          }}
        >
          <span
            className="sparkle-dot sparkle-gold absolute"
            style={{
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        </div>
      ))}

      <style jsx>{`
        .logo-wrap {
          filter: drop-shadow(0 8px 20px rgba(80, 60, 10, 0.18));
        }

        .logo-card {
          background: transparent;
        }

        /* Sparkle Shape */
        .sparkle-dot {
          clip-path: polygon(
            50% 0%,
            61% 35%,
            100% 50%,
            61% 65%,
            50% 100%,
            39% 65%,
            0% 50%,
            39% 35%
          );

          opacity: 0;
          transform: scale(0.2);
          animation: sparkle-twinkle 4.5s ease-in-out infinite;
        }

        .sparkle-gold {
          background: radial-gradient(
            circle,
            #fffbe6 0%,
            #ffe9a8 30%,
            #f2c14e 60%,
            #d89a1f 100%
          );

          filter: drop-shadow(0 0 4px rgba(255, 220, 120, 0.6));

          transform-origin: center;
        }

        @keyframes sparkle-twinkle {
          0% {
            opacity: 0;
            transform: scale(0.15) rotate(0deg);
          }

          25% {
            opacity: 0.7;
            transform: scale(0.8) rotate(15deg);
          }

          50% {
            opacity: 1;
            transform: scale(1.15) rotate(45deg);
          }

          75% {
            opacity: 0.55;
            transform: scale(0.8) rotate(60deg);
          }

          100% {
            opacity: 0;
            transform: scale(0.15) rotate(80deg);
          }
        }
      `}</style>
    </div>
  );
}

