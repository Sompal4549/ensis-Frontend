"use client";

import React from "react";
import Image from "next/image";
import bannerImg from "@/assets/contact/banner.webp";

export interface ContactHeroFeature {
  id: string;
  iconImage: string;
  title: string;
}

export interface ContactHeroContent {
  bgImage?: string;
  title?: string;
  heading?: string;
  highlightedText?: string;
  description?: string;
  features?: ContactHeroFeature[];
}

const ContactHero: React.FC<{ sectionContent?: ContactHeroContent }> = () => {
  return (
    <section className="w-full relative overflow-hidden bg-[#f7efe5] h-[145px] sm:h-[165px] md:h-[185px] lg:h-[195px] flex items-center mt-5 sm:mt-6 md:mt-7">
      {/* Background Banner Image - scaled to show full height without cropping */}
      <Image
        src={bannerImg}
        alt="Contact Us - Let's Create Your Wellness Space"
        fill
        priority
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        className="object-cover object-right md:object-center select-none pointer-events-none"
      />

      {/* Subtle fade overlay on mobile/tablet to guarantee text contrast */}
      <div
        className="absolute inset-0 pointer-events-none z-10 block sm:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(247,239,229,0.95) 0%, rgba(247,239,229,0.85) 60%, rgba(247,239,229,0.2) 100%)",
        }}
      />

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-4 md:px-10 py-4 flex items-center">
        <div className="max-w-[520px] pt-1.5 sm:pt-2.5">
          {/* Tag: Orange line + CONTACT US */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-[3px] bg-[#f59e0b] rounded-full inline-block" />
            <span className="text-sm font-black tracking-[0.16em] text-[#0e271a] uppercase">
              CONTACT US
            </span>
          </div>

          {/* Main Title: Let's Create (Forest Pine Green) + Your Wellness Space (Deep Navy Blue) */}
          <h1 className="text-xl sm:text-xl  font-black tracking-tight">
            <span className="text-[#0c2f1f] block font-black leading-tighter">Let&apos;s Create</span>
            <span className="text-[#092243] block font-black leading-tighter">Your Wellness Space</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[#1e293b] font-semibold  mt-1 max-w-[420px]">
            Have questions or need help? Our team is here to assist you with expert guidance and support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;