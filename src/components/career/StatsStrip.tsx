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
            image: imageUrl ? { src: getImageUrl(imageUrl), alt: item.imageurl?.alt || item.title } : fallback.image,
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

  return (
    <div className="relative z-10 mt-6 md:mt-0 md:-mt-28 xl:-mt-10">
      <Container className="relative z-10 py-0">
        <div className="rounded-xl border border-[#C9972A] bg-[#0f2e22] py-3 px-3 ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
            {resolvedFeatures.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex items-start gap-4 pr-6 ${
                  index !== resolvedFeatures.length - 1
                    ? "xl:border-r border-[#C9972A]/40"
                    : ""
                }`}
              >
                <div className="mt-1 shrink-0 w-14 h-14 flex items-center justify-center">
                  <Image
                    src={item.image.src ?? item.image}
                    alt={item.image.alt || item.title}
                    width={70}
                    height={50}
                    className="object-contain object-center"
                    style={{ height: "auto" }}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#faf6ef]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-4 text-[#faf6ef]/90 font-medium">
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
