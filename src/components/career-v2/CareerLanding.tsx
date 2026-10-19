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
import life1 from "@/assets/career/life1.webp";
import life2 from "@/assets/career/life2.webp";
import life4 from "@/assets/career/life4.png";
import teamWide from "@/assets/career/ChatGPT (6).webp";
import teamTable from "@/assets/career/ChatGPT Image Jun 21, 2026, 03_48_36 PM.png";
import jobDesigner from "@/assets/career/new/Designing a Modern Lounge Chair.webp";
import jobProduction from "@/assets/career/new/Focused Notes in a Modern Wellness Studio.webp";
import jobSales from "@/assets/career/new/Design Consultation in a Modern Showroom.webp";
import jobConsultant from "@/assets/career/new/Professional Browsing in a Warm Showroom.webp";
import iconMeaningful from "@/assets/career/meaning_full.png";
import iconTeam from "@/assets/career/first-step/Golden Group Icon in Circle.png";
import iconGrowth from "@/assets/career/first-step/Golden Growth Chart Icon.png";
import iconHeart from "@/assets/career/first-step/Golden Heart in a Circle.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";
import CareerStatsStrip from "@/components/career/StatsStrip";
import { CareerIcon, Eyebrow, SerifHeading, goldButton, goldOutlineButton, greenButton, serif, serifFontClass } from "./ui";

const HERO_FEATURES = [
  { image: iconMeaningful, label: "Meaningful\nWork" },
  { image: iconTeam, label: "Collaborative\nTeam" },
  { image: iconGrowth, label: "Growth\nOpportunities" },
  { image: iconHeart, label: "Real Impact\non Lives" },
];

function JobLocationIcon({ className = "size-3.5" }: { className?: string }) {
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

function JobBriefcaseIcon({ className = "size-3.5" }: { className?: string }) {
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
      <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden ${className}`}>
        <Image
          src={sectionLeft}
          alt=""
          aria-hidden
          fill
          sizes="7vw"
          className="object-cover object-right"
        />
      </div>
      <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden ${className}`}>
        <Image
          src={sectionRight}
          alt=""
          aria-hidden
          fill
          sizes="7vw"
          className="object-cover object-left"
        />
      </div>
    </>
  );
}

