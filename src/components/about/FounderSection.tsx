import Image from "next/image";
import React from "react";
import founder from "@/assets/about_new/founder.webp"
import signature from "@/assets/about_new/signature.webp"
import { Container } from "../ui/Container";
const FounderSection: React.FC = () => {
  return (
    <section className="relative">
        <Image alt="founder" src={founder} width={500} height={500} className="hidden md:block object-cover absolute top-0 left-0  bottom-0 w-[25%]"/>
 <Container className="relative z-10 py-0!">
      <div className=" flex flex-col md:flex-row items-center lg:pr-20">

        {/* Left: Person Image Placeholder */}
        <div className="flex-shrink-0 w-full md:w-[260px] lg:w-[300px] bg-[#e8e0d0] flex items-end justify-center overflow-hidden min-h-[260px] md:min-h-0">
          {/* Replace this div with your <img> tag */}
          <div className="w-full h-full flex items-center justify-center min-h-[260px] md:min-h-full">
             <Image alt="founder" src={founder} width={500} height={500} className="object-cover block md:hidden" />
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-center px-0 md:px-10 lg:px-14 py-10 md:py-10">

          {/* Label */}
          <p
            className="font-medium text-sm uppercase text-black mb-3"
          >
            Founder &amp; Vision
          </p>

          {/* Heading */}
          <h2
            className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-black leading-snug mb-4"
          >
            Crafting Spaces That Heal
          </h2>

          {/* Body Copy */}
          <div className="text-black text-sm md:text-[13.5px] leading-relaxed space-y-3 max-w-xl">
            <p>
              At ENSIS, we believe a well-designed wellness space has the power to heal,
              energize and transform lives. Our focus is on creating spaces that are authentic
              to Ayurveda, visually premium and practically efficient.
            </p>
            <p>
              We are committed to supporting wellness professionals and hospitality brands
              with solutions that make a real difference.
            </p>
          </div>

          {/* Signature + Name Row */}
        </div>
          <div className="flex flex-col">

            {/* Signature Image Placeholder */}
            <div className="mb-2 flex items-center">
              {/* Replace this div with your <img src="..." alt="Jomy Thomas signature" className="w-full h-auto" /> */}
              <div className="w-full h-full rounded flex items-center select-none">
                <Image alt="signature"  src={signature} width={150} height={50} className="object-fill"/>
              </div>
            </div>

            {/* Name & Title */}
            <div>
             
              <p className="text-black text-xs mb-1">
                Founder
              </p>
              <p className="text-black text-xs md:text-[12px] leading-snug mb-1">
                Design House India Pvt. Ltd.
              </p>
              <p className="text-black text-xs md:text-[12px] leading-snug mb-1">
                (ENSIS – Wellness Division)
              </p>
            </div>

          </div>

      </div>
    </Container>
    </section>
  );
};

export default FounderSection;