"use client";

import React from "react";
import {
  Leaf,
  Flower2,
  Hammer,
  ShieldCheck,
  Building2,
  Globe,
} from "lucide-react";
import { Container } from "../ui/Container";
import sustainable_material from "@/assets/products/sustainable_material.png"
import ayurvedic_heritage from "@/assets/products/ayurvedic_heritage.png"
import handmade_excellence from "@/assets/products/handmade_excellence.png"
import therapist_approved from "@/assets/products/therapist_approved.png"
import hotel_spa_quality from "@/assets/products/hotel_and_spa_quality.png"
import global_shipping from "@/assets/products/global_shippning.png"
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
    <section className="w-full bg-gradient-to-r from-[#012c20] via-[#013727] to-[#012c20] border-y border-[#9f7a43]/20 py-2">
      <Container>
        <div className="flex flex-wrap xl:flex-nowrap justify-between ">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className={`
    relative flex items-center justify-center gap-3
    w-1/2 md:w-1/3 xl:w-1/6 flex-1
    ${index !== features.length - 1 ? "xl:border-r border-[#9f7a43]/30" : ""}
  `}
              >
                {/* Vertical Divider for smaller screens */}
                {index % 2 === 0 && index !== features.length - 1 && (
                  <div className="absolute right-0 top-1/2 h-6 -translate-y-1/2 border-r border-[#9f7a43]/20 xl:hidden" />
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
                  <p className="text-xs font-semibold  text-white">
                    {item.title}
                  </p>

                  <p className="text-[10px] font-normal  text-white mt-1">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}