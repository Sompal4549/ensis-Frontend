import React from "react";
import Image from "next/image";
import project from "@/assets/trunkey_solutions/project_planning.webp";
import architecture from "@/assets/trunkey_solutions/architecture_and_master.webp";
import interior from "@/assets/trunkey_solutions/interior_design.webp";
import furniture from "@/assets/trunkey_solutions/custom_furniture.webp";
import equipment from "@/assets/trunkey_solutions/panchkarma_equipment.webp";
import civil from "@/assets/trunkey_solutions/civil_and_interior.webp";
import mep from "@/assets/trunkey_solutions/mep_technical.webp";
import branding from "@/assets/trunkey_solutions/building_and_experience_design.webp";
import training from "@/assets/trunkey_solutions/recruitment_and_training.webp";
import prelaunch from "@/assets/trunkey_solutions/pre_launch_support.webp";
import handover from "@/assets/trunkey_solutions/handover.webp";
import after_sales from "@/assets/trunkey_solutions/after_sales_support.webp";

import lotus from "@/assets/about/lotus.png";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import { Container } from "../ui/Container";

type SolutionCard = {
  id: string;
  title: string;
  points: string[];
  image?: any;
};

const solutions: SolutionCard[] = [
  {
    id: "01",
    title: "Project Planning & Consultancy",
    points: [
      "Feasibility Study",
      "Business Planning",
      "Wellness Concept Development",
      "Investment Planning",
      "Revenue Model Consultation",
      "Project Budgeting",
    ],
    image: project,
  },
  {
    id: "02",
    title: "Architecture & Master Planning",
    points: [
      "Master Layout",
      "Floor Plans",
      "Treatment Flow Design",
      "Patient Movement Planning",
      "Utility Planning",
      "Future Expansion Planning",
    ],
    image: architecture,
  },
  {
    id: "03",
    title: "Interior Design & Ambience Creation",
    points: [
      "Luxury Ayurveda Interiors",
      "Kerala Traditional Theme",
      "Modern Wellness Theme",
      "Resort Style Design",
      "Reception & Lounge",
      "Treatment Room Design",
    ],
    image: interior,
  },
  {
    id: "04",
    title: "Custom Furniture Manufacturing",
    points: [
      "Panchkarma Tables",
      "Shirodhara Tables",
      "Massage & Spa Beds",
      "Consultation Furniture",
      "Reception Counters",
      "Storage & Cabinets",
    ],
    image: furniture,
  },
  {
    id: "05",
    title: "Panchkarma Equipment Supply",
    points: [
      "Traditional Panchkarma Equipment",
      "Shirodhara Systems",
      "Steam Therapy Systems",
      "Copper Accessories",
      "Therapy Tools",
      "Hygiene & Utility Equipment",
    ],
    image: equipment,
  },
  {
    id: "06",
    title: "Civil & Interior Execution",
    points: [
      "Civil Work & Flooring",
      "False Ceiling & Lighting",
      "Electrical & Plumbing",
      "HVAC Coordination",
      "Partitions & Woodwork",
      "Painting & Finishes",
    ],
    image: civil,
  },
  {
    id: "07",
    title: "MEP & Technical Infrastructure",
    points: [
      "Electrical Planning",
      "Water Supply & Drainage",
      "Hot Water Systems",
      "Steam & Gas Systems",
      "HVAC & Ventilation",
      "Backup Power & Safety",
    ],
    image: mep,
  },
  {
    id: "08",
    title: "Branding & Experience Design",
    points: [
      "Logo & Identity Placement",
      "Directional Signage",
      "Room Identification",
      "Wall Graphics & Art",
      "Patient Journey Design",
      "Brand Storytelling",
    ],
    image: branding,
  },
  {
    id: "09",
    title: "Recruitment & Training Support",
    points: [
      "Therapist Training",
      "Equipment Usage Training",
      "Operational SOPs",
      "Patient Handling Protocols",
      "Treatment Room Setup",
      "Staff Training Programs",
    ],
    image: training,
  },
];

const bottomCards = [
  {
    id: "10",
    title: "Pre-Launch Support",
    points: [
      "Soft Launch Planning",
      "Final Inspection",
      "Quality Audit",
      "Operational Testing",
      "Vendor Coordination",
      "Launch Preparation",
    ],
    image: prelaunch,
  },
  {
    id: "11",
    title: "Handover & After Sales Support",
    points: [
      "Final Handover Documentation",
      "Warranty Support",
      "Maintenance Guidance",
      "AMC & Service Support",
      "Continuous Assistance",
    ],
    image: handover,
  },
];

const Card = ({
  item,
  dark = false,
}: {
  item: SolutionCard;
  dark?: boolean;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[10px] border ${dark
          ? "border-[#1c5d4b] bg-[#063d30]"
          : "border-[#dcc9a8] bg-[#f7f1e7]"
        }`}
    >
      <div className="grid grid-cols-[1fr_1fr] h-full">
        {/* Image Placeholder */}
        <div className="relative border-r border-[#dcc9a8]/70 bg-[#e7dcc7]">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src={item.image} alt={item.title} className="object-fill" fill />
          </div>

          {/* Number Badge */}
          <div className="absolute -right-5 top-0 flex rounded-bl-md h-[36px] w-[36px] items-center justify-center bg-[#b8892e] text-[15px] font-semibold text-white">
            {item.id}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <h3
            className={`text-sm font-bold leading-[1.15] pl-3 ${dark ? "text-[#f4e8c9]" : ""
              }`}
          >
            {item.title}
          </h3>

          <ul
            className={`mt-3 space-y-[5px] text-xs leading-[1.25] font-semibold ${dark ? "text-[#f4e8c9]" : ""
              }`}
          >
            {item.points.map((point, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-[4px] h-[5px] w-[5px] rounded-full bg-[#b8892e]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TurnkeySolutions = () => {
  return (
    <section className="w-full bg-[#f6f1e8]">
      <Container>
        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-[#c7a76b]" />
          <h2 className="text-base font-semibold uppercase">
            Our Complete turnkit solutions
          </h2>
          <span className="h-px w-14 bg-[#c7a76b]" />
        </div>
      </Container>

      {/* Main Grid */}
      <div className="pt-2 border-[#fedda3] border-t">
        <Container>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {solutions.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>

          {/* Bottom Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
            <Card item={bottomCards[0]} />

            <div className="overflow-hidden rounded-[10px] border border-[#1c5d4b] bg-[#063d30] max-h-53.25">
              <div className="grid h-full grid-cols-[200px_1fr_1fr]">
                {/* Left Image Placeholder */}
                <div className="relative flex items-center justify-center border-r  border-[#d0a965] py-5">
                  <Image src={handover} alt="Handover & After Sales Support" className="object-contain" width={120} height={120} />
                </div>

                {/* Content */}
                <div className="px-5 py-4 text-[#f4e8c9]">
                  <div className="mb-3 flex items-center gap-3 text-[#d0a965]">
                    <div className="flex items-center justify-center text-md font-bold">
                      11
                    </div>

                    <h3 className="font-bold text-base leading-none">
                      Handover & After Sales Support
                    </h3>
                  </div>

                  <ul className="space-y-[7px] text-xs">
                    {bottomCards[1].points.map((point, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="mt-[4px] h-[5px] w-[5px] rounded-full bg-[#d8b46d]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image Placeholder */}
                <div className="relative bg-[#0b4b3a]">
                  <Image src={after_sales} alt="Handover & After Sales Support" className="object-fill" fill />
                </div>
              </div>
            </div>
          </div>
        </Container>

      </div>

    </section>
  );
};

export default TurnkeySolutions;