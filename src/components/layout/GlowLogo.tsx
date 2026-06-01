"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface GlowLogoProps {
  children: ReactNode;
  href?: string;
  className?: string;
  /** Dominant color of your logo as an RGB string e.g. "34,85,204" */
  rgb?: string;
}

export function GlowLogo({
  children,
  href,
  className = "",
  rgb = "255,255,255",
}: GlowLogoProps) {
  const inner = (
    <div
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        filter: `drop-shadow(0 0 8px rgba(${rgb},1)) drop-shadow(0 0 70px rgba(${rgb},0.35))`,
      }}
    >
      {children}
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} style={{ display: "inline-block", flexShrink: 0 }}>
      {inner}
    </Link>
  );
}

export default GlowLogo;