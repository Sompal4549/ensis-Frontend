"use client";

import React from "react";
import { Container } from "../ui/Container";
import planning from "@/assets/consultancy/project_planning.webp"
import design from "@/assets/consultancy/design_and_space.webp"
import branding from "@/assets/consultancy/concept_development.webp"
import equipment from "@/assets/consultancy/equipment.webp"
import staff from "@/assets/consultancy/staff_recruitment.webp"
import growth from "@/assets/consultancy/growth_strategy.webp"
import Image from "next/image";

type Service = {
  title: string;
  description: string;
  icon: any;
  iconBg: string;
  href: string;
};

const consultancyServicesData = {
  badge: "WHAT WE OFFER",

  title: "Our Consultancy Services",

  description:
    "We offer complete consultancy solutions to help you build a future-ready wellness business that delivers exceptional experiences.",

  services: [
    {
      title: "Project Planning & Feasibility Study",
      description:
        "Detailed market research and feasibility analysis to ensure a strong start.",
      icon: planning,
      iconBg: "#EDF3FF",
      href: "#",
    },
    {
      title: "Design & Space Planning",
      description:
        "Functional and aesthetic designs that create the perfect wellness environment.",
      icon: design,
      iconBg: "#FFF2E5",
      href: "#",
    },
    {
      title: "Concept Development & Branding",
      description:
        "Unique concepts and branding strategies that set your business apart.",
      icon: branding,
      iconBg: "#EDF8EE",
      href: "#",
    },
    {
      title: "Equipment & Product Consultation",
      description:
        "Expert guidance on selecting the right equipment and products.",
      icon: equipment,
      iconBg: "#F5ECFF",
      href: "#",
    },
    {
      title: "Staff Recruitment & Training",
      description:
        "We help you build and train a skilled team that represents your brand.",
      icon: staff,
      iconBg: "#FFECEF",
      href: "#",
    },
    {
      title: "Business Setup & Growth Strategy",
      description:
        "End-to-end support for launch and strategies for long-term growth.",
      icon: growth,
      iconBg: "#E9FBFC",
      href: "#",
    },
  ] as Service[],
};

export default function ConsultancyServices() {
  return (
    <section className="py-4">
      <Container>
        {/* HEADER */}
        <div className="mx-auto max-w-[540px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-[#D66736]">
            {consultancyServicesData.badge}
          </p>

          <h2 className="mt-2 text-[28px] font-bold leading-tight">
            {consultancyServicesData.title}
          </h2>

          <p className="mx-auto mt-3 max-w-[500px] text-[13px] font-medium">
            {consultancyServicesData.description}
          </p>
        </div>

        {/* CARDS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {consultancyServicesData.services.map((service) => (
            <div
              key={service.title}
              className="group flex min-h-[260px] flex-col rounded-[14px] border border-[#E9E9E9] bg-white px-5 py-5 transition-all duration-300 hover:shadow-md justify-center items-center text-center"
            >
              {/* ICON */}
              <div
                className="flex h-[60px] w-[60px] items-center justify-center rounded-full"
                style={{ backgroundColor: service.iconBg }}
              >

   <Image
                      src={service.icon}
                      alt={service.title}
                      width={26}
                      height={26}
                    />
              </div>

              <h3 className="mt-5 text-xs font-bold leading-[1.45]">
                {service.title}
              </h3>

              <p className="mt-3 text-[12px]">
                {service.description}
              </p>

              <a
                href={service.href}
                className="mt-auto inline-flex items-center gap-2 pt-5 "
              >
                <span className="text-[12px] font-semibold text-[#2563EB]">

                Learn More
                </span>

                <span className="transition-transform duration-300 group-hover:translate-x-1  text-[#2563EB]">
                  →
                </span>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}