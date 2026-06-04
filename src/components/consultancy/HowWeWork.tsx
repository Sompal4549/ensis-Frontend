"use client";

import { ChartNoAxesCombined, Check, LucideIcon, Settings, SquarePen, Users } from "lucide-react";
import React from "react";
import { Container } from "../ui/Container";
import Image from "next/image";
import ourMission from "@/assets/consultancy/our-mission.webp"
import BookButton from "../ui/BookButton";

type Benefit = {
  text: string;
};

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  color: string;
  icon: LucideIcon;
};

const whyChooseData = {
  badge: "WHY CHOOSE ENSIS",

  title: {
    line1: "Your Success is",
    line2: "Our Mission",
  },

  description:
    "We combine industry expertise, innovative strategies, and hands-on support to turn your wellness vision into reality.",

  button: {
    label: "Get Expert Advice",
    href: "#",
  },

  benefits: [
    {
      text: "Industry-leading expertise",
    },
    {
      text: "Customized & practical solutions",
    },
    {
      text: "Transparent process",
    },
    {
      text: "Long-term partnership",
    },
  ] as Benefit[],

  image: ourMission,

  process: {
    badge: "OUR PROCESS",

    title: "How We Work",

steps: [
  {
    step: "01",
    title: "Understanding Your Vision",
    description:
      "We analyze your goals, requirements, and target audience.",
    color: "#2563EB",
    icon: Users,
  },
  {
    step: "02",
    title: "Planning & Strategy",
    description:
      "We create a customized plan and roadmap for your business.",
    color: "#F59E0B",
    icon: SquarePen,
  },
  {
    step: "03",
    title: "Execution & Implementation",
    description:
      "Our team helps you implement the plan with precision.",
    color: "#22C55E",
    icon: Settings,
  },
  {
    step: "04",
    title: "Growth & Support",
    description:
      "We provide continuous support to help your business grow.",
    color: "#9333EA",
    icon: ChartNoAxesCombined,
  },
] as ProcessStep[],
  },
};

export default function HowWeWork() {
  return (
    <section>
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.08fr]">
          {/* LEFT CARD */}
          <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-[#F8FBFE]">
            <div className="grid h-full md:grid-cols-[1.2fr_0.95fr] relative">
              <Image
                src={whyChooseData.image}
                alt="Why Choose Us"
                fill
                className="object-cover object-center z-0"
              />
              {/* CONTENT */}
              <div className="flex flex-col justify-center p-6 lg:p-7 z-10">
                <p className="text-sm font-semibold uppercase tracking-[2px] text-[#D66A38]">
                  {whyChooseData.badge}
                </p>

                <h2 className="mt-2 text-[28px] font-bold leading-[1.1] ">
                  {whyChooseData.title.line1}
                  <br />
                  {whyChooseData.title.line2}
                </h2>

                <p className="mt-4 text-[13px] leading-6">
                  {whyChooseData.description}
                </p>

                <div className="mt-5 space-y-3">
                  {whyChooseData.benefits.map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3"
                    >
                      {/* CHECK ICON */}
                      <div className="flex h-4 w-4 shrink-0 font-bold items-center justify-center rounded-full bg-[#2563EB]">
                        {/* ADD CHECK ICON HERE */}
                        <Check size={10} strokeWidth={2} color="#fff" />
                      </div>

                      <span className="text-[13px]">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-50 h-10 mt-4">

<BookButton text={whyChooseData.button.label} path={whyChooseData.button.href} />
                </div>

              </div>

              {/* IMAGE AREA */}
              <div className="relative min-h-[280px] md:min-h-full">
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
       <div className="flex flex-col">
  <div>
    <p className="text-sm font-semibold uppercase tracking-[2px] text-[#D66A38]">
      {whyChooseData.process.badge}
    </p>

    <h2 className="mt-1 text-[28px] font-bold leading-tight">
      {whyChooseData.process.title}
    </h2>
  </div>

  {/* PROCESS LIST */}
  <div className="mt-2 flex-1">
    {whyChooseData.process.steps.map((step, index) => {
      const Icon = step.icon;

      return (
        <div
          key={step.step}
          className="relative flex items-start gap-4"
        >
          {/* NUMBER COLUMN */}
          <div className="relative flex w-[36px] shrink-0 flex-col items-center self-stretch">
            <div
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border bg-white text-[13px] font-semibold"
              style={{
                borderColor: step.color,
                color: step.color,
              }}
            >
              {step.step}
            </div>

            {index !==
              whyChooseData.process.steps.length - 1 && (
              <div
                className="mt-1 w-px flex-1 border-l border-dashed"
                style={{
                  borderColor: step.color,
                  minHeight: "52px",
                }}
              />
            )}
          </div>

          {/* CONTENT CARD */}
          <div className="relative mb-3 flex min-h-[70px] flex-1 items-center justify-between rounded-xl border border-[#ECECEC] bg-white px-5 py-4 shadow-sm">
            {/* ARROW POINTER */}
            <div className="absolute -left-[8px] top-[18px] h-4 w-4 rotate-45 border-b border-l border-[#ECECEC] bg-white" />

            <div className="flex-1">
              <h3 className="text-[13px] font-semibold leading-5">
                {step.title}
              </h3>

              <p className="mt-1 text-[12px] leading-5 text-[#667085]">
                {step.description}
              </p>
            </div>

            <div className="ml-4 shrink-0">
              <Icon
                size={22}
                strokeWidth={1.8}
                style={{ color: step.color }}
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
        </div>
      </Container>
    </section>
  );
}