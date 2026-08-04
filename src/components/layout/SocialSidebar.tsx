"use client";

import { useEffect, useState } from "react";
import { socialApi } from "@/lib/api/api";
import { SocialLink } from "@/constants";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
};

const colorMap: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  twitter: "#000000",
  x: "#000000",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
};


interface SocialSidebarProps {
  layout?: "horizontal" | "vertical";
}

const SocialSidebar = ({ layout = "vertical" }: SocialSidebarProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    setIsVisible(true);

  const fetchSocialLinks = async () => {
  try {
    const data = await socialApi.getLinks();

    setSocialLinks(
      data
        .filter((item) => item.isActive)
        .sort((a, b) => a.order - b.order)
    );
  } catch (err) {
    console.error("Failed to fetch social links", err);
  }
};

    fetchSocialLinks();
  }, []);

  return (
    <>
      <style>{`
        @keyframes fallIn {
          from {
            transform: translateY(-100px) rotate(-180deg) scale(0.3);
            opacity: 0;
          }
          to {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes iconSpin {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(360deg) scale(1.1);
          }
        }

        @keyframes buttonShake {
          0%,100% {
            transform: rotate(0deg) scale(1.1);
          }
          25% {
            transform: rotate(-10deg) scale(1.1);
          }
          50% {
            transform: rotate(10deg) scale(1.1);
          }
          75% {
            transform: rotate(-10deg) scale(1.1);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .social-item {
          animation: fallIn 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards;
          animation-delay: calc(var(--index) * 0.12s + 0.2s);
          opacity: 0;
        }

        .social-item.visible {
          opacity: 1;
        }

        .glow-effect {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          filter: blur(12px);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .social-item:hover .glow-effect {
          opacity: 0.6;
          animation: pulse 2s ease-in-out infinite;
        }

        .ripple-effect {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid;
          opacity: 0;
        }

        .social-item:hover .ripple-effect {
          animation: ripple 1.5s ease-out infinite;
        }

        .social-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 9999px;
          border: 2px solid;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.1),
            0 2px 4px -1px rgba(0,0,0,0.06);
        }

        @media (min-width: 1024px) {
          .social-button {
            width: 40px;
            height: 40px;
          }
        }

        .social-button:hover {
          animation: buttonShake 0.5s ease-in-out;
          transform: scale(1.1);
        }

        .icon-wrapper {
          transition: all 0.2s;
        }

        .social-item:hover .icon-wrapper {
          animation: iconSpin 0.6s ease-in-out;
        }

        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255,255,255,0.4),
            transparent
          );
          transform: rotate(45deg);
          opacity: 0;
        }

        .social-item:hover .shine-effect {
          opacity: 1;
          animation: shine 0.6s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .tooltip {
          position: absolute;
          right: 100%;
          margin-right: 12px;
          top: 50%;
          transform: translateY(-50%) translateX(10px) scale(0.8);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .social-item:hover .tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0) scale(1);
        }

        .tooltip-content {
          padding: 8px 16px;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: bold;
          position: relative;
        }

        .tooltip-arrow {
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid;
        }
      `}</style>

    <div className={`
  ${layout === "vertical" 
    ? "fixed right-1 lg:right-1.5 top-[45%] lg:top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 lg:gap-4" 
    : "flex flex-row gap-4"
  } print:hidden`}>
        {socialLinks.map((social, index) => {
          const platform = social.platform.toLowerCase();
          const Icon = iconMap[platform];

          if (!Icon) return null;

          const color = colorMap[platform] || "#666";

          return (
            <div
              key={social._id}
              className={`social-item relative ${
                isVisible ? "visible" : ""
              }`}
              style={
                {
                  "--index": index,
                } as React.CSSProperties
              }
            >
              <div
                className="glow-effect"
                style={{ backgroundColor: color }}
              />

              <div
                className="ripple-effect"
                style={{ borderColor: color }}
              />

              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-button"
                style={{ borderColor: color }}
                aria-label={social.platform}
             onClick={async () => {
  await socialApi.trackClick(social.platform);
}}
              >
                <div className="icon-wrapper">
                  <Icon
                    className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px]"
                    style={{ color }}
                  />
                </div>

                <div className="shine-effect" />
              </a>

              <div className="tooltip">
                <div
                  className="tooltip-content"
                  style={{ backgroundColor: color }}
                >
                  {social.platform}
                  <div
                    className="tooltip-arrow"
                    style={{
                      borderLeftColor: color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SocialSidebar;