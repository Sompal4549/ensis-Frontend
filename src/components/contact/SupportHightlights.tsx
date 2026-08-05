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
  iconImage: any;
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

  const features = content.features?.length
    ? content.features
    : fallbackFeatures;

  return (
    <section className="w-full">
      <Container className="relative lg:absolute z-50 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
        <div className="rounded-[15px] border border-[#d7bb77] bg-white px-4 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => {
              const Icon = item.iconImage;

              return (
                <div
                  key={index}
                  className={`relative flex items-center gap-5 px-4 ${
                    index !== features.length - 1
                      ? "after:absolute after:right-0 after:top-1/2 after:h-14 after:w-px after:-translate-y-1/2 after:bg-gradient-to-b after:from-transparent after:via-[#d7bb77] after:to-transparent"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-full border border-[#d7bb77] bg-gradient-to-br from-[#fffdf9] to-[#f3ead8] shadow-sm">
                    {typeof Icon === "string" ? (
                      <Image
                        src={getImageUrl(Icon)}
                        alt={item.title}
                        width={26}
                        height={26}
                      />
                    ) : (
                      <Icon className="h-6 w-6 text-[#c8a45d]" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="mb-1 text-[15px] font-semibold uppercase tracking-wide text-[#1d4d22]">
                      {item.title}
                    </h3>

                    <HtmlRenderer
                      className="text-xs leading-6 text-[#4a4a4a]"
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