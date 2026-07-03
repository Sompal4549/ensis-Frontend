import React from "react";
import { Container } from "../ui/Container";
import trunkry from "@/assets/about/trunkry.webp"
import Image from "next/image";
import design from "@/assets/icons/design_and_visualization.webp";
import manufacturing from "@/assets/about/manufacturing.png";
import installation from "@/assets/icons/instalation_and_execution.webp";
import after_sales_support from "@/assets/icons/after_sales_support.webp";

type ProcessStep = {
  id: number;
  title: string;
  icon: React.ReactNode;
};

const steps: ProcessStep[] = [
  {
    id: 1,
    title: "CONSULTATION & PLANNING",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="w-8 h-8"
      >
        <path d="M8 4h8l3 3v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
        <path d="M9 10h6M9 14h4" />
        <path d="M15 4v4h4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "DESIGN & 3D VISUALIZATION",
    icon: (
      <Image src={design} alt="Design & Visualization" width={35} height={35} className="text-[#b79a7a] mb-3" style={{ height: "auto" }} />
    ),
  },
  {
    id: 3,
    title: "MANUFACTURING & PRODUCTION",
    icon: (
      <Image src={manufacturing} alt="Manufacturing & Production" width={35} height={35} className="text-[#b79a7a] mb-3 object-cover" style={{ height: "auto" }} />
    ),
  },
  {
    id: 4,
    title: "INSTALLATION & EXECUTION",
    icon: (
       <Image src={installation} alt="Installation & Execution" width={35} height={35} className="text-[#b79a7a] mb-3" style={{ height: "auto" }} />
    ),
  },
  {
    id: 5,
    title: "HANDOVER & SUPPORT",
    icon: (
      <Image src={after_sales_support} alt="After Sales Support" width={35} height={35} className="text-[#b79a7a] mb-3" style={{ height: "auto" }} />
    ),
  },
];

type SectionStep = {
  id: number;
  title: string;
  imageurl: {
    imageUrl: string;
    alt: string;
  };
};

type SectionContent = {
  title: string;
  imageurl: {
    imageUrl: string;
    alt: string;
  };
  steps: SectionStep[];
};

type TurnkeyProcessProps = {
  sectionContent: SectionContent;
};

const TurnkeyProcess: React.FC<TurnkeyProcessProps> = ({ sectionContent }) => {
  return (
    <section className="w-full bg-[#f8f5f1] overflow-hidden relative">
        <div className="absolute inset-0">
          <Image
            src={sectionContent.imageurl.imageUrl}
            alt={sectionContent.imageurl.alt}
            className="h-full w-full object-cover"
            fill
            crossOrigin="anonymous"
            sizes="100vw"
          />
        </div>
      <Container>
        <div className="relative flex flex-col lg:flex-row items-stretch min-h-[200px]">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-[58%] px-6 md:px-0 py-4 flex flex-col justify-center relative z-10">
            <h2 className="text-[#2d2a28] text-[18px] md:text-[24px] font-bold font-serif uppercase tracking-[0.4px] mb-6">
              {sectionContent.title}
            </h2>
            
            <div className="flex items-start justify-between gap-2 md:gap-4 relative">
              {sectionContent.steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center text-center max-w-[120px] relative z-10">
                    <div className="text-[#b79a7a] mb-4 flex items-center justify-center">
                      <Image src={step.imageurl.imageUrl} alt={step.imageurl.alt} width={35} height={35} className="text-[#b79a7a] mb-3" style={{ height: "auto" }}/>
                    </div>

                    <p className="text-[10px] md:text-[11px] leading-[1.5] font-semibold tracking-[0.3px] text-[#3f3a36] uppercase">
                      {step.title}
                    </p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="flex-1 pt-3 hidden md:flex items-center justify-center">
                      <div className="w-full border-t border-[#c9b39b] relative">
                        <span className="absolute right-[-2px] top-[-6px] text-[#c9b39b] text-sm font-bold">
                          →
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
      
        </div>
      </Container>
    </section>
  );
};

export default TurnkeyProcess;