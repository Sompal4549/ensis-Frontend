import React from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, Lightbulb, Users, BarChart3, Heart, Leaf, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getImageUrl } from "@/lib/api/api";
import { SITE_URL } from "@/lib/site";
import { toJsonLd } from "@/lib/seo-text";
import {
  getCareerContent,
  jobHref,
  jobLocation,
  jobSummary,
  jobType,
  listOpenJobs,
  plain,
  type CareerContent,
  type PublicJob,
} from "@/lib/careers";
import heroBanner from "@/assets/career/first-step/banner.png";
import botanicalBranch from "@/assets/career/Pale Sage Botanical Branch.png";
import exploreBg from "@/assets/career/first-step/explore-bg.webp";
import whyWorkBg from "@/assets/career/why_work_bg.png";
import lifeBg from "@/assets/career/first-step/life-bg.webp";
import space1 from "@/assets/career/new/space-1.webp";
import space2 from "@/assets/career/new/spaces-2.webp";
import space3 from "@/assets/career/new/spaces-3.png";
import space4 from "@/assets/career/new/space-4.png";
import space5 from "@/assets/career/new/spaces-fifth.png";
import jobDesigner from "@/assets/career/new/Designing a Modern Lounge Chair.webp";
import jobProduction from "@/assets/career/new/Focused Notes in a Modern Wellness Studio.webp";
import jobSales from "@/assets/career/new/Design Consultation in a Modern Showroom.webp";
import jobConsultant from "@/assets/career/new/Professional Browsing in a Warm Showroom.webp";
import iconMeaningful from "@/assets/career/meaning_full.png";
import iconTeam from "@/assets/career/first-step/Golden Group Icon in Circle.png";
import iconGrowth from "@/assets/career/first-step/Golden Growth Chart Icon.png";
import iconHeart from "@/assets/career/first-step/Golden Heart in a Circle.png";
import whyWorkLeaf from "@/assets/career/first-step/icon-leaf.webp";
import whyWorkTeam from "@/assets/career/first-step/icon-team.webp";
import whyWorkGrowth from "@/assets/career/first-step/icon-growth.webp";
import whyWorkHeart from "@/assets/career/first-step/icon-heart.webp";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";
import CareerStatsStrip from "@/components/career/StatsStrip";
import { CareerIcon, Eyebrow, SerifHeading, goldButton, goldOutlineButton, greenButton, serif, serifFontClass } from "./ui";

function formatWhyWorkTitle(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("supportive")) {
    return (
      <>
        Supportive Team<br />Environment
      </>
    );
  }
  if (lower.includes("better spaces")) {
    return (
      <>
        Better Spaces,<br />Better Lives
      </>
    );
  }
  return title;
}

const HERO_FEATURES = [
  { image: iconMeaningful, label: "Meaningful\nWork" },
  { image: iconTeam, label: "Collaborative\nTeam" },
  { image: iconGrowth, label: "Growth\nOpportunities" },
  { image: iconHeart, label: "Real Impact\non Lives" },
];

function JobLocationIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C7.8 2 4.5 5.3 4.5 9.4c0 5.4 6.7 12.1 7 12.4.3.3.7.3 1 0 .3-.3 7-7 7-12.4C19.5 5.3 16.2 2 12 2z"
        fill="#ea8f1c"
      />
      <circle cx="12" cy="9.4" r="3" fill="#ffffff" />
    </svg>
  );
}

function JobBriefcaseIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Top Handle */}
      <path
        d="M8.5 6V4.8C8.5 3.8 9.3 3 10.3 3h3.4c1 0 1.8.8 1.8 1.8V6"
        stroke="#ea8f1c"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Briefcase Body */}
      <rect x="2.5" y="6" width="19" height="14" rx="2.8" fill="#ea8f1c" />
      {/* Center lock & strap line in white */}
      <path
        d="M2.5 11.2h19"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <rect x="10.2" y="10" width="3.6" height="2.8" rx="0.6" fill="#fff" />
    </svg>
  );
}

