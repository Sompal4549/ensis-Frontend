"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import onThisPageBottom from "@/assets/on_this_page_bottom.png";

type NavItem = {
  id: string;
  number: string;
  title: string;
};

type StickyScrollSpyProps = {
  items: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  headerOffset?: number;
  sidebarTitle?: string;
  className?: string;
};

/**
 * The section whose top has passed just below the header. Uses viewport positions, so it works
 * whatever the sections' offset parent is. At the bottom of the page the last section wins,
 * since short final sections can never reach the top.
 */
export function getActiveSectionId(sections: HTMLElement[], headerOffset: number): string {
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) return sections[sections.length - 1].id;
  let current = sections[0].id;
  for (const el of sections) {
    if (el.getBoundingClientRect().top <= headerOffset + 24) current = el.id;
  }
  return current;
}

export default function StickyScrollSpy({
  items,
  activeSection,
  onSectionChange,
  headerOffset = 108,
  sidebarTitle = "On This Page",
  className = "",
}: StickyScrollSpyProps) {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const isProgrammaticScroll = useRef(false);
  const programmaticTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sectionElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (!sectionElements.length) return;

    let ticking = false;
    const onScroll = () => {
      if (isProgrammaticScroll.current || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onSectionChange(getActiveSectionId(sectionElements, headerOffset));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (programmaticTimeout.current) clearTimeout(programmaticTimeout.current);
    };
  }, [items, headerOffset, onSectionChange]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    onSectionChange(id);
    isProgrammaticScroll.current = true;
    if (programmaticTimeout.current) clearTimeout(programmaticTimeout.current);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset, behavior: "smooth" });
    programmaticTimeout.current = setTimeout(() => { isProgrammaticScroll.current = false; onSectionChange(id); }, 900);
  };

  return (
    <aside className={`hidden lg:block h-full ${className}`}>
      <div
        className="sticky rounded-xl border border-[#e6d6b9] bg-[#fdfaf3]"
        style={{ top: `${headerOffset}px` }}
      >
        <div className="px-4.5 pt-4 pb-2">
          <h3 className=" text-[18px] font-bold text-[#063120]">
            {sidebarTitle}
          </h3>
        </div>
        <nav
          ref={navRef}
          className="relative px-2.5 pb-2 space-y-0.5"
        >
          {items.map((item, idx) => {
            const isActive = activeSection === item.id;
            const formattedNum = String(item.number).padStart(2, "0");
            const isLast = idx === items.length - 1;
            return (
              <div
                key={item.id}
                className={!isActive && !isLast ? "border-b border-[#ece8de]/70" : ""}
              >
                <button
                  ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex w-full items-center gap-3.5 px-3 py-1 text-left transition-all duration-200 rounded-lg ${isActive
                    ? "bg-[#ecefde] text-[#063120]"
                    : "text-[#525f6f] hover:bg-[#f3f5e9]/70 hover:text-[#063120]"
                    }`}
                >
                  <span
                    className={`w-6 shrink-0 text-sm tabular-nums ${isActive ? "text-[#063120] " : "text-[#788492] font-medium"
                      }`}
                  >
                    {formattedNum}
                  </span>
                  <span
                    className={`text-sm ${isActive ? "text-[#063120] " : "text-[#4d5b6b] font-medium"
                      }`}
                  >
                    {item.title}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Bottom Right Zen Stones & Flower Visual */}
        <div className="pointer-events-none relative flex justify-end overflow-hidden rounded-b-xl pt-2">
          <Image
            src={onThisPageBottom}
            alt=""
            width={260}
            height={187}
            className="w-[185px] sm:w-[210px] h-auto object-contain select-none -mb-1 -mr-1"
          />
        </div>
      </div>
    </aside>
  );
}