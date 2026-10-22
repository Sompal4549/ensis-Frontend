"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  autoplayDelay?: number;
  slideClassName?: string;
  containerClassName?: string;
  stopOnMouseEnter?: boolean;
  showArrows?: boolean;
}

// 2 on mobile, 3 on tablet, 5 on desktop
const DEFAULT_SLIDE_CLASS =
  "min-w-0 shrink-0 grow-0 basis-1/2 sm:basis-1/3 lg:basis-1/5";

const DEFAULT_CONTAINER_CLASS = "flex gap-4 pr-4";

const YouMightCarousel: React.FC<CarouselProps> = ({
  children,
  autoplayDelay = 4000,
  slideClassName = DEFAULT_SLIDE_CLASS,
  containerClassName = DEFAULT_CONTAINER_CLASS,
  stopOnMouseEnter = false,
  showArrows = false,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: true,
        ...(stopOnMouseEnter ? { stopOnMouseEnter: true } : {}),
      }),
    ]
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative group">
      {/* Previous */}
      {showArrows && (
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
            bg-white border border-gray-200 shadow-md rounded-full p-2
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-gray-50 active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={containerClassName}>
          {children.map((child, index) => (
            <div
              key={index}
              className={`${slideClassName} ${
                index === children.length - 1 ? "pr-4" : ""
              }`}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Next */}
      {showArrows && (
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10
            bg-white border border-gray-200 shadow-md rounded-full p-2
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-gray-50 active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default YouMightCarousel;