function SectionLeaves({ className = "" }: { className?: string }) {
  return (
    <>
      <div className={`hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 w-[60px] sm:w-[85px] md:w-[110px] lg:w-[135px] select-none z-10 overflow-hidden opacity-40 ${className}`}>
        <Image
          src={sectionLeft}
          alt=""
          aria-hidden
          fill
          sizes="12vw"
          className="object-cover object-left"
        />
      </div>
      <div className={`hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 w-[60px] sm:w-[85px] md:w-[110px] lg:w-[135px] select-none z-10 overflow-hidden opacity-40 ${className}`}>
        <Image
          src={sectionRight}
          alt=""
          aria-hidden
          fill
          sizes="12vw"
          className="object-cover object-right"
        />
      </div>
    </>
  );
}

// Exact job cover fallbacks matching the 4 mockup cards
const JOB_FALLBACKS: StaticImageData[] = [jobDesigner, jobProduction, jobSales, jobConsultant];
const LIFE_FALLBACKS: StaticImageData[] = [space1, space2, space3, space4];

const MOCKUP_JOBS_ORDER = [
  {
    slug: "product-designer",
    title: "Product Designer",
    location: "Delhi NCR",
    employmentType: "Full Time",
    shortDescription: "Design innovative wellness furniture and treatment solutions that combine functionalitly, comfort and aesthetics.",
  },
  {
    slug: "furniture-production-specialist",
    title: "Furniture Production Specialist",
    location: "Delhi NCR",
    employmentType: "Full Time",
    shortDescription: "Support manufacturing processes, ensure quality craftsmanship and help bring our designs to life.",
  },
  {
    slug: "sales-partnerships-executive",
    title: "Sales & Partnerships Executive",
    location: "Delhi NCR",
    employmentType: "Full Time",
    shortDescription: "Build client relationships, explore new business opportunities and contribute to the growth of ENSIS.",
  },
  {
    slug: "wellness-space-consultant",
    title: "Wellness Space Consultant",
    location: "Delhi NCR",
    employmentType: "Full Time",
    shortDescription: "Guide clients in creating functional and beautiful wellness spaces with the right furniture and solutions.",
  },
];

const resolveImageUrl = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    if (typeof record.imageUrl === "string") return record.imageUrl.trim();
    if (typeof record.image === "string") return record.image.trim();
    if (typeof record.url === "string") return record.url.trim();
    if (typeof record.src === "string") return record.src.trim();
  }
  return "";
};

const imageSrc = (value: unknown, fallback: StaticImageData) => {
  const url = resolveImageUrl(value);
  return url ? getImageUrl(url) : fallback;
};

function formatJobTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("furniture production")) {
    return (
      <>
        Furniture Production<br />Specialist
      </>
    );
  }
  if (t.includes("sales") && t.includes("partnerships")) {
    return (
      <>
        Sales &amp; Partnerships<br />Executive
      </>
    );
  }
  if (t.includes("wellness space")) {
    return (
      <>
        Wellness Space<br />Consultant
      </>
    );
  }
  return title;
}

