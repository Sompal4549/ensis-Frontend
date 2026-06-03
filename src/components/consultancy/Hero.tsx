"use client";

import React from "react";
import consultancyBanner from "@/assets/consultancy/consultancy.webp"
import { Container } from "../ui/Container";
import Image, { StaticImageData } from "next/image";
import industry from "@/assets/consultancy/industry_expertise.webp"
import solutions from "@/assets/consultancy/customized-solutions.webp"
import support from "@/assets/consultancy/end_to_end.webp"
import projects from "@/assets/consultancy/projects.webp"
import clients from "@/assets/consultancy/happy_clients.webp"
import experience from "@/assets/consultancy/experience.webp"
import support360 from "@/assets/consultancy/business_setup.webp"
import { Download } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: string | StaticImageData;
};

type Stat = {
  value: string;
  title: string;
  description: string;
  icon: string | StaticImageData;
};

const consultancyData = {
  badge: "CONSULTANCY SERVICES",

  title: {
    first: "Expert Guidance for",
    second: "Successful",
    highlight: " Wellness",
    third: " Ventures",
  },

  description:
    "From concept to execution, we provide end-to-end consultancy to help you build, grow, and scale a successful Panchkarma or Spa business.",

  buttons: {
    primary: {
      label: "Book a Consultation",
      href: "#",
    },
    secondary: {
      label: "Download Brochure",
      href: "#",
    },
  },

  features: [
    {
      title: "Industry Expertise",
      description:
        "Years of experience in wellness & spa industry",
      icon: industry,
    },
    {
      title: "Customized Solutions",
      description:
        "Tailored strategies for your unique business goals",
      icon: solutions,
    },
    {
      title: "End-to-End Support",
      description:
        "Complete guidance from planning to operations",
      icon: support,
    },
  ] as Feature[],

  stats: [
    {
      value: "150+",
      title: "Projects Consulted",
      description: "Across India & Globally",
      icon: projects,
    },
    {
      value: "100+",
      title: "Happy Clients",
      description: "Successful & Growing",
      icon: clients,
    },
    {
      value: "10+",
      title: "Years of Experience",
      description: "In Wellness Industry",
      icon: experience,
    },
    {
      value: "360°",
      title: "Business Support",
      description: "From Start to Scale",
      icon: support360,
    },
  ] as Stat[],
};

export default function ConsultancyHero() {
  return (
  <section className="overflow-hidden bg-[#f7f5f2]">
      {/* BG IMAGE */}
  <div className="relative z-0">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${consultancyBanner.src})`,
      }}
    />

     <Container className="relative z-10">
        <div className="grid min-h-[70vh] grid-cols-1 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
         <div className="max-w-[700px] flex flex-col justify-center">
    <p className="mb-4 text-[12px] font-bold tracking-[1.8px] text-[#d66a38] uppercase">
              {consultancyData.badge}
            </p>

       <h1 className="max-w-[650px] text-[34px] leading-[1.1] font-semibold lg:text-5xl">
        <span className="font-sans">

        
              {consultancyData.title.first}
              <br />
              {consultancyData.title.second}
              <span className="text-[#2563eb]">
                {consultancyData.title.highlight}
              </span>
              {consultancyData.title.third}
              </span>
            </h1>

           <p className="mt-4 max-w-[520px] text-[15px]">
              {consultancyData.description}
            </p>

            {/* FEATURES */}
           <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {consultancyData.features.map((item) => (
                <div key={item.title} className="flex gap-4">
                  {/* ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf3ff]">
                    {/* ADD FEATURE ICON HERE */}
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                      />
                  </div>

                  <div>
                   <h3 className="text-xs font-semibold">
                      {item.title}
                    </h3>

                <p className="mt-1 text-[11px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={consultancyData.buttons.primary.href}
                className="inline-flex h-[50px] items-center justify-center rounded-lg bg-[#2563eb] px-4 text-[14px] font-semiboldd text-white transition hover:opacity-90"
              >
                <span className="text-white">

                {consultancyData.buttons.primary.label}

                </span>
                <span className="ml-4 text-white">→</span>
              </a>

              <a
                href={consultancyData.buttons.secondary.href}
                className="inline-flex h-[50px] items-center justify-center rounded-lg border-2 border-[#9fa0a1] bg-white px-4 text-[14px] font-semibold"
              >
                {consultancyData.buttons.secondary.label}

                <span className="ml-4"><Download size={16} /></span>
              </a>
            </div>
          </div>
        </div>

    
      </Container>
      </div>
    <Container className="md:-mt-10 relative z-20">
            {/* STATS CARD */}
        <div>
          <div className="rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {consultancyData.stats.map((item, index) => (
                <div
                  key={item.title}
                  className="relative flex items-center gap-5 px-8 py-8 lg:px-10"
                >
                  {/* VERTICAL DIVIDER */}
                  {index !== 0 && (
                    <div className="absolute left-0 top-1/2 hidden h-[58px] -translate-y-1/2 border-l border-[#e6e8ee] xl:block" />
                  )}

                  {/* ICON */}
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full
                    ${
                      index === 0
                        ? "bg-[#fff3e5]"
                        : index === 1
                        ? "bg-[#eef3ff]"
                        : index === 2
                        ? "bg-[#edf8ef]"
                        : "bg-[#f6ecff]"
                    }`}
                  >
                    {/* ADD STAT ICON HERE */}
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={32}
                      height={32}
                    />
                  </div>

                  <div>
                    <div className="text-2xl font-bold leading-none">
                      {item.value}
                    </div>

                    <div className="mt-3 text-sm font-semibold">
                      {item.title}
                    </div>

                    <div className="mt-1 text-xs">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}