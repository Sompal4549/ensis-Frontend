"use client";

import React from "react";

import { Container } from "../ui/Container";

import Image from "next/image";
import made_in from "@/assets/products/made_in_india.webp"
import seven_days from "@/assets/products/sevem_days.webp"
import pan_india from "@/assets/products/pan_india.webp";
import export_packing from "@/assets/products/export_packining.webp"
import lifetime_support from "@/assets/products/lifetime_suppor.webp"

const features = [
  {
    icon: made_in,
    title: "Made in India",
    subtitle: "Proudly Manufactured",
  },
  {
    icon: seven_days,
    title: "7 Days Dispatch",
    subtitle: "On All Porducts",
  },
  {
    icon: pan_india,
    title: "Pan India Installion",
    subtitle: "By Expert Team",
  },
  {
    icon: export_packing,
    title: "Export Packing",
    subtitle: "Safe & Secure",
  },
  {
    icon: lifetime_support,
    title: "Lifetime Support",
    subtitle: "For All Products",
  },
];

export default function ProductFeatureStrip() {
  return (
    <section className="static md:absolute left-0 right-0 bottom-0 md:translate-y-1/2 z-30">
      <Container className="py-0">
        <div className="w-full bg-gradient-to-r from-[#012c20] via-[#013727] to-[#012c20] rounded-xl px-3 py-2 border border-[#C9972A] ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent">
          <div className="flex flex-wrap gap-y-4 md:gap-y-0 xl:flex-nowrap justify-between">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`
    relative flex items-center justify-start gap-4 md:justify-center
    w-full md:w-1/3 xl:w-1/6 flex-none
    px-4 md:py-2
    ${index !== features.length - 1 ? "xl:border-r border-[#9f7a43]/30" : ""}
  `}
              >
                {/* Vertical Divider for smaller screens */}
                {index !== features.length - 1 && (
                  <div className="absolute right-0 top-1/2 h-6 -translate-y-1/2 border-r border-[#9f7a43]/20 hidden md:block xl:hidden" />
                )}

                <div className="shrink-0">
                  <Image
                    className="text-[#c4934d]"
                    height={26}
                    width={26}
                    src={Icon}
                    alt={item.title}
                  />
                </div>

                <div className="leading-tight">
                  <p className="text-base font-semibold  text-white">
                    {item.title}
                  </p>

                  <p className="text-base font-normal  text-white mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </Container>
    </section>
  );
}