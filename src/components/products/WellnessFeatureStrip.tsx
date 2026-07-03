import { Container } from "../ui/Container";
import Image, { StaticImageData } from "next/image";

import sustainable_material from "@/assets/products/sustainable_material.png";
import ayurvedic_heritage from "@/assets/products/ayurvedic_heritage.png";
import handmade_excellence from "@/assets/products/handmade_excellence.png";
import therapist_approved from "@/assets/products/therapist_approved.png";
import hotel_spa_quality from "@/assets/products/hotel_and_spa_quality.png";
import global_shipping from "@/assets/products/global_shippning.png";
import { getComponentContent, getImageUrl } from "@/lib/api/api";

const defaultFeatures = [
  {
    image: sustainable_material,
    title: "SUSTAINABLE",
    subtitle: "MATERIALS",
  },
  {
    image: ayurvedic_heritage,
    title: "AYURVEDIC",
    subtitle: "HERITAGE",
  },
  {
    image: handmade_excellence,
    title: "HANDCRAFTED",
    subtitle: "EXCELLENCE",
  },
  {
    image: therapist_approved,
    title: "THERAPIST",
    subtitle: "APPROVED",
  },
  {
    image: hotel_spa_quality,
    title: "HOTEL & SPA",
    subtitle: "QUALITY",
  },
  {
    image: global_shipping,
    title: "GLOBAL",
    subtitle: "SHIPPING",
  },
];

export interface WellnessFeature {
  image: string | StaticImageData;
  title: string;
  subtitle: string;
}

export interface WellnessFeatureStripContent {
  features: WellnessFeature[];
}

interface Props {
  sectionContent?: WellnessFeatureStripContent;
}

export default async function WellnessFeatureStrip() {
  const sectionContent = await getComponentContent<WellnessFeatureStripContent>(
    "product.featureStrip",
    { features: defaultFeatures }
  );

  const count = sectionContent.features.length;

  const getGridCols = () => {
    if (count <= 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2 md:grid-cols-4";
    if (count === 5)
      return "grid-cols-2 md:grid-cols-5 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1";

    return "grid-cols-2 md:grid-cols-3 xl:grid-cols-6";
  };

  return (
    <section
      className="
        static md:absolute
        left-0
        right-0
        bottom-0
        md:translate-y-1/2
        z-30
      "
    >
      <div className="w-full bg-gradient-to-r from-[#012c20] via-[#013727] to-[#012c20]">
        <Container className="py-3">
          <div className={`grid gap-6 ${getGridCols()}`}>
            {sectionContent.features.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-center gap-4 pr-6 ${
                  index !== count - 1 ? "xl:border-r border-[#9f7a43]/30" : ""
                }`}
              >
                {index % 2 === 0 && index !== count - 1 && (
                  <div className="absolute right-0 top-1/2 h-10 -translate-y-1/2 border-r border-[#9f7a43]/20 xl:hidden" />
                )}

                <Image
                  src={
                    typeof item.image === "string"
                      ? getImageUrl(item.image)
                      : item.image
                  }
                  alt={item.title}
                  width={70}
                  height={50}
                  className="object-contain"
                />

                <div>
                  <p className="text-xs font-semibold text-[#f7f1e8]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs font-medium leading-4 text-[#f7f1e8]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}