"use client";
import React, {  useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import SubHeading from "./SubHeading";
import panchkarma from "@/assets/home/panchkarma.webp";
import shirodha from "@/assets/home/steam.webp";
import steam from "@/assets/home/panchkarma.webp";
import consultaion from "@/assets/home/consultation.webp";
import Image from "next/image";
import BookButton from "../ui/BookButton";
import {  getImageUrl } from "@/lib/api/api";

const fallbackImages: Record<string, any> = {
  "Panchkarma Suite Setup": panchkarma,
  "Shirodhara Room Setup": shirodha,
  "Steam Therapy Room Setup": steam,
  "Consultation Room Setup": consultaion,
};


interface WellnessRoomSetupsProps {
  sectionContent?: {
    subtitle?: string;
    heading?: string;
    description?: string;
    sectionButtonText?: string;
    sectionButtonPath?: string;
    cards?: Array<{ id?: string; title: string; image: string; tag?: string }>;
  };
}

const WellnessRoomSetups: React.FC<WellnessRoomSetupsProps> = ({ sectionContent = {} }) => {
  const defaultContent = {
  subtitle: sectionContent.subtitle ||"Complete Wellness Solutions",
  heading: sectionContent.heading ||"Complete Room\nSetups",
  description:sectionContent.description ||"Thoughtfully designed, perfectly crafted wellness rooms that reflect the essence of Ayurveda and modern luxury.",
  buttonText: sectionContent.sectionButtonText||"EXPLORE ROOM SETUPS",
  buttonPath: sectionContent.sectionButtonPath ||"/products",
  // Admin sends `cards`, frontend fallback uses `cards` to match
  cards:sectionContent.cards ||[
    { id: "1", title: "Panchkarma Suite Setup", image: "", tag: "" },
    { id: "2", title: "Shirodhara Room Setup", image: "", tag: "" },
    { id: "3", title: "Steam Therapy Room Setup", image: "", tag: "" },
    { id: "4", title: "Consultation Room Setup", image: "", tag: "" },
  ],
};

  const [hovered, setHovered] = useState<number | null>(null);
  const content = defaultContent;


  const headingLines = (content.heading || "").split("\n");
  // Use `cards` from admin API (fallback to defaultContent.cards)
  const cards = (content as any).cards?.length ? (content as any).cards : defaultContent.cards;

  return (
    <section className="w-full">
      <Container className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">

        {/* Left Content */}
        <div className="flex flex-col justify-center h-full">
          <SubHeading text={content.subtitle} className="uppercase tracking-[4px] text-[#8f8777] text-xs font-semibold mb-2">
          </SubHeading>

          <h2 className="text-[#0f2518] text-4xl md:text-3xl font-semibold mb-3">
            {headingLines.map((line: string, i: number) => (
              <React.Fragment key={i}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>
            <p className="text-[#0f2518] text-xs mb-3">
              {content.description}
            </p>
          <div className="max-w-[220px]">
            <BookButton text={content.buttonText} path={content.buttonPath} />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card: { id?: string; title: string; image: string; tag?: string }, index: number) => (
            <div
              key={card.id || index}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="relative overflow-hidden rounded-2xl h-[100%] cursor-pointer group"
            >
              {/* Image */}
              <Image width={250} height={500}
                src={card.image ? getImageUrl(card.image) : fallbackImages[card.title] || panchkarma}
                alt={card.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${hovered === index ? "scale-105" : "scale-100"
                  }`}
                  crossOrigin="anonymous"
              />

              {/* Tag badge */}
              {card.tag && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#0f2518] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                  {card.tag}
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex items-end justify-between">
                <h3 className="text-white text-md font-semibold max-w-45 leading-5">
                  {card.title}
                </h3>

                <button
                  className={`min-w-[36px] h-[36px] rounded-full border border-white/40 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${hovered === index
                    ? "bg-white text-black"
                    : "text-white"
                    }`}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WellnessRoomSetups;