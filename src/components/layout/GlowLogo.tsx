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
filter: `
  drop-shadow(0 0 1px rgba(${rgb},1))
  drop-shadow(0 0 3px rgba(${rgb},1))
  drop-shadow(0 0 6px rgba(${rgb},0.9))
  drop-shadow(0 2px 8px rgba(${rgb},0.8))
  drop-shadow(0 4px 10px rgba(${rgb},0.5))
  drop-shadow(0 15px 10px rgba(${rgb},0.2))
`,
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