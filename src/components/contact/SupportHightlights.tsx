import React from "react";
import {
  ShieldCheck,
  Users,
  Clock3,
  BadgeCheck,
} from "lucide-react";
import { Container } from "../ui/Container";
import Image from "next/image";
import HtmlRenderer from "../layout/HtmlRender";
import { getComponentContent, getImageUrl } from "@/lib/api/api";

interface SupportHighlightItem {
  iconImage: any; // lucide icon component (fallback) or image URL string (fetched)
  title: string;
  description: string;
}

export interface SupportHighlightsContent {
  features: SupportHighlightItem[];
}

const SupportHighlights = async () => {
  const fallbackFeatures: SupportHighlightItem[] = [
    {
      iconImage: ShieldCheck,
      title: "100% SECURE",
      description: "Your information is safe with us",
    },
    {
      iconImage: Users,
      title: "DEDICATED TEAM",
      description: "We are here to help",
    },
    {
      iconImage: Clock3,
      title: "QUICK RESPONSE",
      description: "We reply within 24 hrs",
    },
    {
      iconImage: BadgeCheck,
      title: "TRUSTED SUPPORT",
      description: "Your satisfaction is our priority",
    },
  ];

  const content = await getComponentContent<SupportHighlightsContent>(
    "contact.featuresStrip",
    { features: fallbackFeatures }
  );
  const features = content.features?.length ? content.features : fallbackFeatures;

  return (
    <section className="w-full">
   <Container className="relative lg:absolute z-100 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
        <div className="border border-[#ece7df] rounded-[26px] px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.03)] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => {
              const Icon = item.iconImage;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-5 px-2 py-2 ${
                    index !== features.length - 1
                      ? "lg:border-r md:border-r border-[#ddd7ce]"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="min-w-[52px] h-[52px] rounded-full bg-[#f4f0e6] flex items-center justify-center">
                    {typeof Icon === "string" ? (
                      <Image
                        className="text-[#c8a45d]"
                        height={24}
                        width={24}
                        alt={item.title}
                        src={getImageUrl(Icon)}
                      />
                    ) : (
                      <Icon className="text-[#c8a45d] w-6 h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-[#1d4d22] text-[15px] font-semibold uppercase leading-none mb-1">
                      {item.title}
                    </p>

                    <HtmlRenderer
                      className="text-[#2f2f2f] text-xs font-semibold leading-6"
                      content={item.description}
                    />
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