import React from 'react';
import rooted from '@/assets/bg/bg3.webp';
import tradition from '@/assets/bg/bg4.webp';
import wellness_spaces from '@/assets/bg/bg2.webp';
import wooden_steam from '@/assets/bg/bg1.webp';
import { Features } from './Features';
import GreenButton from '../ui/GreenButton';
import BookButton from '../ui/BookButton';
import HeroCarousel from './HeroCarousel';
import type { HeroSlide } from './HeroSlideContent';

export const Hero = async (data: { slides: HeroSlide[] }) => {
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
        <GreenButton text="Book Consultation" path={'/contact'} />
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
        <GreenButton text="Book Consultation" path={'/contact'} />
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
        <GreenButton text="Book Consultation" path={'/contact'} />
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
        <GreenButton text="Book Consultation" path={'/contact'} />
      ],
    }
  ];
  const content = data || fallbackSlides;
  const heroSlides = content.slides?.length ? content.slides : fallbackSlides;

  return (
    <section className="bg-[#f7f2ea] relative z-20 lg:mb-12">
      <HeroCarousel slides={heroSlides} />
      <Features />
    </section>
  );
};
