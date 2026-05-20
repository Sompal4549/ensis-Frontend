import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  ArrowRight,
} from 'lucide-react';

import { Container } from '../ui/Container';
import { Carousel } from '../ui/Carousel';

import rooted from '@/assets/home/rooted_tradition_3.webp';
import tradition from '@/assets/home/tradition3.webp';
import wellness_spaces from '@/assets/home/wellness_spaces2.webp';
import wooden_steam from '@/assets/home/wooden.webp';
import arrow from "@/assets/icons/arrow.png"
import { Features } from './Features';


export const Hero = () => {
  const heroSlides = [
    {
      id: 1,
      image: rooted,
      title: (
        <>
          Rooted in Tradition
          <br />
          <span className="font-light italic text-[#c79b59]">
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
          <span className="font-light italic text-[#c79b59]">
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
          <span className="font-light italic text-[#c79b59]">
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
          <span className="font-light italic text-[#c79b59]">
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

  return (
    <section className="bg-[#f7f2ea] relative z-20 mb-16">
      <Carousel autoplayDelay={6000}>
        {heroSlides.map((slide) => (
          <div
            key={slide.id}
            className="relative pb-16"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                quality={95}
                className="object-cover"
              />
            </div>

            {/* Soft Overlay */}

            {/* Decorative Light */}
            <div className="absolute left-0 top-0 h-[280px] w-[280px] bg-[#d8c19d]/20 blur-3xl" />

            {/* Content */}
            <Container className="relative z-10">
              <div className="flex min-h-[450px] items-center">

                <div className="max-w-[700px] pt-10 sm:pl-10 lg:pl-15">
                  {/* Main Heading */}
                  <h1 className="mt-6 font-serif text-[40px] leading-[0.96] tracking-[-0.03em] text-[#1f261b] lg:text-[52px]">
                    {slide.title}
                  </h1>

                  {/* Divider */}
                  <div className="flex w-full py-4">
                    <Image src={arrow} alt='arrow' width={300} height={10} />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold tracking-[0.16em] text-[#313628]">
                    <span className='font-semibold'>PANCHKARMA EQUIPMENT</span>
                  </div>

                  {/* Description */}
                  {/* <p className="mt-7 max-w-[560px] text-[15px] leading-8 text-[#4f5449]">
                    {slide.description}
                  </p> */}

                  {/* CTA Buttons */}
                  <div className="mt-6 flex flex-wrap gap-5">

                    <Link
                      href="/products"
                      className="inline-flex h-[58px] items-center justify-center gap-3 rounded-[2px] bg-[#2f4420] px-8 text-[12px] font-semibold tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#1f2d14] rounded-md"
                    >
                      <span className='text-white'>
                        {slide.primaryBtn}
                      </span>
                      <ArrowRight size={17} className='text-white' />
                    </Link>

                    {/* <Link
                      href="/contact"
                      className="inline-flex h-[58px] items-center justify-center border border-[#ceb489] bg-white/60 px-8 text-[12px] font-semibold tracking-[0.16em] text-[#9e7740] backdrop-blur-sm transition-all duration-300 hover:bg-white rounded-md"
                    >
                      {slide.secondaryBtn}
                    </Link> */}

                  </div>

                  {/* Features */}
                  {/* <div className="mt-6 flex flex-wrap gap-y-6 border-t border-[#dccfbf] pt-7">

                    <div className="flex items-center gap-3 pr-8">
                      <Leaf
                        size={24}
                        className="text-[#b89157]"
                      />

                      <div>
                        <p className="text-[13px] font-semibold tracking-[0.08em] text-[#27311f]">
                          AYURVEDA
                        </p>

                        <p className="text-[13px] text-[#4d5247]">
                          Expertise
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-l border-[#d8cab7] px-8">
                      <ShieldCheck
                        size={24}
                        className="text-[#b89157]"
                      />

                      <div>
                        <p className="text-[13px] font-semibold tracking-[0.08em] text-[#27311f]">
                          PREMIUM
                        </p>

                        <p className="text-[13px] text-[#4d5247]">
                          Quality
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-l border-[#d8cab7] px-8">
                      <Wrench
                        size={24}
                        className="text-[#b89157]"
                      />

                      <div>
                        <p className="text-[13px] font-semibold tracking-[0.08em] text-[#27311f]">
                          CUSTOM
                        </p>

                        <p className="text-[13px] text-[#4d5247]">
                          Solutions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-l border-[#d8cab7] pl-8">
                      <Globe
                        size={24}
                        className="text-[#b89157]"
                      />

                      <div>
                        <p className="text-[13px] font-semibold tracking-[0.08em] text-[#27311f]">
                          PAN INDIA
                        </p>

                        <p className="text-[13px] text-[#4d5247]">
                          Installation
                        </p>
                      </div>
                    </div>

                  </div> */}

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