"use client";

import { ArrowUp } from "lucide-react";

/** Round "back to top" button used in the footer copyright bar */
export default function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
    >
      <ArrowUp className="size-4" strokeWidth={2.25} />
    </button>
  );
}
