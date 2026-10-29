"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  Award,
} from "lucide-react";
import StickyScrollSpy from "@/components/ui/StickyScrollSpy";
import { Container } from "@/components/ui/Container";
import MobileScrollSpy from "@/components/ui/MobileScrollSpy";
import termsBg from "@/assets/disclaimer_hero.webp";
import lotusIcon from "@/assets/lotus.png";
import { API_URL, getImageUrl } from "@/lib/api/api";

import { staticTermsSections } from "@/data/policy";

interface PolicySection {
  id: string;
  number: string;
  title: string;
  text: string;
  bullets?: string[];
  extra?: string;
  extra2?: string;
  link?: { href: string; label: string };
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TermsConditionsPage() {
  const [sections, setSections] = useState<PolicySection[]>(staticTermsSections);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>(staticTermsSections[0]?.id || "");
  const [bannerImg, setBannerImg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("25 October 2026");
  const [heroContent, setHeroContent] = useState<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  }>({});
  const [mobileMenu, setMobileMenu] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const sidebarCardRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      if (sidebarCardRef.current && window.innerWidth >= 1024) {
        setSidebarHeight(sidebarCardRef.current.offsetHeight);
      } else {
        setSidebarHeight(undefined);
      }
    };
    updateHeight();
    const ro = typeof ResizeObserver !== "undefined" && sidebarCardRef.current
      ? new ResizeObserver(updateHeight)
      : null;
    if (sidebarCardRef.current && ro) ro.observe(sidebarCardRef.current);
    window.addEventListener("resize", updateHeight);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const fetchTermsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/component-content/policy.terms`
        );
        if (response.ok) {
          const data = await response.json();
          const termsData = data.data;
          const hero = termsData?.data?.hero || termsData?.hero;
          const updatedDate = hero?.lastUpdated || termsData?.data?.lastUpdated;
          if (updatedDate) {
            setLastUpdated(updatedDate);
          } else if (termsData?.updatedAt) {
            const d = new Date(termsData.updatedAt);
            if (!isNaN(d.getTime())) {
              setLastUpdated(d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
            }
          }
          const img =
            hero?.bannerImage ||
            hero?.backgroundImage ||
            termsData?.data?.bannerImage ||
            termsData?.bannerImage;
          if (img) setBannerImg(img);
          if (hero) {
            setHeroContent({
              eyebrow: hero.eyebrow,
              title: hero.title,
              subtitle: hero.subtitle,
            });
          }
          if (termsData && termsData.data && termsData.data.sections) {
            setSections(termsData.data.sections);
            if (termsData.data.sections.length > 0) {
              setActiveSection(termsData.data.sections[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTermsData();
  }, []);

  const navItems = useMemo(
    () => sections.map((section) => ({ id: section.id, number: section.number, title: section.title })),
    [sections]
  );

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  return (
    <main className="min-h-screen bg-[#faf7f2] font-['DM_Sans',sans-serif] text-[#333333]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms & Conditions | ENSIS",
            description:
              "Review the terms and conditions governing your use of the ENSIS website, products, services and business interactions. Policy updated May 2025.",
            url: "https://ensis.in/terms-and-conditions",
            publisher: {
              "@type": "Organization",
              name: "ENSIS",
              url: "https://ensis.in",
            },
            dateModified: "2025-05-01",
          }),
        }}
      />
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative z-10 pt-4 overflow-visible">
        {/* HERO IMAGE */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={bannerImg && !bannerImg.includes("disclaimer_hero") ? getImageUrl(bannerImg) : termsBg}
            alt="ENSIS Terms and Conditions"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover"
            onError={() => setBannerImg(null)}
          />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto flex max-w-[1400px] items-center px-4 py-8  lg:px-10">
          <div className="max-w-[570px]">
            <div className="mb-2 flex items-center gap-3">
              <span className="h-px w-8 bg-[#a9742a]" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a9742a]">
                {heroContent.eyebrow || "LEGAL"}
              </p>
            </div>

            <h1 className="text-[clamp(2rem,3vw+0.75rem,2.875rem)] leading-normal text-[#1f261b]">
              {heroContent.title ? (
                heroContent.title
              ) : (
                <>
                  Terms & <span className="text-[#a9742a]">Conditions</span>
                </>
              )}
            </h1>

            <p className="max-w-[480px] text-base font-medium leading-normal text-[#666666]">
              {heroContent.subtitle ||
                "Please review the terms that govern your use of the ENSIS website, products, services and business interactions."}
            </p>
            {/* 
            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#666666]">
              <span className="text-[#a9742a]">●</span>
              <span>Last Updated: 20 May 2025</span>
            </div> */}
          </div>
        </div>

        {/* STATS STRIP */}
        {/* <div className="relative z-20 px-4 sm:px-10 lg:absolute lg:left-0 lg:right-0 lg:bottom-0 lg:translate-y-1/2 lg:px-10">
          <Container className="py-0">
            <div className="rounded-xl border border-[#C9972A] bg-[#0f2e22] px-4 py-3 ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent sm:px-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
                <StatItem icon={<Shield size={30} strokeWidth={1.5} />} number="100%" label="Legal Compliance" border />
                <StatItem icon={<Clock size={30} strokeWidth={1.5} />} number="24/7" label="Support Available" border />
                <StatItem icon={<Users size={30} strokeWidth={1.5} />} number="1000+" label="Clients Trust Us" border />
                <StatItem icon={<Award size={30} strokeWidth={1.5} />} number="20+" label="Years Experience" />
              </div>
            </div>
          </Container>
        </div> */}
      </section>

      {/* =====================================================
          MOBILE TOC
      ===================================================== */}

      <MobileScrollSpy
        items={navItems}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={mobileMenu}
        onToggle={() => setMobileMenu(!mobileMenu)}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative mx-auto max-w-[1400px] px-5 py-2 sm:px-10 overflow-visible">
        {/* <img
          src={onThisPageDecoration.src}
          alt=""
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 object-contain object-right max-h-[300px] w-auto"
        /> */}
        {/* ===================================================
            CONTENT GRID
        =================================================== */}

        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <StickyScrollSpy
            items={navItems}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            scrollContainerRef={contentContainerRef}
            sidebarCardRef={sidebarCardRef}
          />

          {/* =================================================
              POLICY CONTENT
          ================================================= */}

          <div
            style={sidebarHeight ? { height: `${sidebarHeight}px` } : undefined}
            className="relative min-w-0 rounded-xl border border-[#e5e7eb] bg-white shadow-xs px-2 sm:px-2.5 pt-3 pb-3.5 sm:pt-3.5 sm:pb-4 flex flex-col overflow-hidden"
          >
            <div
              ref={contentContainerRef}
              className="flex-1 min-h-0 lg:overflow-y-auto pr-1 sm:pr-2 scroll-smooth"
            >
              {/* LAST UPDATED (scrolls with content) */}
              <div className="flex justify-end pb-1 select-none">
                <p className="text-[12px] font-medium text-[#8a8a8a]">
                  Last Updated: {lastUpdated}
                </p>
              </div>

              <div className="space-y-1.5">
                {sections.map((section, index) => (
                  <React.Fragment key={section.id}>
                    <PolicySection
                      section={section}
                      isActive={activeSection === section.id}
                    />
                    {index < sections.length - 1 && <SectionDivider />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SECTION DIVIDER (GOLD LINE + LOTUS)
========================================================= */

function SectionDivider() {
  return (
    <div className="my-1.5 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-[#d9b877]" />
      <img
        src={lotusIcon.src}
        alt=""
        className="h-5 w-auto shrink-0 object-contain"
      />
      <span className="h-px flex-1 bg-[#d9b877]" />
    </div>
  );
}

/* =========================================================
   POLICY SECTION COMPONENT
========================================================= */

function PolicySection({
  section,
  isActive,
}: {
  section: PolicySection;
  isActive: boolean;
}) {
  return (
    <article
      id={section.id}
      className="scroll-mt-6 rounded-xl px-1.5 py-1 sm:px-2 sm:py-1 transition-all duration-300"
    >
      <h2 className="text-[20px] font-bold leading-tight text-[#063120] sm:text-[22px]">
        {(parseInt(section.number, 10) || section.number)}. {section.title}
      </h2>

      <p className="mt-1.5 max-w-[850px] text-[14px] font-medium leading-snug text-[#555555]">
        {section.text}
      </p>

      {section.extra && (
        <p className="mt-1.5 max-w-[850px] text-[14px] font-medium leading-snug text-[#555555]">
          {section.extra}
        </p>
      )}

      {section.extra2 && (
        <p className="mt-1.5 max-w-[850px] text-[14px] font-medium leading-snug text-[#555555]">
          {section.extra2}
        </p>
      )}

      {section.bullets && (
        <ul className="mt-1.5 space-y-1 pl-4">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="relative pl-1 text-[14px] font-medium leading-snug text-[#555555]"
            >
              <span className="absolute -left-3 top-[9px] h-1 w-1 rounded-full bg-[#333333]" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {section.link && (
        <a
          href={section.link.href}
          className="mt-2.5 inline-flex items-center gap-2 text-[14px] sm:text-[15px] font-semibold text-[#0f2518] underline underline-offset-4 transition-colors hover:text-[#a9742a]"
        >
          {section.link.label}
          <ArrowRight size={15} />
        </a>
      )}
    </article>
  );
}

/* =========================================================
   STAT ITEM
========================================================= */

function StatItem({
  icon,
  number,
  label,
  border,
}: {
  icon: React.ReactNode;
  number: string;
  label: string;
  border?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 py-1 ${border ? "md:border-r md:border-[#C9972A]/40 md:pr-6" : "md:pr-6"}`}>
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-[#a9742a]">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-sm font-semibold text-[#faf6ef] leading-tight md:text-base">
          {number}
        </span>
        <span className="text-xs font-medium text-[#faf6ef]/80 md:text-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
