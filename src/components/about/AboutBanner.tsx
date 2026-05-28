"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import banner_image from "@/assets/about_new/about_banner.webp"
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import lotus from "@/assets/about_new/about_lotus.png";
import { Container } from "../ui/Container";
export default function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Your Background Image */}
      {/* 
        Add your background image using:
        bg-[url('/your-image.jpg')]
      */}
      <Image priority alt="about banner" src={banner_image} fill className="object-cover object-right absolute inset-0" />
      <Container>
      <div className="relative min-h-[470px] w-full ">
        {/* Overlay */}
        <div className="absolute inset-0 " />

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[450px] max-w-[1500px] items-center">
          <div className="max-w-[620px] pt-10 pb-12 md:pt-16 md:pb-16">
            {/* Small Label */}
            <div className="mb-5 flex items-center gap-3">
              <Image alt="lotus" src={lotus} width={20} height={20} className="h-full object-contain" />
              <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#d6a85f]">
                About Ensis
              </span>

              <div className="h-[1px] w-14 bg-[#d6a85f]" />
            </div>

            {/* Heading */}
            <h1 className="text-[38px] font-medium leading-[1.08] text-white sm:text-[48px] md:text-5xl">
              Crafting Wellness Spaces

              <span className="mt-1 block text-[#d6a85f]">
                That Heal <span className="font-serif font-normal">&</span> Inspire
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[360px] text-xs tracking-wide leading-6 text-white">
              India’s trusted manufacturer of Panchkarma equipment,
              wellness furniture and turnkey spa interiors since 2003.
              We design, build and install complete wellness centres
              that blend Ayurvedic wisdom with modern comfort.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-2">
              <div className="w-35">
                <BookButton text="Our Journey" />
              </div>
             <div className="w-50">
                <GreenButton text="Explore Products" />
              </div>

            </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}