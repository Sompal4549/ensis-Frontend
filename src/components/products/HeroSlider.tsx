"use client";

import { Carousel } from "../ui/Carousel";
import { StaticImageData } from "next/image";

import Image from "next/image";
import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

interface HeroSliderButton {
  label: string;
  url: string;
}

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryButton: HeroSliderButton;
  secondaryButton: HeroSliderButton;
  bgImage: string | StaticImageData;
  accent: string;
}

export interface HeroSliderContent {
  slides: HeroSlide[];
}

// ─── Individual slide ─────────────────────────────────────────────────────────
function SlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <div className="ws-banner ws-grain relative h-[82dvh] w-full overflow-hidden bg-[#f5efe6]">
      
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.bgImage}
          alt={slide.highlight || ""}
          fill
          className="object-cover md:object-fill object-center"
          loading="eager"
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">
        <Container className=" flex h-full w-full items-center">
          
          {/* Text content */}
          <div className="max-w-[680px] bg-white/20">
            
            {/* Heading */}
            <h1 className="ws-title mb-3 text-[2.3rem] font-[500] leading-[1.04] text-[#1a1a1a] sm:mb-4 sm:text-[3rem] md:text-[3.5rem] lg:text-[3.9rem]">
              {slide.title}
              <br />

              <em
                className="not-italic font-medium"
                style={{ color: '#b87333' }}
              >
                {slide.highlight}
              </em>
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-[400px] text-[13px] font-semibold leading-relaxed text-[#5a5040] sm:mb-8 sm:text-[14px] md:text-[15px]">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <BookButton text={slide.primaryButton.label} path={slide.primaryButton.url} />
              <GreenButton text={slide.secondaryButton.label} path={slide.secondaryButton.url} />
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function HeroSlider({ sectionContent }: { sectionContent: HeroSliderContent }) { // Added explicit type
  return (
    <>
      <section
        aria-label="Wellness product collection"
        className="relative w-full h-[82dvh]"
      >
        <Carousel autoplayDelay={5000}>
          {sectionContent.slides.map((slide) => (
            <SlideContent key={slide.id} slide={slide} />
          ))}
        </Carousel>
      </section>
    </>
  );
}