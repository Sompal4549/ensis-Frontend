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
import lotus from "@/assets/about/lotus.png"
import LotusButton from '../button/LotusButton';
import { FaArrowRightLong } from 'react-icons/fa6';
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

  return (
    <section className="bg-[#f7f2ea] relative z-20">
      <Carousel autoplayDelay={6000}>
        {heroSlides.map((slide) => (
          <div
            key={slide.id || `${slide.title}-${slide.primaryBtn}`}
            className="relative pb-16 md:pb-16"
          >
            {/* Background Image - full on desktop, fixed height on mobile */}
            <div className="absolute inset-0 hidden md:block">
              {typeof slide.image === "string" && slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="" fill className="object-fill" />
              ) : (
                <Image src={slide.image} alt="" fill priority quality={95} className="object-fill" />
              )}
            </div>

            {/* Mobile image - shown above content */}
            <div className="relative w-full h-55 sm:h-65 md:hidden overflow-hidden">
              {typeof slide.image === "string" && slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="" fill className="object-fill object-left" />
              ) : (
                <Image src={slide.image} alt="" fill priority quality={95} className="object-fill object-left" />
              )}
            </div>

            {/* Decorative Light */}
            <div className="absolute left-0 top-0 h-70 w-70 bg-[#d8c19d]/20 blur-3xl hidden md:block" />

            {/* Content */}
            <Container className="relative z-10">
              <div className="flex md:min-h-[82dvh] md:max-h-[650px] md:items-center">

                <div
                  className={`max-w-175 pt-6 md:pt-10 w-full ${slide.isCenter && "flex flex-col items-center justify-center"}`}
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
                  }}
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
                    <Image src={arrow} alt='arrow' width={350} height={10} className="max-w-[220px] sm:max-w-[300px] md:max-w-[350px]" />
                  </div>

                  {/* Description */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[#313628]">
                    <span className='font-semibold'>{slide.description}</span>
                  </div>

                  {/* List desc */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-semibold text-[#313628]">
                    {((slide.listItems || slide.listdesc) as string[])?.map((item, i, arr) => (
                      <div key={item}>
                        <span key={item} className="nav-item">{item}</span>
                        {i < arr.length - 1 && (
                          <span key={`div-${i}`} className="nav-divider">|</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Icons */}
                  <div className="mt-4 md:mt-6 flex flex-wrap gap-5 overflow-x-auto no-scrollbar">
                    <div className="flex items-center self-stretch">
                      <>
                        <div className="flex flex-col items-center gap-1 md:gap-2 pr-3 md:pr-6">
                          <div
                            className="w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                            style={{ border: "2px solid #b89060" }}
                          >
                            <Image src={ayurvedic_wisdom} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Natural
                            </span>
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Wood
                            </span>
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
                            <Image src={premium_craftmanship} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Deep
                            </span>
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Detox
                            </span>
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
                            <Image src={durable} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Premium
                            </span>
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Quality
                            </span>
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
                            <Image src={wellness_focused} alt="deep detox" width={18} height={18} className="object-contain md:w-[28px] md:h-[28px]" />
                          </div>
                          <div className="flex flex-col items-center">
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Wellness
                            </span>
                            <span
                              className="text-[8px] md:text-[11px] font-bold tracking-widest uppercase text-center leading-tight"
                              style={{ color: "#4a3a28", fontFamily: "'Montserrat', sans-serif" }}
                            >
                              Focused
                            </span>
                          </div>
                        </div>
                      </>
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