// Exact job cover fallbacks matching the 4 mockup cards
const JOB_FALLBACKS: StaticImageData[] = [jobDesigner, jobProduction, jobSales, jobConsultant];
const LIFE_FALLBACKS: StaticImageData[] = [teamTable, life1, life2, teamWide];

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
            className="text-[17px] sm:text-[18px] xl:text-[18.5px] font-bold leading-[1.22] text-[#163a2b] min-h-[44px] sm:min-h-[46px]"
          >
            {formatJobTitle(job.title)}
          </h3>
          <div className="mt-2 mb-2 flex items-center gap-2 text-[11.5px] sm:text-[12px] font-medium text-[#4a4338]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <JobLocationIcon className="size-3.5 shrink-0" /> {jobLocation(job)}
            </span>
            <span className="text-[#dacbb4]">|</span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <JobBriefcaseIcon className="size-3.5 shrink-0" /> {jobType(job)}
            </span>
          </div>
          <p className="text-[12px] sm:text-[12.5px] leading-[1.48] text-[#554e42] line-clamp-3 min-h-[54px]">
            {jobSummary(job)}
          </p>
        </div>
        <Link
          href={jobHref(job)}
          className="mt-3 w-full py-2 px-3 rounded-xl border border-[#ebdcc7] bg-[#fffdfa] hover:bg-[#c08a2e] text-[#9d7232] hover:text-white text-xs sm:text-[13px] font-semibold transition-all inline-flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>View Details</span>
          <ArrowRight size={13.5} />
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
            className="object-cover object-[72%_center] xl:object-center"
          />
        </div>

        <Container className="bg-transparent relative z-10">
          <div className="relative min-h-[460px] md:h-[500px] lg:h-[520px] xl:h-[540px] w-full flex items-center">
            <div className="max-w-[580px] pt-4 pb-4 sm:pt-6 sm:pb-6 pl-1 sm:pl-3 lg:pl-5">
              {/* 1. Eyebrow: CAREERS AT ENSIS — */}
              <div className="mb-1.5 sm:mb-2 flex items-center gap-2">
                <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#a9742a]">
                  CAREERS AT ENSIS
                </span>
                <span className="text-[#a9742a] font-bold text-sm select-none">—</span>
              </div>

              {/* 2. Headline: Design Spaces for a Healthier Tomorrow */}
              <h1
                style={serif}
                className={`${serifFontClass} text-[36px] sm:text-[42px] md:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[0.96] tracking-[-0.02em] text-[#163a2b]`}
              >
                Design Spaces<br />
                for a Healthier<br />
                <span className="text-[#cca038]">Tomorrow</span>
              </h1>

              {/* 3. Subtitle / Description - wraps in exact 3 lines */}
              <p className="mt-3 sm:mt-3.5 text-xs sm:text-[13px] md:text-[13.5px] text-[#423b32] leading-[1.48] max-w-[480px] font-medium">
                Be a part of a passionate team that designs and delivers<br />
                wellness furniture and solutions for spas, wellness centers<br />
                and healthcare spaces across the world.
              </p>

              {/* 4. Button: Explore Opportunities → */}
              <div className="mt-3.5 sm:mt-4">
                <Link
                  href={banner.ctaHref || "#openings"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0e3022] hover:bg-[#071b13] px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(14,48,34,0.3)] transition-all transform hover:-translate-y-0.5"
                >
                  <span>{banner.ctaText || "Explore Opportunities"}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* 5. Four Feature Emblems matching mockup with vertical dividers */}
              <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3.5 md:gap-4 lg:gap-5">
                {HERO_FEATURES.map((item, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="h-8 sm:h-9 w-px bg-[#dfceb5] shrink-0" aria-hidden />
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative size-10 sm:size-11 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.label}
                          width={42}
                          height={42}
                          className="object-contain"
                        />
                      </div>
                      <span className="mt-1 text-[10.5px] sm:text-[11px] font-semibold leading-[1.18] text-[#333d36] whitespace-pre-line">
                        {item.label}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
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
  const { openings, emptyState } = content;

  // Prioritize the 4 mockup jobs on the landing page
  const prioritySlugs = ["product-designer", "furniture-production-specialist", "sales-partnerships-executive", "wellness-space-consultant"];
  const displayJobs = MOCKUP_JOBS_ORDER.map((fallback, i) => {
    const match = jobs.find(
      (j) => j.slug === fallback.slug || j.title?.toLowerCase() === fallback.title.toLowerCase()
    );
    return match || ({ ...fallback, _id: `mock-${i}` } as PublicJob);
  });

  return (
    <section id="openings" className="relative scroll-mt-20 pt-4 sm:pt-5 lg:pt-6 pb-6 sm:pb-8 overflow-hidden">
      {/* Background with subtle warmth */}
      <Image src={exploreBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />

      {/* Decorative Botanical Leaf Borders */}
      <SectionLeaves />

      <Container className="relative z-10">
        <div className="grid items-end gap-3 lg:grid-cols-[1fr_auto] pb-2 sm:pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#a8742b]">
                {openings.eyebrow || "CURRENT OPENINGS"}
              </span>
              <div className="h-[1.5px] w-8 sm:w-10 bg-[#c9a86a]" />
            </div>
            <h2 style={serif} className="mt-1 text-2xl sm:text-3xl md:text-[32px] font-bold leading-[1.12] text-[#163a2b]">
              Explore <span className="text-[#c88f28]">Opportunities</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-6">
            <p className="max-w-md text-xs sm:text-[13px] leading-relaxed text-[#4a4338] font-medium">
              {openings.description || "Join our team and contribute to creating inspiring wellness spaces through innovative furniture, design and customer-focused solutions."}
            </p>
            <Link
              href="/career/jobs"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#163a2b] hover:text-[#c88f28] self-start sm:self-center transition-colors whitespace-nowrap"
            >
              <span>{openings.viewAllText || "View all roles"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-4">
          {displayJobs.map((job, i) => (
            <JobCard key={job._id || job.slug || i} job={job} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function WhyWork({ whyWork }: { whyWork: CareerContent["whyWork"] }) {
  const items = [
    {
      icon: Leaf,
      title: whyWork.items?.[0]?.title || "Purpose-Driven Work",
      text: whyWork.items?.[0]?.text || "Contribute to wellness spaces that enhance people's lives.",
    },
    {
      icon: Users,
      title: whyWork.items?.[1]?.title || "Supportive Team Environment",
      text: whyWork.items?.[1]?.text || "Collaborate with talented and driven colleagues across design, manufacturing, sales and operations.",
    },
    {
      icon: BarChart3,
      title: whyWork.items?.[2]?.title || "Learning & Growth",
      text: whyWork.items?.[2]?.text || "Enhance your skills with continuous learning and exposure to global markets.",
    },
    {
      icon: HeartHandshake,
      title: whyWork.items?.[3]?.title || "Better Spaces, Better Lives",
      text: whyWork.items?.[3]?.text || "Be part of a mission that improves how people live, work and heal.",
    },
  ];

  return (
    <section className="relative py-6 sm:py-8 overflow-hidden text-white">
      {/* Dark Forest Green Background with Gold Border Foliage */}
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
        <div className="grid items-end gap-2 lg:grid-cols-[1fr_minmax(0,1.15fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#e0a92b]">
                {whyWork.eyebrow || "WHY WORK AT ENSIS?"}
              </span>
              <span className="h-px w-8 sm:w-10 bg-[#e0a92b]" />
            </div>
            <h2 style={serif} className="mt-1 text-2xl sm:text-3xl md:text-[34px] font-bold leading-[1.12] text-white">
              Why Work <span className="text-[#e0a92b]">with ENSIS</span>
            </h2>
          </div>
          <p className="max-w-xl text-xs sm:text-[13.5px] leading-relaxed text-[#e2ded6]">
            {whyWork.description ||
              "We're not just creating interiors and equipment, we're crafting experiences that transform lives. Join a team that believes in purpose over profit and wellness over everything."}
          </p>
        </div>

        <ul className="mt-3 sm:mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className={`flex flex-col items-center px-3 sm:px-4 text-center ${
                  i > 0 ? "lg:border-l lg:border-[#e0a92b]/30" : ""
                }`}
              >
                <div className="grid size-12 sm:size-14 place-items-center rounded-full border border-[#e0a92b]/60 bg-[#0a2318]/70 text-[#e0a92b] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h3 style={serif} className="mt-2.5 text-base sm:text-[17px] font-semibold leading-snug text-white">
                  {item.title}
                </h3>
                <p className="mt-1 max-w-[16rem] text-xs sm:text-[13px] leading-relaxed text-[#d1ccc4]">
                  {item.text}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function LifeAtEnsis({ life }: { life: CareerContent["life"] }) {
  const photos = (life.images.length ? life.images.map((p, i) => ({ src: imageSrc(p.image, LIFE_FALLBACKS[i % LIFE_FALLBACKS.length]), alt: p.alt || "Life at Ensis" })) : LIFE_FALLBACKS.map((src) => ({ src, alt: "Life at Ensis" }))).slice(0, 4);
  return (
    <section className="relative pt-3 sm:pt-4 pb-1">
      <Container className="relative z-10">
        <div className="grid items-end gap-2 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>{life.eyebrow}</Eyebrow>
            <SerifHeading text={life.heading} className="mt-1 text-[1.85rem] md:text-[2.25rem]" />
          </div>
          {life.description && <p className="max-w-lg text-xs sm:text-[13.5px] leading-relaxed text-[#4b453b]">{life.description}</p>}
        </div>
        <div className="mt-2.5 sm:mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
          {photos.map((photo, i) => (
            <div key={i} className={`relative h-32 sm:h-36 overflow-hidden rounded-lg md:h-36 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
          <div className="relative col-span-2 flex h-32 sm:h-36 items-center justify-end overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f6ead2_0%,#e9d3a8_100%)] p-3 md:col-span-1 md:h-36">
            <Image src={life4} alt="" aria-hidden fill sizes="20vw" className="object-cover opacity-25" />
            <p style={serif} className="relative text-right text-xl leading-tight text-[#3a2c14]">
              {life.tileText.split(" ").map((word, i, words) => (
                <span key={i}>{word}{i % 2 === 1 && i < words.length - 1 ? <br /> : " "}</span>
              ))}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TalentCta({ talent }: { talent: CareerContent["talent"] }) {
  return (
    <section className="relative overflow-hidden py-4 sm:py-6 md:py-8">
      <Container className="relative z-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2
            style={serif}
            className="text-2xl sm:text-[26px] md:text-[28px] font-bold leading-[1.18] text-[#163a2b]"
          >
            {talent.heading || "Don't See the Right Role?"}
          </h2>
          <p className="mt-1.5 text-[13px] sm:text-[13.5px] md:text-[14px] leading-[1.55] text-[#3e3830] font-medium max-w-xl">
            {talent.text ||
              "We are always open to connecting with passionate and talented professionals. Share your profile with us and we will get in touch when a suitable opportunity arises."}
          </p>
        </div>
        <Link
          href="/career/jobs"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#c08a2e] hover:bg-[#a8742b] px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-[13px] font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5"
        >
          <span>{talent.buttonText || "Share Your Profile"}</span>
          <ArrowRight size={15} />
        </Link>
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
  const jsonLd = jobPostingJsonLd(jobs);
  return (
    <div className="relative overflow-hidden bg-[#fbf6ec] bg-[radial-gradient(1200px_600px_at_15%_0%,#fffaf0_0%,transparent_60%)]">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <Hero banner={content.banner} />
      <Openings content={content} jobs={jobs} />
      <WhyWork whyWork={content.whyWork} />
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
