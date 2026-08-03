"use client";

import { socialApi } from "@/lib/api/api";


interface Props {
  href: string;
  platform: string;
  className?: string;
  children: React.ReactNode;
}

export default function SocialIconLink({
  href,
  platform,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Follow us on ${platform}`}
      className={className}
      onClick={() => {
        void socialApi.trackClick(platform);
      }}
    >
      <span className="hover:text-white md:text-white">
      {children}
      </span>
    </a>
  );
}