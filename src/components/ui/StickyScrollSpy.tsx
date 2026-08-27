"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

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

export default function StickyScrollSpy({
  items,
  activeSection,
  onSectionChange,
  headerOffset = 108,
  sidebarTitle = "ON THIS PAGE",
  className = "",
}: StickyScrollSpyProps) {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const isProgrammaticScroll = useRef(false);
  const programmaticTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sectionElements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) onSectionChange(visible[0].target.id);
      },
      { root: null, rootMargin: `-${headerOffset}px 0px -55% 0px`, threshold: [0, 0.1, 0.25, 0.5] }
    );
    sectionElements.forEach((el) => observer.observe(el));

    let ticking = false;
    const onScroll = () => {
      if (isProgrammaticScroll.current || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const pos = window.scrollY + headerOffset + 20;
        let cur = items[0].id;
        sectionElements.forEach((el) => { if (el.offsetTop <= pos) cur = el.id; });
        onSectionChange(cur);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); if (programmaticTimeout.current) clearTimeout(programmaticTimeout.current); };
  }, [items, headerOffset, onSectionChange]);

  const updateIndicator = useCallback(() => {
    const el = itemRefs.current.get(activeSection);
    if (!el || !navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setIndicatorStyle({ top: itemRect.top - navRect.top, height: itemRect.height });
  }, [activeSection]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

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
    <aside className={`hidden lg:block ${className}`}>
      <div
        className="sticky rounded-xl border border-[#e6d6b9] bg-[#fdfaf3]"
        style={{ top: `${headerOffset}px` }}
      >
        <div className="px-4 py-3">
          <h3 className="font-['Playfair_Display',serif] text-[15px] font-semibold uppercase tracking-wide text-[#1f261b]">
            {sidebarTitle}
          </h3>
        </div>
        <nav
          ref={navRef}
          className="relative border-l-[3px] border-transparent"
        >
          <span
            className="pointer-events-none absolute left-0 top-0 rounded-full bg-[#c39a5c] shadow-[0_0_8px_2px_rgba(195,154,92,0.4)]"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
              width: "3px",
              transition: "top 400ms cubic-bezier(0.22,1,0.36,1), height 400ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          {items.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => { if (el) itemRefs.current.set(item.id, el); }}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? "true" : undefined}
                style={isActive ? { boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" } : undefined}
                className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-[#0f2518] text-white"
                    : "text-[#333333] hover:bg-[#f8f1e5]"
                }`}
              >
                <span className={`text-sm font-semibold ${isActive ? "text-[#d4af37]" : "text-[#333333]"}`}>
                  {item.number}
                </span>
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}