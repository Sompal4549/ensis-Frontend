"use client";

import { ChartNoAxesCombined, Check, LucideIcon, Settings, SquarePen, Users } from "lucide-react";
import React from "react";
import { Container } from "../ui/Container";
import Image from "next/image";
import ourMission from "@/assets/consultancy/our-mission.webp"
import BookButton from "../ui/BookButton";
import HtmlRenderer from "../layout/HtmlRender";

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

interface HowWeWorkContent {
  whyChoose: {
    bgImage: string;
    heading: string;
    title: string;
    description: string;
    chooseList: Array<{ text: string }>;
    primaryButton: { label: string; href: string }; // Changed href to path
  };
  ourProcess: {
    heading: string;
    title: string;
    processList: Array<{
      title: string;
      description: string;
      color: string; // Assuming color is a string like "#HEX"
      image: any; // Changed from image to icon
    }>;
  };
}

export default function HowWeWork({ sectionContent }: { sectionContent: HowWeWorkContent }) {
  const whyChoose = sectionContent.whyChoose;
  const ourProcess = sectionContent.ourProcess;
  return (
    <section>
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.08fr]">
          {/* LEFT CARD */}
          <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-[#F8FBFE]">
            <div className="grid h-full md:grid-cols-[1.2fr_0.95fr] relative">
              <Image
                src={whyChoose.bgImage}
                alt="Why Choose Us"
                fill
                className="object-cover object-center z-0"
              />
              {/* CONTENT */}
              <div className="flex flex-col justify-center p-6 lg:p-7 z-10">
                <p className="text-sm font-semibold uppercase tracking-[2px] text-[#D66A38]">
                  {whyChoose.heading}
                </p>

                <h2 className="mt-2 text-[28px] font-bold leading-[1.1] ">
                  {whyChoose.title}
                </h2>

                <p className="mt-4 text-[13px] leading-6" dangerouslySetInnerHTML={{ __html: whyChoose.description }}>
                </p>

                <div className="mt-5 space-y-3">
                  {whyChoose.chooseList.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4"
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

                  <BookButton text={whyChoose.primaryButton.label} path={whyChoose.primaryButton.href} />
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
                {ourProcess.heading}
              </p>

              <h2 className="mt-1 text-[28px] font-bold leading-tight">
                {ourProcess.title}
              </h2>
            </div>

            {/* PROCESS LIST */}
            <div className="mt-2 flex-1">
              {ourProcess.processList.map((step, index) => {

                return (
                  <div
                    key={index}
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
                        {index + 1}
                      </div>

                      {index !==
                        ourProcess.processList.length - 1 && ( // Changed to ourProcess.processList
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

                        <HtmlRenderer content={step.description}
                         className="mt-1 text-[12px] leading-5 text-[#667085]">
                        </HtmlRenderer>
                      </div>

                      <div className="ml-4 shrink-0">
                        <Image src={step.image} // Changed to step.icon
                          height={22}
                          width={22}
                          style={{ color: step.color }}
                          alt={step.title}
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