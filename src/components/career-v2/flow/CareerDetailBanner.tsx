import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow, serif, serifFontClass } from "@/components/career-v2/ui";
import detailBg from "@/assets/career/new/career-detail-bg.png";
import iconLeaf from "@/assets/career/new/green-leaf.png";
import iconTeam from "@/assets/career/new/green-group.png";
import iconGrowth from "@/assets/career/new/green-chart.png";
import iconHeart from "@/assets/career/new/green-heart.png";
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
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
        <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
        <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
      </div>

      {/* Readability overlay: subtle fade on left so the baked-in right room & lotus tagline stay visible */}
      <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
      <div className="absolute inset-0 hidden w-[58%] bg-gradient-to-r from-[#fbf4e2]/95 via-[#fbf4e2]/80 to-transparent lg:block" />
      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-[#fbf4e2]" />

      <Container className="relative py-0!">
        <div className="max-w-[620px] pt-7 pb-2 sm:pt-9 sm:pb-3 lg:pt-11 lg:pb-3">
          <div className="mb-0.5">
            <span className="text-[14px] sm:text-[15px] font-bold uppercase tracking-[0.05em] text-[#b47422]">
              CAREERS AT ENSIS
            </span>
          </div>

          <h1
            style={{ ...serif, fontWeight: 800 }}
            className={`${serifFontClass} mt-0 text-[34px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-[-0.02em] text-[#163a2b]`}
          >
            Create Spaces
            <br />
            That Help People Thrive.
          </h1>

          <p className="mt-2.5 text-[15px] sm:text-[16px] leading-[1.28] text-[#332f28] font-medium max-w-[640px] tracking-normal">
            Be a part of a passionate team that designs and delivers wellness <br />
            furniture and turnkey solutions for spas, wellness centers and<br />
            healthcare spaces across the world.
          </p>

          <Link
            href="/career#openings"
            className="mt-3.5 inline-flex items-center gap-2 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] px-6 py-2.5 text-sm sm:text-[14px] font-semibold text-white shadow-[0_3px_8px_rgba(10,25,18,0.3),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all hover:-translate-y-0.5"
          >
            <span>Explore Opportunities</span>
            <ArrowRight size={15} className="text-[#e5b85a]" />
          </Link>

          {/* 4 Feature Emblems with generous spacing matching image */}
          <ul className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-8 sm:gap-x-11 lg:gap-x-14 gap-y-3">
            {FEATURES.map((item, i) => (
              <li key={i} className="flex flex-col items-center gap-1.5 text-center">
                <div className="relative size-[52px] sm:size-[58px] flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt=""
                    width={58}
                    height={58}
                    className="size-full object-contain drop-shadow-xs"
                  />
                </div>
                <span className="text-[13px] sm:text-[14px] font-semibold leading-[1.25] text-[#163a2b] whitespace-pre-line">
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

