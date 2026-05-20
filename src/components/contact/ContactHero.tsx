import React from "react";
import {
  Leaf,
  ShieldCheck,
  Settings2,
  Truck,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import aboutHeroImage from "@/assets/home/contact.webp";
import { Container } from "../ui/Container";
import authentic_ayurveda from "@/assets/icons/authentic_ayurveda.webp";
import premium_quality from "@/assets/icons/premium_quality.webp"
import custom_solutions from "@/assets/icons/custom_solutions.webp"
import timely_delivery from "@/assets/icons/timely_delivery.webp"
import arrow from "@/assets/icons/arrow.png"

const ContactHero: React.FC = () => {
  return (
    <section className="w-full bg-[#e9dfd3] overflow-hidden relative">
      <Image src={aboutHeroImage} alt="About Us" className="w-full h-full object-cover absolute top-0 bottom-0 right-0 left-0" priority />
      <Container className=" grid grid-cols-1 lg:grid-cols-2 min-h-[550px] z-10">
        <div className="absolute inset-0 pointer-events-none  z-20 w-[100%] block lg:hidden"
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
          }} />
 <div className="absolute inset-0 pointer-events-none backdrop-blur-[1px] z-20 w-[80%] lg:block hidden"
          style={{
            background: `
      linear-gradient(
        90deg,
        rgba(250,247,242,0.97) 0%,
        rgba(250,247,242,0.92) 24%,
        rgba(250,247,242,0.60) 52%,
        rgba(250,247,242,0.20) 62%,
        rgba(250,247,242,0.00) 100%
      )
    `,
          }} />

        {/* LEFT CONTENT */}
        <div className="relative flex items-end md:items-center py-10 z-30 lg:top-0 bottom-0">
          {/* Content */}
          <div className="relative max-w-[600px] ">

            {/* Small Heading */}
            <p className="uppercase tracking-[2px] text-[11px] font-semibold text-[#7b6d5d] mb-3">
              Premium Ayurvedic Equipment & Wellness Solutions
            </p>

            {/* Main Heading */}
            <h1 className="text-[42px] sm:text-[42px] leading-[1.05] font-serif text-[#173128] font-medium">
              Contact Us
              <br />
              <span className="text-[#b58a48] capitalize">We're here to help you Heal.</span>
            </h1>

            {/* Description */}
                 <div className="flex w-full py-4">
                    <Image src={arrow} alt='arrow' width={300} height={10} />
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold tracking-[0.16em] text-[#313628]">
                    <span className='font-semibold'>PANCHKARMA EQUIPMENT</span>
                  </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4">

              <div className="flex flex-col items-center text-center relative">
                <Image src={authentic_ayurveda} alt="Authentic Ayurveda" width={26} height={26} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Authentic Ayurveda Focused Design
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                 <Image src={premium_quality} alt="Authentic Ayurveda" width={26} height={26} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Premium Quality Products
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center relative">
                <Image src={custom_solutions} alt="Authentic Ayurveda" width={26} height={26} className="text-[#b58a48] mb-3" />
               
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Custom Solutions for Every Need
                </p>

                {/* Ruler */}
                <div className="hidden sm:block absolute right-[-12px] top-2 h-[60px] w-[1px] bg-[#d8c5ab]" />
              </div>

              <div className="flex flex-col items-center text-center">
               <Image src={timely_delivery} alt="Authentic Ayurveda" width={26} height={26} className="text-[#b58a48] mb-3" />
                <p className="text-[11px] leading-[17px] text-[#4e463d]">
                  Timely Delivery & Installation Support
                </p>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactHero;