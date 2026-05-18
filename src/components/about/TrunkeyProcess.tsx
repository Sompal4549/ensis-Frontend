import React from "react";
import { Container } from "../ui/Container";
import trunkry from "@/assets/about/trunkry.webp"
import Image from "next/image";

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
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="w-8 h-8"
      >
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1.5-3 4-5 7-5s5.5 2 7 5" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "MANUFACTURING & PRODUCTION",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="w-8 h-8"
      >
        <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
        <path d="M12 7v10M7 9.5l10 5" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "INSTALLATION & EXECUTION",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="w-8 h-8"
      >
        <path d="M5 18l5-5" />
        <path d="M14 5l5 5" />
        <path d="M8 21l-5-5 11-11 5 5-11 11z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "HANDOVER & SUPPORT",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="w-8 h-8"
      >
        <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const TurnkeyProcess: React.FC = () => {
  return (
    <section className="w-full bg-[#f8f5f1] overflow-hidden relative">
        <div className="absolute inset-0">
          <Image
            src={trunkry}
            alt="Turnkey Process"
            className="h-full w-full object-cover"
            fill
          />
        </div>
      <Container>
        <div className="relative flex flex-col lg:flex-row items-stretch min-h-[200px]">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-[58%] px-6 md:px-10 py-4 flex flex-col justify-center relative z-10">
            <h2 className="text-[#2d2a28] text-[18px] md:text-[28px] font-bold font-serif uppercase tracking-[0.4px] mb-6">
              OUR TURNKEY PROCESS
            </h2>

            <div className="flex items-start justify-between gap-2 md:gap-4 relative">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center text-center max-w-[120px] relative z-10">
                    <div className="text-[#b79a7a] mb-4 flex items-center justify-center">
                      {step.icon}
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