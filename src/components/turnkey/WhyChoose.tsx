import Image from "next/image";

// Replace with your actual asset imports
import singlePointIcon from "@/assets/trunkey_solutions/why_choose/single_point.webp";
import noVendorIcon from "@/assets/trunkey_solutions/nod_wendor.webp";
import fasterProjectIcon from "@/assets/trunkey_solutions/why_choose/faster.webp";
import ownManufacturingIcon from "@/assets/trunkey_solutions/own_manufacturing.webp";
import transparentBoqIcon from "@/assets/trunkey_solutions/why_choose/transparent.webp";
import traditionalModernIcon from "@/assets/trunkey_solutions/why_choose/traditional_modern.webp";
import wellnessIndustryIcon from "@/assets/trunkey_solutions/why_choose/wellness_industry.webp";
import expertReadyIcon from "@/assets/trunkey_solutions/expert_ready_solution.webp";
import { Container } from "../ui/Container";
import decorationLeft from "@/assets/icons/arrow_left2.webp"
import decorationRight from "@/assets/icons/arrow_right2.webp"
import HtmlRenderer from "../layout/HtmlRender";



export interface TurnkeyWhyChooseContent {
  title: string;
  backgroundImage: { imageUrl: string; alt?: string };
  statsTitle: string;
  stats: Array<{ id?: string; value: string; label: string, title:string, description:string }>; // Added id for unique key prop
  features: Array<{ id?: string; title: string; image: { imageUrl: string; alt: string, id?: string; } }>;
}

const defaultFeatures = [
  { id: "1", title: "Single Point Contact", image: { imageUrl: singlePointIcon.src || singlePointIcon, alt: "Single Point" } },
  { id: "2", title: "No Vendor Hassles", image: { imageUrl: noVendorIcon.src || noVendorIcon, alt: "No Vendor Hassles" } },
  { id: "3", title: "Faster Project Delivery", image: { imageUrl: fasterProjectIcon.src || fasterProjectIcon, alt: "Faster Delivery" } },
  { id: "4", title: "Own Manufacturing", image: { imageUrl: ownManufacturingIcon.src || ownManufacturingIcon, alt: "Own Manufacturing" } },
  { id: "5", title: "Transparent BOQ", image: { imageUrl: transparentBoqIcon.src || transparentBoqIcon, alt: "Transparent BOQ" } },
  { id: "6", title: "Traditional & Modern", image: { imageUrl: traditionalModernIcon.src || traditionalModernIcon, alt: "Traditional Modern" } },
];

const defaultStats = [
  { id: "1", value: "20+", label: "Years Experience", title: "20+", description: "Years Experience" },
  { id: "2", value: "500+", label: "Projects Delivered", title: "500+", description: "Projects Delivered" },
];

export default function WhyChoose({sectionContent}: { sectionContent?: TurnkeyWhyChooseContent }) {
  const title = sectionContent?.title || "Why Choose Ensis Turnkey";
  const statsTitle = sectionContent?.statsTitle || "OUR TRACK RECORD";
  const stats = (sectionContent?.stats && sectionContent.stats.length > 0) ? sectionContent.stats : defaultStats;
  const features = (sectionContent?.features && sectionContent.features.length > 0) ? sectionContent.features : defaultFeatures;
  const bgImage = sectionContent?.backgroundImage?.imageUrl;

  return (
    <div className="w-full">

      {/* ── Top banner: "AND MANY MORE..." ── */}
      <Container className="py-3 flex items-center gap-4">
       <Image src={decorationLeft}  height={30} alt="decoration" className="h-full object-contain flex-1" />
        <span className="text-[#d19f4f] text-base font-semibold uppercase whitespace-nowrap">
         {title}
        </span>
        <Image src={decorationRight}  height={30} alt="decoration" className="h-full object-contain flex-1" crossOrigin="anonymous" />
      </Container>

      {/* ── Main dark section ── */}
      <div className="relative w-full overflow-hidden bg-[#062a22]">

        {/* Background image */}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt={sectionContent?.backgroundImage?.alt || ""}
              fill
              className="object-fill"
            />
          </div>
        )}

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-[#0e1f0e]/80 z-[1]" /> */}

        {/* Content */}
        <Container className="relative z-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0">

            {/* ── LEFT: Section title + stats ── */}
            <div className="flex flex-col gap-5 w-full lg:w-[40%] shrink-0">

              {/* Section title */}
              <div className="flex items-center gap-3 ml-0 lg:ml-20">
                <div className="h-px w-6 lg:w-10 bg-[#c9972a] opacity-60" />
                <p className="text-[#c9972a] text-base tracking-[0.28em] font-semibold uppercase whitespace-normal lg:whitespace-nowrap">
                  {statsTitle}
                </p>
                <div className="h-px w-6 lg:w-10 bg-[#c9972a] opacity-60" />
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-stretch gap-y-3 gap-x-0 lg:border-r-2 lg:border-[#c9972a]/30 lg:pr-8 pt-2">
                {stats.map((s, index) => (
                  <div
                    key={s.id || index}
                    className={`flex flex-col items-start justify-center px-3 sm:px-5 first:pl-0 ${
                      index !== stats.length - 1 ? "border-r border-[#c9972a]/40" : ""
                    }`}
                  >
                    <span className="text-[#c9972a] text-2xl sm:text-4xl font-semibold leading-none">
                      {s?.title || s?.value || ""}
                    </span>
                    <HtmlRenderer content={s.description || s.label || ""} className="text-[#e8d9b5] text-base leading-snug whitespace-pre-line mt-1 font-medium" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Feature icons ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 w-full lg:w-[70%] lg:grid-cols-3 xl:grid-cols-6 items-start justify-items-center gap-4 lg:gap-5 lg:pl-8">
              {features.map((f, idx) => (
                <div 
                  key={f.id || f.title || idx}
                  className={`flex flex-col items-center gap-4 text-center px-2 lg:px-2 w-full`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src={typeof f.image === 'string' ? f.image : (f.image?.imageUrl || singlePointIcon)}
                      alt={f.image?.alt || f.title || ""}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <p className="text-[#e8d9b5] text-base leading-snug whitespace-pre-line font-medium">
                    {f.title}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}