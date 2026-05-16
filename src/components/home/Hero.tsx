import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import { Carousel } from '../ui/Carousel';
import img8 from '@/assets/home/img-8.webp';
import img2 from '@/assets/home/img-2.webp';

import Image from 'next/image';

export const Hero = () => {
  const slides = [
    (
      <div className="relative min-h-[420px] overflow-hidden md:min-h-[520px]" key="1">
        <Image src={img8} alt="Hero Background 1" fill priority style={{ objectFit: 'cover' }} quality={90} />
        <div
  className="absolute inset-0 pointer-events-none backdrop-blur-[1px]"
  style={{
    background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 24%,
        rgba(250,247,242,0.70) 42%,
        rgba(250,247,242,0.28) 58%,
        rgba(250,247,242,0.00) 100%
      )
    `,
    clipPath: "polygon(0 0, 64% 0, 50% 100%, 0 100%)",
  }}
/>
        <Container className="relative z-10 flex min-h-[420px] items-center md:min-h-[520px]">
          <div className="max-w-[650px] py-16">
            <h1 className="font-serif text-[42px] leading-[1.05] text-[#171813] md:text-[68px]">Crafting Premium<br /><span className='text-[#525a2f]'>Panchkarma &<br />Wellness</span> Spaces</h1>
            <p className="mt-6 max-w-[430px] text-sm leading-7 text-[#1f261b] md:text-base">
              Manufacturers of Ayurvedic, Spa & Wellness Equipment for Clinics, Resorts, Hospitals & Global Wellness Centers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-[#3c4827] px-7 py-4 text-[11px] font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-[#263016]">EXPLORE PRODUCTS</button>
              <button className="border border-[#b7ab99] bg-white/80 px-7 py-4 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-white">REQUEST CATALOGUE</button>
              <button className="inline-flex items-center gap-2 border border-[#b7ab99] bg-white px-7 py-4 text-[11px] font-bold tracking-wide text-[#31512f] transition-colors hover:bg-[#f7f2e9]">
                <MessageCircle size={16} /> WHATSAPP CONSULTATION
              </button>
            </div>
          </div>
        </Container>
      </div>
    ),
    (
      <div className="relative min-h-[420px] overflow-hidden md:min-h-[520px]" key="2">
        <Image src={img2} alt="Hero Background 2" fill style={{ objectFit: 'cover' }} quality={90} />
      <div
  className="absolute inset-0 pointer-events-none backdrop-blur-[1px]"
  style={{
    background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 24%,
        rgba(250,247,242,0.70) 42%,
        rgba(250,247,242,0.28) 58%,
        rgba(250,247,242,0.00) 100%
      )
    `,
    clipPath: "polygon(0 0, 64% 0, 50% 100%, 0 100%)",
  }}
/>
        <Container className="relative z-10 flex min-h-[420px] items-center md:min-h-[520px]">
          <div className="max-w-[620px] py-16">
            <h1 className="font-serif text-[42px] leading-[1.05] text-[#171813] md:text-[68px]">Elevate Your<br />Spa Experience</h1>
            <p className="mt-6 max-w-[430px] text-sm  leading-7 text-[#1f261b] md:text-base">
              Discover our range of handcrafted, authentic massage tables and steam chambers for ultimate relaxation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-[#3c4827] px-7 py-4 text-[11px] font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-[#263016]">VIEW COLLECTION</button>
            </div>
          </div>
        </Container>
      </div>
    )
  ];

  return (
    <section className="bg-[#faf7f2]">
      <Carousel autoplayDelay={6000}>
        {slides}
      </Carousel>
    </section>
  );
};
