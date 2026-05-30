import Image from "next/image";

// Replace with your actual asset imports
import bgImage from "@/assets/trunkey_solutions/why_choose_bg.webp";
import singlePointIcon from "@/assets/trunkey_solutions/why_choose/single_point.webp";
import noVendorIcon from "@/assets/trunkey_solutions/nod_wendor.webp";
import fasterProjectIcon from "@/assets/trunkey_solutions/why_choose/faster.webp";
import ownManufacturingIcon from "@/assets/trunkey_solutions/own_manufacturing.webp";
import transparentBoqIcon from "@/assets/trunkey_solutions/why_choose/transparent.webp";
import traditionalModernIcon from "@/assets/trunkey_solutions/why_choose/traditional_modern.webp";
import wellnessIndustryIcon from "@/assets/trunkey_solutions/why_choose/wellness_industry.webp";
import expertReadyIcon from "@/assets/trunkey_solutions/expert_ready_solution.webp";

const STATS = [
  { value: "20+",   label: "Years of\nExperience" },
  { value: "1000+", label: "Products\nManufactured" },
  { value: "500+",  label: "Projects\nDelivered" },
  { value: "PAN",   label: "India\nExecution" },
];

const FEATURES = [
  { icon: singlePointIcon,      label: "Single Point\nResponsibility" },
  { icon: noVendorIcon,         label: "No Vendor\nCoordination" },
  { icon: fasterProjectIcon,    label: "Faster Project\nCompletion" },
  { icon: ownManufacturingIcon, label: "Own Manufacturing\nFacility" },
  { icon: transparentBoqIcon,   label: "Transparent\nBOQ" },
  { icon: traditionalModernIcon,label: "Traditional + Modern\nDesign Approach" },
  { icon: wellnessIndustryIcon, label: "Wellness Industry\nSpecialists" },
  { icon: expertReadyIcon,      label: "Expert Ready\nSolutions" },
];

export default function WhyChoose() {
  return (
    <div className="w-full">

      {/* ── Top banner: "AND MANY MORE..." ── */}
      <div className="bg-[#f5efe0] py-3 flex items-center gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex-1 h-px bg-[#c9972a] opacity-40" />
        <span className="text-[#d19f4f] text-base font-semibold uppercase tracking-[0.1em] whitespace-nowrap">
          ✦ And Many More Customised Wellness Facilities ✦
        </span>
        <div className="flex-1 h-px bg-[#c9972a] opacity-40" />
      </div>

      {/* ── Main dark section ── */}
      <div className="relative w-full overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Why ENSIS background"
            fill
            className="object-fill"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0e1f0e]/80 z-[1]" />

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-0">

            {/* ── LEFT: Section title + stats ── */}
            <div className="flex flex-col gap-5  shrink-0">

              {/* Section title */}
              <div className="flex items-center gap-2 ml-20">
                <div className="h-px w-10 bg-[#c9972a] opacity-60" />
                <p className="text-[#c9972a] text-sm tracking-[0.28em] font-semibold uppercase whitespace-nowrap ">
                  Why Clients Choose Ensis?
                </p>
                <div className="h-px w-10 bg-[#c9972a] opacity-60" />
              </div>

              {/* Stats row */}
              <div className="flex items-stretch gap-0 lg:border-r-2 lg:border-[#c9972a]/30 lg:pr-8 pt-2">
                {STATS.map((s, index) => (
                  <div
                    key={s.label}
                    className={`flex flex-col items-start justify-center px-5 first:pl-0 ${
                      index !== STATS.length - 1 ? "border-r border-[#c9972a]/40" : ""
                    }`}
                  >
                    <span className="text-[#c9972a] text-2xl sm:text-4xl font-semibold leading-none">
                      {s.value}
                    </span>
                    <span className="text-[#e8d9b5] text-[10px] sm:text-xs leading-snug whitespace-pre-line mt-1 font-medium">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Feature icons ── */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-start lg:justify-around gap-4 lg:gap-0 lg:pl-8 w-full">
              {FEATURES.map((f, index) => (
                <div
                  key={f.label}
                  className={`flex flex-col items-center gap-2 text-center px-2 lg:px-2`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image
                      src={f.icon}
                      alt={f.label}
                      width={48}
                      height={48}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <p className="text-[#e8d9b5] text-[9px] sm:text-[10px] leading-snug whitespace-pre-line">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}