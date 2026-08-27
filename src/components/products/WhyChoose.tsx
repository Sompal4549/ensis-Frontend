"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import Image from "next/image";
import whyChooseBg from "@/assets/products/whyChooseBg.webp"
import ayurvedic from "@/assets/icons/panchkarma_centers.webp"
import customized from "@/assets/icons/customized.webp";
import global from "@/assets/products/global_shippning.png"
import premium_quality from "@/assets/icons/premium_quality.webp"

const features = [
  "Authentic Ayurvedic Design",
  "Premium Quality Materials",
  "Custom Solutions for Every Space",
  "Expert Guidance & Support",
  "Timely Delivery Worldwide",
];

const stats = [
  {
    icon: customized,
    label: "Custom\nManufacturing",
  },
  {
    icon: premium_quality,
    label: "Premium\nQuality",
  },
  {
    icon: ayurvedic,
    label: "Ayurvedic\nExpertise",
  },
  {
    icon: global,
    label: "Global\nSupport",
  },
];

export interface WhyChooseContent {
  whyChoose: {
    title: string;
    reasons: string[];
    button: {
      label: string;
      url: string;
    };
  };
  welcomeToEnsis: {
    highlight: string;
    title: string;
    description: string;
    features:{id: string, image: string, title: string}[]
  };
}

const sanitizeDescription = (html: string): string => {
  if (!html) return "";
  if (html.includes("StartFragment") || html.includes("data-turn-id")) {
    return html
      .replace(/<!--StartFragment-->|<!--EndFragment-->/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return html;
};

const fallbackContent: WhyChooseContent = {
  whyChoose: {
    title: "WHY CHOOSE ENSIS",
    reasons: [
      "Authentic Ayurvedic Design",
      "Premium Quality Materials",
      "Custom Solutions for Every Space",
      "Expert Guidance & Support",
      "Timely Delivery Worldwide",
    ],
    button: { label: "View All Products", url: "/products" },
  },
  welcomeToEnsis: {
    highlight: "WELCOME TO ENSIS",
    title: "Crafting Wellness Spaces That Heal",
    description: "<p>We combine Ayurvedic wisdom with modern engineering to deliver complete wellness environments across India and worldwide.</p>",
    features: [
      { id: "1", image: customized.src, title: "Custom\nManufacturing" },
      { id: "2", image: premium_quality.src, title: "Premium\nQuality" },
      { id: "3", image: ayurvedic.src, title: "Ayurvedic\nExpertise" },
      { id: "4", image: global.src, title: "Global\nSupport" },
    ],
  },
};

export default function WhyChoose({sectionContent}: { sectionContent?: WhyChooseContent }) {
  const resolved = { ...fallbackContent, ...sectionContent };
  if (!resolved.whyChoose) resolved.whyChoose = fallbackContent.whyChoose;
  if (!resolved.welcomeToEnsis) resolved.welcomeToEnsis = fallbackContent.welcomeToEnsis;
  console.log(resolved, "why choose")
  return (
    <section className="wca-body w-full bg-[#f5efe6]">
      <Container>
        <div className="flex flex-col md:flex-row min-h-[200px] rounded-xl relative overflow-hidden rounded-[28px]">
<Image src={whyChooseBg}  fill alt="why choose bg" className="object-center object-cover z-0" />
          {/* ── LEFT PANEL ── */}
          <div className="relative bg-[#183b17] flex flex-col justify-between p-5 sm:p-7 md:p-8 
                          w-[80%] md:w-[30%] shrink-0 overflow-hidden">
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

            <div>
              <p className="font-semibold tracking-[0.22em] text-[#c8a45d] uppercase mb-4 text-base">
                {resolved.whyChoose.title}
              </p>
              <ul className="space-y-4 mb-6">
                {resolved.whyChoose.reasons.map((f) => (
                  <li key={f} className="flex items-start gap-4">
                    <span className="mt-[2px] shrink-0 w-[15px] h-[15px] rounded-full border border-[#c8a45d]/60 flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="2.5" fill="#c8a45d" opacity="0.85"/>
                      </svg>
                    </span>
                    <span className="text-base text-white/85 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <GreenButton rightIcon={<ArrowRight size={11} className="text-[#c8a45d]" />} text={resolved.whyChoose.button.label} path={resolved.whyChoose.button.url}/>
          </div>

          {/* ── CENTRE — image ── */}
          <div className="relative w-[30%] shrink-0 overflow-hidden">
            {/* <img
              src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=80&auto=format&fit=crop"
              alt="Ayurvedic wellness setup"
              className="w-full h-full object-cover object-center"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#183b17]/30 via-transparent to-[#f5efe6]/70 md:to-[#f5efe6]/40 pointer-events-none" />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="bg-white/50 flex flex-col justify-center p-5 sm:p-7 md:p-8 flex-1 relative">

            <p className="text-base font-semibold tracking-[0.22em] text-[#a9742a] uppercase mb-2">
              {resolved.welcomeToEnsis.highlight}
            </p>

            <h2 className="wca-serif text-[1.35rem] sm:text-[1.6rem] lg:text-[1.85rem] leading-[1.1] font-[600] text-[#1a1a1a] mb-2.5">
              {resolved.welcomeToEnsis.title}
            </h2>

            <p className="text-base text-[#5a5040] leading-relaxed mb-4 max-w-[340px]" dangerouslySetInnerHTML={{__html: sanitizeDescription(resolved.welcomeToEnsis.description)}}>
            </p>

            {/* Stats row — icons only, no bg/border */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {resolved.welcomeToEnsis.features.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center justify-center w-8 h-8">
                    <Image src={s.image} alt={s.title} width={30} height={30} className="object-fill object-center" />
                  </div>
                  <span className="text-base whitespace-pre-line">
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

          <div className="w-60">
            <BookButton text="Book a Consultation" rightIcon={<ArrowRight size={11} className="text-white" />} />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}