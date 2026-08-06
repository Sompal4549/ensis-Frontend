"use client";

import Image, { type StaticImageData } from "next/image";

type SparkleLogoProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
};

const sparkles = [
  { top: "-6%", left: "10%", size: 18, delay: "0s" },
  { top: "12%", left: "96%", size: 16, delay: ".8s" },
  { top: "88%", left: "10%", size: 18, delay: "1.6s" },
  { top: "92%", left: "90%", size: 18, delay: "2.4s" },
  { top: "-4%", left: "52%", size: 13, delay: ".4s" },
  { top: "38%", left: "4%", size: 12, delay: "1.2s" },
  { top: "52%", left: "98%", size: 12, delay: "2s" },
  { top: "98%", left: "52%", size: 13, delay: "2.8s" },
];

export default function SparkleLogo({
  src,
  alt,
  className,
}: SparkleLogoProps) {
  return (
    <div className="logo-wrap relative inline-block">
      {/* Halo Glow */}
      <div className="logo-halo pointer-events-none absolute -inset-2 rounded-[30px] md:-inset-3" />

      {/* Royal Card */}
      <div className="logo-card relative overflow-hidden rounded-[24px] p-4 md:p-5">

        {/* Top Highlight */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,222,150,.35),transparent_50%)]" />

        {/* Bottom Glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-40 -translate-x-1/2 rounded-full bg-[#c8a45d]/25 blur-3xl" />

        {/* Border */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] border-2 border-[#c8a45d]" />

        {/* Inner Gold Edge */}
        <div className="pointer-events-none absolute inset-[2px] rounded-[22px] border border-[#e3c88a]/70" />

        {/* Corner Gems */}
        <span className="corner-gem pointer-events-none absolute -left-1 -top-1" style={{ animationDelay: "0s" }} />
        <span className="corner-gem pointer-events-none absolute -right-1 -top-1" style={{ animationDelay: ".9s" }} />
        <span className="corner-gem pointer-events-none absolute -bottom-1 -left-1" style={{ animationDelay: "1.8s" }} />
        <span className="corner-gem pointer-events-none absolute -bottom-1 -right-1" style={{ animationDelay: "2.7s" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            className={className}
            priority
          />
        </div>

        {/* Shine */}
        <span className="sparkle-shine pointer-events-none absolute inset-0 rounded-[24px]" />
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
          filter: drop-shadow(0 16px 42px rgba(80, 60, 10, 0.3));
        }

        .logo-halo {
          background: radial-gradient(
            circle,
            rgba(230, 190, 90, 0.55) 0%,
            rgba(230, 190, 90, 0.16) 55%,
            transparent 75%
          );

          animation: halo-pulse 3.5s ease-in-out infinite;
        }

        @keyframes halo-pulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(0.92);
          }

          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        .logo-card {
          background:
            radial-gradient(
              circle at top left,
              rgba(255, 226, 160, 0.5),
              transparent 48%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(255, 226, 160, 0.3),
              transparent 55%
            ),
            linear-gradient(160deg, #ffffff 0%, #fdfaf3 60%, #f7f1e3 100%);

          border: 2px solid #c8a45d;

          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 0 30px rgba(232, 197, 120, 0.22),
            0 18px 45px rgba(80, 60, 10, 0.22),
            0 0 30px rgba(212, 168, 80, 0.28);
        }

        /* Corner Gem */
        .corner-gem {
          width: 9px;
          height: 9px;
          background: radial-gradient(
            circle,
            #fff3cf 0%,
            #f2c14e 45%,
            #b8860b 100%
          );
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          filter: drop-shadow(0 0 5px rgba(242, 193, 78, 0.95));
          z-index: 2;
          opacity: 0;
          transform: scale(0.3);
          animation: gem-twinkle 3.4s ease-in-out infinite;
        }

        @keyframes gem-twinkle {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }

          22% {
            opacity: 1;
            transform: scale(1.15) rotate(45deg);
          }

          50% {
            opacity: 0.75;
            transform: scale(0.95) rotate(45deg);
          }

          78% {
            opacity: 0;
            transform: scale(0.3) rotate(90deg);
          }

          100% {
            opacity: 0;
            transform: scale(0.3) rotate(90deg);
          }
        }

        /* Moving Shine */
        .sparkle-shine {
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 238, 200, 0.14) 46%,
            rgba(255, 250, 235, 0.8) 50%,
            rgba(255, 238, 200, 0.14) 54%,
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
          animation: sparkle-twinkle 3.2s ease-in-out infinite;
        }

        .sparkle-gold {
          background: radial-gradient(
            circle,
            #fffbe6 0%,
            #ffe9a8 20%,
            #f2c14e 45%,
            #d89a1f 70%,
            #a06c0e 100%
          );

          filter:
            drop-shadow(0 0 3px rgba(255, 250, 220, 0.95))
            drop-shadow(0 0 9px rgba(255, 220, 120, 0.9))
            drop-shadow(0 0 22px rgba(230, 170, 50, 0.85));

          box-shadow:
            0 0 12px rgba(255, 230, 150, 0.9),
            0 0 26px rgba(240, 190, 80, 0.6);

          transform-origin: center;
        }

        @keyframes sparkle-twinkle {
          0% {
            opacity: 0;
            transform: scale(0.15) rotate(0deg);
          }

          20% {
            opacity: 0.6;
            transform: scale(0.8) rotate(15deg);
          }

          45% {
            opacity: 1;
            transform: scale(1.4) rotate(45deg);
          }

          60% {
            opacity: 0.8;
            transform: scale(1.1) rotate(60deg);
          }

          80% {
            opacity: 0.3;
            transform: scale(0.6) rotate(80deg);
          }

          100% {
            opacity: 0;
            transform: scale(0.15) rotate(100deg);
          }
        }
      `}</style>
    </div>
  );
}

