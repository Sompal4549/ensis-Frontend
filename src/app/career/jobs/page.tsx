import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { JobCard } from "@/components/career-v2/CareerLanding";
import { CareerIcon, Eyebrow, SerifHeading } from "@/components/career-v2/ui";
import { CAREER_DEFAULTS, listOpenJobs } from "@/lib/careers";

export const metadata: Metadata = {
  title: "All Open Roles | Careers at ENSIS",
  description: "Every open position at ENSIS — wellness furniture design, production, sales and consultancy.",
};

/** "View all roles" — every open job in the same card style as the career page */
export default async function AllJobsPage() {
  const { jobs } = await listOpenJobs();
  return (
    <div className="bg-[#fbf6ec] py-10">
      <Container>
        <Link href="/career" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#163a2b] hover:text-[#a8792c]">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
        <div className="mt-5">
          <Eyebrow>Current Openings</Eyebrow>
          <SerifHeading as="h1" text="All Open" highlight="Roles" className="mt-3 text-[2rem] md:text-[2.6rem]" />
          <p className="mt-3 text-[15px] text-[#4b453b]">{jobs.length} open position{jobs.length === 1 ? "" : "s"}</p>
        </div>
        {jobs.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-[#eadfcd] bg-[#fffdf8] px-6 py-12 text-center">
            <CareerIcon name="briefcase" size="lg" />
            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#163a2b]">{CAREER_DEFAULTS.emptyState.title}</h2>
            <p className="mt-3 max-w-lg text-[15px] text-[#4b453b]">{CAREER_DEFAULTS.emptyState.text}</p>
          </div>
        )}
      </Container>
    </div>
  );
}
