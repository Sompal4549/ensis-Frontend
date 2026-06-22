"use client";

import { Container } from "../ui/Container";
import sustainable_material from "@/assets/products/sustainable_material.png"
import ayurvedic_heritage from "@/assets/products/ayurvedic_heritage.png"
import handmade_excellence from "@/assets/products/handmade_excellence.png"
import therapist_approved from "@/assets/products/therapist_approved.png"
import hotel_spa_quality from "@/assets/products/hotel_and_spa_quality.png"
import global_shipping from "@/assets/products/global_shippning.png"
import Image, { StaticImageData } from "next/image";


const features = [
  {
    icon: sustainable_material,
    title: "SUSTAINABLE",
    subtitle: "MATERIALS",
  },
  {
    icon: ayurvedic_heritage,
    title: "AYURVEDIC",
    subtitle: "HERITAGE",
  },
  {
    icon: handmade_excellence,
    title: "HANDCRAFTED",
    subtitle: "EXCELLENCE",
  },
  {
    icon: therapist_approved,
    title: "THERAPIST",
    subtitle: "APPROVED",
  },
  {
    icon: hotel_spa_quality,
    title: "HOTEL & SPA",
    subtitle: "QUALITY",
  },
  {
    icon: global_shipping,
    title: "GLOBAL",
    subtitle: "SHIPPING",
  },
];

interface WellnessFeature {
  image: string|StaticImageData; // Assuming image is a path/URL
  title: string;
  subtitle: string;
}

export interface WellnessFeatureStripContent {
  features: WellnessFeature[];
}

export default function WellnessFeatureStrip({ sectionContent }: { sectionContent: WellnessFeatureStripContent }) {
  const features = sectionContent.features;
  const count = features.length;

  const getGridCols = () => {
    if (count <= 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2 md:grid-cols-4";
    if (count === 5) return "grid-cols-2 md:grid-cols-5 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1";
    return "grid-cols-2 md:grid-cols-3 xl:grid-cols-6";
  };

  return (
    <section className="w-full bg-gradient-to-r from-[#012c20] via-[#013727] to-[#012c20] border-y border-[#9f7a43]/20">
      <Container>
        <div className={`grid ${getGridCols()}`}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`relative flex items-center justify-center gap-3 py-2 ${
                index !== count - 1 ? "border-r border-[#9f7a43]/30" : ""
              }`}
            >
              {/* Mobile vertical divider — sirf even index pe, last item pe nahi */}
              {index % 2 === 0 && index !== count - 1 && (
                <div className="absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#9f7a43]/20 md:hidden" />
              )}

              <div className="shrink-0">
                <Image
                  className="text-[#c4934d]"
                  height={26}
                  width={26}
                  src={item.image}
                  alt={item.title}
                />
              </div>

              <div className="leading-tight">
                <p className="text-xs font-semibold text-[#f7f1e8]">{item.title}</p>
                <p className="text-xs font-semibold text-[#f7f1e8] mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}