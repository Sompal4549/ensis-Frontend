"use client";

import React from "react";
import Image from "next/image";
import banner from "@/assets/projects-and-clients/banner.webp";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import left from "@/assets/icons/arrow_left.webp"
import right from "@/assets/icons/arrow_right.webp"
import arrow from "@/assets/icons/arrow.png"
import ProjectsStatsStrip from "./ProjectsStatsStrip";

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
    <section className="relative overflow-visible bg-[#f8f2e8] mb-0 md:mb-20">
      <div className="relative">
      {/* Background Image — clipped in its own layer so the outer
          section can stay overflow-visible for StatsStrip overlap */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={banner}
          alt={sectionContent?.title?.line1}
          fill
          priority
          sizes="100vw"
          className="md:object-center object-left object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f2e8] from-10% via-[#f8f2e8]/80 via-50% to-transparent w-[100%] md:w-[60%] h-full" />
      </div>

      {/* Content */}
      <Container className="relative z-20">
        <div className="flex min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none items-center">
          <div className="w-full lg:max-w-[42%]">
            <h1>
              <span className="block text-[#1f2c25]">
                {sectionContent?.title?.line1}
              </span>

              <span className="block text-[#b1793d] italic">
                {sectionContent?.title?.line2}
              </span>
            </h1>

            <div className="flex items-center gap-4 my-2">
              <Image src={arrow} alt='arrow' width={350} height={10} className="max-w-55 sm:max-w-75 md:max-w-87.5" crossOrigin="anonymous" />
            </div>

            <h2 className="mb-4 text-md font-medium">
              {sectionContent?.subtitle}
            </h2>

            <p className="max-w-xs text-base leading-6" dangerouslySetInnerHTML={{ __html: sectionContent?.description }}>
            </p>
          </div>
        </div>
      </Container>
      </div>

      <ProjectsStatsStrip />
    </section>
  );
};

export default ProjectsBanner;