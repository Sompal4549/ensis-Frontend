"use client";

import React from "react";
import { Container } from "../ui/Container";
import Image from "next/image";
import HeadsetIcon from "@/assets/consultancy/headset.webp";
import bg from "@/assets/consultancy/letsbuildbg.webp"
import BookButton from "../ui/BookButton";


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
        className="absolute inset-0 bg-cover  bg-no-repeat"
        style={{
          backgroundImage: `url(${bg.src})`,
          backgroundPosition: "right center",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 grid min-h-[160px] grid-cols-1 items-center gap-6 px-5 py-5 md:grid-cols-[1fr_auto_380px] lg:px-10">
        {/* LEFT CONTENT */}
        <div className="flex items-center gap-4 lg:gap-5">
          {/* HEADSET ICON */}
          <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm">
            <Image src={HeadsetIcon} alt="Headset Icon"width={58} height={58} />
          </div>

          <div className="max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-[1.8px] text-[#F4B16A]">
              {ctaData.badge}
            </p>

            <h2 className="mt-3 text-[24px] font-bold leading-[1.2] text-white">
              {ctaData.title}
            </h2>

            <p className="mt-2 text-[14px] text-white max-w-[450px]">
              {ctaData.description}
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-start md:justify-center">
          <BookButton text={ctaData.button.label} path={ctaData.button.href} />
        </div>

        {/* EMPTY COLUMN TO KEEP RIGHT IMAGE VISIBLE */}
        <div className="hidden h-full md:block" />
      </div>
    </div>
  </Container>
</section>
  );
}