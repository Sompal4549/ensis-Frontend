import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow, serif } from "@/components/career-v2/ui";
import detailBg from "@/assets/career/new/career-detail-bg.png";
import iconLeaf from "@/assets/career/first-step/Glossy Golden Leaf Emblem.png";
import iconTeam from "@/assets/career/first-step/Golden Group Icon in Circle.png";
import iconGrowth from "@/assets/career/first-step/Golden Growth Chart Icon.png";
import iconHeart from "@/assets/career/first-step/Golden Heart in a Circle.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";

const FEATURES = [
  { image: iconLeaf, label: "Meaningful\nWork" },
  { image: iconTeam, label: "Collaborative\nTeam" },
  { image: iconGrowth, label: "Growth\nOpportunities" },
  { image: iconHeart, label: "Real Impact\non Lives" },
];

export function CareerDetailBanner() {
  return (
    <section className="relative isolate w-full overflow-hidden">
      <Image
        src={detailBg}
        alt="Careers at Ensis"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Botanical leaves on left and right borders: left starts from right, right starts from left */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* Readability overlay: subtle fade on left so the baked-in right room & lotus tagline stay visible */}
      <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
      <div className="absolute inset-0 hidden w-[58%] bg-gradient-to-r from-[#fbf4e2]/95 via-[#fbf4e2]/80 to-transparent lg:block" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-[#fbf4e2]" />

      <Container className="relative py-0!">
        <div className="max-w-[620px] pt-5 pb-2 sm:pt-7 sm:pb-3 lg:pt-8 lg:pb-3">
          <Eyebrow>Careers at Ensis</Eyebrow>

          <h1
            style={serif}
            className="mt-2 text-[2.1rem] sm:text-[2.5rem] lg:text-[2.85rem] font-bold leading-[1.04] tracking-[-0.015em] text-[#163a2b]"
          >
            Create Spaces
            <br />
            That Help People Thrive.
          </h1>

          <p className="mt-2.5 text-xs sm:text-[13px] leading-[1.5] text-[#4a4237]">
            Be a part of a passionate team that designs and delivers wellness furniture and turnkey
            solutions for spas, wellness centers and healthcare spaces across the world.
          </p>

          <Link
            href="/career#openings"
            className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-[#163a2b] px-6 py-2.5 text-xs sm:text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(22,58,43,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#0f2a1f] hover:shadow-[0_8px_20px_rgba(22,58,43,0.35)]"
          >
            <span>Explore Opportunities</span>
            <ArrowRight size={15} />
          </Link>

          {/* 4 Feature Emblems - directly render emblem without extra outer concentric circle */}
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7">
            {FEATURES.map((item, i) => (
              <li key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="relative size-12 sm:size-13 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={48}
                    height={48}
                    className="object-contain drop-shadow-xs"
                  />
                </div>
                <span className="text-[10.5px] sm:text-[11px] font-semibold leading-[1.2] text-[#163a2b] whitespace-pre-line">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

