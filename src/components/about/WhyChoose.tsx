import React from "react";
import { Container } from "../ui/Container";

type Feature = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center mb-[18px] text-[#b79a7a]">
    {children}
  </div>
);

const features: Feature[] = [
  {
    id: 1,
    title: "AUTHENTIC & AYURVEDIC FOCUS",
    description:
      "Designs rooted in ancient Ayurvedic principles for effective therapies.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <circle cx="12" cy="6" r="2" />
          <circle cx="6" cy="16" r="2" />
          <circle cx="18" cy="16" r="2" />
          <path d="M12 8v4M8 16h8M8 14l4-2 4 2" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    id: 2,
    title: "PREMIUM QUALITY MATERIALS",
    description:
      "Using the finest wood, metals and accessories built to last.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <path d="M12 3l2 2.5 3.2-.5.7 3 2.6 1.8-1.6 2.8 1.6 2.8-2.6 1.8-.7 3-3.2-.5L12 21l-2-2.5-3.2.5-.7-3L3.5 14l1.6-2.8L3.5 8.4 6.1 6.6l.7-3 3.2.5L12 3z" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    id: 3,
    title: "CUSTOM MADE SOLUTIONS",
    description:
      "Tailor-made equipment and interiors to fit your exact requirements.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <path d="M12 3l2 2.5 3.2-.5.7 3 2.6 1.8-1.6 2.8 1.6 2.8-2.6 1.8-.7 3-3.2-.5L12 21l-2-2.5-3.2.5-.7-3L3.5 14l1.6-2.8L3.5 8.4 6.1 6.6l.7-3 3.2.5L12 3z" />
          <path d="M10 9h4v6h-4z" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    id: 4,
    title: "TURNKEY WELLNESS EXPERTS",
    description:
      "From concept to handover, we handle everything under one roof.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <path d="M8 4h3l5 5v3l-4 4H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" />
          <circle cx="10" cy="8" r="1.5" />
          <circle cx="14" cy="14" r="1.5" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    id: 5,
    title: "ON-TIME DELIVERY & INSTALLATION",
    description:
      "Timely execution with professional installation support.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <path d="M12 4v8" />
          <path d="M8 9l4 4 4-4" />
          <path d="M4 16c1.5 0 2.5 1 4 1s2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
        </svg>
      </IconWrapper>
    ),
  },
  {
    id: 6,
    title: "AFTER SALES SUPPORT",
    description:
      "Reliable support for maintenance and long term relationships.",
    icon: (
      <IconWrapper>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="w-9 h-9"
        >
          <path d="M12 3l6 2v5c0 4.5-2.5 7-6 9-3.5-2-6-4.5-6-9V5l6-2z" />
          <path d="M9.5 12l2 2 3-4" />
        </svg>
      </IconWrapper>
    ),
  },
];

const WhyChooseEnsis: React.FC = () => {
  return (
    <section className="w-full bg-[#f8f5f1] text-[#2e2b28]">
      <Container>
        <div className="flex items-center justify-center gap-3.5 mb-1">
          <div className="w-[70px] h-px bg-[#d9cfc5]" />

          <h2 className="text-[24px] md:text-[32px] leading-none font-bold tracking-[0.5px] text-[#2d2a28] font-serif">
            WHY CHOOSE ENSIS?
          </h2>

          <div className="w-[70px] h-px bg-[#d9cfc5]" />
        </div>

        <div className="text-center text-[#bda88f] text-sm mb-2.5">
          ❦
        </div>

        <p className="text-center text-sm text-[#5e5a55] mb-[30px] max-w-3xl mx-auto">
          We don&apos;t just sell products, we create complete wellness
          experiences.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[14px]">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-[#f3ede7] rounded-xl px-[18px] py-7 min-h-[220px] text-center border border-[rgba(194,174,153,0.15)] transition-transform duration-200 hover:-translate-y-[2px]"
            >
              {feature.icon}

              <h3 className="mb-3 text-[16px] font-extrabold leading-[1.5] tracking-[0.4px] text-[#2d2a28]">
                {feature.title}
              </h3>

              <p className="text-[14px] leading-[1.8] text-[#605a54]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseEnsis;