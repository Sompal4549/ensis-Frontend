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
          <div className="absolute inset-0 flex items-center justify-center"> {/* item.image is any, assuming it has imageUrl and alt */}
            <Image src={item.image.imageUrl} alt={item.image.alt} className="object-fill" fill />
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

const TurnkeySolutions = ({sectionContent}: { sectionContent: TurnkeySolutionsContent }) => { // Added explicit type
  const lastCard =sectionContent.cards[sectionContent.cards.length - 1]
  return (
    <section className="w-full bg-[#f6f1e8]">
      <Container>
        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-4">
          <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" />
          <h2 className="text-base font-semibold uppercase">
           {sectionContent.title}
          </h2>
                  <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />

        </div>
      </Container>

      {/* Main Grid */}
      <div className="pt-2 border-[#fedda3] border-t">
        <Container>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
           {sectionContent.cards.slice(0, -1).map((item, index) => (
  <Card
    key={item.id}
    item={item}
    index={index + 1}
  />
))}
          </div>

          {/* Bottom Row */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_2fr]"> {/* Removed the extra Card component here */}
<Card index={sectionContent.cards.length} item={sectionContent.cards[sectionContent.cards.length-1]} />
            <div className="h-full overflow-hidden rounded-[10px] border border-[#1c5d4b] bg-[#063d30]">
              <div className="grid h-full grid-cols-1 md:grid-cols-[200px_1fr_1fr]">
                {/* Left Image Placeholder */}
                <div className="relative flex items-center justify-center border-b border-[#d0a965] py-5 md:border-b-0 md:border-r">
                  <Image src={sectionContent.specialCard.leftImage.imageUrl} alt={sectionContent.specialCard.leftImage.alt||""} className="object-contain" width={120} height={120} />
                </div>

                {/* Content */}
                <div className="px-5 py-4 text-[#f4e8c9]">
                  <div className="mb-3 flex items-center gap-4 text-[#d0a965]">
                    {/* <div className="flex items-center justify-center text-md font-bold">
                      11
                    </div> */}

                    <h3 className="font-bold text-base leading-none">
                     {lastCard.title}
                    </h3>
                  </div>

                  <ul className="space-y-[7px] text-base">
                    {sectionContent.specialCard.details.map((point, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#d8b46d]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image Placeholder */}
                <div className="relative hidden bg-[#0b4b3a] md:block">
                  <Image src={sectionContent.specialCard.rightImage.imageUrl} alt={sectionContent.specialCard.rightImage.alt||""} className="object-fill" fill />
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