"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { serif, Eyebrow } from "@/components/career-v2/ui";
import spaBannerImg from "@/assets/career/flow/spa-banner.webp";

export type FlowHeroProps = {
  breadcrumbs: { label: string; href?: string }[];
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
};

export function FlowHero({
  breadcrumbs,
  backHref = "/career",
  backLabel = "Back to Job Details",
  eyebrow,
  title,
  highlight,
  subtitle,
}: FlowHeroProps) {
  return (
    <div className="relative border-b border-[#eadfcd] bg-[#fbf6ec]/60 pt-4 pb-6 sm:pb-8">
      <Container className="!py-0">
        {/* Breadcrumbs Row */}
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-[#8d6a3a]">
          <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-[#163a2b]">
            <Home size={13} className="text-[#a8792c]" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="text-[#c9a86a]" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-[#163a2b]">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#163a2b]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Back Link */}
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8d6a3a] transition-colors hover:text-[#163a2b]"
          >
            <ArrowLeft size={13} />
            <span>{backLabel}</span>
          </Link>
        )}

        {/* Main Header Band (Text Left, Spa Banner Image Right) */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1
              style={serif}
              className="mt-1 text-3xl font-semibold tracking-tight text-[#163a2b] sm:text-4xl lg:text-[40px] lg:leading-[1.15]"
            >
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-[#a8792c]">{highlight}</span>
                </>
              )}
            </h1>
            {subtitle && (
              <p className="mt-2.5 text-sm text-[#5f5647] sm:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Spa Treatment Bed Hero Image with Tagline */}
          <div className="relative hidden shrink-0 overflow-hidden rounded-xl border border-[#eadfcd] shadow-[0_4px_16px_rgba(154,115,52,0.12)] lg:block lg:w-[420px] xl:w-[480px]">
            <div className="relative h-32 w-full xl:h-36">
              <Image
                src={spaBannerImg}
                alt="Ensis Wellness Space"
                fill
                priority
                sizes="(max-width: 1280px) 420px, 480px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
              <div className="absolute right-4 bottom-3 max-w-[200px] text-right">
                <p style={serif} className="text-sm font-semibold italic leading-tight text-white drop-shadow-md">
                  Wellness Spaces For A Healthier Tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
