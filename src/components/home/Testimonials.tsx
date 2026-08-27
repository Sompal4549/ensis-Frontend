'use client';

import React from 'react';
import { Container } from '../ui/Container';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import quote from '@/assets/icons/quote.webp';
import userImage from "@/assets/home/testimonial1.webp";
import SubHeading from './SubHeading';
import { FaStar } from 'react-icons/fa';

const defaultContent = {
  title: "WHAT OUR CLIENTS SAY",
  testimonials: [
    { text: "Ensis has delivered exceptional quality Panchkarma equipment for our center. Their customization and support are outstanding.", name: "Dr. Anand Sharma", role: "Ayurveda Physician", image: "" },
    { text: "The spa setup by Ensis has elevated our resort's wellness experience to a whole new level.", name: "Neha Malhotra", role: "Wellness Resort Owner", image: "" },
    { text: "Excellent workmanship, premium finishing and on-time delivery. Highly recommended!", name: "Arjun Menon", role: "Spa Consultant", image: "" },
    { text: "Their steam chambers and massage tables are of outstanding quality. Our clients love them.", name: "Priya Nair", role: "Wellness Center Director", image: "" },
  ],
};

export interface Testimonial {
  title: string;
  testimonials: {
    text?: string;
    description?: string;
    name: string;
    role?: string;
    designation?: string;
    image?: any;
    userImage?: string;
    rating?: number;
  }[];
}

export interface TestimonialsProps {
  sectionContent: Testimonial;
}

// ✅ autoplay config component ke bahar — har render pe naya object nahi banega
const autoplayConfig = { delay: 3500, disableOnInteraction: false };
const breakpointsConfig = {
  0: { slidesPerView: 1 },
  768: { slidesPerView: 2 },
  1280: { slidesPerView: 4 },
};

export const Testimonials = ({ sectionContent }: TestimonialsProps) => {
  const content = sectionContent || defaultContent;
  return (
    <section className="bg-[#fbf8f2]">
      <Container>
        <SubHeading className='text-black' text={content.title} />
        <div className="mt-2">
        <Swiper
  modules={[Autoplay]}
  spaceBetween={16}
  loop={true}
  autoplay={autoplayConfig}
  breakpoints={breakpointsConfig}
  className="testimonial-swiper"
  watchSlidesProgress={false}
  preventInteractionOnTransition={true}
>
            {content.testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="h-full border border-[#e1d7c9] bg-white p-3 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative">
                  <Image height={28} width={28} alt="quote" src={quote} />
                  <p className="mb-2 text-base font-medium pl-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.text || item.description || "" }} />
                  <div className='flex text-orange-400 items-center gap-4 my-2 pl-6'>
                    {[...Array(Math.round(item.rating ?? 5))].map((_, i) => <FaStar key={i} />)}
                  </div>
                  <div className="flex items-center gap-4">
                    {/* ✅ backgroundImage se Image component pe switch karo */}
                    <div className="size-11 rounded-full overflow-hidden shrink-0 bg-[#e8e0d5]">
                      <Image
                        src={item?.image?.imageUrl || item?.image || item?.userImage || userImage}
                        alt={item.name || item.image?.alt || ""}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                        unoptimized={!!item.image || !!item.userImage}
                      />
                    </div>
                    <div className="py-1">
                      <p className="text-base font-bold text-[#1f261b] leading-5">{item.name}</p>
                      <span className="text-base font-medium leading-5">{item.role ?? item.designation}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>

      <style jsx global>{`
        .testimonial-swiper .swiper-pagination { bottom: 0px !important; }
        .testimonial-swiper .swiper-pagination-bullet { width: 10px; height: 10px; background: #d7cbbd; opacity: 1; transition: all 0.3s ease; }
        .testimonial-swiper .swiper-pagination-bullet-active { width: 28px; border-radius: 999px; background: #8d6a3a; }
      `}</style>
    </section>
  );
};