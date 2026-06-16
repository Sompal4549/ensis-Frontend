"use client";

import Image from "next/image";
import banner from "@/assets/projects-and-clients/banner.webp"
export interface ProjectsBannerContent {
  logo: string;
  logoAlt: string;

  title: {
    line1: string;
    line2: string;
  };

  subtitle: string;

  description: string;

  heroImage: string;

  sectionTitle: string;
}
// data/projects-banner-fallback.ts


export const fallbackProjectsBanner: ProjectsBannerContent = {
  logo: "/images/ensis-logo.png",
  logoAlt: "ENSIS Logo",

  title: {
    line1: "Our Projects.",
    line2: "Our Clients.",
  },

  subtitle: "Spaces Designed. Wellness Delivered.",

  description:
    "From concept to completion, we create holistic wellness environments that inspire healing, balance and transformation.",

  heroImage: "/images/projects-banner.webp",

  sectionTitle: "Our Projects",
};

interface ProjectsBannerProps {
  content?: ProjectsBannerContent;
}

const ProjectsBanner: React.FC<ProjectsBannerProps> = ({
  content = fallbackProjectsBanner,
}) => {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[650px]">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center px-6 md:px-12 xl:px-16 py-12">
          <h1 className="font-serif leading-tight">
            <span className="block text-[#1f2c25] text-5xl md:text-6xl xl:text-7xl">
              {content.title.line1}
            </span>

            <span className="block text-[#b1793d] text-5xl md:text-6xl xl:text-7xl">
              {content.title.line2}
            </span>
          </h1>

          <div className="w-28 h-px bg-[#b1793d] my-8" />

          <h2 className="text-2xl md:text-3xl text-[#1f2c25] font-medium mb-4">
            {content.subtitle}
          </h2>

          <p className="max-w-lg text-[#4f4f4f] text-lg leading-8">
            {content.description}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative min-h-[500px] lg:min-h-full">
          <Image
            src={banner}
            alt={content.sectionTitle}
            fill
            priority
            className="object-cover"
          />

          {/* Luxury Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f2e8]/70 via-transparent to-transparent" />
        </div>
      </div>

      {/* Bottom Section Header */}
      <div className="border-t border-[#d7c3a5] py-6">
        <div className="flex items-center justify-center gap-4">
          <span className="w-12 h-px bg-[#b1793d]" />

          <h3 className="font-serif text-4xl text-[#1f2c25]">
            {content.sectionTitle}
          </h3>

          <span className="w-12 h-px bg-[#b1793d]" />
        </div>
      </div>
    </section>
  );
};

export default ProjectsBanner;