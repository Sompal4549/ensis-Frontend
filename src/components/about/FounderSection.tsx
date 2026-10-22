import Image from "next/image";
import React from "react";
import founder from "@/assets/about_new/founder.webp"
import signature from "@/assets/about_new/signature.webp"
import { Container } from "../ui/Container";
export interface FounderSectionContent {
  founderImageurl: { imageUrl: string; alt: string };
  heading: string;
  title: string;
  description: string;
  signatureImageurl: { imageUrl: string; alt: string };
  aboutFounder: {
    title: string;
    company: string;
    division: string;
  };
}

const fallbackContent: FounderSectionContent = {
  founderImageurl: { imageUrl: founder.src, alt: "Founder" },
  heading: "FOUNDER'S VISION",
  title: "Building a Legacy of Wellness",
  description: "<p>With over two decades of experience in the wellness industry, our founder envisioned creating spaces that seamlessly blend traditional Ayurvedic wisdom with modern engineering excellence.</p>",
  signatureImageurl: { imageUrl: signature.src, alt: "Signature" },
  aboutFounder: {
    title: "Jomy Thomas",
    company: "Design House India Pvt. Ltd.",
    division: "Founder & Managing Director",
  },
};

interface FounderSectionProps {
  sectionContent?: FounderSectionContent;
}


const FounderSection: React.FC<FounderSectionProps> = ({ sectionContent = {} as FounderSectionContent }) => {
  const resolved = { ...fallbackContent, ...sectionContent };
  return (
    <section className="relative">
        <Image alt="founder" src={founder} width={500} height={500} className="hidden md:block object-cover absolute top-0 left-0  bottom-0 w-[25%]"/>
 <Container className="relative z-10 py-0!">
      <div className=" flex flex-col md:flex-row items-center lg:pr-20">

        {/* Left: Person Image Placeholder */}
        <div className="flex-shrink-0 w-full md:w-[260px] lg:w-[300px] bg-[#e8e0d0] flex items-end justify-center overflow-hidden min-h-[260px] md:min-h-0">
          {/* Replace this div with your <img> tag */}
          <div className="w-full h-full flex items-center justify-center min-h-[260px] md:min-h-full">
             <Image alt={resolved.founderImageurl.alt} src={resolved.founderImageurl.imageUrl} width={500} height={500} className="object-cover block md:hidden" />
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-center px-0 md:px-10 lg:px-14 py-10 md:py-10">

          {/* Label */}
          <p
            className="font-medium text-base uppercase text-black mb-3"
          >
            {resolved?.heading}
          </p>

          {/* Heading */}
          <h2
            className="text-2xl md:text-3xl lg:text-[2rem] font-semibold text-black leading-snug mb-4"
          >
            {resolved.title}
          </h2>

          {/* Body Copy */}
          <div className="text-black text-base leading-relaxed space-y-3 max-w-xl">
              <p dangerouslySetInnerHTML={{__html:resolved.description||""}}>
              </p>
          </div>

          {/* Signature + Name Row */}
        </div>
          <div className="flex flex-col">

            {/* Signature Image Placeholder */}
            <div className="mb-2 flex items-center">
              {/* Replace this div with your <img src="..." alt="Jomy Thomas signature" className="w-full h-auto" /> */}
              <div className="w-full h-full rounded flex items-center select-none">
                <Image alt={resolved.signatureImageurl.alt}  src={resolved.signatureImageurl.imageUrl} width={150} height={50} className="object-fill"/>
              </div>
            </div>

            {/* Name & Title */}
            <div>
             
              <p className="text-black text-base mb-1">
                {resolved.aboutFounder.title}
              </p>
              <p className="text-black text-base leading-snug mb-1">
                {resolved.aboutFounder.company}
              </p>
              <p className="text-black text-base leading-snug mb-1">
                {resolved.aboutFounder.division}
              </p>
            </div>

          </div>

      </div>
    </Container>
    </section>
  );
};

export default FounderSection;