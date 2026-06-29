"use client";

import React from "react";
import Image from "next/image";
import banner from "@/assets/projects-and-clients/banner.webp";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import left from "@/assets/icons/arrow_left.png"
import right from "@/assets/icons/arrow_right.png"
import arrow from "@/assets/icons/arrow.png"
export interface ProjectsBannerContent {
 

  title: {
    line1: string;
    line2: string;
  };

  subtitle: string;
  description: string;
  heroImage?: string;
}

export const fallbackProjectsBanner: ProjectsBannerContent = {
  title: {
    line1: "Our Projects.",
    line2: "Our Clients.",
  },

  subtitle: "Spaces Designed. Wellness Delivered.",

  description:
    "From concept to completion, we create holistic wellness environments that inspire healing, balance and transformation.",

};

interface ProjectsBannerProps {
  sectionContent?: ProjectsBannerContent;
}

const ProjectsBanner: React.FC<ProjectsBannerProps> = ({
  sectionContent = fallbackProjectsBanner,
}) => {
  return (
 <section className="relative overflow-hidden bg-[#f8f2e8]">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image
      src={banner}
      alt={sectionContent?.title?.line1}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />

    {/* Strong Luxury Gradient */}

    {/* Extra Solid Layer */}
    {/* <div className="absolute inset-y-0 left-0 w-[60%] bg-[#f8f2e8]/40" /> */}
  </div>
    <div className="absolute inset-0 bg-gradient-to-r from-[#f8f2e8] from-10% via-[#f8f2e8]/80 via-50% to-transparent w-[60%] z-10 h-[100%]" />

  {/* Content */}
  <Container className="relative z-20">
    <div className="flex min-h-162.5 md:min-h-[calc(90vh-96px)] items-center">
      <div className="w-full lg:max-w-[42%]">
        <h1 className="leading-loose">
          <span className="block text-[#1f2c25] text-4xl md:text-5xl lg:text-6xl">
            {sectionContent?.title?.line1}
          </span>

          <span className="block text-[#b1793d] text-4xl md:text-5xl lg:text-6xl italic">
            {sectionContent?.title?.line2}
          </span>
        </h1>

        <div className="flex items-center gap-2 my-2">
           <Image src={arrow} alt='arrow' width={350} height={10} className="max-w-55 sm:max-w-75 md:max-w-87.5" crossOrigin="anonymous" />
        </div>

        <h2 className="mb-4 text-md font-medium">
          {sectionContent?.subtitle}
        </h2>

        <p className="max-w-xs leading-relaxed text-sm" dangerouslySetInnerHTML={{__html:sectionContent?.description}}>
        </p>
      </div>
    </div>
  </Container>
</section>
  );
};

export default ProjectsBanner;