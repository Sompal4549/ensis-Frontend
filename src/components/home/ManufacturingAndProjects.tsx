import React from 'react';
import { CheckCircle2, ArrowRight, CheckSquare, CheckSquare2 } from 'lucide-react';
import { Container } from '../ui/Container';
import Image from 'next/image';
import Link from 'next/link';

import img11 from '@/assets/home/img-11.webp';
import img12 from '@/assets/home/img-12.webp';
import img13 from '@/assets/home/img-13.webp';
import img14 from '@/assets/home/img-14.webp';
import img15 from '@/assets/home/img-7.webp';
import img16 from '@/assets/home/img-1.webp';
import SubHeading from './SubHeading';
import BookButton from '../ui/BookButton';

export const ManufacturingAndProjects = () => {
  return (
    <section className="border-b border-[#e7ddd1] bg-[#fbf8f2]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 items-stretch">

          {/* LEFT SIDE */}
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] h-full">

            {/* Content */}
            <div className="flex flex-col justify-center">
              <SubHeading className=' text-black font-normal' text='MANUFACTURING EXCELLENCE' />
              <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
                Crafted with Precision,
                <br />
                Delivered Worldwide
              </h2>

              <p className="mt-2 text-xs text-[#5f5a50]">
                Our advanced manufacturing facility combines traditional craftsmanship with modern technology to deliver world-class wellness equipment.
              </p>

              <ul className="mt-6 space-y-2">
                {[
                  'Premium Quality Raw Materials',
                  'Skilled Artisans & Modern Machinery',
                  'Multi-Level Quality Testing',
                  'International Export Packing',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[13px] text-[#3f3a32]"
                  >
                    <CheckSquare2
                      size={16}
                      className="shrink-0 text-[#b08b57]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="w-50 mt-2">
                <BookButton text="OUR MANUFACTURING" path="/manufacturing" />
              </div>
            </div>

            {/* Manufacturing Images */}
            <div className="grid grid-cols-2 gap-1 self-start h-[100%]">

              {/* Top Large */}
              <div className="relative col-span-2 h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={img11}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Left */}
              <div className="relative h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={img12}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={img13}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="border-[#e7ddd1] lg:border-l lg:pl-12 h">
            <SubHeading className=' text-black font-normal' text='OUR PROJECTS' />
            <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
              Creating Wellness
              <br />
              Spaces Worldwide
            </h2>

            <p className="mt-2 max-w-[320px] text-xs text-[#5f5a50]">
              Proud to be a trusted partner for 500+ wellness projects across the globe.
            </p>
            <div className="w-50 mt-2">

              <BookButton text="VIEW ALL PROJECTS" path="/projects" />
            </div>

            {/* Project Grid */}
            <div className="mt-2">
              <div className="grid h-50 grid-cols-3 grid-rows-[1fr_1fr] gap-2">

                {/* Left Tall */}
                <div className="relative row-span-2 h-full overflow-hidden rounded-xl">
                  <Image
                    src={img12}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Middle */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={img13}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Right */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={img14}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Middle */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={img15}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Right */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={img16}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};