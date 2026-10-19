import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Quote } from "lucide-react";
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
import heroBanner from "@/assets/career/first-step/banner.webp";
import exploreBg from "@/assets/career/first-step/explore-bg.webp";
import lifeBg from "@/assets/career/first-step/life-bg.webp";
import life1 from "@/assets/career/life1.webp";
import life2 from "@/assets/career/life2.webp";
import life4 from "@/assets/career/life4.png";
import teamWide from "@/assets/career/ChatGPT (6).webp";
import teamTable from "@/assets/career/ChatGPT Image Jun 21, 2026, 03_48_36 PM.png";
import { CareerIcon, Eyebrow, SerifHeading, goldButton, goldOutlineButton, greenButton, serif } from "./ui";

// Placeholders until real photos are uploaded (job cover images come from the admin per job)
const JOB_FALLBACKS: StaticImageData[] = [life2, life1, teamTable, life4];
const LIFE_FALLBACKS: StaticImageData[] = [teamTable, life1, life2, teamWide];

const imageSrc = (value: string | undefined, fallback: StaticImageData) => (value ? getImageUrl(value) : fallback);

export function JobCard({ job, index }: { job: PublicJob; index: number }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#eadfcd] bg-[#fffdf8] shadow-[0_8px_24px_rgba(60,45,20,0.06)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(60,45,20,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#efe6d6]">
        <Image
          src={imageSrc(job.coverImage, JOB_FALLBACKS[index % JOB_FALLBACKS.length])}
          alt={job.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 style={serif} className="text-xl font-semibold leading-snug text-[#163a2b]">{job.title}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#4b453b]">
          <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-[#c08a2e]" /> {jobLocation(job)}</span>
          <span className="inline-flex items-center gap-1.5"><Briefcase size={15} className="text-[#c08a2e]" /> {jobType(job)}</span>
        </div>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#4b453b]">{jobSummary(job)}</p>
        <Link href={jobHref(job)} className={`${goldOutlineButton} mt-5 w-full`}>
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function Hero({ banner }: { banner: CareerContent["banner"] }) {
  const background = imageSrc(banner.backgroundImage, heroBanner);
  return (
    // ≥1400px: the section has the banner's exact aspect ratio (no cropping) and the text sits in
    // the banner's cream left third (5vw–36vw), so it never covers the people at any screen width.
    <section className="relative overflow-hidden min-[1400px]:aspect-[2000/737]">
      <Image src={background} alt="" aria-hidden fill priority sizes="100vw" className="hidden object-cover min-[1400px]:block" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 md:px-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 min-[1400px]:absolute min-[1400px]:inset-y-0 min-[1400px]:left-[5vw] min-[1400px]:flex min-[1400px]:w-[31vw] min-[1400px]:max-w-none min-[1400px]:flex-col min-[1400px]:justify-center min-[1400px]:px-0 min-[1400px]:py-0">
        <div>
        <Eyebrow>{banner.eyebrow}</Eyebrow>
        <h1 style={serif} className="mt-4 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.01em] text-[#163a2b] md:text-[3.2rem] min-[1400px]:mt-3 min-[1400px]:text-[2.9vw]">
          {banner.headingLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
          <span className="block text-[#a8792c]">{banner.highlight}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#3f3a33] min-[1400px]:mt-4 min-[1400px]:line-clamp-3 min-[1400px]:text-[clamp(15px,1.08vw,18px)]">{banner.description}</p>
        <Link href={banner.ctaHref || "#openings"} className={`${greenButton} mt-7 self-start min-[1400px]:mt-5`}>
          {banner.ctaText} <ArrowRight size={18} />
        </Link>
        <ul className="mt-9 grid max-w-xl grid-cols-2 gap-y-6 sm:grid-cols-4 min-[1400px]:mt-6">
          {banner.highlights.slice(0, 4).map((item, i) => (
            <li key={item.label} className={`flex flex-col items-center gap-2 px-2 text-center ${i > 0 ? "sm:border-l sm:border-[#e3d6bf]" : ""}`}>
              <CareerIcon name={item.icon} />
              <span className="text-sm font-medium leading-snug text-[#3f3a33] min-[1400px]:text-[clamp(12px,0.9vw,15px)]">{item.label}</span>
            </li>
          ))}
        </ul>
        </div>
        {/* Below 1400px: the team half of the banner, under the text on phones and beside it from 1024px */}
        <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[2/1] lg:mt-0 lg:aspect-[5/4] min-[1400px]:hidden">
          <Image src={background} alt="The Ensis team at work" fill sizes="100vw" className="object-cover object-[85%_center]" />
        </div>
      </div>
    </section>
  );
}

function Openings({ content, jobs }: { content: CareerContent; jobs: PublicJob[] }) {
  const { openings, emptyState } = content;
  const shown = jobs.slice(0, 4);
  return (
    <section id="openings" className="relative scroll-mt-28 py-12">
      <Image src={exploreBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
      <Container className="relative z-10">
        <div className="grid items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>{openings.eyebrow}</Eyebrow>
            <SerifHeading text={openings.heading} highlight={openings.highlight} className="mt-3 text-[2rem] md:text-[2.6rem]" />
          </div>
          {jobs.length ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-[15px] leading-relaxed text-[#4b453b]">{openings.description}</p>
              {jobs.length > 4 && (
                <Link href="/career/jobs" className="inline-flex shrink-0 items-center gap-1.5 text-[15px] font-semibold text-[#163a2b] hover:text-[#a8792c]">
                  {openings.viewAllText} <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <p style={serif} className="flex max-w-md gap-3 text-xl leading-snug text-[#163a2b]">
              <Quote size={34} className="shrink-0 -scale-x-100 fill-[#c9a86a] text-[#c9a86a]" />
              {emptyState.quote}
            </p>
          )}
        </div>

        {jobs.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {shown.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-[#eadfcd] bg-[#fffdf8] px-6 py-12 text-center shadow-[0_8px_24px_rgba(60,45,20,0.05)]">
            <CareerIcon name="briefcase" size="lg" />
            <h3 style={serif} className="mt-5 text-2xl font-semibold text-[#163a2b]">{emptyState.title}</h3>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#4b453b]">{emptyState.text}</p>
          </div>
        )}
      </Container>
    </section>
  );
}

function WhyWork({ whyWork }: { whyWork: CareerContent["whyWork"] }) {
  return (
    <section className="relative py-10">
      <Container className="relative z-10">
        <div className="grid items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>{whyWork.eyebrow}</Eyebrow>
            <SerifHeading text={whyWork.heading} className="mt-3 text-[2rem] md:text-[2.6rem]" />
          </div>
          <p className="max-w-lg text-[15px] leading-relaxed text-[#4b453b]">{whyWork.description}</p>
        </div>
        <ul className="mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {whyWork.items.slice(0, 4).map((item, i) => (
            <li key={item.title} className={`flex flex-col items-center px-6 text-center ${i > 0 ? "lg:border-l lg:border-[#e3d6bf]" : ""}`}>
              <CareerIcon name={item.icon} size="lg" />
              <h3 style={serif} className="mt-4 text-xl font-semibold leading-snug text-[#163a2b]">{item.title}</h3>
              <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-[#4b453b]">{item.text}</p>
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
    <section className="relative py-10">
      <Container className="relative z-10">
        <div className="grid items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
          <div>
            <Eyebrow>{life.eyebrow}</Eyebrow>
            <SerifHeading text={life.heading} className="mt-3 text-[2rem] md:text-[2.6rem]" />
          </div>
          {life.description && <p className="max-w-lg text-[15px] leading-relaxed text-[#4b453b]">{life.description}</p>}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {photos.map((photo, i) => (
            <div key={i} className={`relative h-40 overflow-hidden rounded-xl md:h-44 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
          <div className="relative col-span-2 flex h-40 items-center justify-end overflow-hidden rounded-xl bg-[linear-gradient(135deg,#f6ead2_0%,#e9d3a8_100%)] p-5 md:col-span-1 md:h-44">
            <Image src={life4} alt="" aria-hidden fill sizes="20vw" className="object-cover opacity-25" />
            <p style={serif} className="relative text-right text-2xl leading-tight text-[#3a2c14]">
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
    <section className="relative overflow-hidden pb-14 pt-6">
      <Container className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <SerifHeading text={talent.heading} className="text-[1.8rem] md:text-[2.2rem]" />
          <p className="mt-3 text-[15px] leading-relaxed text-[#4b453b]">{talent.text}</p>
        </div>
        <Link href="/career/general" className={goldButton}>
          {talent.buttonText} <ArrowRight size={18} />
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
      <div className="relative">
        <Image src={lifeBg} alt="" aria-hidden fill sizes="100vw" className="object-cover" />
        <LifeAtEnsis life={content.life} />
        <TalentCta talent={content.talent} />
      </div>
    </div>
  );
}
