"use client";

import Image, { type StaticImageData } from "next/image";

type SparkleLogoProps = {
  src: StaticImageData | string;
  alt: string;
  className?: string;
};

const sparkles = [
  { top: "-5%", left: "10%", size: 18, delay: "0s" },
  { top: "12%", left: "96%", size: 16, delay: "0.8s" },
  { top: "88%", left: "12%", size: 18, delay: "1.6s" },
  { top: "90%", left: "88%", size: 18, delay: "2.4s" },
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

{/* <div className="logo-bottom-glow pointer-events-none rounded-full" /> */}

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
.logo-bottom-glow {
  position: absolute;
top:0;
width:150px;
height:60px;
  pointer-events: none;
  z-index: -1;
border-radius:50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 243, 200, 0.9) 18%,
    rgba(255, 215, 120, 0.75) 38%,
    rgba(212, 168, 44, 0.45) 60%,
    rgba(212, 168, 44, 0.18) 78%,
    transparent 100%
  );

  filter: blur(26px);
  opacity: 1;
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
  background: radial-gradient(
    circle,
    #ffffff 0%,
    #fff9dc 18%,
    #ffe58a 40%,
    #f7c948 68%,
    #d6a320 100%
  );

  filter:
    drop-shadow(0 0 3px rgba(255,255,255,.95))
    drop-shadow(0 0 8px rgba(255,225,120,.95))
    drop-shadow(0 0 16px rgba(212,168,44,.9))
    drop-shadow(0 0 28px rgba(255,208,80,.7));

  box-shadow:
    0 0 10px rgba(255,235,170,.9),
    0 0 18px rgba(255,210,90,.75),
    0 0 32px rgba(201,152,34,.55);

  transform-origin: center;
}

      @keyframes sparkle-twinkle {
  0% {
    opacity: 0;
    transform: scale(0.15) rotate(0deg);
    filter: brightness(.9);
  }

  18% {
    opacity: .5;
    transform: scale(.65) rotate(15deg);
    filter: brightness(1.2);
  }

  40% {
    opacity: 1;
    transform: scale(1.15) rotate(35deg);
    filter: brightness(1.6);
  }

  50% {
    opacity: 1;
    transform: scale(1.55) rotate(45deg);
    filter: brightness(2);
  }

  65% {
    opacity: .75;
    transform: scale(1.1) rotate(60deg);
    filter: brightness(1.4);
  }

  82% {
    opacity: .35;
    transform: scale(.7) rotate(80deg);
    filter: brightness(1);
  }

  100% {
    opacity: 0;
    transform: scale(.15) rotate(100deg);
    filter: brightness(.8);
  }
}
      `}</style>
    </div>
  );
}