export function JobCard({ job, index }: { job: PublicJob; index: number }) {
  return (
    <article className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] shadow-[0_4px_16px_rgba(70,50,20,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(70,50,20,0.08)]">
      {/* Edge-to-edge cover image with NO side gappings */}
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#efe6d6]">
        <Image
          src={imageSrc(job.coverImage, JOB_FALLBACKS[index % JOB_FALLBACKS.length])}
          alt={job.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Padding inside the bottom text container */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div className="flex flex-1 flex-col">
          <h3
            style={serif}
            className="text-[17px] sm:text-[18px] xl:text-[19px] font-bold text-[#163a2b] line-clamp-2 min-h-[44px] sm:min-h-[48px]"
            title={job.title}
          >
            {formatJobTitle(job.title)}
          </h3>
          <div className="mt-2 mb-2 flex items-center gap-2 text-[14px] font-medium text-[#4a4338] min-h-[24px]">
            <span className="inline-flex items-center gap-1.5 font-medium truncate max-w-[170px]" title={jobLocation(job)}>
              <JobLocationIcon className="size-4 shrink-0 text-[#a8742b]" />
              <span className="truncate">{jobLocation(job)}</span>
            </span>
            <span className="text-[#dacbb4] shrink-0">|</span>
            <span className="inline-flex items-center gap-1.5 font-medium shrink-0">
              <JobBriefcaseIcon className="size-4 shrink-0 text-[#a8742b]" /> {jobType(job)}
            </span>
          </div>
          <p className="text-[14px] leading-[1.5] text-[#554e42] line-clamp-3 min-h-[63px]">
            {jobSummary(job)}
          </p>
        </div>
        <Link
          href={jobHref(job)}
          className="mt-3.5 w-full shrink-0 py-2 px-3.5 rounded-lg border-[1.5px] border-[#c89228] bg-transparent hover:bg-[#c89228] text-[#8a570c] hover:text-white text-[14px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

function Hero({ banner }: { banner: CareerContent["banner"] }) {
  const rawBg = banner.backgroundImage || (banner as any).image || (banner as any).bgImage || (banner as any).bannerImage;
  const background = imageSrc(rawBg, heroBanner);

  const eyebrow = banner.eyebrow || "CAREERS AT ENSIS";
  const highlight = banner.highlight || "Tomorrow";

  let lines: string[] = [];
  if (Array.isArray(banner.headingLines) && banner.headingLines.length > 0) {
    lines = banner.headingLines;
  } else if ((banner as any).heading || (banner as any).title) {
    const rawHeading = String((banner as any).heading || (banner as any).title).trim();
    if (highlight && rawHeading.toLowerCase().endsWith(highlight.toLowerCase())) {
      const trimmed = rawHeading.slice(0, -highlight.length).trim();
      lines = trimmed.includes("\n") ? trimmed.split("\n") : [trimmed];
    } else {
      lines = rawHeading.includes("\n") ? rawHeading.split("\n") : [rawHeading];
    }
  } else {
    lines = ["Design Spaces", "for a Healthier"];
  }

  const description =
    banner.description ||
    "Be a part of a passionate team that designs and delivers wellness furniture and solutions for spas, wellness centers and healthcare spaces across the world.";

  return (
    <section className="relative z-20 overflow-hidden mb-0">
      <div className="relative">
        {/* Panoramic Banner Background */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={background}
            alt="Ensis Careers Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center] xl:object-top"
          />
          {/* Mobile & Tablet Readability Overlay - exactly like Home & About heroes */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(251, 247, 238, 0.94) 0%, rgba(251, 247, 238, 0.84) 45%, rgba(251, 247, 238, 0.95) 100%)",
            }}
          />
        </div>

        <Container className="bg-transparent relative z-10">
          <div className="relative min-h-[440px] py-7 sm:py-9 md:py-12 lg:py-0 md:h-[480px] lg:h-[490px] xl:h-[500px] w-full flex items-center">
            <div className="max-w-[620px] pl-0 sm:pl-3 lg:pl-5 w-full">
              {/* 1. Eyebrow: CAREERS AT ENSIS — */}
              <div className="mb-1 sm:mb-1.5 flex items-center gap-2">
                <span className="text-[14px] md:text-[16px] font-bold uppercase tracking-[0.16em] text-[#a9742a]">
                  {eyebrow}
                </span>
                <span className="text-[#a9742a] font-bold text-sm sm:text-base select-none">—</span>
              </div>

              {/* 2. Headline: Design Spaces for a Healthier Tomorrow */}
              <h1
                style={{ ...serif, fontWeight: 800 }}
                className={`${serifFontClass} text-[30px] sm:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[60px] font-extrabold tracking-[-0.03em] text-[#163a2b] mt-0 leading-[1.12] sm:leading-[1.15]`}
              >
                {lines.map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br className="hidden xs:inline" />{" "}
                  </React.Fragment>
                ))}
                {highlight ? <span className="text-[#dc881a]">{highlight}</span> : null}
              </h1>

              {/* 3. Subtitle / Description */}
              <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15px] md:text-[16px] text-[#332f28] leading-[1.5] max-w-[560px] font-medium whitespace-pre-line">
                {description}
              </p>

              {/* 4. Button: Explore Opportunities → */}
              <div className="mt-3.5 sm:mt-4">
                <Link
                  href={banner.ctaHref || (banner as any).buttonHref || (banner as any).buttonPath || "#openings"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0e3022] hover:bg-[#071b13] px-5 sm:px-7 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(14,48,34,0.3)] transition-all transform hover:-translate-y-0.5"
                >
                  <span>{banner.ctaText || (banner as any).buttonLabel || (banner as any).buttonText || "Explore Opportunities"}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* 5. Four Feature Emblems */}
              <ul className="mt-4 sm:mt-5 grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-x-2 sm:gap-x-8 lg:gap-x-11 gap-y-2 max-w-[520px]">
                {HERO_FEATURES.map((item, i) => (
                  <li key={i} className="flex flex-col items-center gap-1 sm:gap-1.5 text-center">
                    <div className="relative size-[38px] sm:size-[48px] lg:size-[54px] flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt=""
                        width={54}
                        height={54}
                        className="size-full object-contain drop-shadow-xs"
                      />
                    </div>
                    <span className="text-[10.5px] sm:text-[13px] lg:text-[14px] font-semibold leading-[1.2] sm:leading-[1.25] text-[#163a2b] whitespace-pre-line">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
      {/* Stats strip commented out for now as requested */}
      {/* <CareerStatsStrip /> */}
    </section>
  );
}

function Openings({ content, jobs }: { content: CareerContent; jobs: PublicJob[] }) {
  const { openings } = content;

  // Use real live jobs from the database; only fallback to mockup placeholders if 0 database jobs exist
  const displayJobs = React.useMemo(() => {
    if (jobs && jobs.length > 0) {
      return jobs;
    }
    return MOCKUP_JOBS_ORDER.map((fallback, i) => ({ ...fallback, _id: `mock-${i}` } as PublicJob));
  }, [jobs]);

  const isMarquee = displayJobs.length > 4;

  return (
    <section id="openings" className="relative scroll-mt-20 pt-3 sm:pt-3.5 lg:pt-4 pb-3 sm:pb-3.5 overflow-hidden">
      {/* Background with subtle warmth */}
      <Image src={exploreBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />

      {/* Decorative Botanical Leaf Borders */}
      <SectionLeaves />

      <Container className="relative z-10">
        <div className="grid items-end gap-2.5 pb-1.5 sm:pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[18px] font-bold uppercase tracking-[0.16em] text-[#a8742b]">
                {openings.eyebrow || "CURRENT OPENINGS"}
              </span>
              <div className="h-[2px] w-8 sm:w-10 bg-[#c9a86a]" />
            </div>
            <h2 style={serif} className="mt-1 text-3xl sm:text-4xl md:text-[38px] font-bold leading-[1.12] text-[#163a2b]">
              Explore <span className="text-[#c88f28]">Opportunities</span>
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-sm sm:text-[14.5px] leading-relaxed text-[#4a4338] font-medium">
              {openings.description || "Join our team and contribute to creating inspiring wellness spaces through innovative furniture, design and customer-focused solutions."}
            </p>
          </div>
        </div>

        {isMarquee ? (
          <div className="relative mt-2.5 sm:mt-3 w-full overflow-hidden py-2 group">
            {/* Subtle fade edges for smooth transition */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#fbf6ec] via-[#fbf6ec]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#fbf6ec] via-[#fbf6ec]/80 to-transparent z-10" />

            <style>{`
              @keyframes careerMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-career-marquee {
                display: flex;
                align-items: stretch;
                width: max-content;
                animation: careerMarquee ${Math.max(26, displayJobs.length * 6)}s linear infinite;
              }
              .animate-career-marquee:hover,
              .group:hover .animate-career-marquee {
                animation-play-state: paused;
              }
            `}</style>

            <div className="animate-career-marquee items-stretch gap-3.5 sm:gap-4 lg:gap-4.5 py-1">
              {/* First Set */}
              {displayJobs.map((job, i) => (
                <div
                  key={`orig-${job._id || job.slug || i}`}
                  className="w-[280px] sm:w-[305px] lg:w-[320px] shrink-0 flex flex-col self-stretch"
                >
                  <JobCard job={job} index={i} />
                </div>
              ))}
              {/* Duplicate Set for Seamless Continuous Infinite Loop */}
              {displayJobs.map((job, i) => (
                <div
                  key={`dup-${job._id || job.slug || i}`}
                  className="w-[280px] sm:w-[305px] lg:w-[320px] shrink-0 flex flex-col self-stretch"
                  aria-hidden="true"
                >
                  <JobCard job={job} index={i} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch gap-3.5 sm:gap-4 lg:gap-4.5">
            {displayJobs.map((job, i) => (
              <JobCard key={job._id || job.slug || i} job={job} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function WhyWork({
  whyWork,
  hasPosts = true,
  jobsCount,
}: {
  whyWork: CareerContent["whyWork"];
  hasPosts?: boolean;
  jobsCount?: number;
}) {
  // Background image ONLY appears when there are no job posts or 0 posts
  const hasBg = jobsCount !== undefined ? jobsCount === 0 : !hasPosts;

  const items = [
    {
      image: whyWorkLeaf,
      title: whyWork.items?.[0]?.title || "Purpose-Driven Work",
      text: whyWork.items?.[0]?.text || "Contribute to wellness spaces that enhance people's lives.",
    },
    {
      image: whyWorkTeam,
      title: whyWork.items?.[1]?.title || "Supportive Team Environment",
      text: whyWork.items?.[1]?.text || "Collaborate with talented and driven colleagues across design, manufacturing, sales and operations.",
    },
    {
      image: whyWorkGrowth,
      title: whyWork.items?.[2]?.title || "Learning & Growth",
      text: whyWork.items?.[2]?.text || "Enhance your skills with continuous learning and exposure to global markets.",
    },
    {
      image: whyWorkHeart,
      title: whyWork.items?.[3]?.title || "Better Spaces, Better Lives",
      text: whyWork.items?.[3]?.text || "Be part of a mission that improves how people live, work and heal.",
    },
  ];

  if (hasBg) {
    return (
      <section className="relative py-4 sm:py-4.5 md:py-5 overflow-hidden text-white bg-[#fdf9ed]">
        {/* Dark Forest Green Background with Gold Border Foliage - Only when 0 posts */}
        <Image
          src={whyWorkBg}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        <Container className="relative z-10">
          <div className="grid items-end gap-2.5 lg:grid-cols-[1fr_minmax(0,1.15fr)]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[18px] font-bold uppercase tracking-[0.16em] text-[#e0a92b]">
                  {whyWork.eyebrow || "WHY WORK AT ENSIS?"}
                </span>
                <span className="h-[2px] w-8 sm:w-10 bg-[#e0a92b]" />
              </div>
              <h2 style={serif} className="mt-1 text-3xl sm:text-4xl md:text-[38px] font-bold leading-[1.12] text-white">
                Why Work <span className="text-[#e0a92b]">with ENSIS</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm sm:text-[14.5px] md:text-[15px] leading-relaxed text-[#e2ded6]">
              {whyWork.description ||
                "We're not just creating interiors and equipment, we're crafting experiences that transform lives. Join a team that believes in purpose over profit and wellness over everything."}
            </p>
          </div>

          <ul className="mt-3.5 sm:mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {items.map((item, i) => (
              <li
                key={i}
                className={`flex flex-col items-center px-3.5 sm:px-4 text-center ${i > 0 ? "lg:border-l lg:border-[#e0a92b]/30" : ""
                  }`}
              >
                <div className="relative size-12 sm:size-14 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt=""
                    width={56}
                    height={56}
                    className="size-full object-contain drop-shadow-xs"
                  />
                </div>
                <h3 style={serif} className="mt-2.5 text-base sm:text-[18px] font-bold leading-snug text-white min-h-[42px] sm:min-h-[46px] flex items-center justify-center text-center">
                  {formatWhyWorkTitle(item.title)}
                </h3>
                <p className="mt-1.5 max-w-[16rem] text-[14px] leading-relaxed text-[#d1ccc4] text-center">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  // When posts exist, render on clean natural background with leaf borders matching mockup
  return (
    <section className="relative py-4 sm:py-4.5 md:py-5 overflow-hidden bg-[#faf5eb] border-y border-[#ebdcc7]/60">
      {/* Decorative Botanical Leaf Borders on left and right */}
      <SectionLeaves />

      <Container className="relative z-10">
        <div className="grid items-end gap-2.5 lg:grid-cols-[1fr_minmax(0,1.15fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-bold uppercase tracking-[0.16em] text-[#b47422]">
                WHY WORK WITH ENSIS
              </span>
              <span className="h-[1.5px] w-8 sm:w-10 bg-[#b47422]" />
            </div>
            <h2 style={serif} className="mt-1 text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.12] text-[#163a2b]">
              A Career with Purpose
            </h2>
          </div>
          <p className="max-w-xl text-[14px] leading-relaxed text-[#4a4338] font-normal">
            {whyWork.description ||
              "At ENSIS, you will be part of a passionate and collaborative environment where design, innovation and wellbeing come together to create spaces that make a real difference."}
          </p>
        </div>

        <ul className="mt-3.5 sm:mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {items.map((item, i) => (
            <li
              key={i}
              className={`flex flex-col items-center px-3.5 sm:px-4 text-center ${i > 0 ? "lg:border-l lg:border-[#dfceb5]" : ""
                }`}
            >
              <div className="relative size-12 sm:size-14 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt=""
                  width={56}
                  height={56}
                  className="size-full object-contain drop-shadow-xs"
                />
              </div>
              <h3 style={serif} className="mt-2.5 text-base sm:text-[17.5px] font-bold leading-snug text-[#163a2b] min-h-[42px] sm:min-h-[46px] flex items-center justify-center text-center">
                {formatWhyWorkTitle(item.title)}
              </h3>
              <p className="mt-1.5 max-w-[17rem] text-[14px] leading-relaxed text-[#554e42] text-center">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function LifeAtEnsis({ life }: { life: CareerContent["life"] }) {
  const photos = (life.images.length ? life.images.map((p, i) => ({ src: imageSrc(p.image, LIFE_FALLBACKS[i % LIFE_FALLBACKS.length]), alt: p.alt || "Life at Ensis" })) : LIFE_FALLBACKS.map((src) => ({ src, alt: "Life at Ensis" }))).slice(0, 4);
  return (
    <section className="relative pt-2.5 sm:pt-3 pb-1">
      <Container className="relative z-10">
        <div className="grid items-end gap-2 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>{life.eyebrow}</Eyebrow>
            <SerifHeading text={life.heading} className="mt-1 text-2xl sm:text-3xl md:text-[36px]" />
          </div>
          {life.description && <p className="max-w-lg text-[14px] leading-relaxed text-[#4b453b] font-medium">{life.description}</p>}
        </div>
        <div className="mt-2.5 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-5">
          {photos.map((photo, i) => (
            <div key={i} className="relative h-28 xs:h-32 sm:h-36 overflow-hidden rounded-xl md:h-36">
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
          {/* Mobile-only 5th photo to pair with the 5th tile so every row has exactly 2 images on mobile */}
          <div className="relative h-28 xs:h-32 sm:h-36 overflow-hidden rounded-xl md:hidden">
            <Image
              src={jobSales}
              alt="Life at Ensis"
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
          {/* 5th tile: spaces-fifth.png (Healing People Enriching Lives) */}
          <div className="relative h-28 xs:h-32 sm:h-36 overflow-hidden rounded-xl md:h-36">
            <Image
              src={space5}
              alt={life.tileText || "Healing People Enriching Lives"}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function TalentCta({ talent }: { talent: CareerContent["talent"] }) {
  return (
    <section className="relative overflow-hidden py-2 sm:py-2.5 md:py-3">
      <Container className="relative z-10 flex flex-col items-start gap-2.5 sm:gap-3 pl-8 sm:pl-12 md:pl-16 lg:pl-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md sm:max-w-lg md:max-w-[460px] lg:max-w-xl">
          <h2
            style={{ ...serif, fontWeight: 700 }}
            className="text-2xl sm:text-3xl md:text-[30px] lg:text-[32px] font-bold leading-[1.18] text-[#163a2b]"
          >
            {talent.heading || "Don't See the Right Role?"}
          </h2>
          <p className="mt-1 sm:mt-1.5 text-[14px] sm:text-[14.5px] leading-relaxed text-[#3e3830] font-medium max-w-md md:max-w-[440px] lg:max-w-xl">
            {talent.text ||
              "We are always open to connecting with passionate and talented professionals. Share your profile with us and we will get in touch when a suitable opportunity arises."}
          </p>
        </div>
        <div className="shrink-0 mt-1 lg:mt-0">
          <Link
            href="/career/jobs"
            className="inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-xl bg-[#c08a2e] hover:bg-[#a8742b] px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5"
          >
            <span>{talent.buttonText || "Share Your Profile"}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/** Google for Jobs structured data for every open role */
function jobPostingJsonLd(jobs: PublicJob[]) {
  if (!jobs.length) return null;
  return toJsonLd(
    jobs.map((job) => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: plain(job.description || job.shortDescription) || job.title,
      datePosted: job.createdAt,
      validThrough: job.applicationClosingDate,
      employmentType: jobType(job).toUpperCase().replace(/\s+/g, "_"),
      hiringOrganization: { "@type": "Organization", name: "ENSIS", sameAs: SITE_URL },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: jobLocation(job), addressCountry: "IN" } },
      url: `${SITE_URL}${jobHref(job)}`,
    })),
  );
}

export default async function CareerLanding() {
  const [content, { jobs }] = await Promise.all([getCareerContent(), listOpenJobs()]);
  const hasPosts = Boolean(jobs && jobs.length > 0);
  const jsonLd = jobPostingJsonLd(jobs);
  return (
    <div className="relative overflow-hidden bg-[#fbf6ec] bg-[radial-gradient(1200px_600px_at_15%_0%,#fffaf0_0%,transparent_60%)] text-[16px] [font-size:16px]">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <Hero banner={content.banner} />
      {hasPosts && <Openings content={content} jobs={jobs} />}
      <WhyWork whyWork={content.whyWork} jobsCount={jobs.length} hasPosts={hasPosts} />
      {/* One cream-and-leaves backdrop behind the gallery and the closing call to action */}
      <div className="relative overflow-hidden">
        <Image src={lifeBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
        <SectionLeaves />
        <LifeAtEnsis life={content.life} />
        <TalentCta talent={content.talent} />
      </div>
    </div>
  );
}
