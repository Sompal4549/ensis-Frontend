import React from "react";
import {
  Leaf,
  ShieldCheck,
  Settings2,
  Truck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import aboutHeroImage from "@/assets/bg/bg5.webp";
import { Container } from "../ui/Container";
import authentic_ayurveda from "@/assets/icons/authentic_ayurveda.webp";
import premium_quality from "@/assets/icons/premium_quality.webp"
import custom_solutions from "@/assets/icons/custom_solutions.webp"
import timely_delivery from "@/assets/icons/timely_delivery.webp"
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

const AboutHero: React.FC = () => {
  return (
    <section className="w-full bg-[#e9dfd3] overflow-hidden relative">
      <Image src={aboutHeroImage} alt="About Us" className="w-full h-full object-fill absolute top-0 bottom-0 right-0 left-0" priority />
      <Container className=" grid grid-cols-1 lg:grid-cols-2 min-h-[85dvh] max-h-[650px] z-10">
        {/* <div className="absolute inset-0 pointer-events-none  z-20 w-[100%] block lg:hidden"
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
          }} /> */}
          {/* Gradient Overlay for Desktop */}
 {/* <div className="absolute inset-0 pointer-events-none backdrop-blur-[1px] z-20 w-[60%] lg:block hidden"
          style={{
            background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 64%,
        rgba(250,247,242,0.10) 82%,
        rgba(250,247,242,0.00) 100%
      )
    `,
          }} /> */}

        {/* LEFT CONTENT */}
        <div className="relative flex items-end md:items-center py-10 z-30 lg:top-0 bottom-0">
          {/* Content */}
          <div className="relative max-w-[560px] ">

            {/* Small Heading */}
            <p className="uppercase tracking-[2px] text-[11px] font-semibold text-[#7b6d5d] mb-3">
              Premium Ayurvedic Equipment & Wellness Solutions
            </p>

            {/* Main Heading */}
            <h1 className="text-[42px] sm:text-[42px] leading-[1.05] font-serif font-semibold">
              Crafted for Wellness.
              <br />
              <span className="text-[#b58a48] font-semibold">Built for Life.</span>
            </h1>

            {/* Description */}
            <p className="mt-3 text-xs leading-[22px] font-semibold max-w-[400px]">
              At ENSIS, we combine ancient Ayurvedic wisdom with modern
              craftsmanship to create authentic wellness environments that
              heal, rejuvenate and inspire.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">

              <div className="flex flex-col items-center text-center relative">
                <Image src={authentic_ayurveda} alt="Authentic Ayurveda" width={35} height={35} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] leading-[17px] font-semibold">
                  Authentic Ayurveda Focused Design
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                 <Image src={premium_quality} alt="Authentic Ayurveda" width={35} height={35} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] text-[#4e463d] font-semibold">
                  Premium Quality Products
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                <Image src={custom_solutions} alt="Authentic Ayurveda" width={35} height={35} className="text-[#b58a48] mb-3" />
               
                <p className="text-[11px] leading-[17px] font-semibold">
                  Custom Solutions for Every Need
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center">
               <Image src={timely_delivery} alt="Authentic Ayurveda" width={35} height={35} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] leading-[17px] font-semibold">
                  Timely Delivery & Installation Support
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <BookButton text="EXPLORE PRODUCTS" path="/products" rightIcon={<ArrowRight size={15} className="text-white" />} />
              <GreenButton text="START YOUR PROJECT" path="/contact" rightIcon={<ArrowRight size={15} className="text-[#050A1A]" />} />

            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="relative lg:min-h-full lg:block hidden">


          {/* Experience Badge */}
          <div className="absolute top-14 right-14 w-[125px] h-[125px] rounded-full border-[3px] border-[#c7a567] bg-[#113228] text-white flex flex-col items-center justify-center shadow-2xl">
            <h3 className="text-[42px] leading-none font-serif">20<span className="text-[28px]">+</span></h3>
            <p className="text-[11px] font-semibold text-center mt-2 uppercase">
              Years of
              <br />
              Excellence
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutHero;