"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import HeroSlideContent, { type HeroSlide } from "./HeroSlideContent";

export default function HeroCarousel({
  slides,
}: {
  slides: HeroSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative overflow-hidden h-[560px] md:h-[calc(100vh-146px)]">
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <HeroSlideContent
            slide={slides[activeIndex]}
            slideIndex={activeIndex}
            isActive
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}