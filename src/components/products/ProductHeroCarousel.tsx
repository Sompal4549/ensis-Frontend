"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ProductHeroSlideContent, {
  type ProductHeroSlideData,
} from "./ProductHeroSlideContent";

export default function ProductHeroCarousel({
  slides,
}: {
  slides: ProductHeroSlideData[];
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
    <div className="relative min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none">
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <ProductHeroSlideContent
            slide={slides[activeIndex]}
            slideIndex={activeIndex}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
