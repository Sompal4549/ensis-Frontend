import React from "react";

import Image from "next/image";
import { Container } from "../ui/Container";

import arrow from "@/assets/icons/arrow.png"

interface ContactHeroFeature {
  id: string;
  iconImage: string; // Assuming this is an image URL or path
  title: string;
}

export interface ContactHeroContent {
  bgImage: string; // Assuming this is an image URL or path
  title: string;
  heading: string;
  highlightedText: string;
  description: string;
  features: ContactHeroFeature[];
  // Add other properties if they are used from sectionContent
  // e.g., buttons, etc.
}

const ContactHero: React.FC<{ sectionContent: ContactHeroContent }> = ({sectionContent}) => {
  return (
    <section className="w-full bg-[#e9dfd3] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none  z-30 w-[100%] block lg:hidden"
          style={{
            background: `
      linear-gradient(
        180deg,
        rgba(250,247,242,0.0) 0%,
        rgba(250,247,242,0.12) 24%,
        rgba(250,247,242,0.80) 52%,
        rgba(250,247,242,0.80) 62%,
        rgba(250,247,242,1) 100%
      )
    `,
          }} />
 <div className="absolute inset-0 pointer-events-none backdrop-blur-[1px] z-30 w-[50%] lg:block hidden"
          style={{
            background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 24%,
        rgba(250,247,242,0.60) 52%,
        rgba(250,247,242,0.20) 62%,
        rgba(250,247,242,0.00) 100%
      )
    `,
          }} />
      <Image src={sectionContent.bgImage} alt={sectionContent.title} className="w-full h-full object-cover absolute top-0 bottom-0 right-0 left-0 z-20" priority fill />
      <Container className="grid min-h-[80dvh] max-h-[650px] grid-cols-1 lg:grid-cols-2 relative z-40 items-center">
      

        {/* LEFT CONTENT */}
        <div className="relative flex items-end md:items-center py-10 z-40 lg:top-0 bottom-0">
          {/* Content */}
          <div className="relative max-w-[600px] ">

            {/* Small Heading */}
            <p className="uppercase tracking-[2px] text-[11px] font-semibold text-[#7b6d5d] mb-3">
              {sectionContent.heading}
            </p>

            {/* Main Heading */}
            <h1 className="text-[24px] lg:text-[62px] leading-[1.05] font-serif text-[#173128] font-semibold">
             {sectionContent.title}
              <br />
              <span className="text-[#b58a48] capitalize font-semibold">{sectionContent.highlightedText}</span>
            </h1>

            {/* Description */}
                 <div className="flex w-full py-4">
                    <Image src={arrow} alt='arrow' width={300} height={10} />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold tracking-[0.16em] text-[#313628]">
                    <span className='font-semibold'>{sectionContent.description}</span>
                  </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">
              {sectionContent.features.map((feature, index) => (
                <div key={feature.id} className="flex flex-col items-center text-center relative">
                  <Image src={feature.iconImage} alt={feature.title} width={26} height={26} className="text-[#b58a48] mb-3" />
                  <p className="text-[11px] leading-[17px] text-[#4e463d] font-semibold">
                    {feature.title}
                  </p>

                  {/* Ruler */}
                  {index !== sectionContent.features.length - 1 && (
                    <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactHero;