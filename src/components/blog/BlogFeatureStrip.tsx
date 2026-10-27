import React from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { ShieldCheck, Award, Users, Lightbulb } from "lucide-react";
import contactLeaf from "@/assets/contact/contact-left.webp";

export default function BlogFeatureStrip() {
  const features = [
    {
      icon: <ShieldCheck size={22} className="text-[#a9742a]" />,
      title: "Authentic Information",
      subtitle: "Backed by Experts",
    },
    {
      icon: <Award size={22} className="text-[#a9742a]" />,
      title: "Practical Insights",
      subtitle: "for Real-World Use",
    },
    {
      icon: <Users size={22} className="text-[#a9742a]" />,
      title: "Designed for Clinics,",
      subtitle: "Resorts & Wellness Centers",
    },
    {
      icon: <Lightbulb size={22} className="text-[#a9742a]" />,
      title: "Stay Updated with",
      subtitle: "Latest Trends",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#ede7dc] bg-[#fbf7f1] py-8 sm:py-9">
      {/* Decorative Botanical Leaf Accents in Bottom Corners */}
      <div className="pointer-events-none absolute -bottom-6 -left-6 w-24 sm:w-32 opacity-35 select-none rotate-12">
        <Image src={contactLeaf} alt="" className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-6 w-24 sm:w-32 opacity-35 select-none -scale-x-100 -rotate-12">
        <Image src={contactLeaf} alt="" className="object-contain" />
      </div>

      <Container className="relative z-10 py-0">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6 lg:gap-8">
          {features.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8dac7] bg-[#fdfaf5] shadow-xs">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-[#063120] leading-tight">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#666666] leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
