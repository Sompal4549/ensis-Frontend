"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Check,
  FileText,
  List,
  Monitor,
  MessageSquare,
  User,
} from "lucide-react";
import StickyScrollSpy from "@/components/ui/StickyScrollSpy";
import MobileScrollSpy from "@/components/ui/MobileScrollSpy";
import heroBg from "@/assets/privacy_and_enquiry.png";
import lotusIcon from "@/assets/lotus.png";
import onThisPageDecoration from "@/assets/privacy-terms/on_this_page_decoration.png";
import { staticPrivacySections, type PrivacySection } from "@/data/policy";
import { API_URL, getImageUrl } from "@/lib/api/api";

const cardIcons: Record<string, React.ReactNode> = {
  user: <User size={24} strokeWidth={1.5} />,
  list: <List size={24} strokeWidth={1.5} />,
  monitor: <Monitor size={24} strokeWidth={1.5} />,
  message: <MessageSquare size={24} strokeWidth={1.5} />,
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function PrivacyPolicyPage() {
  const [sections, setSections] = useState<PrivacySection[]>(staticPrivacySections);
  const [activeSection, setActiveSection] = useState<string>(staticPrivacySections[0]?.id || "");
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
    const fetchPolicyData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/component-content/policy.privacy`
        );
        if (response.ok) {
          const data = await response.json();
          const policyData = data.data;
          const hero = policyData?.data?.hero || policyData?.hero;
          const updatedDate =
            hero?.lastUpdated ||
            policyData?.data?.lastUpdated;
          if (updatedDate) {
            setLastUpdated(updatedDate);
          } else if (policyData?.updatedAt) {
            const d = new Date(policyData.updatedAt);
            if (!isNaN(d.getTime())) {
              setLastUpdated(d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
            }
          }
          const img =
            hero?.bannerImage ||
            hero?.backgroundImage ||
            policyData?.data?.bannerImage ||
            policyData?.bannerImage;
          if (img) setBannerImg(img);
          if (hero) {
            setHeroContent({
              eyebrow: hero.eyebrow,
              title: hero.title,
              subtitle: hero.subtitle,
            });
          }
          const cmsSections = policyData?.data?.sections;
          if (Array.isArray(cmsSections) && cmsSections[0]?.id === "introduction") {
            setSections(cmsSections);
            setActiveSection(cmsSections[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };
    fetchPolicyData();
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
            name: "Privacy Policy | ENSIS",
            description:
              "Your privacy is important to us. This policy explains how ENSIS collects, uses, protects and respects your information.",
            url: "https://ensis.in/privacy-policy",
            publisher: {
              "@type": "Organization",
              name: "ENSIS",
              url: "https://ensis.in",
            },
            dateModified: "2026-10-25",
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
            src={bannerImg && !bannerImg.includes("privacy_and_enquiry") ? getImageUrl(bannerImg) : heroBg}
            alt="ENSIS Privacy Policy"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover object-right sm:object-center"
            onError={() => setBannerImg(null)}
          />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto flex max-w-[1400px] items-center px-4 py-8  lg:px-10">
          <div className="flex w-full items-center justify-between gap-6">
            <div className="max-w-[570px]">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-8 bg-[#a9742a]" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a9742a]">
                  {heroContent.eyebrow || "LEGAL"}
                </p>
              </div>

              <h1 className=" text-[clamp(2rem,3vw+0.75rem,2.875rem)] leading-normal text-[#1f261b]">
                {heroContent.title ? (
                  heroContent.title
                ) : (
                  <>
                    Privacy <span className="text-[#a9742a]">Policy</span>
                  </>
                )}
              </h1>

              <p className="max-w-[480px] text-base font-medium leading-normal text-[#666666]">
                {heroContent.subtitle ||
                  "Your privacy is important to us. This policy explains how we collect, use, protect and respect your information."}
              </p>
            </div>

            {/* BREADCRUMB */}
            {/* <nav
              aria-label="Breadcrumb"
              className="hidden shrink-0 items-center gap-2 text-sm font-medium text-[#ffffff] lg:flex"
            >
              <Link href="/" className="transition-colors hover:text-[#a9742a]">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#a9742a]" />
              <span className="font-semibold text-[#a9742a]">Privacy Policy</span>
            </nav> */}
          </div>
        </div>
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

      <section className="relative mx-auto max-w-[1400px] px-5 py-2 sm:px-10">
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
            className="relative min-w-0 rounded-xl border border-[#e5e7eb] bg-white shadow-xs pl-3 sm:pl-4 pr-0 pt-3 pb-3.5 sm:pt-3.5 sm:pb-4 flex flex-col overflow-hidden"
          >
            <div
              ref={contentContainerRef}
              className="flex-1 min-h-0 lg:overflow-y-auto pr-2 sm:pr-3 scroll-smooth"
            >
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

              {/* LAST UPDATED (at the end of content) */}
              <div className="flex justify-end pt-3 pb-1 select-none">
                <p className="text-[12px] font-medium text-[#8a8a8a]">
                  Last Updated: {lastUpdated}
                </p>
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
    <div className="my-2.5 flex items-center gap-3" aria-hidden>
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
  section: PrivacySection;
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

      <p className="mt-1.5 max-w-[850px] text-[14px] font-medium leading-snug text-[#666666]">
        {section.text}
      </p>

      {section.extra && (
        <p className="mt-1.5 max-w-[850px] text-[14px] font-medium leading-snug text-[#666666]">
          {section.extra}
        </p>
      )}

      {section.bullets && (
        <ul className="mt-1.5 space-y-1 pl-4">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="relative pl-1 text-[14px] font-medium leading-snug text-[#666666]"
            >
              <span className="absolute -left-3 top-[9px] h-1 w-1 rounded-full bg-[#888888]" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {/* INFORMATION CARDS */}
      {section.cards && section.cards.length > 0 && (
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {section.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center gap-1.5 rounded-none border border-[#e6d6b9] bg-[#fdfaf3] px-3.5 py-3 text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#93a66d] bg-white text-[#1f4d2f]">
                {cardIcons[card.icon] ?? <FileText size={22} strokeWidth={1.5} />}
              </div>

              <p className="text-[13.5px] font-semibold leading-snug text-[#1f261b]">
                {card.title}
              </p>

              <p className="text-[12px] font-medium leading-relaxed text-[#666666]">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* USE CHECKLIST */}
      {section.checkItems && section.checkItems.length > 0 && (
        <ul className="mt-2.5 grid gap-x-2.5 gap-y-1.5 lg:grid-flow-col lg:grid-rows-3">
          {section.checkItems.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#a9742a] text-white">
                <Check size={12} strokeWidth={2.5} />
              </span>
              <span className="text-[13.5px] font-medium text-[#666666]">
                {item}
              </span>
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
