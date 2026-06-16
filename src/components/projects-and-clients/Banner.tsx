"use client";

import React from "react";
import Image from "next/image";
import banner from "@/assets/projects-and-clients/banner.webp";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import left from "@/assets/icons/arrow_left.png"
import right from "@/assets/icons/arrow_right.png"
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
  content?: ProjectsBannerContent;
}

const ProjectsBanner: React.FC<ProjectsBannerProps> = ({
  content = fallbackProjectsBanner,
}) => {
  return (
 <section className="relative overflow-hidden bg-[#f8f2e8]">
  {/* Background Image */}
  <div className="absolute inset-0 z-0">
    <Image
      src={banner}
      alt={content.title.line1}
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />

    {/* Strong Luxury Gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#f8f2e8] w-[60%] via-[#f8f2e8]/95 via-45% to-transparent" />

    {/* Extra Solid Layer */}
    {/* <div className="absolute inset-y-0 left-0 w-[60%] bg-[#f8f2e8]/40" /> */}
  </div>

  {/* Content */}
  <Container className="relative z-10">
    <div className="flex min-h-[650px] md:min-h-[calc(100vh-96px)] items-center">
      <div className="w-full lg:max-w-[42%]">
        <h1 className="leading-[2]">
          <span className="block text-[#1f2c25] text-4xl md:text-5xl lg:text-6xl">
            {content.title.line1}
          </span>

          <span className="block text-[#b1793d] text-4xl md:text-5xl lg:text-6xl">
            {content.title.line2}
          </span>
        </h1>

        <div className="flex items-center gap-2 my-2">
          <Image
            src={left}
            height={45}
            width={240}
            alt="left decoration"
            className="h-12 w-auto max-w-20 object-contain"
          />

          <Image
            src={flower}
            height={25}
            width={50}
            alt="flower"
            className="h-5 w-auto object-contain"
          />

          <Image
            src={right}
            height={45}
            width={240}
            alt="right decoration"
            className="h-12 w-auto max-w-20 object-contain"
          />
        </div>

        <h2 className="mb-4 text-xl text-[#1f2c25] font-medium">
          {content.subtitle}
        </h2>

        <p className="max-w-xs leading-relaxed text-sm">
          {content.description}
        </p>
      </div>
    </div>
  </Container>
</section>
  );
};

export default ProjectsBanner;