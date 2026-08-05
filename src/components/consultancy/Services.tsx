"use client";

import { Container } from "../ui/Container";
import planning from "@/assets/consultancy/project_planning.webp"
import design from "@/assets/consultancy/design_and_space.webp"
import branding from "@/assets/consultancy/concept_development.webp"
import equipment from "@/assets/consultancy/equipment.webp"
import staff from "@/assets/consultancy/staff_recruitment.webp"
import growth from "@/assets/consultancy/growth_strategy.webp"
import Image from "next/image";
import HtmlRenderer from "../layout/HtmlRender";

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

interface ConsultancyServicesContent {
  subheading: string;
  title: string;
  description: string;
  serviceCards: Array<{
    title: string;
    description: string;
    iconBg: string;
    image: string; // Assuming image is a path/URL
    learnMoreLink: string;
    learnMoreText:string
  }>;
}

export default function ConsultancyServices({ sectionContent }: { sectionContent: ConsultancyServicesContent }) {
  return (
    <section>
      <Container>
        {/* HEADER */}
        <div className="mx-auto max-w-[540px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[2px] text-[#D66736]">
            {sectionContent.subheading}
          </p>

          <h2 className="mt-2 text-[28px] font-bold leading-tight">
            {sectionContent.title}
          </h2>

          <p className="mx-auto mt-3 max-w-[500px] text-[13px] font-medium" dangerouslySetInnerHTML={{__html:sectionContent.description}}>
            
          </p>
        </div>

        {/* CARDS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {sectionContent.serviceCards.map((service) => (
           <div
  key={service.title}
  className="group flex flex-col rounded-[14px] border border-[#E9E9E9] bg-white px-4 py-4 transition-all duration-300 hover:shadow-md items-center text-center"
>
  {/* ICON */}
  <div
    className="flex w-15 items-center justify-center rounded-full"
    style={{ backgroundColor: service.iconBg }}
  >
    <Image src={service.image} alt={service.title} width={26} height={26} />
  </div>

  <h3 className="mt-3 text-xs font-bold leading-[1.45]">
    {service.title}
  </h3>

  <HtmlRenderer content={service.description} className="mt-3 text-[12px] text-gray-500">
    
  </HtmlRenderer>

  {/* mt-auto yahan flex-grow wale div pe lagao */}
 <div className="mt-auto">
  <a
    href={`/${service.learnMoreLink}`}
    className="flex items-center justify-center gap-4" // Removed Next/Link import, using <a>
  >
    <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB' }}>
      {service.learnMoreText}
    </span>
    <span style={{ color: '#2563EB' }} className="transition-transform duration-300 group-hover:translate-x-1">
      &#8594;
    </span>
  </a>
</div>
</div>
          ))}
        </div>
      </Container>
    </section>
  );
}