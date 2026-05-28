"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  autoplayDelay?: number;
}

const YouMightCarousel: React.FC<CarouselProps> = ({
  children,
  autoplayDelay = 4000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative w-full group">
      {/* Prev button */}
      <button
        onClick={scrollPrev}
        className="absolute -left-10 top-1/2 -translate-y-1/2 -translate-x-3 z-10
          bg-white border border-gray-200 shadow-md rounded-full p-1.5
          opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-gray-50 active:scale-95"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {children.map((child, index) => (
            <div
              key={index}
              // Show 2 on mobile, 3 on sm, 5 on lg — mirrors the old grid
              className="min-w-0 shrink-0 grow-0
                basis-[calc(50%-6px)]
                sm:basis-[calc(33.333%-8px)]
                lg:basis-[calc(20%-10px)] h-[220px]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={scrollNext}
        className="absolute right-[-40px] top-1/2 -translate-y-1/2 translate-x-3 z-10
          bg-white border border-gray-200 shadow-md rounded-full p-1.5
          opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-gray-50 active:scale-95"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
export default YouMightCarousel;