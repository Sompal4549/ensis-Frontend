"use client";

import React from "react";
import { Container } from "../ui/Container";
import SubHeading from "../home/SubHeading";
import ananda from "@/assets/products/ananda_image.png"
import six_senses from "@/assets/products/six_senses.png"
import taj from "@/assets/products/taj.png"
import kama from "@/assets/products/kama.png"
import the_leela from "@/assets/products/the_leela.png"
import jw_marriott from "@/assets/products/jw_marriott.png"
import Image from "next/image";

const brands = [
  {
    name: "ANANDA",
    subtitle: "Spa & Resorts",
    logo: six_senses,
  },
  {
    name: "SIX SENSES",
    subtitle: "Hotels • Resorts • Spas",
    logo: six_senses,
  },
  {
    name: "TAJ",
    subtitle: "Hotels • Palaces • Resorts • Safaris",
    logo: kama,
  },
  {
    name: "KAMA",
    subtitle: "AYURVEDA",
    logo: kama,
  },
  {
    name: "THE LEELA",
    subtitle: "Palaces • Hotels • Resorts",
    logo: jw_marriott,
  },
  {
    name: "JW MARRIOTT",
    subtitle: "Hotels & Resorts",
    logo: jw_marriott,
  },
];

export default function TrustedBrandsStrip() {
  return (
    <section className="w-full bg-[#f8f3ec]">
      <Container>
        <div className="border border-[#e6d6bf] rounded-2xl bg-[#faf6f1] px-3 py-3.5">

          {/* Heading */}
          <div className="flex items-center justify-center mb-3.5">
        
             <SubHeading text="Trusted By Leading Wellness Centers Worldwide" className=' text-[#d5ad6a] text-center' />
          </div>

          {/* Brands — flex with vertical dividers */}
          <div className="flex flex-wrap xl:flex-nowrap items-center justify-center divide-x divide-[#e2d0b8]">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-2 xl:py-0 w-1/2 md:w-1/3 xl:w-auto xl:flex-1"
              >
                <div className="text-[#a67945] text-base sm:text-lg mb-1.5 opacity-90 ">
                  <Image src={brand.logo} alt={brand.name} width={100} height={100} className="object-cover object-center max-h-25 max-w-25" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}