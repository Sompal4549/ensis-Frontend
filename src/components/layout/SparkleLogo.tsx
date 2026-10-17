"use client";

import Image, { type StaticImageData } from "next/image";

type SparkleLogoProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
  /**
   * plain — logo on its own (white header).
   * card  — logo on an ivory card with a gold frame, so it stays crisp on busy or
   *         gold backgrounds (footer).
   */
  variant?: "plain" | "card";
};

const sparkles = [
  { top: "-10%", left: "6%", size: 14, delay: "0s" },
  { top: "84%", left: "94%", size: 14, delay: "1.6s" },
  { top: "-8%", left: "62%", size: 11, delay: ".8s" },
  { top: "92%", left: "34%", size: 11, delay: "2.4s" },
];

export default function SparkleLogo({
  src,
  alt,
  className,
  variant = "plain",
}: SparkleLogoProps) {
  const isCard = variant === "card";

  return (
    <div className={`logo-wrap relative inline-block ${isCard ? "is-card" : "is-plain"}`}>
      <div className="logo-frame">
        <div className="logo-card relative overflow-hidden">
          {/* Admin-uploaded logos arrive as URLs, which next/image can only size with explicit dimensions */}
          <Image
            src={src}
            alt={alt}
            className={`relative z-10 ${className ?? ""}`}
            {...(typeof src === "string" ? { width: 600, height: 258 } : {})}
            priority
          />
          {/* Light sweep that glides across the logo every few seconds */}
          <span className="logo-shine" aria-hidden />
        </div>
      </div>

      {sparkles.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="sparkle-dot pointer-events-none absolute"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      <style jsx>{`
        .logo-wrap {
          transition: transform 0.35s ease;
        }
        .logo-wrap:hover {
          transform: translateY(-1px) scale(1.02);
        }

        /* Plain: the logo itself carries a soft lift so it reads crisply on white */
        .is-plain .logo-card {
          filter: drop-shadow(0 2px 6px rgba(30, 64, 150, 0.12));
        }

        /* Card: gold gradient frame around an ivory card */
        .is-card .logo-frame {
          padding: 1.5px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f6e3a8 0%, #c9a86a 30%, #8d6a3a 55%, #e9cd86 80%, #b8904e 100%);
          box-shadow:
            0 14px 34px -12px rgba(60, 40, 10, 0.45),
            0 4px 10px rgba(60, 40, 10, 0.12);
        }
        .is-card .logo-card {
          border-radius: 16.5px;
          padding: 14px 22px;
          background:
            radial-gradient(120% 140% at 50% 0%, #ffffff 0%, #fffdf7 55%, #f7f0e1 100%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 -10px 24px -18px rgba(141, 106, 58, 0.45);
        }

        .logo-shine {
          position: absolute;
          inset: -20% auto -20% -60%;
          width: 45%;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(
            100deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.75) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-18deg);
          mix-blend-mode: soft-light;
          animation: logo-shine 6s ease-in-out infinite;
        }
        .is-card .logo-shine {
          mix-blend-mode: normal;
          opacity: 0.55;
        }

        @keyframes logo-shine {
          0%,
          70% {
            left: -60%;
          }
          100% {
            left: 130%;
          }
        }

        .sparkle-dot {
          clip-path: polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%);
          background: radial-gradient(circle, #fffbe6 0%, #ffe9a8 30%, #f2c14e 60%, #d89a1f 100%);
          filter: drop-shadow(0 0 4px rgba(255, 220, 120, 0.6));
          opacity: 0;
          transform: scale(0.2);
          transform-origin: center;
          animation: sparkle-twinkle 4.5s ease-in-out infinite;
          z-index: 30;
        }

        @keyframes sparkle-twinkle {
          0% { opacity: 0; transform: scale(0.15) rotate(0deg); }
          25% { opacity: 0.7; transform: scale(0.8) rotate(15deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(45deg); }
          75% { opacity: 0.55; transform: scale(0.8) rotate(60deg); }
          100% { opacity: 0; transform: scale(0.15) rotate(80deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-shine,
          .sparkle-dot {
            animation: none;
          }
          .logo-wrap:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
