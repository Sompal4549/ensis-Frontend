import React from "react";
import { Container } from "../ui/Container";
import authentic_ayurveda from "@/assets/home/authentic_ayurveda_icon.webp";
import holistic_wellbeing from "@/assets/home/holistic_wellbeing.webp";
import timeless_care from "@/assets/home/timeless_care.webp";
import Image from "next/image";
import GreenButton from "../ui/GreenButton";
import { getComponentContent, getImageUrl } from "@/app/lib/api";
import SubHeading from "./SubHeading";
import { features } from "process";

const fallbackImages: Record<string, any> = {
  "Authentic Ayurveda": authentic_ayurveda,
  "Holistic Well-being": holistic_wellbeing,
  "Timeless Care": timeless_care,
};

const defaultContent = {
  features: [
    { title: "Authentic Ayurveda", description: "Rooted in ancient wisdom", image: authentic_ayurveda, tag: "" },
    { title: "Holistic Well-being", description: "For mind, body & soul", image: holistic_wellbeing, tag: "" },
    { title: "Timeless Care", description: "Lasting transformation", image: timeless_care, tag: "" },
  ],
  buttonText: "Get In Touch",
  buttonPath: "/contact",
};

export default async function FullWidthFeatures(data?: { features?: any[]; buttonText?: string; buttonPath?: string }) {
  const content = {
    features: data?.features ?? defaultContent.features,
    buttonText: data?.buttonText ?? defaultContent.buttonText,
    buttonPath: data?.buttonPath ?? defaultContent.buttonPath,
  };
  // const content = defaultContent
  return (
    <section className="w-full bg-[#0d2a17] border border-[#3d5c39]">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
          {content.features.map((item: { title: string; description?: string; image: any; tag?: string }, index: number) => (
            <div
              key={index}
              className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 min-w-0"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <Image
                  src={getImageUrl(item?.image) || fallbackImages[item.title] || authentic_ayurveda}
                  alt={item?.title}
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                  style={{ height: "auto" }}
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="text-[#f5e7c8] text-base font-semibold leading-tight font-serif">
                  {item.title}
                </h3>
                <p className="text-[#d2c3a1] text-xs mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}

          <div className="w-full lg:w-auto flex justify-center lg:justify-end font-semibold my-auto">
            <GreenButton text={content.buttonText} path={content.buttonPath} />
          </div>
        </div>
      </Container>
    </section>
  );
}