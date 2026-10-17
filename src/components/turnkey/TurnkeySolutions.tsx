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
import decorationLeft from "@/assets/icons/decoration_left.png"
import decorationRight from "@/assets/icons/decoration_right.png"
import { Container } from "@/components/ui/Container";


type SolutionCard = {
  id: string;
  title: string;
  details: string[]; // Changed from description to details to match usage
  image?: any;
  bottomStrap?: boolean;
  bottomStrapText?: string;
};


const Card = ({
  item,
  dark = false,
  index
}: {
  item: SolutionCard;
  dark?: boolean;
  index: number;
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
            <Image src={item.image?.imageUrl || item.image || project} alt={item.image?.alt || item.title || "Turnkey Solution"} className="object-fill" fill />
          </div>

          {/* Number Badge */}
          <div className="absolute -right-5 top-0 flex rounded-bl-md h-[36px] w-[36px] items-center justify-center bg-[#b8892e] text-base font-semibold text-white">
            {index}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <h3
            className={`text-base font-bold leading-[1.15] pl-3 ${dark ? "text-[#f4e8c9]" : ""
              }`}
          >
            {item.title}
          </h3>

          <ul
            className={`mt-3 space-y-[5px] text-base leading-[1.25] font-semibold line-clamp-6 ${dark ? "text-[#f4e8c9]" : ""
              }`}
          >
              {item.details.map((point, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#b8892e]" />
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Strap */}
      {item.bottomStrap && (
        <div className="flex items-center justify-center gap-4 bg-[#b8892e] px-3 py-[6px] absolute bottom-0 left-0 right-0">
          <span className="text-white text-base font-semibold tracking-wide text-center leading-none">
           {item.bottomStrapText}
          </span>
        </div>
      )}
    </div>
  );
};

export interface TurnkeySolutionsContent {
  title: string;
  cards: Array<SolutionCard & { image: { imageUrl: string; alt?: string } }>; // Added image type
  specialCard: {
    leftImage: { imageUrl: string; alt?: string };
    details: string[];
    rightImage: { imageUrl: string; alt?: string };
  };
}

const defaultCards = [
  { id: "1", title: "Project Planning", details: ["Comprehensive feasibility study.", "Layout and workflow design."], image: { imageUrl: project.src || project, alt: "Project Planning" } },
  { id: "2", title: "Architecture & Master", details: ["Vastu and NABH compliant designs.", "Space optimization."], image: { imageUrl: architecture.src || architecture, alt: "Architecture" } },
  { id: "3", title: "Interior Design", details: ["Serene aesthetic environments.", "Natural materials and lighting."], image: { imageUrl: interior.src || interior, alt: "Interior Design" } },
  { id: "4", title: "Custom Furniture", details: ["Ayurvedic treatment tables.", "Relaxation recliners and cabinetry."], image: { imageUrl: furniture.src || furniture, alt: "Furniture" } },
  { id: "5", title: "Panchkarma Equipment", details: ["Authentic teakwood droni tables.", "Shirodhara stands and steam boxes."], image: { imageUrl: equipment.src || equipment, alt: "Equipment" } },
  { id: "6", title: "Civil & Interior", details: ["Precision civil execution.", "Waterproofing and acoustic dampening."], image: { imageUrl: civil.src || civil, alt: "Civil" } },
  { id: "7", title: "MEP & Technical", details: ["Specialized plumbing for herbal oils.", "Ventilation and exhaust systems."], image: { imageUrl: mep.src || mep, alt: "MEP" } },
  { id: "8", title: "Brand & Experience", details: ["Signage and visual branding.", "Guest journey mapping."], image: { imageUrl: branding.src || branding, alt: "Branding" } },
  { id: "9", title: "Recruitment & Training", details: ["Therapist sourcing assistance.", "Equipment operational training."], image: { imageUrl: training.src || training, alt: "Training" } },
  { id: "10", title: "Pre-Launch Support", details: ["Dry-run operational trials.", "Inspection and quality audit."], image: { imageUrl: prelaunch.src || prelaunch, alt: "Pre-Launch" } },
  { id: "11", title: "Handover & Support", details: ["Final commissioning sign-off.", "Annual maintenance warranties."], image: { imageUrl: handover.src || handover, alt: "Handover" } },
];

const TurnkeySolutions = ({sectionContent}: { sectionContent?: TurnkeySolutionsContent }) => {
  const cards = (sectionContent?.cards && sectionContent.cards.length > 0)
    ? sectionContent.cards
    : defaultCards;

  const title = sectionContent?.title || "Our Complete Turnkey Solutions";
  const lastCard = cards[cards.length - 1] || defaultCards[defaultCards.length - 1];

  const specialCard = sectionContent?.specialCard || {
    leftImage: { imageUrl: handover.src || handover, alt: "Handover" },
    rightImage: { imageUrl: project.src || project, alt: "Project" },
    details: ["One Team, One Timeline, One Budget.", "Complete Peace of Mind."],
  };

  return (
    <section className="w-full bg-[#f6f1e8]">
      <Container>
        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-4">
          <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" />
          <h2 className="text-base font-semibold uppercase">
           {title}
          </h2>
          <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />
        </div>
      </Container>

      {/* Main Grid */}
      <div className="pt-2 border-[#fedda3] border-t">
        <Container>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
           {cards.slice(0, -1).map((item, index) => (
             <Card
               key={item.id || index}
               item={item}
               index={index + 1}
             />
           ))}
          </div>

          {/* Bottom Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]">
            <Card index={cards.length} item={lastCard} />
            <div className="h-full overflow-hidden rounded-[10px] border border-[#1c5d4b] bg-[#063d30]">
              <div className="grid h-full grid-cols-1 md:grid-cols-[200px_1fr_1fr]">
                {/* Left Image Placeholder */}
                <div className="relative flex items-center justify-center border-b border-[#d0a965] py-5 md:border-b-0 md:border-r">
                  <Image src={specialCard.leftImage?.imageUrl || handover} alt={specialCard.leftImage?.alt || "Handover"} className="object-contain" width={120} height={120} />
                </div>

                {/* Content */}
                <div className="px-5 py-4 text-[#f4e8c9]">
                  <div className="mb-3 flex items-center gap-4 text-[#d0a965]">
                    <h3 className="font-bold text-base leading-none">
                     {lastCard.title}
                    </h3>
                  </div>

                  <ul className="space-y-[7px] text-base">
                    {(specialCard.details || []).map((point, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#d8b46d]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image Placeholder */}
                <div className="relative hidden bg-[#0b4b3a] md:block">
                  <Image src={specialCard.rightImage?.imageUrl || project} alt={specialCard.rightImage?.alt || "Project"} className="object-fill" fill />
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