import React from "react";
import {
  Leaf,
  ShieldCheck,
  Settings2,
  Truck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import aboutHeroImage from "@/assets/home/home_banner2.webp";

const AboutHero: React.FC = () => {
  return (
    <section className="w-full bg-[#e9dfd3] overflow-hidden relative">
      <Image src={aboutHeroImage} alt="About Us" className="w-full h-full object-cover absolute top-0 bottom-0 right-0 left-0" />
    <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[620px] z-10">
          <div className="absolute inset-0 pointer-events-none backdrop-blur-[1px] z-20 w-[80%]"
  style={{
    background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 24%,
        rgba(250,247,242,0.60) 42%,
        rgba(250,247,242,0.20) 62%,
        rgba(250,247,242,0.00) 100%
      )
    `,
  }} />

        
        {/* LEFT CONTENT */}
        <div className="relative flex items-center px-6 sm:px-10 lg:px-16 py-16 z-30">
          
          {/* White Blur Overlay */}

          {/* Blur Towards Right */}

          {/* Content */}
          <div className="relative max-w-[560px]">
            
            {/* Small Heading */}
            <p className="uppercase tracking-[2px] text-[11px] font-semibold text-[#7b6d5d] mb-5">
              Premium Ayurvedic Equipment & Wellness Solutions
            </p>

            {/* Main Heading */}
            <h1 className="text-[42px] sm:text-[54px] leading-[1.05] font-serif text-[#173128] font-medium">
              Crafted for Wellness.
              <br />
              <span className="text-[#b58a48]">Built for Life.</span>
            </h1>

            {/* Description */}
            <p className="mt-7 text-[15px] leading-[28px] text-[#5d5449] max-w-[520px]">
              At ENSIS, we combine ancient Ayurvedic wisdom with modern
              craftsmanship to create authentic wellness environments that
              heal, rejuvenate and inspire.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
              
              <div className="flex flex-col items-center text-center relative">
                <Leaf
                  size={26}
                  strokeWidth={1.5}
                  className="text-[#b58a48] mb-3"
                />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Authentic Ayurveda Focused Design
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                <ShieldCheck
                  size={26}
                  strokeWidth={1.5}
                  className="text-[#b58a48] mb-3"
                />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Premium Quality Products
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                <Settings2
                  size={26}
                  strokeWidth={1.5}
                  className="text-[#b58a48] mb-3"
                />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Custom Solutions for Every Need
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center">
                <Truck
                  size={26}
                  strokeWidth={1.5}
                  className="text-[#b58a48] mb-3"
                />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Timely Delivery & Installation Support
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-12">
              
              <button className="bg-[#173128] hover:bg-[#0f241d] transition-all text-white text-[13px] font-medium px-7 py-4 rounded-md flex items-center gap-2">
                EXPLORE PRODUCTS
                <ArrowRight size={15} />
              </button>

              <button className="border border-[#bcae9f] bg-white/70 hover:bg-white transition-all text-[#2f2b27] text-[13px] font-medium px-7 py-4 rounded-md flex items-center gap-2">
                START YOUR PROJECT
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="relative min-h-[500px] lg:min-h-full">

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Experience Badge */}
          <div className="absolute top-14 right-14 w-[135px] h-[135px] rounded-full border-[3px] border-[#c7a567] bg-[#113228] text-white flex flex-col items-center justify-center shadow-2xl">
            <h3 className="text-[38px] leading-none font-serif">20+</h3>
            <p className="text-[11px] tracking-[1.5px] text-center mt-2 leading-[16px] uppercase">
              Years of
              <br />
              Excellence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;