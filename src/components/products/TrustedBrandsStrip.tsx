"use client";

import React from "react";
import { Container } from "../ui/Container";

const brands = [
  {
    name: "ANANDA",
    subtitle: "Spa & Resorts",
    logo: "◉",
  },
  {
    name: "SIX SENSES",
    subtitle: "Hotels • Resorts • Spas",
    logo: "● ● ●",
  },
  {
    name: "TAJ",
    subtitle: "Hotels • Palaces • Resorts • Safaris",
    logo: "✦",
  },
  {
    name: "KAMA",
    subtitle: "AYURVEDA",
    logo: "✧",
  },
  {
    name: "THE LEELA",
    subtitle: "Palaces • Hotels • Resorts",
    logo: "ℒ",
  },
  {
    name: "JW MARRIOTT",
    subtitle: "Hotels & Resorts",
    logo: "⬢",
  },
];

export default function TrustedBrandsStrip() {
  return (
    <section className="w-full bg-[#f8f3ec]">
      <Container>
        <div className="border border-[#e6d6bf] rounded-2xl bg-[#faf6f1] px-3 py-3.5">

          {/* Heading */}
          <div className="flex items-center justify-center mb-3.5">
            <div className="h-px w-8 sm:w-12 bg-[#d8c2a3]" />
            <p className="px-3 text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold text-[#b2854f] text-center uppercase whitespace-nowrap">
              Trusted By Leading Wellness Centers Worldwide
            </p>
            <div className="h-px w-8 sm:w-12 bg-[#d8c2a3]" />
          </div>

          {/* Brands — flex with vertical dividers */}
          <div className="flex flex-wrap xl:flex-nowrap items-center justify-center divide-x divide-[#e2d0b8]">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-2 xl:py-0 w-1/2 md:w-1/3 xl:w-auto xl:flex-1"
              >
                <div className="text-[#a67945] text-base sm:text-lg mb-1.5 opacity-90">
                  {brand.logo}
                </div>
                <h3 className="text-[#3b2b1d] text-[11px] sm:text-[12px] tracking-[0.15em] font-semibold">
                  {brand.name}
                </h3>
                <p className="mt-0.5 text-[8px] sm:text-[9px] tracking-[0.13em] uppercase text-[#8d7b68] leading-relaxed">
                  {brand.subtitle}
                </p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}