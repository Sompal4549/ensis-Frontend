import React from "react";
import durable_and_highzenic from "@/assets/products/durable_and_highzenic.webp";
import easy_mobility from "@/assets/products/easy_mobility.webp"
import erogonomic_handle from "@/assets/products/erogonomic_handle.webp"
import premium_solid_wood from "@/assets/products/premium_solid_wood.webp"
import raised_edge from "@/assets/products/raised_edge.webp"
import spaciour_three_selves from "@/assets/products/spaciour_three_selves.webp"
import Image from "next/image";
const features = [
  {
    title: "Premium Solid Wood",
    desc: "Made from high quality seasoned hardwood.",
    icon: premium_solid_wood,
  },
  {
    title: "Spacious 3 Shelves",
    desc: "Ample space to keep oils, utensils, towels and more.",
    icon: spaciour_three_selves,
  },
  {
    title: "Raised Edge Design",
    desc: "Raised edges on all shelves prevent items from falling.",
    icon: raised_edge,
  },
  {
    title: "Easy Mobility",
    desc: "Smooth rolling 360° caster wheels.",
    icon: easy_mobility,
  },
  {
    title: "Ergonomic Handle",
    desc: "Comfortable handle for easy push and pull.",
    icon: erogonomic_handle,
  },
  {
    title: "Durable & Hygienic",
    desc: "Polished wood finish, easy to clean and maintain.",
    icon: durable_and_highzenic,
  },
];

export default function ProductFeatures() {
  return (
    <div className="bg-[#f5f0e8] p-2">
      {/* Description */}
      <p className="text-base">
        Expertly crafted wooden trolley designed for Panchkarma therapies.
        Ideal for keeping oils, powders, towels and accessories organized
        and within easy reach. Durable, smooth mobility and easy to clean.
      </p>

      {/* Features header */}
      <h2 className="text-base font-semibold tracking-[0.22em] my-2 text-[#4a6741]">
        Features
      </h2>

      {/* Feature list */}
      <ul className="flex flex-col gap-1.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-4">
            {/* Icon circle */}
            <div className="shrink-0 rounded-full border border-[#4a6741] flex items-center justify-center text-[#4a6741]">
              <Image src={feature.icon} width={20} height={20} alt={feature.title} className="object-contain"/>
            </div>
            {/* Text */}
            <div className="pt-0.5">
              <p className="text-base font-semibold leading-tight mb-0.5">{feature.title}</p>
              <p className="text-base leading-snug font-medium">{feature.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}