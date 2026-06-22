// WhyWorkSection.tsx
import React from "react";
import Image, { StaticImageData } from "next/image";
import flower from "@/assets/about/lotus.png";
import { Container } from "../ui/Container";
interface CardItem {
  title: string;
  description: string;
  icon: string | StaticImageData;
}



export interface WhyWorkProps{
  bgImage:{image:string; alt:string};
  title1:string;
  title2:string;
heading: string;
description:string;
cards:CardItem[]
}
const cards: CardItem[] = [
  {
    title: "Meaningful Impact",
    description:
      "Create spaces that heal, inspire and transform lives.",
    icon: flower,
  },
  {
    title: "Growth & Learning",
    description:
      "Opportunities to learn, evolve and lead the change.",
    icon: flower,
  },
  {
    title: "Collaborative Culture",
    description:
      "Work with passionate people in a respectful and inclusive environment.",
    icon: flower,
  },
  {
    title: "Wellness First",
    description:
      "We care for our team's well-being – physical, mental and emotional.",
        icon: flower,
  },
  {
    title: "Integrity & Trust",
    description:
      "Built on honesty, transparency and long-term relationships.",
        icon: flower,
  },
];
const WhyWorkSection = ({sectionContent}:{sectionContent:WhyWorkProps}) => {
  return (
    <section className="relative overflow-hidden mt-2">
      {/* Background Image */}
      <Image
        src="/images/why-work-bg.png"
        alt="Background"
        fill
        className="object-cover -z-10"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#FCFAF7]/90 -z-10" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[380px_1fr] items-start">
          {/* Left Content */}
          <div className="max-w-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-[#2C2C2C] font-semibold">
              {sectionContent.heading||"Why Work At Ensis?"}
            </p>

            <h2 className="text-2xl leading-tight text-[#111] font-semibold">
              {sectionContent.title1||"A Purpose"}
              <br />
              {sectionContent.title2||"Beyond Profit"}
            </h2>

            <p className="mt-2 text-[15px] text-[#555]">
              {sectionContent.description||`We're not just creating interiors and equipment, we're
              crafting experiences that transform lives. Join a team
              that believes in purpose over profit and wellness over
              everything.`}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {sectionContent.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-[#E7E1D9] bg-white/70 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={48}
                    height={48}
                  />
                </div>

                <h3 className="mb-2 text-sm font-semibold text-[#222]">
                  {card.title}
                </h3>

                <p className="text-xs">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyWorkSection;