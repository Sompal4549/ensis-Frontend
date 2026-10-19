import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJob, type PublicJob } from "@/lib/careerApi";
import { JobDetailClient } from "./JobDetailClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return {
      title: "Job Not Found | Ensis Careers",
      description: "The requested career opening could not be found.",
    };
  }

  const title = `${job.title} | Careers at Ensis`;
  const description =
    job.shortDescription ||
    job.description?.slice(0, 160) ||
    `Apply for the ${job.title} position at Ensis Wellness.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: job.coverImage ? [{ url: job.coverImage }] : undefined,
    },
  };
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
      name: "Ensis Wellness",
      sameAs: "https://ensiswellness.com",
      logo: "https://ensiswellness.com/logo.png",
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
