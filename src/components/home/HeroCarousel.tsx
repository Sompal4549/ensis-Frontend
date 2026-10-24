"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroSlideContent, { type HeroSlide } from "./HeroSlideContent";
import { API_URL } from "@/lib/api/api";
import { nextScheduleBoundary, visibleHeroSlides } from "@/lib/heroSchedule";

// setTimeout stores its delay in a signed 32-bit int; longer waits are chopped and re-checked
const MAX_TIMER_MS = 2_000_000_000;
// A visitor's own clock is only trusted when it agrees with the server within this window;
// otherwise the server's clock (sent with the page) wins, so a wrong device date cannot show a wrong slide
const CLOCK_TRUST_MS = 60_000;
// How often an open page re-reads the hero from the CMS, so slides added or rescheduled in the admin show up
// without a refresh. Only while the tab is visible; jitter keeps visitors from hitting the API together.
const POLL_BASE_MS = 30_000;
const POLL_JITTER_MS = 10_000;

/** Current hero slides from the CMS, or null when the request failed / nothing is saved (keep what we have) */
async function fetchSlides(): Promise<HeroSlide[] | null> {
  try {
    const res = await fetch(`${API_URL}/component-content/home.hero`, { cache: "no-store" });
    if (!res.ok) return null;
    const record = (await res.json())?.data as { isActive?: boolean; data?: { slides?: unknown } } | undefined;
    if (!record || record.isActive === false) return null;
    return Array.isArray(record.data?.slides) ? (record.data.slides as HeroSlide[]) : null;
  } catch {
    return null;
  }
}

const sameSlides = (a: HeroSlide[], b: HeroSlide[]) => a.length === b.length && a.every((slide, i) => slide === b[i]);

/**
 * The home hero. Slides without a schedule are the normal hero. A slide with a schedule (admin: slide > Schedule)
 * shows only inside its window and, while live, replaces the normal slides; when its time is over the normal slides
 * return. The switch happens at the exact start/end moment while the page stays open (no reload, no polling for
 * the switch itself), and the CMS is re-read periodically so admin changes reach an already open page.
 */
export default function HeroCarousel({
  slides,
  fallbackSlides = [],
  serverNow,
}: {
  /** Hero slides saved in the CMS (normal and scheduled) */
  slides: HeroSlide[];
  /** Built-in slides, shown when the CMS has nothing to show right now */
  fallbackSlides?: HeroSlide[];
  /** Server clock (epoch ms) at render time */
  serverNow: number;
}) {
  const [items, setItems] = useState<HeroSlide[]>(slides);
  // First render uses the server's clock, so it matches the server HTML exactly (no flash, no hydration mismatch)
  const [visible, setVisible] = useState<HeroSlide[]>(() => visibleHeroSlides(slides, serverNow));
  const [activeIndex, setActiveIndex] = useState(0);
  const skewRef = useRef(0);

  const shown = visible.length > 0 ? visible : fallbackSlides;

  // Flip between normal and scheduled slides at the exact start/end moments
  useEffect(() => {
    const offset = serverNow - Date.now();
    skewRef.current = Math.abs(offset) > CLOCK_TRUST_MS ? offset : 0;
    const now = () => Date.now() + skewRef.current;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const apply = () => {
      const current = now();
      const next = visibleHeroSlides(items, current);
      // keep the same state when nothing changed, so the carousel does not restart
      setVisible((prev) => {
        if (sameSlides(prev, next)) return prev;
        setActiveIndex(0);
        return next;
      });
      if (timer) clearTimeout(timer);
      const boundary = nextScheduleBoundary(items, current);
      if (boundary !== null) timer = setTimeout(apply, Math.min(Math.max(boundary - current, 0), MAX_TIMER_MS));
    };

    apply();

    // Background tabs throttle timers: re-check the moment the visitor is back
    const onVisible = () => {
      if (document.visibilityState === "visible") apply();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", apply);
    window.addEventListener("pageshow", apply);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", apply);
      window.removeEventListener("pageshow", apply);
    };
  }, [items, serverNow]);

  // Keep the slides fresh while the page stays open
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const delay = () => POLL_BASE_MS + Math.random() * POLL_JITTER_MS;
    const poll = async () => {
      if (document.visibilityState === "visible") {
        const next = await fetchSlides();
        if (!stopped && next) setItems((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      }
      if (!stopped) timer = setTimeout(poll, delay());
    };
    timer = setTimeout(poll, delay());
    // Back on the tab after a while: check right away instead of waiting for the next tick
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (timer) clearTimeout(timer);
      void poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    if (shown.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % shown.length);
    }, 5000);
    return () => clearInterval(id);
  }, [shown.length]);

  if (!shown.length) return null;

  const index = activeIndex % shown.length;

  return (
    <div className="relative overflow-hidden min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none">
      <AnimatePresence>
        <motion.div
          key={`${index}-${String(shown[index].id ?? "")}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <HeroSlideContent
            slide={shown[index]}
            slideIndex={index}
            isActive
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
