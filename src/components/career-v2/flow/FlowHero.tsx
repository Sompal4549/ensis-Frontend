"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { serif, serifFontClass, Eyebrow } from "@/components/career-v2/ui";
import spaBannerImg from "@/assets/career/flow/spa-banner.webp";

export type FlowHeroProps = {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
};

export function FlowHero({
  backHref = "/career",
  backLabel = "Back to Job Details",
  eyebrow,
  title,
  highlight,
  subtitle,
}: FlowHeroProps) {
  return (
    <div className="relative border-b border-[#eadfcd] bg-[#fbf6ec]/60 pt-5 sm:pt-6 md:pt-7 pb-4 sm:pb-5">
      <Container className="!py-0">
        {/* Back Link */}
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8d6a3a] transition-colors hover:text-[#163a2b]"
          >
            <ArrowLeft size={14} />
            <span>{backLabel}</span>
          </Link>
        )}

        {/* Main Header Band (Text Left, Spa Banner Image Right) */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1
              style={{ ...serif, fontWeight: 800 }}
              className={`${serifFontClass} mt-0.5 text-[28px] font-extrabold tracking-tight text-[#163a2b] sm:text-[34px] lg:text-[40px] lg:leading-[1.18]`}
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
              <p className="mt-1.5 text-[14px] text-[#5f5647] leading-relaxed font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {/* Spa Treatment Bed Hero Image with Tagline */}
          <div className="relative hidden shrink-0 overflow-hidden rounded-xl border border-[#eadfcd] shadow-[0_4px_16px_rgba(154,115,52,0.12)] lg:block lg:w-[380px] xl:w-[420px]">
            <div className="relative h-24 w-full xl:h-28">
              <Image
                src={spaBannerImg}
                alt="Ensis Wellness Space"
                fill
                priority
                sizes="(max-width: 1280px) 380px, 420px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30" />
              <div className="absolute right-3.5 bottom-2.5 max-w-[210px] text-right">
                <p style={serif} className={`${serifFontClass} text-[14px] font-semibold italic leading-tight text-white drop-shadow-md`}>
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
