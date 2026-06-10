import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  ArrowRight,
} from 'lucide-react';

import { Container } from '../ui/Container';
import { Carousel } from '../ui/Carousel';

import rooted from '@/assets/bg/bg3.webp';
import tradition from '@/assets/bg/bg4.webp';
import wellness_spaces from '@/assets/bg/bg2.webp';
import wooden_steam from '@/assets/bg/bg1.webp';
import arrow from "@/assets/icons/arrow.png"
import { Features } from './Features';
import { getComponentContent, getImageUrl } from '@/app/lib/api';
import premium_craftmanship from "@/assets/icons/premium_craftmanship.webp"
import ayurvedic_wisdom from "@/assets/icons/ayurvedic_wisdom.webp"
import durable from "@/assets/icons/durable.webp"
import wellness_focused from "@/assets/icons/wellness_focused.webp"
import GreenButton from '../ui/GreenButton';
import BookButton from '../ui/BookButton';


type HeroSlide = {
  id?: any;
  image: any;
  title: React.ReactNode;
  highlight?: string;
  description?: string;
  primaryBtn?: string;
  secondaryBtn?: string;
  showLutus?: boolean;
  listdesc?: string[];
  listItems?: string[];
  isCenter?: boolean;
  buttons?: React.ReactNode[];
  icons?: React.ReactNode[];
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  features?: { imgUrl?: string; title?: string }[];  // ← add karo
};

