"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { getComponentContent } from "@/lib/api/api";
import iconLeaf from "@/assets/career/first-step/Glossy Golden Leaf Emblem.png";
import iconTeam from "@/assets/career/first-step/Golden Group Icon in Circle.png";
import iconGrowth from "@/assets/career/first-step/Golden Growth Chart Icon.png";
import iconHeart from "@/assets/career/first-step/Golden Heart in a Circle.png";

interface FeatureItem {
  id?: string;
  image: any;
  title: string;
  subtitle?: string;
  description?: string;
  imageurl?: {
    imageUrl: string;
    alt: string;
  };
}

const defaultFeatures: FeatureItem[] = [
  {
    image: iconLeaf,
    title: "Meaningful Work",
    subtitle: "Transform Lives",
  },
  {
    image: iconTeam,
    title: "Collaborative Team",
    subtitle: "Strong Together",
  },
  {
    image: iconGrowth,
    title: "Growth Opportunities",
    subtitle: "Grow With Us",
  },
  {
    image: iconHeart,
    title: "Real Impact on Lives",
    subtitle: "Worldwide Impact",
  },
];

const FIRST_STEP_ICONS = [iconLeaf, iconTeam, iconGrowth, iconHeart];

interface FeaturesStripContent {
  features?: FeatureItem[];
  items?: FeatureItem[];
}

export default function CareerStatsStrip() {
  const [resolvedFeatures, setResolvedFeatures] = useState<FeatureItem[]>(defaultFeatures);

  useEffect(() => {
    let isMounted = true;

    getComponentContent<FeaturesStripContent>("career.features", {
      features: defaultFeatures,
    })
      .then((content) => {
        if (!isMounted) return;

        const source = content.features?.length ? content.features : content.items;
        const stats = source?.length ? source : defaultFeatures;

        const resolved: FeatureItem[] = stats.slice(0, 4).map((item: FeatureItem, i: number) => {
          const fallback = defaultFeatures[i % defaultFeatures.length];
          return {
            ...fallback,
            title: item.title || fallback.title,
            subtitle: item.subtitle || item.description || fallback.subtitle,
            image: FIRST_STEP_ICONS[i % FIRST_STEP_ICONS.length],
          };
        });

        setResolvedFeatures(resolved);
      })
      .catch((err) => {
        console.error("Error fetching career stats strip content:", err);
        if (isMounted) setResolvedFeatures(defaultFeatures);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayFeatures = resolvedFeatures.slice(0, 4);

  return (
    <Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
      <div className="rounded-xl border border-[#C9972A] bg-[#0f2e22] py-2.5 px-3 ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent shadow-lg">
        <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {displayFeatures.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex items-center gap-3 pr-3 ${
                index !== displayFeatures.length - 1
                  ? "lg:border-r border-[#C9972A]/40"
                  : ""
              }`}
            >
              <div className="shrink-0 w-11 h-11 flex items-center justify-center overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={42}
                  height={42}
                  className="object-contain object-center"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="tabular-nums text-sm sm:text-[15px] font-semibold text-[#faf6ef] leading-tight">
                  {item.title}
                </p>

                <p className="text-xs leading-4 text-[#faf6ef]/90 font-medium">
                  {item.subtitle || item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
