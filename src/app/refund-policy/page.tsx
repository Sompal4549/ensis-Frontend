"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  ChevronRight,
  Check,
  FileX2,
  Puzzle,
  Settings,
  Shield,
  Clock,
  Users,
  Award,
} from "lucide-react";
import StickyScrollSpy from "@/components/ui/StickyScrollSpy";
import { Container } from "@/components/ui/Container";
import MobileScrollSpy from "@/components/ui/MobileScrollSpy";
import disclaimerBg from "@/assets/disclaimer_hero.webp";
import lotusIcon from "@/assets/lotus.png";
import { staticRefundSections, type RefundSection } from "@/data/policy";

const cardIcons: Record<string, React.ReactNode> = {
  "file-x": <FileX2 size={26} strokeWidth={1.5} />,
  settings: <Settings size={26} strokeWidth={1.5} />,
  puzzle: <Puzzle size={26} strokeWidth={1.5} />,
  calendar: <CalendarCheck2 size={26} strokeWidth={1.5} />,
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function RefundPolicyPage() {
  const [sections, setSections] = useState<RefundSection[]>(staticRefundSections);
  const [activeSection, setActiveSection] = useState<string>(staticRefundSections[0]?.id || "");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchRefundData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/component-content/policy.refund`
        );
        if (response.ok) {
          const data = await response.json();
          const refundData = data.data;
          if (refundData && refundData.data && refundData.data.sections) {
            setSections(refundData.data.sections);
            if (refundData.data.sections.length > 0) {
              setActiveSection(refundData.data.sections[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch refund policy:", error);
      }
    };
    fetchRefundData();
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
            name: "Refund Policy | ENSIS",
            description:
              "Read the ENSIS refund policy — conditions under which cancellations, refunds or adjustments apply to our products, services and payments.",
            url: "https://ensis.in/refund-policy",
            publisher: {
              "@type": "Organization",
              name: "ENSIS",
              url: "https://ensis.in",
            },
            dateModified: "2026-10-26",
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
            src={disclaimerBg}
            alt="ENSIS Refund Policy"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto flex max-w-[1400px] items-center px-4 py-8  lg:px-10">
          <div className="flex w-full items-center justify-between gap-6">
            <div className="max-w-[570px]">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-8 bg-[#a9742a]" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a9742a]">
                  LEGAL
                </p>
              </div>

              <h1 className=" text-[clamp(2rem,3vw+0.75rem,2.875rem)] leading-normal text-[#1f261b]">
                Refund <span className="text-[#a9742a]">Policy</span>
              </h1>

              <p className="max-w-[480px] text-base font-medium leading-normal text-[#666666]">
                Our refund policy explains the conditions under which
                cancellations, refunds or adjustments are applicable for
                our products and services.
              </p>
            </div>

            {/* BREADCRUMB */}
            {/* <nav
              aria-label="Breadcrumb"
              className="hidden shrink-0 items-center gap-2 text-sm font-medium text-[#666666] lg:flex"
            >
              <Link href="/" className="transition-colors hover:text-[#a9742a]">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#a9742a]" />
              <span className="font-semibold text-[#a9742a]">Refund Policy</span>
            </nav> */}
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

      <section className="relative mx-auto max-w-[1400px] px-5 py-3 sm:px-10 lg:py-4 overflow-visible">

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
          />

          {/* =================================================
              POLICY CONTENT
          ================================================= */}

          <div className="min-w-0">
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
      </section>
    </main>
  );
}

/* =========================================================
   SECTION DIVIDER (GOLD LINE + LOTUS)
========================================================= */

function SectionDivider() {
  return (
    <div className="my-1 flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d9b877] to-[#d9b877]" />
      <img
        src={lotusIcon.src}
        alt=""
        className="h-6 w-auto shrink-0 object-contain"
      />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#d9b877] to-[#d9b877]" />
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
  section: RefundSection;
  isActive: boolean;
}) {
  const displayNum = parseInt(section.number, 10) || section.number;

  return (
    <article
      id={section.id}
      style={isActive ? { boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" } : undefined}
      className="scroll-mt-28 rounded-xl px-4 py-2 transition-all duration-300 sm:px-4"
    >
      <h2 className="text-[23px] font-bold leading-tight text-[#063120] sm:text-[25px]">
        {displayNum}. {section.title}
      </h2>

      <p className="mt-2 max-w-[850px] text-base font-medium leading-normal text-[#666666]">
        {section.text}
      </p>

      {section.extra && (
        <p className="mt-2 max-w-[850px] text-base font-medium leading-normal text-[#666666]">
          {section.extra}
        </p>
      )}

      {section.extra2 && (
        <p className="mt-2 max-w-[850px] text-base font-medium leading-normal text-[#666666]">
          {section.extra2}
        </p>
      )}

      {section.bullets && (
        <ul className="mt-2 space-y-1 pl-4">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="relative pl-1 text-base font-medium leading-normal text-[#666666]"
            >
              <span className="absolute -left-3 top-[9px] h-1 w-1 rounded-full bg-[#333333]" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {/* CANCELLATION CARDS */}
      {section.cards && section.cards.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {section.cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] px-4 py-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#93a66d] bg-white text-[#1f4d2f]">
                {cardIcons[card.icon] ?? <Check size={26} strokeWidth={1.5} />}
              </div>

              <p className="text-sm font-bold leading-5 text-[#063120]">
                {card.title}
              </p>

              <p className="text-[13px] font-medium leading-5 text-[#666666]">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* REFUND ELIGIBILITY CHECKLIST */}
      {section.checkItems && section.checkItems.length > 0 && (
        <div className="mt-3 rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] p-4">
          <ul className="grid gap-x-2 gap-y-2 lg:grid-flow-col lg:grid-rows-3">
            {section.checkItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e07e1b] text-white">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium leading-6 text-[#666666]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.link && (
        <a
          href={section.link.href}
          className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#0f2518] underline underline-offset-4 transition-colors hover:text-[#a9742a]"
        >
          {section.link.label}
          <ArrowRight size={16} />
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
