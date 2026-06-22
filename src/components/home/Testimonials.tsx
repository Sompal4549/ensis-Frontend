'use client';

import React, { useEffect, useState } from 'react';
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
import { getComponentContent } from '@/lib/api/api';
export interface Testimonial {
    title: string;
    testimonials: {
        text: string;
        name: string;
        role: string;
        image: string;
    }[];
}

interface TestimonialsProps {
  sectionContent: Testimonial;
}

const defaultContent = {
  subtitle: "WHAT OUR CLIENTS SAY",
  testimonials: [
    { text: "Ensis has delivered exceptional quality Panchkarma equipment for our center. Their customization and support are outstanding.", name: "Dr. Anand Sharma", role: "Ayurveda Physician", image: "" },
    { text: "The spa setup by Ensis has elevated our resort's wellness experience to a whole new level.", name: "Neha Malhotra", role: "Wellness Resort Owner", image: "" },
    { text: "Excellent workmanship, premium finishing and on-time delivery. Highly recommended!", name: "Arjun Menon", role: "Spa Consultant", image: "" },
    { text: "Their steam chambers and massage tables are of outstanding quality. Our clients love them.", name: "Priya Nair", role: "Wellness Center Director", image: "" },
  ],
};

export const Testimonials = ({ sectionContent }: TestimonialsProps) => {
  

  // Duplicate testimonials for a smooth loop effect
  const testimonials = [...sectionContent.testimonials];

  return (
    <section className="bg-[#fbf8f2]">
      <Container>
        {sectionContent.title|| <SubHeading className='text-black' text={sectionContent.subtitle} />}
        <div className="mt-2">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="testimonial-swiper !pb-8"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="h-full border border-[#e1d7c9] bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative">

                  <Image
                    height={28}
                    width={28}
                    alt="quote"
                    src={quote}
                  />

               <p className="mb-2 text-xs font-medium pl-6 line-clamp-3">
  {item.text}
</p>
                  <div className='flex text-orange-400 items-center gap-2 my-2 pl-6'>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image || userImage.src})` }} />

                    <div className="py-1">
                      <p className="text-xs font-bold text-[#1f261b] leading-5">
                        {item.name}
                      </p>

                      <span className="text-xs font-medium leading-4">
                        {item.role}
                      </span>
                    </div>

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>

      {/* Custom Pagination Styling */}
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination {
          bottom: 0px !important;
        }

        .testimonial-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d7cbbd;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 999px;
          background: #8d6a3a;
        }
      `}</style>
    </section>
  );
};