import { Container } from "../ui/Container";
import Image from "next/image";
import TurnkeyStatsStrip from "./TurnkeyStatsStrip";
import banner_image from "@/assets/trunkey_solutions/turnkey.webp"
import single_point from "@/assets/trunkey_solutions/single_point_banner.webp"
import on_time from "@/assets/trunkey_solutions/on_time.webp"
import premium from "@/assets/trunkey_solutions/premium.webp"
import transparent from "@/assets/trunkey_solutions/transparent_banner.webp"
import after_sales from "@/assets/trunkey_solutions/after_sales_banner.webp"
import lotus from "@/assets/about/lotus.png";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

const FEATURES = [
  { icon: single_point, label: "Single Point\nResponsibility" },
  { icon: on_time, label: "On-Time\nDelivery" },
  { icon: premium, label: "Premium\nQuality" },
  { icon: transparent, label: "Transparent\nProcess" },
  { icon: after_sales, label: "After Sales\nSupport" },
];

export interface TurnkeyHeroContent {
  backgroundImage: { imageUrl: string; alt?: string };
  subheading: string;
  title: string;
  highlight: string;
  description: string;
  features: Array<{
    id?: string; // Added id for unique key prop
    title: string;
    label: string;
    image: { imageUrl: string; alt?: string };
  }>;
  primaryButton: { label: string; url: string }; // Changed url to path
  secondaryButton: { label: string; url: string }; // Changed url to path
}

export default function TurnkeyHero({ sectionContent }: { sectionContent?: TurnkeyHeroContent }) {
  const bgImage = sectionContent?.backgroundImage?.imageUrl || banner_image;
  const subheading = sectionContent?.subheading || "END-TO-END SOLUTIONS";
  const title = sectionContent?.title || "Complete Turnkey Solutions";
  const highlight = sectionContent?.highlight || "From Concept to Commissioning";
  const description = sectionContent?.description || "We design, manufacture, and build world-class Ayurvedic clinics, spas, and wellness spaces.";
  const features = (sectionContent?.features && sectionContent.features.length > 0)
    ? sectionContent.features
    : FEATURES.map((f, i) => ({ id: String(i), title: f.label.replace('\n', ' '), label: f.label, image: { imageUrl: f.icon.src || f.icon, alt: f.label } }));
  const primaryButton = sectionContent?.primaryButton || { label: "Get a Free Consultation", url: "/contact" };
  const secondaryButton = sectionContent?.secondaryButton || { label: "View Our Products", url: "/products" };

  return (
    <div className="relative overflow-visible mb-0 md:mb-20 pt-6">
      <div className="relative">
        <Image
          src={bgImage}
          alt={sectionContent?.backgroundImage?.alt || title}
          fill
          priority
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover xl:object-fill z-0! absolute object-left xl:object-right"
        />
        {/* ── HERO ── */}
        <Container className="relative z-20 !py-0 !max-w-none xl:!max-w-[1400px]">
          <div className="relative min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none w-full">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-8 items-center h-full">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-4 h-full justify-center">
                {/* Eyebrow */}
                <div className="flex items-center gap-4">
                  <span className="text-[#c38727] text-base font-semibold uppercase">
                    {subheading}
                  </span>
                  <div className="h-px w-8 bg-[#c38727]" />
                  <Image alt="lotus" src={lotus} width={30} height={30} className="h-full object-contain" />
                  <div className="h-px w-8 bg-[#c38727]" />
                </div>

                {/* Headline */}
                <h1 className="text-[#1a2e1a] text-3xl md:text-5xl font-normal tracking-tight">
                  {title}
                  {highlight && (
                    <span className="block mt-1 text-[#c38727] font-medium">{highlight}</span>
                  )}
                </h1>

                {/* Body copy */}
                <div className="text-base leading-6 max-w-lg mb-4 line-clamp-4" dangerouslySetInnerHTML={{ __html: description }}>
                </div>

                {/* Feature icons */}
                <div className="flex flex-wrap md:flex-nowrap gap-4 sm:gap-6">
                  {features.map((f, index) => (
                    <div
                      key={f?.id || index}
                      className={`flex flex-col items-center gap-3 text-center min-w-[64px] pr-3 ${index !== features.length - 1 ? "border-r border-[#7c5c18]" : ""
                        }`}
                    >
                      <div className="w-8 h-8 text-[#d6a85f] flex items-center justify-center text-xl">
                        <Image src={typeof f?.image === 'string' ? f?.image : (f?.image?.imageUrl || single_point)} alt={f?.image?.alt || f?.title || ""} width={40} height={40} className="object-fill" />
                      </div>
                      <p className="text-sm md:text-xs leading-snug whitespace-pre-line font-medium max-w-[90px]">
                        {f?.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 mt-3">
                  <BookButton text={primaryButton.label} path={primaryButton.url} />
                  <GreenButton text={secondaryButton.label} path={secondaryButton.url} />
                </div>
              </div>

            </div>
          </div>
        </Container>
      </div>
      <TurnkeyStatsStrip />
    </div>
  );
}