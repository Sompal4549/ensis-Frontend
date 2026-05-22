import React from "react";
import { Container } from "../ui/Container";
import AboutTitle from "./AboutTitle";
import Image from "next/image";
import authentic from "@/assets/icons/authentic_focus.webp";
import on_time_delivery from "@/assets/icons/on_time_delivery.webp";
import after_sales_support from "@/assets/icons/after_sales_support.webp";
import custom_solutions from "@/assets/icons/custom_solutions.webp";
import premium_quality from "@/assets/icons/premium_quality.webp";
import trunky_wellness_experts from "@/assets/icons/trunky_wellness_experts.webp";

type Feature = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center mb-[18px] text-[#b79a7a]">
    {children}
  </div>
);

const features: Feature[] = [
  {
    id: 1,
    title: "AUTHENTIC & AYURVEDIC FOCUS",
    description:
      "Designs rooted in ancient Ayurvedic principles for effective therapies.",
    icon: (
       <IconWrapper>
      <Image src={authentic} alt="Authentic & Ayurvedic" width={34} height={34}  />
      </IconWrapper>
    ),
  },
  {
    id: 2,
    title: "PREMIUM QUALITY MATERIALS",
    description:
      "Using the finest wood, metals and accessories built to last.",
    icon: (
      <IconWrapper>
       <Image src={premium_quality} alt="Premium Quality" width={34} height={34}  />
      </IconWrapper>
    ),
  },
  {
    id: 3,
    title: "CUSTOM MADE SOLUTIONS",
    description:
      "Tailor-made equipment and interiors to fit your exact requirements.",
    icon: (
      <IconWrapper>
      <Image src={custom_solutions} alt="Authentic & Ayurvedic" width={34} height={34}  />
    
      </IconWrapper>
    ),
  },
  {
    id: 4,
    title: "TURNKEY WELLNESS EXPERTS",
    description:
      "From concept to handover, we handle everything under one roof.",
    icon: (
      <IconWrapper>
      <Image src={trunky_wellness_experts} alt="Authentic & Ayurvedic" width={34} height={34}  />
     
      </IconWrapper>
    ),
  },
  {
    id: 5,
    title: "ON-TIME DELIVERY & INSTALLATION",
    description:
      "Timely execution with professional installation support.",
    icon: (
      <IconWrapper>
      <Image src={on_time_delivery} alt="On-Time Delivery" width={34} height={34}  />
      </IconWrapper>
    ),
  },
  {
    id: 6,
    title: "AFTER SALES SUPPORT",
    description:
      "Reliable support for maintenance and long term relationships.",
    icon: (
      <IconWrapper>
      <Image src={after_sales_support} alt="After Sales Support" width={34} height={34}  />
      </IconWrapper>
    ),
  },
];

const WhyChooseEnsis: React.FC = () => {
  return (
    <section className="w-full bg-[#f8f5f1] text-[#2e2b28]">
      <Container>
        <AboutTitle title="Why Choose Ensis?" />

        <p className="text-center text-sm text-[#5e5a55] mb-[20px] max-w-3xl mx-auto font-semibold">
          We don&apos;t just sell products, we create complete wellness
          experiences.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[14px]">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-[#f3ede7] rounded-xl px-[18px] py-7 min-h-[220px] text-center border border-[rgba(194,174,153,0.15)] transition-transform duration-200 hover:-translate-y-[2px] flex items-center justify-center flex-col"
            >
              {feature.icon}

              <b className="mb-3 text-[14px] font-bold tracking-[0.4px] text-[#2d2a28]">
                {feature.title}
              </b>

              <p className="text-[14px] leading-[1.8] text-[#605a54]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseEnsis;