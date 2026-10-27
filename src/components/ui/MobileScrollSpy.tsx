"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { getActiveSectionId } from "./StickyScrollSpy";
import onThisPageBottom from "@/assets/on_this_page_bottom.png";

/* =========================================================
   TYPES
========================================================= */

type NavItem = {
  id: string;
  number: string;
  title: string;
};

type MobileScrollSpyProps = {
  items: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  headerOffset?: number;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MobileScrollSpy({
  items,
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
  headerOffset = 108,
}: MobileScrollSpyProps) {
  const isProgrammaticScroll = useRef(false);
  const programmaticTimeout = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  /* =======================================================
     INTERSECTION OBSERVER
  ======================================================= */

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
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (programmaticTimeout.current) {
        clearTimeout(programmaticTimeout.current);
      }
    };
  }, [items, headerOffset, onSectionChange]);

  /* =======================================================
     SCROLL TO SECTION
  ======================================================= */

  const scrollToSection = useCallback(
    (id: string) => {
      const element = document.getElementById(id);
      if (!element) return;

      onSectionChange(id);
      isProgrammaticScroll.current = true;

      if (programmaticTimeout.current) {
        clearTimeout(programmaticTimeout.current);
      }

      const elementTop =
        element.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementTop - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      programmaticTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
        onSectionChange(id);
      }, 900);

      onToggle();
    },
    [headerOffset, onSectionChange, onToggle]
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="sticky top-0 z-40 border-b border-[#e6d6b9] bg-[#faf7f2]/95 p-4 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-11 w-full items-center justify-between rounded-lg bg-[#063120] px-4 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(6,49,32,0.35)]"
      >
        <span className=" text-base font-bold">On This Page</span>
        <svg
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-4 right-4 top-[68px] overflow-hidden rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] p-2.5 shadow-[0_18px_44px_rgba(139,107,55,0.16)]">
          <div className="space-y-0.5">
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
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex w-full items-center gap-3.5 px-3 py-2.5 text-left transition-all duration-200 rounded-lg ${isActive
                        ? "bg-[#ecefde] text-[#063120]"
                        : "text-[#525f6f] hover:bg-[#f3f5e9]/70 hover:text-[#063120]"
                      }`}
                  >
                    <span
                      className={`w-6 shrink-0 text-sm tabular-nums ${isActive ? "text-[#063120] font-semibold" : "text-[#788492] font-medium"
                        }`}
                    >
                      {formattedNum}
                    </span>
                    <span
                      className={`text-sm ${isActive ? "text-[#063120] font-semibold" : "text-[#4d5b6b] font-medium"
                        }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {/* Bottom Right Zen Stones & Flower Visual */}
          <div className="pointer-events-none relative flex justify-end overflow-hidden rounded-b-xl pt-1">
            <Image
              src={onThisPageBottom}
              alt=""
              width={200}
              height={144}
              className="w-[140px] h-auto object-contain select-none -mb-1 -mr-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
