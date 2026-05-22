"use client";

import Image from "next/image";
import blogHero from "@/assets/blog/blog.webp"; // replace with your image
import { Container } from "../ui/Container";

export default function BlogHeroSection() {
  return (
    <section className="w-full bg-[#f8f1e7] overflow-hidden relative">
       <Image
            src={blogHero}
            alt="Spa wellness"
            fill
            priority
            className="object-cover object-center absolute inset-0 z-10"
          />
  <Container className="grid min-h-[90dvh] max-h-[650px] grid-cols-1 lg:grid-cols-2 relative z-20 items-center">
        {/* Left Content */}
        <div className="sm:py-8 lg:py-14">
          <div className="max-w-[480px]">
            {/* Decorative Line */}
            <div className="mb-6 h-px w-28 bg-[#d6b27a]" />

            {/* Heading */}
            <h1 className="font-serif text-[52px] leading-none text-[#1f3b1f] sm:text-[68px] lg:text-[82px]">
              Blog
            </h1>

            {/* Small Ornament */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-16 bg-[#c89b5a]" />
              <div className="flex gap-[3px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89b5a]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89b5a]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#c89b5a]" />
              </div>
              <div className="h-px w-16 bg-[#c89b5a]" />
            </div>

            {/* Subtitle */}
            <h2 className="mt-4 font-serif text-[24px] italic leading-relaxed text-[#a7652a] sm:text-[30px]">
              Insights. Wisdom. Wellness.
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-[420px] text-[17px]  text-[#2d2d2d]">
              Curated perspectives on spa, wellness,
              <br className="hidden sm:block" />
              and timeless healing traditions.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}