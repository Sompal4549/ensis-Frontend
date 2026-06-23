"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CarouselProps {
  children: React.ReactNode[];
  autoplayDelay?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ children, autoplayDelay = 5000 }) => {
  const autoplay = React.useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  const [emblaRef] = useEmblaCarousel(
    { loop: true, duration: 20 }, // ✅ slower duration = less reflow frequency
    [autoplay.current]
  );

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}> {/* ✅ overflow-hidden parent pe */}
      <div className="flex">
        {children.map((child, index) => (
          <div className="min-w-0 shrink-0 grow-0 basis-full" key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};