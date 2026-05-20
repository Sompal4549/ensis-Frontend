import React from "react";
import {
  ShieldCheck,
  Users,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { Container } from "../ui/Container";

const features = [
  {
    icon: ShieldCheck,
    title: "100% SECURE",
    description: "Your information is safe with us",
  },
  {
    icon: Users,
    title: "DEDICATED TEAM",
    description: "We are here to help",
  },
  {
    icon: Clock3,
    title: "QUICK RESPONSE",
    description: "We reply within 24 hrs",
  },
  {
    icon: BadgeCheck,
    title: "TRUSTED SUPPORT",
    description: "Your satisfaction is our priority",
  },
];

const SupportHighlights = () => {
  return (
    <section className="w-full">
      <Container>
        <div className="border border-[#ece7df] rounded-[26px] px-6 md:px-10 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-5 px-4 py-4 ${
                    index !== features.length - 1
                      ? "lg:border-r md:border-r border-[#ddd7ce]"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="min-w-[52px] h-[52px] rounded-full bg-[#f4f0e6] flex items-center justify-center">
                    <Icon
                      className="text-[#c8a45d]"
                      size={24}
                      strokeWidth={1.8}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-[#1d4d22] text-[15px] font-semibold uppercase leading-none mb-1">
                      {item.title}
                    </h3>

                    <p className="text-[#2f2f2f] text-sm md:text-[15px] font-medium leading-6">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SupportHighlights;