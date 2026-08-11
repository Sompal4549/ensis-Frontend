"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { getComponentContent, getImageUrl } from "@/lib/api/api";
import twenty from "@/assets/about_new/years_experience.webp";
import projects from "@/assets/about_new/project.webp";
import twohundred from "@/assets/about_new/happy_clients.webp";
import states from "@/assets/about_new/states_served.webp";
import in_house from "@/assets/about_new/in_house.webp";
import pan_india from "@/assets/about_new/pan_india.webp";
import { gridColsClass } from "@/constants/grid";

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
  { image: twenty, title: "20+", subtitle: "Years Experience" },
  { image: projects, title: "1000+", subtitle: "Projects Completed" },
  { image: twohundred, title: "200+", subtitle: "Happy Clients" },
  { image: states, title: "28", subtitle: "States Served" },
  { image: in_house, title: "In-house", subtitle: "Manufacturing" },
  { image: pan_india, title: "Pan India", subtitle: "Installation & Support" },
];

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

        const resolved: FeatureItem[] = stats.map((item: FeatureItem, i: number) => {
          const fallback = defaultFeatures[i % defaultFeatures.length];
          const imageUrl = item.imageurl?.imageUrl || (typeof item.image === "string" ? item.image : "");
          return {
            ...fallback,
            ...item,
            image: imageUrl ? { src: getImageUrl(imageUrl, 200), alt: item.imageurl?.alt || item.title } : fallback.image,
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

  const gridCols = gridColsClass(resolvedFeatures.length);

  return (
    <div className="relative z-10 mt-6 md:mt-0 md:-mt-28 xl:-mt-10">
      <Container className="relative z-10 py-2">
        <div className="rounded-xl border border-[#C9972A] bg-[#0f2e22] py-2 px-3 ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent">
          <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridCols}`}>
            {resolvedFeatures.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex items-center gap-4 pr-4 ${
                  index !== resolvedFeatures.length - 1
                    ? "xl:border-r border-[#C9972A]/40"
                    : ""
                }`}
              >
                <div className="shrink-0 w-14 h-14 flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.image.src ?? item.image}
                    alt={item.image.alt || item.title}
                    width={44}
                    height={44}
                    className="object-contain object-center"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="tabular-nums text-base font-semibold text-[#faf6ef] leading-tight">
                    {item.title}
                  </p>

                  <p className="text-base leading-4 text-[#faf6ef]/90 font-medium">
                    {item.subtitle || item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
