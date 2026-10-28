"use client";

import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  className?: string;
}

/** Round "back to top" button, static in the footer bar */
export default function BackToTop({ className = "" }: BackToTopProps) {
  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group flex size-[30px] sm:size-[34px] shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#0b2250] text-white transition-colors duration-200 hover:border-white hover:bg-[#16336f] shadow-xs cursor-pointer ${className}`}
    >
      <ArrowUp className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={2.25} />
    </button>
  );
}
