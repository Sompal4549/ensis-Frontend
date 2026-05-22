import React from "react";
import { Leaf } from "lucide-react";
import { Container } from "../ui/Container";
import authentic_ayurveda from "@/assets/home/authentic_ayurveda_icon.webp";
import holistic_wellbeing from "@/assets/home/holistic_wellbeing.webp";
import timeless_care from "@/assets/home/timeless_care.webp";
import Image from "next/image";
import flower from "@/assets/about/lotus.png";
import LotusButton from "../button/LotusButton";
const features = [
  {
    title: "Authentic Ayurveda",
    subtitle: "Rooted in ancient wisdom",
    img: authentic_ayurveda
  },
  {
    title: "Holistic Well-being",
    subtitle: "For mind, body & soul",
    img: holistic_wellbeing
  },
  {
    title: "Timeless Care",
    subtitle: "Lasting transformation",
    img:  timeless_care,
  },
];

export default function FullWidthFeatures() {
  return (
    <section className="w-full bg-[#0d2a17] border border-[#3d5c39]">
      <Container>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
  {features.map((item, index) => (
    <div
      key={index}
      className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 min-w-0"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 shrink-0">
        <Image
          src={item.img}
          alt={item.title}
          width={28}
          height={28}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <h3 className="text-[#f5e7c8] text-base  font-semibold leading-tight font-serif">
          {item.title}
        </h3>

        <p className="text-[#d2c3a1] text-xs mt-1 leading-snug">
          {item.subtitle}
        </p>
      </div>
    </div>
  ))}

  <div className="w-full lg:w-auto flex justify-center lg:justify-end font-semibold">
    <LotusButton href="/contact" text="Get In Touch"/>
  </div>
</div>

          {/* CTA Button */}
       
      </Container>
    </section>
  );
}