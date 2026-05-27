
"use client";

import Image, { type StaticImageData } from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { Container } from "../ui/Container";

const spaceLabels = [
  "Ayurveda Hospital",
  "Wellness Resort",
  "Spa Center",
  "Panchkarma Clinic",
];

type Props = {
  images: (string | StaticImageData)[];
  title?: string;
};

export default function RealSpacesCarousel({
  images,
  title,
}: Props) {
  const labeled = images.map((src, i) => ({
    src,
    label: spaceLabels[i % spaceLabels.length],
  }));

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section className="bg-[#1e2b1a] py-2">
      <Container>
        {/* Header */}
        <div className="mb-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#b8922f] mb-2">
            See it in Real Spaces
          </p>

          <h2 className="font-serif text-xl md:text-2xl text-white">
            {title || "Perfect for Every Wellness Environment"}
          </h2>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="
              hidden lg:flex
              absolute
              left-[-20px]
              top-1/2
              -translate-y-1/2
              z-20
              w-10
              h-10
              rounded-full
              bg-white
              items-center
              justify-center
              shadow-lg
              hover:scale-105
              transition-all
            "
          >
            <ChevronLeft size={18} className="text-black" />
          </button>

          {/* Embla */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-3">
              {labeled.map(({ src, label }, i) => (
                <div
                  key={i}
                  className="
                    flex-[0_0_90%]
                    sm:flex-[0_0_48%]
                    lg:flex-[0_0_25%]
                    min-w-0
                    pl-3
                  "
                >
                  <div className="relative overflow-hidden rounded-xl group">
                    <Image
                      src={src}
                      alt={label}
                      width={600}
                      height={400}
                      className="
                        h-[180px]
                        md:h-[200px]
                        lg:h-[220px]
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-105
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-medium">
                        {label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="
              hidden lg:flex
              absolute
              right-[-20px]
              top-1/2
              -translate-y-1/2
              z-20
              w-10
              h-10
              rounded-full
              bg-white
              items-center
              justify-center
              shadow-lg
              hover:scale-105
              transition-all
            "
          >
            <ChevronRight size={18} className="text-black" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden justify-center gap-3 mt-6">
          <button
            onClick={scrollPrev}
            className="
              w-10
              h-10
              rounded-full
              border
              border-white/20
              flex
              items-center
              justify-center
              text-white
            "
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={scrollNext}
            className="
              w-10
              h-10
              rounded-full
              border
              border-white/20
              flex
              items-center
              justify-center
              text-white
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
}
