"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Round "back to top" button, fixed to the viewport corner; shown only once the page is scrolled to the very bottom */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const { scrollHeight } = document.documentElement;
      setVisible(window.scrollY + window.innerHeight >= scrollHeight - 24);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-3 right-3 z-40 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-[#0b2250] text-white transition-all duration-300 hover:border-white hover:bg-[#16336f] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-[15px]" strokeWidth={2.25} />
    </button>
  );
}
