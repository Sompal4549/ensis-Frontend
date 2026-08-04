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

export default function WhyChoose({sectionContent}: { sectionContent: TurnkeyWhyChooseContent }) {
  return (
    <div className="w-full">

      {/* ── Top banner: "AND MANY MORE..." ── */}
      <Container className="py-3 flex items-center gap-4">
       <Image src={decorationLeft}  height={30} alt="decoration" className="h-full object-contain flex-1" />
        <span className="text-[#d19f4f] text-base font-semibold uppercase whitespace-nowrap">
         {sectionContent.title}
        </span>
        <Image src={decorationRight}  height={30} alt="decoration" className="h-full object-contain flex-1" crossOrigin="anonymous" />
      </Container>

      {/* ── Main dark section ── */}
      <div className="relative w-full overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={sectionContent.backgroundImage.imageUrl}
            alt={sectionContent.backgroundImage.alt||""}
            fill
            className="object-fill"
          />
        </div>

        {/* Dark overlay */}
        {/* <div className="absolute inset-0 bg-[#0e1f0e]/80 z-[1]" /> */}

        {/* Content */}
        <Container className="relative z-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0">

            {/* ── LEFT: Section title + stats ── */}
            <div className="flex flex-col gap-5  shrink-0">

              {/* Section title */}
              <div className="flex items-center gap-4 ml-20">
                <div className="h-px w-10 bg-[#c9972a] opacity-60" />
                <p className="text-[#c9972a] text-sm tracking-[0.28em] font-semibold uppercase whitespace-nowrap ">
                  {sectionContent.statsTitle}
                </p>
                <div className="h-px w-10 bg-[#c9972a] opacity-60" />
              </div>

              {/* Stats row */}
              <div className="flex items-stretch gap-0 lg:border-r-2 lg:border-[#c9972a]/30 lg:pr-8 pt-2">
                {sectionContent.stats.map((s, index) => (
                  <div
                    key={s.id || index}
                    className={`flex flex-col items-start justify-center px-5 first:pl-0 ${
                      index !== sectionContent.stats.length - 1 ? "border-r border-[#c9972a]/40" : ""
                    }`}
                  >
                    <span className="text-[#c9972a] text-2xl sm:text-4xl font-semibold leading-none">
                      {s?.title||""}
                    </span>
                    <HtmlRenderer content={s.description} className="text-[#e8d9b5] text-[10px] sm:text-xs leading-snug whitespace-pre-line mt-1 font-medium">
                      
                    </HtmlRenderer>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Feature icons ── */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-start lg:justify-around gap-4 lg:gap-0 lg:pl-8 w-full">
              {sectionContent.features.map((f) => (
                <div 
                  key={f.id || f.title} // Changed f.label to f.title
                  className={`flex flex-col items-center gap-4 text-center px-2 lg:px-2`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src={f.image.imageUrl}
                      alt={f.image.alt}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <p className="text-[#e8d9b5] text-[9px] sm:text-[10px] leading-snug whitespace-pre-line">
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