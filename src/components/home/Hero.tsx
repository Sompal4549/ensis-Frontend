import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  ArrowRight,
} from 'lucide-react';

import { Container } from '../ui/Container';
import { Carousel } from '../ui/Carousel';

import rooted from '@/assets/home/rooted_tradition_3.webp';
import tradition from '@/assets/bg/bg4.webp';
import wellness_spaces from '@/assets/bg/bg2.webp';
import wooden_steam from '@/assets/home/wooden.webp';
import arrow from "@/assets/icons/arrow.png"
import { Features } from './Features';
import { getComponentContent, getImageUrl } from '@/app/lib/api';
import lotus from "@/assets/about/lotus.png"
import LotusButton from '../button/LotusButton';


type HeroSlide = {
  id?: number;
  image: any;
  title: React.ReactNode;
  highlight?: string;
  description: string;
  primaryBtn: string;
  secondaryBtn?: string;
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
    },

    {
      id: 2,
      image: wellness_spaces,
      title: (
        <>
          Wellness Spaces
          <br />
          <span className="font-medium italic text-[#a9742a]">
            That Heal
          </span>
        </>
      ),
      description:
        'Authentic Panchakarma. Timeless Healing',
      primaryBtn: 'VIEW PRODUCTS',
      secondaryBtn: 'START PROJECT',
    },
    {
      id: 3,
      image: wooden_steam,
      title: (
        <>
          Wooden Steam
          <br />
          <span className="font-medium italic text-[#a9742a]">
            Bath
          </span>
        </>
      ),
      description:
        'Authentic Panchakarma. Timeless Healing',
      primaryBtn: 'DISCOVER MORE',
      secondaryBtn: 'SCHEDULE DEMO',
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
            className="relative pb-16"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {typeof slide.image === "string" && slide.image ? (
                <Image src={getImageUrl(slide.image)} alt="" fill className="object-cover" />
              ) : (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority
                  quality={95}
                  className="object-cover"
                />
              )}
            </div>

            {/* Soft Overlay */}

            {/* Decorative Light */}
            <div className="absolute left-0 top-0 h-[280px] w-[280px] bg-[#d8c19d]/20 blur-3xl" />

            {/* Content */}
            <Container className="relative z-10">
              <div className="flex min-h-[82dvh] max-h-[650px] items-center">

<div
  className="max-w-[700px] pt-10"
  style={{
    background: "linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
  }}
>
                  {/* Main Heading */}
                  <h1 className="mt-6 font-serif text-[40px] leading-[0.96] tracking-[-0.03em] text-[#0e3d21] font-semibold lg:text-[52px] ">
                    {typeof slide.title === "string" ? (
                      <>
                        {slide.title}
                        {slide.highlight && (
                          <>
                            <br />
                            <span className="font-semibold italic text-[#c07d19]">{slide.highlight}</span>
                          </>
                        )}
                      </>
                    ) : (
                      slide.title
                    )}
                  </h1>

                  {/* Divider */}
                  <div className="flex w-full py-2">
                    <Image src={arrow} alt='arrow' width={350} height={10} />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold tracking-[0.16em] text-[#313628]">
                    <span className='font-semibold'>PANCHKARMA EQUIPMENT</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-5">
                    <LotusButton text={slide.primaryBtn} href={slide.primaryBtn} />
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
