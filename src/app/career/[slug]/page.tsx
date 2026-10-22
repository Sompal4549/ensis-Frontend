import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJob, type PublicJob } from "@/lib/careerApi";
import { JobDetailClient } from "./JobDetailClient";

import { generateSeo } from "@/lib/api/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generateSeo("career");
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  // JSON-LD Structured Data for JobPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.shortDescription || job.title,
    datePosted: job.createdAt || new Date().toISOString(),
    validThrough: job.applicationClosingDate || undefined,
    employmentType: job.employmentType ? job.employmentType.toUpperCase().replace(/\s+/g, "_") : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "ENSIS",
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Delhi NCR",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailClient job={job} slug={slug} />
    </>
  );
}
