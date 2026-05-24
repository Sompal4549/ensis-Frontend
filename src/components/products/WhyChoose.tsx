"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import Image from "next/image";
import whyChooseBg from "@/assets/products/whyChooseBg.png"

const features = [
  "Authentic Ayurvedic Design",
  "Premium Quality Materials",
  "Custom Solutions for Every Space",
  "Expert Guidance & Support",
  "Timely Delivery Worldwide",
];

const stats = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C14 3 7 8 7 14.5C7 18.09 10.13 21 14 21C17.87 21 21 18.09 21 14.5C21 8 14 3 14 3Z" stroke="#c8a45d" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 21.5C10 23.43 11.79 25 14 25C16.21 25 18 23.43 18 21.5" stroke="#c8a45d" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "Custom\nManufacturing",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#c8a45d" strokeWidth="1.5"/>
        <path d="M10 14l3 3 5-5" stroke="#c8a45d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Premium\nQuality",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <ellipse cx="14" cy="19" rx="5" ry="7" stroke="#c8a45d" strokeWidth="1.5"/>
        <ellipse cx="14" cy="19" rx="5" ry="7" stroke="#c8a45d" strokeWidth="1.5" transform="rotate(60 14 19)"/>
        <ellipse cx="14" cy="19" rx="5" ry="7" stroke="#c8a45d" strokeWidth="1.5" transform="rotate(120 14 19)"/>
        <circle cx="14" cy="12" r="2" fill="#c8a45d"/>
      </svg>
    ),
    label: "Ayurvedic\nExpertise",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#c8a45d" strokeWidth="1.5"/>
        <path d="M14 5C14 5 9 8.5 9 14C9 16.5 11 18.5 14 19C17 18.5 19 16.5 19 14C19 8.5 14 5 14 5Z" stroke="#c8a45d" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 14h18" stroke="#c8a45d" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "Global\nSupport",
  },
];

export default function WhyChoose() {
  return (
    <section className="wca-body w-full bg-[#f5efe6]">
      <Container>
        <div className="flex flex-col md:flex-row min-h-[200px] rounded-xl relative">
<Image src={whyChooseBg}  fill alt="why choose bg" className="object-center object-cover z-0" />
          {/* ── LEFT PANEL ── */}
          <div className="relative bg-[#183b17] flex flex-col justify-between p-5 sm:p-7 md:p-8 
                          w-[30%] shrink-0 overflow-hidden">
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

            <div>
              <p className="font-semibold tracking-[0.22em] text-[#c8a45d] uppercase mb-4 text-sm">
                Why Choose ENSIS?
              </p>
              <ul className="space-y-4 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-[2px] shrink-0 w-[15px] h-[15px] rounded-full border border-[#c8a45d]/60 flex items-center justify-center">
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="2.5" fill="#c8a45d" opacity="0.85"/>
                      </svg>
                    </span>
                    <span className="text-sm text-white/85 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <GreenButton rightIcon={<ArrowRight size={11} className="text-[#c8a45d]" />} text="Know More About Us" />
          </div>

          {/* ── CENTRE — image ── */}
          <div className="relative w-[30%] shrink-0 overflow-hidden">
            {/* <img
              src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=80&auto=format&fit=crop"
              alt="Ayurvedic wellness setup"
              className="w-full h-full object-cover object-center"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#183b17]/30 via-transparent to-[#f5efe6]/40 pointer-events-none" />
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="bg-white/50 flex flex-col justify-center p-5 sm:p-7 md:p-8 flex-1 relative">

            <p className="text-sm font-semibold tracking-[0.22em] text-[#c8a45d] uppercase mb-2">
              Welcome to ENSIS
            </p>

            <h2 className="wca-serif text-[1.35rem] sm:text-[1.6rem] lg:text-[1.85rem] leading-[1.1] font-[600] text-[#1a1a1a] mb-2.5">
              Where Ancient Wisdom<br />Meets Modern Wellness
            </h2>

            <p className="text-[11px] sm:text-[12px] text-[#5a5040] leading-relaxed mb-4 max-w-[340px]">
              At ENSIS Wellness Solutions, we are passionate about creating authentic,
              luxurious, and sustainable wellness experiences. Our premium range of
              Ayurvedic and spa products is crafted with precision, tradition, and the
              finest natural materials.
            </p>

            {/* Stats row — icons only, no bg/border */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center justify-center w-6 h-6">
                    {s.icon}
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-[#5a5040] font-[500] leading-tight whitespace-pre-line">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

          <div className="w-50">
            <BookButton text="Book a Consultation" rightIcon={<ArrowRight size={11} className="text-white" />} />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}