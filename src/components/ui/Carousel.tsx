"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface CarouselProps {
  children: React.ReactNode[];
  autoplayDelay?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ children, autoplayDelay = 5000 }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false }),
  ]);

  return (
    <div className="relative w-full">
      <div className="" ref={emblaRef}>
        <div className="flex">
          {children.map((child, index) => (
            <div className="min-w-0 shrink-0 grow-0 basis-full" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
