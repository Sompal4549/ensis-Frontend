"use client";

import Image, { type StaticImageData } from "next/image";

type SparkleLogoProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
};

const sparkles = [
  { top: "-2%", left: "6%", size: 18, delay: "0s" },
  { top: "12%", left: "96%", size: 16, delay: "0.5s" },
  { top: "46%", left: "-4%", size: 15, delay: "1s" },
  { top: "54%", left: "101%", size: 15, delay: "1.5s" },
  { top: "95%", left: "12%", size: 17, delay: "2s" },
  { top: "92%", left: "84%", size: 18, delay: "2.5s" },
];

export default function SparkleLogo({
  src,
  alt,
  className,
}: SparkleLogoProps) {
  return (
    <div className="relative inline-block">
      <div className="relative overflow-hidden">
        <Image src={src} alt={alt} className={className} />
        <span className="sparkle-shine pointer-events-none absolute inset-0" />
      </div>

      {sparkles.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{
            top: s.top,
            left: s.left,
          }}
        >
          {/* White sparkle */}
          <span
            className="sparkle-dot sparkle-white absolute"
            style={{
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        </div>
      ))}

      <style jsx>{`
        .sparkle-shine {
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(208, 169, 101, 0.55) 48%,
            rgba(255, 246, 222, 0.9) 50%,
            rgba(208, 169, 101, 0.55) 52%,
            transparent 65%
          );
          background-size: 250% 100%;
          background-position: 150% 0;
          mix-blend-mode: screen;
          animation: sparkle-sweep 5s ease-in-out infinite;
        }

        @keyframes sparkle-sweep {
          0% {
            background-position: 150% 0;
          }
          18% {
            background-position: -50% 0;
          }
          100% {
            background-position: -50% 0;
          }
        }

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
          animation: sparkle-twinkle 3.2s ease-in-out infinite;
        }

   .sparkle-white {
  background: #fff;
  color: #fff;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}

        @keyframes sparkle-twinkle {
          0% {
            opacity: 0;
            transform: scale(0.2) rotate(0deg);
            box-shadow: 0 0 0 currentColor;
          }

          25% {
            opacity: 0.4;
            transform: scale(0.7) rotate(20deg);
            box-shadow: 0 0 4px currentColor;
          }

          50% {
            opacity: 1;
            transform: scale(1.45) rotate(45deg);
            box-shadow:
              0 0 6px currentColor,
              0 0 12px currentColor,
              0 0 22px currentColor;
          }

          75% {
            opacity: 0.4;
            transform: scale(0.8) rotate(70deg);
            box-shadow: 0 0 4px currentColor;
          }

          100% {
            opacity: 0;
            transform: scale(0.2) rotate(90deg);
            box-shadow: 0 0 0 currentColor;
          }
        }
      `}</style>
    </div>
  );
}