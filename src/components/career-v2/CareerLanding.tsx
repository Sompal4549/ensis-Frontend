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
      <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-[60px] sm:w-[85px] md:w-[110px] lg:w-[135px] select-none z-10 overflow-hidden opacity-40 ${className}`}>
        <Image
          src={sectionLeft}
          alt=""
          aria-hidden
          fill
          sizes="12vw"
          className="object-cover object-left"
        />
      </div>
      <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-[60px] sm:w-[85px] md:w-[110px] lg:w-[135px] select-none z-10 overflow-hidden opacity-40 ${className}`}>
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

const imageSrc = (value: string | undefined, fallback: StaticImageData) => (value ? getImageUrl(value) : fallback);

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
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] shadow-[0_4px_16px_rgba(70,50,20,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(70,50,20,0.08)]">
      {/* Edge-to-edge cover image with NO side gappings */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efe6d6]">
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
        <div>
          <h3
            style={serif}
            className="text-[18px] sm:text-[19px] xl:text-[20px] font-bold leading-[1.22] text-[#163a2b] min-h-[44px]"
          >
            {formatJobTitle(job.title)}
          </h3>
          <div className="mt-2 mb-2 flex items-center gap-2 text-[12.5px] sm:text-[13.5px] font-medium text-[#4a4338]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <JobLocationIcon className="size-4 shrink-0" /> {jobLocation(job)}
            </span>
            <span className="text-[#dacbb4]">|</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <JobBriefcaseIcon className="size-4 shrink-0" /> {jobType(job)}
            </span>
          </div>
          <p className="text-[13px] sm:text-[14px] leading-[1.45] text-[#554e42] line-clamp-3 min-h-[56px]">
            {jobSummary(job)}
          </p>
        </div>
        <Link
          href={jobHref(job)}
          className="mt-3 w-full py-1.5 sm:py-2 px-3.5 rounded-lg border-[1.5px] border-[#c89228] bg-transparent hover:bg-[#c89228] text-[#8a570c] hover:text-white text-xs sm:text-[13px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

function Hero({ banner }: { banner: CareerContent["banner"] }) {
  const background = imageSrc(banner.backgroundImage, heroBanner);

  // Exact fallback description matching mockup
  const description =
    banner.description && !banner.description.includes("ancient wisdom")
      ? banner.description
      : "Be a part of a passionate team that designs and delivers wellness furniture and solutions for spas, wellness centers and healthcare spaces across the world.";

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
        </div>

        <Container className="bg-transparent relative z-10">
          <div className="relative min-h-[440px] md:h-[480px] lg:h-[490px] xl:h-[500px] w-full flex items-center">
            <div className="max-w-[620px] pt-3 pb-3 sm:pt-4 sm:pb-4 pl-1 sm:pl-3 lg:pl-5">
              {/* 1. Eyebrow: CAREERS AT ENSIS — */}
              <div className="mb-0.5 sm:mb-1 flex items-center gap-2">
                <span className="text-[15px] sm:text-[16px] md:text-[17px] font-bold uppercase tracking-[0.16em] text-[#a9742a]">
                  CAREERS AT ENSIS
                </span>
                <span className="text-[#a9742a] font-bold text-base select-none">—</span>
              </div>

              {/* 2. Headline: Design Spaces for a Healthier Tomorrow - Tight Line-Height & Small Gap */}
              <h1
                style={{ ...serif, fontWeight: 800 }}
                className={`${serifFontClass} text-[40px] sm:text-[46px] md:text-[52px] lg:text-[58px] xl:text-[62px] font-extrabold tracking-[-0.03em] text-[#163a2b] mt-0`}
              >
                Design Spaces<br />
                for a Healthier<br />
                <span className="text-[#dc881a]">Tomorrow</span>
              </h1>

              {/* 3. Subtitle / Description */}
              <p className="mt-3 sm:mt-3.5 text-[15px] sm:text-[16px] md:text-[16.5px] text-[#332f28] leading-[1.5] max-w-[560px] font-medium">
                Be a part of a passionate team that designs and delivers<br />
                wellness furniture and solutions for spas, wellness centers<br />
                and healthcare spaces across the world.
              </p>

              {/* 4. Button: Explore Opportunities → */}
              <div className="mt-3.5 sm:mt-4">
                <Link
                  href={banner.ctaHref || "#openings"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0e3022] hover:bg-[#071b13] px-6 sm:px-7 py-2.5 sm:py-3 text-[14px] sm:text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(14,48,34,0.3)] transition-all transform hover:-translate-y-0.5"
                >
                  <span>{banner.ctaText || "Explore Opportunities"}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* 5. Four Feature Emblems matching career detail page sizes and styling */}
              <ul className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-7 sm:gap-x-10 lg:gap-x-12 gap-y-2.5">
                {HERO_FEATURES.map((item, i) => (
                  <li key={i} className="flex flex-col items-center gap-1.5 text-center">
                    <div className="relative size-[48px] sm:size-[54px] flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt=""
                        width={54}
                        height={54}
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

  // Prioritize the 4 mockup jobs on the landing page
  const displayJobs = MOCKUP_JOBS_ORDER.map((fallback, i) => {
    const match = jobs.find(
      (j) => j.slug === fallback.slug || j.title?.toLowerCase() === fallback.title.toLowerCase()
    );
    return match || ({ ...fallback, _id: `mock-${i}` } as PublicJob);
  });

  return (
    <section id="openings" className="relative scroll-mt-20 pt-3 sm:pt-3.5 lg:pt-4 pb-3 sm:pb-3.5 overflow-hidden">
      {/* Background with subtle warmth */}
      <Image src={exploreBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />

      {/* Decorative Botanical Leaf Borders */}
      <SectionLeaves />

      <Container className="relative z-10">
        <div className="grid items-end gap-2.5 lg:grid-cols-[1fr_auto] pb-1.5 sm:pb-2">
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 lg:gap-5">
            <p className="max-w-md text-sm sm:text-[14.5px] leading-relaxed text-[#4a4338] font-medium">
              {openings.description || "Join our team and contribute to creating inspiring wellness spaces through innovative furniture, design and customer-focused solutions."}
            </p>
            <Link
              href="/career/jobs"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm sm:text-[14.5px] font-bold text-[#163a2b] hover:text-[#c88f28] self-start sm:self-center transition-colors whitespace-nowrap"
            >
              <span>{openings.viewAllText || "View all roles"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
          {displayJobs.map((job, i) => (
            <JobCard key={job._id || job.slug || i} job={job} index={i} />
          ))}
        </div>
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
                <p className="mt-1.5 max-w-[16rem] text-[13px] sm:text-[14px] leading-relaxed text-[#d1ccc4] text-center">
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
              <span className="text-xs sm:text-[13px] md:text-sm font-bold uppercase tracking-[0.16em] text-[#b47422]">
                WHY WORK WITH ENSIS
              </span>
              <span className="h-[1.5px] w-8 sm:w-10 bg-[#b47422]" />
            </div>
            <h2 style={serif} className="mt-1 text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.12] text-[#163a2b]">
              A Career with Purpose
            </h2>
          </div>
          <p className="max-w-xl text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed text-[#4a4338] font-normal">
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
              <p className="mt-1.5 max-w-[16rem] text-[13px] sm:text-[13.5px] leading-relaxed text-[#554e42] text-center">
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
          {life.description && <p className="max-w-lg text-[13px] sm:text-[14px] leading-relaxed text-[#4b453b] font-medium">{life.description}</p>}
        </div>
        <div className="mt-2.5 sm:mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-5">
          {photos.map((photo, i) => (
            <div key={i} className={`relative h-32 sm:h-36 overflow-hidden rounded-xl md:h-36 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
          {/* 5th tile: spaces-fifth.png (Healing People Enriching Lives) */}
          <div className="relative col-span-2 h-32 sm:h-36 overflow-hidden rounded-xl md:col-span-1 md:h-36">
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
      <Container className="relative z-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl pl-2 sm:pl-4 md:pl-8 lg:pl-12">
          <h2
            style={{ ...serif, fontWeight: 700 }}
            className="text-2xl sm:text-3xl md:text-[30px] font-bold leading-[1.18] text-[#163a2b]"
          >
            {talent.heading || "Don't See the Right Role?"}
          </h2>
          <p className="mt-1 text-[13px] sm:text-[14px] leading-relaxed text-[#3e3830] font-medium max-w-xl">
            {talent.text ||
              "We are always open to connecting with passionate and talented professionals. Share your profile with us and we will get in touch when a suitable opportunity arises."}
          </p>
        </div>
        <div className="pr-2 sm:pr-4 md:pr-8 lg:pr-12">
          <Link
            href="/career/jobs"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#c08a2e] hover:bg-[#a8742b] px-5 sm:px-6 py-2.5 sm:py-3 text-[13.5px] sm:text-[14px] font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5"
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
