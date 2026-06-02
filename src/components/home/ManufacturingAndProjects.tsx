import React from 'react';
import { CheckSquare2 } from 'lucide-react';
import { Container } from '../ui/Container';
import Image from 'next/image';

import img11 from '@/assets/home/img-11.webp';
import img12 from '@/assets/home/img-12.webp';
import img13 from '@/assets/home/img-13.webp';
import img14 from '@/assets/home/img-14.webp';
import img15 from '@/assets/home/img-7.webp';
import img16 from '@/assets/home/img-1.webp';
import SubHeading from './SubHeading';
import BookButton from '../ui/BookButton';
import { getComponentContent, getImageUrl } from '@/app/lib/api';

const mfgFallbackImages = [img11, img12, img13];
const projFallbackImages = [img12, img13, img14, img15, img16];

const defaultContent = {
  mfgSubtitle: "MANUFACTURING EXCELLENCE",
  mfgHeading: "Crafted with Precision,\nDelivered Worldwide",
  mfgDescription: "Our advanced manufacturing facility combines traditional craftsmanship with modern technology to deliver world-class wellness equipment.",
  mfgFeatures: [
    "Premium Quality Raw Materials",
    "Skilled Artisans & Modern Machinery",
    "Multi-Level Quality Testing",
    "International Export Packing",
  ],
  mfgButtonText: "OUR MANUFACTURING",
  mfgButtonPath: "/manufacturing",
  mfgImages: ["", "", ""],
  projSubtitle: "OUR PROJECTS",
  projHeading: "Creating Wellness\nSpaces Worldwide",
  projDescription: "Proud to be a trusted partner for 500+ wellness projects across the globe.",
  projButtonText: "VIEW ALL PROJECTS",
  projButtonPath: "/projects",
  projImages: ["", "", "", "", ""],
};

export const ManufacturingAndProjects = async () => {
  const content = await getComponentContent("home.manufacturingAndProjects", defaultContent);

  const getMfgImage = (index: number) => {
    const cmsImg = content.mfgImages?.[index];
    return cmsImg ? getImageUrl(cmsImg) : mfgFallbackImages[index] || img11;
  };

  const getProjImage = (index: number) => {
    const cmsImg = content.projImages?.[index];
    return cmsImg ? getImageUrl(cmsImg) : projFallbackImages[index] || img12;
  };

  const mfgHeadingLines = content.mfgHeading.split("\n");
  const projHeadingLines = content.projHeading.split("\n");

  return (
    <section className="border-b border-[#e7ddd1] bg-[#fbf8f2]">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 items-stretch">

          {/* LEFT SIDE */}
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] h-full">

            {/* Content */}
            <div className="flex flex-col justify-center">
              <SubHeading className=' text-black font-normal' text={content.mfgSubtitle} />
              <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
                {mfgHeadingLines.map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < mfgHeadingLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>

              <p className="mt-2 text-xs text-[#5f5a50]">
                {content.mfgDescription}
              </p>

              <ul className="mt-6 space-y-2">
                {content.mfgFeatures.map((item: string) => (
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
                <BookButton text={content.mfgButtonText} path={content.mfgButtonPath} />
              </div>
            </div>

            {/* Manufacturing Images */}
            <div className="grid grid-cols-2 gap-1 self-start h-[100%]">

              {/* Top Large */}
              <div className="relative col-span-2 h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={getMfgImage(0)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Left */}
              <div className="relative h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={getMfgImage(1)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={getMfgImage(2)}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="border-[#e7ddd1] lg:border-l lg:pl-12 h">
            <SubHeading className=' text-black font-normal' text={content.projSubtitle} />
            <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
              {projHeadingLines.map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i < projHeadingLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <p className="mt-2 max-w-[320px] text-xs text-[#5f5a50]">
              {content.projDescription}
            </p>
            <div className="w-50 mt-2">
              <BookButton text={content.projButtonText} path={content.projButtonPath} />
            </div>

            {/* Project Grid */}
            <div className="mt-2">
              <div className="grid h-50 grid-cols-3 grid-rows-[1fr_1fr] gap-2">

                {/* Left Tall */}
                <div className="relative row-span-2 h-full overflow-hidden rounded-xl">
                  <Image
                    src={getProjImage(0)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Middle */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={getProjImage(1)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Top Right */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={getProjImage(2)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Middle */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={getProjImage(3)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Bottom Right */}
                <div className="relative h-full overflow-hidden rounded-xl">
                  <Image
                    src={getProjImage(4)}
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