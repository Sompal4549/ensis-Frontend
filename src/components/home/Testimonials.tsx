'use client';

import React from 'react';
import { Container } from '../ui/Container';
import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import quote from '@/assets/icons/quote.webp';
import userImage from "@/assets/home/testimonial1.webp"
import SubHeading from './SubHeading';
import { FaStar } from 'react-icons/fa';

export const Testimonials = () => {
  const testimonials = [
    {
      text: 'Ensis has delivered exceptional quality Panchkarma equipment for our center. Their customization and support are outstanding.',
      name: 'Dr. Anand Sharma',
      role: 'Ayurveda Physician',
      imgurl: userImage
    },
    {
      text: "The spa setup by Ensis has elevated our resort's wellness experience to a whole new level.",
      name: 'Neha Malhotra',
      role: 'Wellness Resort Owner',
      imgurl: userImage
    },
    {
      text: 'Excellent workmanship, premium finishing and on-time delivery. Highly recommended!',
      name: 'Arjun Menon',
      role: 'Spa Consultant',
      imgurl: userImage
    },
    {
      text: 'Their steam chambers and massage tables are of outstanding quality. Our clients love them.',
      name: 'Priya Nair',
      role: 'Wellness Center Director',
      imgurl: userImage
    },
    {
      text: 'Ensis has delivered exceptional quality Panchkarma equipment for our center. Their customization and support are outstanding.',
      name: 'Dr. Anand Sharma',
      role: 'Ayurveda Physician',
      imgurl: userImage
    },
    {
      text: "The spa setup by Ensis has elevated our resort's wellness experience to a whole new level.",
      name: 'Neha Malhotra',
      role: 'Wellness Resort Owner',
      imgurl: userImage
    },
    {
      text: 'Excellent workmanship, premium finishing and on-time delivery. Highly recommended!',
      name: 'Arjun Menon',
      role: 'Spa Consultant',
      imgurl: userImage
    },
    {
      text: 'Their steam chambers and massage tables are of outstanding quality. Our clients love them.',
      name: 'Priya Nair',
      role: 'Wellness Center Director',
      imgurl: userImage
    },
  ];

  return (
    <section className="bg-[#fbf8f2]">
      <Container>
        <SubHeading className=' text-[#8d6a3a]' text='WHAT OUR CLIENTS SAY' />
        <div className="mt-8">
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
            className="testimonial-swiper !pb-14"
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="h-full border border-[#e1d7c9] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

                  <Image
                    height={28}
                    width={28}
                    alt="quote"
                    src={quote}
                    className="mb-2"
                  />

                  <p className="min-h-[110px] text-[14px] leading-7 text-[#3f3a32]">
                    {item.text}
                  </p>
<div className='flex text-orange-400 items-center gap-2 my-2'>
<FaStar/>
<FaStar/>
<FaStar/>
<FaStar/>
<FaStar/>
</div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="size-11 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${userImage.src})` }} />

                    <div>
                      <h4 className="text-sm font-semibold text-[#1f261b]">
                        {item.name}
                      </h4>

                      <span className="text-xs text-[#6f675d]">
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