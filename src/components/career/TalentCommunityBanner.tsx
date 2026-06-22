"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import talentBg from "@/assets/career/contact_banner.webp"

const features = [
  "Be part of a purpose-driven team",
  "Work on meaningful projects",
  "Grow your career with us",
];
export interface CareerTalentCommunity{
  bgImage:{image:string; alt:string;}
  heading:string;
  description:string;
  features:{image: string; label:string;}[];
  newsLetterCard:{
    title:string;
    description:string;
    buttonText:string;
  }
}
const TalentCommunityBanner = ({sectionContent}:CareerTalentCommunity) => {
  return (
    <section className="relative">
      {/* Background Image */}
      <Image
        src={sectionContent.bgImage.image||talentBg} // Your background image
        alt="Ready to Create Impact"
        fill
        priority
        className="object-cover"
      />


      {/* Content */}
      <div className="relative z-10 grid min-h-[280px] lg:grid-cols-[1.2fr_300px] items-center gap-10 px-6 py-8 sm:px-8 lg:px-12">
        {/* Left Content */}
        <div className="max-w-md lg:ml-auto">
          <h2 className="font-serif text-xl text-[#d4a35c] sm:text-2xl font-semibold">
            {sectionContent.heading||'Ready to Create Impact?'}
          </h2>

          <p className="mt-4 text-sm text-white/80 max-w-105">
            {sectionContent.description||`If you're passionate about wellness, design and innovation,
            we'd love to hear from you.`}
          </p>

          <ul className="mt-6 space-y-4">
            {sectionContent.features.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-white/90"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#c89a4b]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#b98b43]/40 bg-[#032116]/75 p-6 backdrop-blur-sm">
          {/* Decorative Flower */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full border border-[#b98b43]/20" />
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 rounded-full border border-[#b98b43]/20" />

          <h3 className="text-base font-semibold uppercase tracking-wide text-[#d4a35c]">
            {sectionContent.newsLetterCard.title||`Join Our Talent Community`}
          </h3>

          <p className="mt-3 text-xs leading-6 text-white/70">
            {sectionContent.description||"Receive updates on new openings and career opportunities."}
          </p>

          <form className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-md border border-[#d7d7d7]/20 bg-white px-4 text-sm text-black outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-md bg-[#c89a4b] text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#b48235]"
            >
              {sectionContent.button||"Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TalentCommunityBanner;