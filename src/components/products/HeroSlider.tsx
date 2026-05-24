"use client";

import { Carousel } from "../ui/Carousel";
import rooted from '@/assets/bg/bg3.webp';
import tradition from '@/assets/bg/bg4.webp';
import wellness_spaces from '@/assets/bg/bg2.webp';
import wooden_steam from '@/assets/bg/bg1.webp';
import Image from "next/image";
import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
// ─── Slide data ───────────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    badge: "Panchkarma Collection",
    title: "Our Wellness",
    titleHighlight: "Product",
    description:
      "Explore our curated range of authentic Ayurvedic wellness products crafted for luxury spas, wellness centers and healing environments.",
    cta1: "Explore Collection",
    cta2: "Book Consultation",
    image:rooted,
    accent: "#c8a45d",
  },
  {
    id: 2,
    badge: "Dhara Therapy",
    title: "Shirodhara",
    titleHighlight: "Drip Tables",
    description:
      "Handcrafted teak & brass Shirodhara stands with precision-flow vessels — the centrepiece of any authentic Ayurvedic retreat.",
    cta1: "View Dhara Range",
    cta2: "Request Quote",
    image:wellness_spaces,
    accent: "#b87333",
  },
  {
    id: 3,
    badge: "Steam & Sauna",
    title: "Herbal Steam",
    titleHighlight: "Cabinets",
    description:
      "Single-herb and blended medicated steam cabinets engineered for therapeutic efficacy — from compact clinics to grand spa suites.",
    cta1: "Shop Steam Cabinets",
    cta2: "Book Consultation",
    image:tradition,
        accent: "#c8a45d",
  },
  {
    id: 4,
    badge: "Massage Tables",
    title: "Abhyanga",
    titleHighlight: "Treatment Tables",
    description:
      "Solid hardwood Abhyanga tables with carved oil channels, adjustable height and premium upholstery — built for decades of daily practice.",
    cta1: "Explore Tables",
    cta2: "Book Consultation",
    image:wooden_steam,
    accent: "#c8a45d",
  },
];

// ─── Individual slide ─────────────────────────────────────────────────────────
function SlideContent({ slide }: { slide: (typeof slides)[0] }) {
  return (
    <div className="ws-banner ws-grain relative h-[82dvh] w-full overflow-hidden bg-[#f5efe6]">
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.image}
          alt={slide.titleHighlight}
          fill
          className="object-cover md:object-fill object-center"
          loading="eager"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">
        <Container className=" flex h-full w-full items-center">
          
          {/* Text content */}
          <div className="max-w-[680px]">
            
            {/* Heading */}
            <h1 className="ws-title mb-3 text-[2.3rem] font-[500] leading-[1.04] text-[#1a1a1a] sm:mb-4 sm:text-[3rem] md:text-[3.5rem] lg:text-[3.9rem]">
              {slide.title}
              <br />

              <em
                className="not-italic font-medium"
                style={{ color: slide.accent }}
              >
                {slide.titleHighlight}
              </em>
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-[400px] text-[13px] font-semibold leading-relaxed text-[#5a5040] sm:mb-8 sm:text-[14px] md:text-[15px]">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <BookButton text={slide.cta1} />
              <GreenButton text={slide.cta2} />
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HeroSlider() {
  return (
    <>
      <section
        aria-label="Wellness product collection"
        className="relative w-full h-[82dvh]"
      >
        <Carousel autoplayDelay={5000}>
          {slides.map((slide) => (
            <SlideContent key={slide.id} slide={slide} />
          ))}
        </Carousel>
      </section>
    </>
  );
}