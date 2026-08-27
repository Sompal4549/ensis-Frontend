"use client";

import React, { useCallback, useEffect, useRef } from "react";

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

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top
          );

        if (visibleEntries.length > 0) {
          onSectionChange(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: `-${headerOffset}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
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
        className="flex h-10 w-full items-center justify-between rounded-lg bg-[#0f2518] px-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_2px_12px_rgba(15,37,24,0.35)]"
      >
        <span>On This Page</span>
        <svg
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
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
        <div className="absolute left-4 right-4 top-[68px] overflow-hidden rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] shadow-[0_18px_44px_rgba(139,107,55,0.16)]">
          {items.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`flex w-full items-center gap-3 border-b border-[#e6d6b9] px-4 py-4 text-left transition-all duration-300 last:border-0 ${
                  isActive
                    ? "bg-[#0f2518] text-white"
                    : "bg-[#fdfaf3] text-[#333333] hover:bg-[#f8f1e5]"
                }`}
              >
                <span
                  className={`font-semibold ${
                    isActive ? "text-[#d4af37]" : "text-[#c39a5c]"
                  }`}
                >
                  {item.number}
                </span>
                <span
                  className={`text-base font-medium ${
                    isActive ? "text-white" : "text-[#333333]"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