export const Hero = async () => {
  const fallbackSlides: HeroSlide[] = [
    {
      id: 1,
      image: rooted,
      title: (
        <>
          Rooted in Tradition
          <br />
          <span className="font-medium italic text-[#a9742a]">
            Crafted for Healing
          </span>
        </>
      ),
      description:
        'Authentic Panchakarma. Timeless wellness',
      primaryBtn: 'EXPLORE COLLECTION',
      secondaryBtn: 'BOOK CONSULTATION',
      showLutus: true,
      isCenter: false,
      listdesc: [],
      buttons: [
       <BookButton text="Explore Collections" />,
        <GreenButton text="Book Consultation"  path={'/contact'} />
      ],
    },

    {
      id: 2,
      image: wellness_spaces,
      isCenter: false,
      title: (
        <>
          Wellness Spaces
          <br />
          <span className="font-medium italic text-[#a9742a]">
            That Heal
          </span>
        </>
      ),
      showLutus: false,
      listdesc: ["Panchkarma Equipment", "Wellness Interiors", "Trunkey Solutions"],
      primaryBtn: 'VIEW PRODUCTS',
      secondaryBtn: 'START PROJECT',
       buttons: [
       <BookButton text="Explore Collections" />,
        <GreenButton text="Book Consultation"  path={'/contact'} />
      ],

    },
    {
      id: 3,
      image: wooden_steam,
      isCenter: true,
      title: (
        <>
          Wooden
          <br />
          <span className="font-medium italic text-[#a9742a]">
            Steam Bath
          </span>
        </>
      ),
      description:
        'Detoxify. Rejuvenate. Restore',
      primaryBtn: 'DISCOVER MORE',
      secondaryBtn: 'SCHEDULE DEMO',
      listdesc: [],
       buttons: [
       <BookButton text="Explore Collections" />,
        <GreenButton text="Book Consultation"  path={'/contact'} />
      ],
      showLutus: false,

    },
    {
      id: 4,
      image: tradition,
      title: (
        <>
          Tradition. Therapy.
          <br />
          <span className="font-medium italic text-[#a9742a]">
            Transformation
          </span>
        </>
      ),
      description:
        'Authentic Panchakarma. Timeless Healing',
      primaryBtn: 'DISCOVER MORE',
      secondaryBtn: 'SCHEDULE DEMO',
      listdesc: [],
      showLutus: false,

       buttons: [
       <BookButton text="Explore Collections" />,
        <GreenButton text="Book Consultation"  path={'/contact'} />
      ],
    }
  ];
  const content = await getComponentContent<{ slides: HeroSlide[] }>("home.hero", { slides: fallbackSlides });
  const heroSlides = content.slides?.length ? content.slides : fallbackSlides;
  console.log(content, "content")

  return (
    <section className="bg-[#f7f2ea] relative z-20 mb-12">
      <Carousel autoplayDelay={6000}>
        {heroSlides.map((slide) => (
          <div
            key={slide.id || `${slide.title}-${slide.primaryBtn}`}
            className="relative"
          >
            {/* Background Image - full on desktop, fixed height on mobile */}
            <div className="absolute inset-0 hidden md:block">
              {typeof slide.image === "string" && slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="" fill className="object-fill" crossOrigin="anonymous" sizes="100vw" />
              ) : (
                <Image src={slide.image} alt="" fill priority className="object-fill" crossOrigin="anonymous" sizes="100vw" />
              )}
            </div>

            {/* Mobile image - shown above content */}
            <div className="relative w-full h-55 sm:h-65 md:hidden overflow-hidden">
              {typeof slide.image === "string" && slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="" fill className="object-fill object-left" crossOrigin="anonymous" sizes="100vw" />
              ) : (
                <Image src={slide.image} alt="" fill priority className="object-fill object-left" crossOrigin="anonymous" sizes="100vw" />
              )}
            </div>

            {/* Decorative Light */}
            <div className="absolute left-0 top-0 h-70 w-70 bg-[#d8c19d]/20 blur-3xl hidden md:block" />

            {/* Content */}
            <Container className="relative z-10">
  <div className="flex md:h-[calc(100vh-96px)]">
  <div
    className={`max-w-175 w-full pt-8 md:pt-16 lg:pt-20 xl:pt-24 ${
      slide.isCenter && "flex flex-col items-center"
    }`}
  >
                  {/* Main Heading */}
                  <h1 className={`mt-4 md:mt-6 font-serif text-[28px] sm:text-[36px] leading-[0.96] tracking-[-0.02em] text-[#0e3d21] font-medium lg:text-[62px] ${slide.isCenter && "text-center"}`}>
                    {typeof slide.title === "string" ? (
                      <>
                        {slide.title}
                        {slide.highlight && (
                          <>
                            <br />
                            <span className="font-medium italic text-[#c07d19] mt-2">{slide.highlight}</span>
                          </>
                        )}
                      </>
                    ) : (
                      slide.title
                    )}
                  </h1>

                  {/* Divider */}
                  <div className={`flex w-full py-2 ${slide.isCenter && "flex flex-col items-center justify-center"}`}>
                    <Image src={arrow} alt='arrow' width={350} height={10} className="max-w-[220px] sm:max-w-[300px] md:max-w-[350px]" crossOrigin="anonymous" />
                  </div>

                  {/* Description */}
                  {slide.description && (
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[#313628]">
                      <span className='font-semibold' dangerouslySetInnerHTML={{ __html: slide.description }}></span>
                    </div>
                  )}

                  {/* List desc */}
               <div className="flex flex-wrap items-center text-[12px] font-semibold text-[#313628]">
  {((slide.listItems || slide.listdesc) as string[])?.map((item, i, arr) => (
    <React.Fragment key={item}>
      <span className="nav-item">{item}</span>
      {i < arr.length - 1 && (
        <span className="nav-divider mx-2">|</span>
      )}
    </React.Fragment>
  ))}
</div>

                  {/* Icons / Features */}
                  <div className="mt-4 md:mt-6 flex flex-wrap gap-5 overflow-x-auto no-scrollbar">
                    <div className="flex items-center self-stretch">
                      {slide.features && Array.isArray(slide.features) && slide.features.length > 0 && slide.features[0]?.title ? (
                        /* Dynamic features from admin API */
                        slide.features.map((feat: { imgUrl?: string; title?: string }, fi: number) => (
                          <React.Fragment key={fi}>
                            <div className="flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6 first:pl-0 first:pr-3 first:md:pr-6">
                              <div
                                className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                                style={{ border: "2px solid #b89060" }}
                              >
                                {feat.imgUrl ? (
                                  <Image src={getImageUrl(feat.imgUrl)} alt={feat.title || ""} width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous" />
                                ) : (
                                  <Image src={ayurvedic_wisdom} alt={feat.title || ""} width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous" />
                                )}
                              </div>
                              <div className="flex flex-col items-center">
                                {(feat.title || "").split(" ").map((word: string, wi: number) => (
                                  <span
                                    key={wi}
                                    className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                                    style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                                  >
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {fi < slide.features!.length - 1 && (
                              <div className="w-px h-full flex-shrink-0 opacity-40" style={{ background: "#c8a97a" }} />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        /* Hardcoded fallback icons */
                        <>
                          <>
                            <div className="flex flex-col items-center gap-1 md:gap-2 pr-3 md:pr-6">
                              <div
                                className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                                style={{ border: "2px solid #b89060" }}
                              >
                                <Image src={ayurvedic_wisdom} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous" />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Natural</span>
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Wood</span>
                              </div>
                            </div>
                            <div className="w-px h-full flex-shrink-0 opacity-40" style={{ background: "#c8a97a" }} />
                          </>
                          <>
                            <div className="flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6">
                              <div
                                className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                                style={{ border: "2px solid #b89060" }}
                              >
                                <Image src={premium_craftmanship} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous"/>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Deep</span>
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Detox</span>
                              </div>
                            </div>
                            <div className="w-px h-full flex-shrink-0 opacity-40" style={{ background: "#c8a97a" }} />
                          </>
                          <>
                            <div className="flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6">
                              <div
                                className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                                style={{ border: "2px solid #b89060" }}
                              >
                                <Image src={durable} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous" />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Premium</span>
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Quality</span>
                              </div>
                            </div>
                            <div className="w-px h-full flex-shrink-0 opacity-40" style={{ background: "#c8a97a" }} />
                          </>
                          <>
                            <div className="flex flex-col items-center gap-1 md:gap-2 px-3 md:px-6">
                              <div
                                className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                                style={{ border: "2px solid #b89060" }}
                              >
                                <Image src={wellness_focused} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" crossOrigin="anonymous"/>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Wellness</span>
                                <span className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight" style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}>Focused</span>
                              </div>
                            </div>
                          </>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 md:mt-6 flex flex-wrap gap-3 md:gap-5">
                    {slide.buttons && slide.buttons.length > 0 ? (
                      slide.buttons.map((button, index) => <div key={index}>{button}</div>)
                    ) : (
                      <>
                        {(slide.primaryButtonText || slide.primaryBtn) && (
                          <BookButton
                            text={slide.primaryButtonText || slide.primaryBtn}
                            path={slide.primaryButtonHref || '/contact'}
                          />
                        )}
                        {(slide.secondaryButtonText || slide.secondaryBtn) && (
                          <GreenButton
                            text={slide.secondaryButtonText || slide.secondaryBtn}
                            path={slide.secondaryButtonHref || '/contact'}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            </Container>
          </div>
        ))}
      </Carousel>
      <Features />
    </section>
  );
};
