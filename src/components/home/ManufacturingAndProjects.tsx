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

export const ManufacturingAndProjects = () => {
  return (
    <section className="border-b border-[#e7ddd1] bg-[#fbf8f2]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">

          {/* LEFT SIDE */}
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

            {/* Content */}
            <div className="flex flex-col justify-center">
              <SubHeading className=' text-[#8d6a3a]' text='MANUFACTURING EXCELLENCE' />
              <h2 className="mt-3 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
                Crafted with Precision,
                <br />
                Delivered Worldwide
              </h2>

              <p className="mt-3 text-[14px] text-[#5f5a50]">
                Our advanced manufacturing facility combines traditional craftsmanship with modern technology to deliver world-class wellness equipment.
              </p>

              <ul className="mt-3 space-y-4">
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

              <Link
                href="/manufacturing"
                className="mt-8 inline-flex w-fit items-center gap-3 border border-[#d9ccbd] bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-[#1f261b] transition-all duration-300 hover:bg-[#f3eee6]"
              >
                OUR MANUFACTURING
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Manufacturing Images */}
            <div className="grid grid-cols-2 gap-2 self-start h-full">

              {/* Top Large */}
              <div className="relative col-span-2 h-[220px] sm:h-[260px] overflow-hidden rounded-xl">
                <Image
                  src={img11}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Left */}
              <div className="relative h-[170px] sm:h-[210px] overflow-hidden rounded-xl">
                <Image
                  src={img12}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative h-[170px] sm:h-[210px] overflow-hidden rounded-xl">
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
          <div className="border-[#e7ddd1] lg:border-l lg:pl-12">
            <SubHeading className=' text-[#8d6a3a]' text='OUR PROJECTS' />
            <h2 className="mt-3 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
              Creating Wellness
              <br />
              Spaces Worldwide
            </h2>

            <p className="mt-5 max-w-[420px] text-[14px] leading-7 text-[#5f5a50]">
              Proud to be a trusted partner for 500+ wellness projects across the globe.
            </p>

            <Link
              href="/projects"
              className="mt-8 inline-flex w-fit items-center gap-3 border border-[#d9ccbd] bg-white px-5 py-3 text-[11px] font-semibold tracking-[0.14em] text-[#1f261b] transition-all duration-300 hover:bg-[#f3eee6]"
            >
              VIEW ALL PROJECTS
              <ArrowRight size={15} />
            </Link>

            {/* Project Grid */}
            <div className="mt-8">
              <div className="grid h-[200px] grid-cols-3 grid-rows-[1fr_1fr] gap-2">

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