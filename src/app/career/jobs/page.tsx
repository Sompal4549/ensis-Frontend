import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { JobCard } from "@/components/career-v2/CareerLanding";
import { CareerIcon, Eyebrow, SerifHeading, serif, serifFontClass } from "@/components/career-v2/ui";
import { CAREER_DEFAULTS, listOpenJobs } from "@/lib/careers";

import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateSeo("career");
}

/** "View all roles" — every open job in the same card style as the career page */
export default async function AllJobsPage() {
  const { jobs } = await listOpenJobs();
  return (
    <div className="bg-[#fbf6ec] pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10">
      <Container>
        <Link href="/career" className="inline-flex items-center gap-1.5 text-[14px] sm:text-base font-semibold text-[#163a2b] hover:text-[#a8792c]">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
        <div className="mt-3">
          <Eyebrow>Current Openings</Eyebrow>
          <SerifHeading as="h1" text="All Open" highlight="Roles" className="mt-1.5 text-[2.1rem] md:text-[2.6rem]" />
          <p className="mt-1 text-[14px] text-[#4b453b] font-normal">{jobs.length} open position{jobs.length === 1 ? "" : "s"}</p>
        </div>
        {jobs.length ? (
          <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#eadfcd] bg-[#fffdf8] px-6 py-10 text-center">
            <CareerIcon name="briefcase" size="lg" />
            <h2 style={serif} className={`${serifFontClass} mt-4 text-xl sm:text-2xl font-bold text-[#06372c]`}>{CAREER_DEFAULTS.emptyState.title}</h2>
            <p className="mt-2 max-w-lg text-[14px] text-[#4b453b] font-normal">{CAREER_DEFAULTS.emptyState.text}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
