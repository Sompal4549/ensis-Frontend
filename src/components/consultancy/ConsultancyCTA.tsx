"use client";

import React from "react";
import { Container } from "../ui/Container";
import Image from "next/image";
import HeadsetIcon from "@/assets/consultancy/headset.webp";
import bg from "@/assets/consultancy/letsbuildbg.webp"


type CtaData = {
  badge: string;
  title: string;
  description: string;
  button: {
    label: string;
    href: string;
  };
};

const ctaData: CtaData = {
  badge: "READY TO GET STARTED?",
  title: "Let's Build Your Wellness Success Story",
  description:
    "Connect with our experts and take the first step towards your successful wellness business.",
  button: {
    label: "Book a Consultation",
    href: "#",
  },
};

export default function ConsultancyCTA() {
  return (
  <section>
  <Container>
    <div className="relative overflow-hidden rounded-[14px]">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat py-10"
        style={{
          backgroundImage: `url(${bg.src})`,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 grid min-h-[146px] grid-cols-1 items-center gap-6 px-5 py-5 md:grid-cols-[1fr_auto_280px] lg:px-10">
        {/* LEFT CONTENT */}
        <div className="flex items-center gap-4 lg:gap-5">
          {/* HEADSET ICON */}
          <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
            <Image src={HeadsetIcon} alt="Headset Icon"width={58} height={58} />
          </div>

          <div className="max-w-[520px]">
            <p className="text-[11px] font-semibold uppercase tracking-[1.8px] text-[#F4B16A]">
              {ctaData.badge}
            </p>

            <h2 className="mt-1 text-[24px] font-bold leading-[1.2] text-white">
              {ctaData.title}
            </h2>

            <p className="mt-2 text-[14px] text-white/90">
              {ctaData.description}
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-start md:justify-center">
          <a
            href={ctaData.button.href}
            className="inline-flex h-[52px] items-center justify-center rounded-lg bg-white px-7 text-[14px] font-semibold text-[#2563EB] shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <span className="text-[#2563EB]">

            {ctaData.button.label}
            </span>

            <span className="ml-4 text-[#2563EB]">→</span>
          </a>
        </div>

        {/* EMPTY COLUMN TO KEEP RIGHT IMAGE VISIBLE */}
        <div className="hidden h-full md:block" />
      </div>
    </div>
  </Container>
</section>
  );
}