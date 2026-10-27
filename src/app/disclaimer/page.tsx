"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Copyright,
  FileCog,
  FileText,
  Image as ImageIcon,
  Link2,
  Mail,
  Package,
  Shield,
  ShoppingCart,
  User,
  Users,
  Clock,
  Award,
} from "lucide-react";
import StickyScrollSpy from "@/components/ui/StickyScrollSpy";
import { Container } from "@/components/ui/Container";
import MobileScrollSpy from "@/components/ui/MobileScrollSpy";
import disclaimerBg from "@/assets/disclaimer_hero.webp";
import { staticDisclaimerSections, type DisclaimerSection } from "@/data/policy";

const sectionIcons: Record<string, React.ReactNode> = {
  "file-text": <FileText size={26} strokeWidth={1.5} />,
  package: <Package size={26} strokeWidth={1.5} />,
  image: <ImageIcon size={26} strokeWidth={1.5} />,
  link: <Link2 size={26} strokeWidth={1.5} />,
  users: <Users size={26} strokeWidth={1.5} />,
  shield: <Shield size={26} strokeWidth={1.5} />,
  cart: <ShoppingCart size={26} strokeWidth={1.5} />,
  copyright: <Copyright size={26} strokeWidth={1.5} />,
  user: <User size={26} strokeWidth={1.5} />,
  "file-cog": <FileCog size={26} strokeWidth={1.5} />,
  mail: <Mail size={26} strokeWidth={1.5} />,
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DisclaimerPage() {
  const [sections, setSections] = useState<DisclaimerSection[]>(staticDisclaimerSections);
  const [activeSection, setActiveSection] = useState<string>(staticDisclaimerSections[0]?.id || "");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchDisclaimerData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/component-content/policy.disclaimer`
        );
        if (response.ok) {
          const data = await response.json();
          const disclaimerData = data.data;
          if (disclaimerData && disclaimerData.data && disclaimerData.data.sections) {
            setSections(disclaimerData.data.sections);
            if (disclaimerData.data.sections.length > 0) {
              setActiveSection(disclaimerData.data.sections[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch disclaimer:", error);
      }
    };
    fetchDisclaimerData();
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
            name: "Disclaimer | ENSIS",
            description:
              "Important information about the use of the ENSIS website, products, services and content — including product information, visuals, liability and intellectual property.",
            url: "https://ensis.in/disclaimer",
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
          <img
            src={disclaimerBg.src}
            alt="ENSIS Disclaimer"
            className="h-full w-full object-cover"
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
                Dis<span className="text-[#a9742a]">claimer</span>
              </h1>

              <p className="max-w-[400px] text-base font-medium leading-normal text-[#666666]">
                Important information about the use of our website,
                products, services and content.
              </p>
            </div>

            {/* BREADCRUMB */}
            <nav
              aria-label="Breadcrumb"
              className="hidden shrink-0 items-center gap-2 text-sm font-medium text-white lg:flex"
            >
              <Link href="/" className="text-white transition-colors hover:text-[#a9742a]">
                Home
              </Link>
              <ChevronRight size={14} className="text-[#a9742a]" />
              <span className="font-semibold text-[#a9742a]">Disclaimer</span>
            </nav>
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
              DISCLAIMER SECTIONS (2-COLUMN ICON GRID)
          ================================================= */}

          <div className="grid gap-x-2 gap-y-3 lg:grid-cols-2 lg:gap-y-1">
            {sections.map((section, index) => (
              <DisclaimerSectionCard
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                isFirst={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   DISCLAIMER SECTION CARD (2-COLUMN GRID ITEM)
========================================================= */

function DisclaimerSectionCard({
  section,
  isActive,
  isFirst,
}: {
  section: DisclaimerSection;
  isActive: boolean;
  isFirst: boolean;
}) {
  return (
    <article
      id={section.id}
      style={isActive ? { boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" } : undefined}
      className={`scroll-mt-28 rounded-xl px-3 py-2 transition-all duration-300 sm:px-3 ${isFirst
        ? ""
        : "border-t border-[#e6d6b9] lg:[&:nth-child(2)]:border-t-0"
        }`}
    >
      <div className="flex gap-4 sm:gap-5">
        {/* ICON */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#93a66d] bg-[#fdfaf3] text-[#1f4d2f] sm:h-11 sm:w-11">
          {sectionIcons[section.icon] ?? <FileText size={26} strokeWidth={1.5} />}
        </div>

        {/* CONTENT */}
        <div className="min-w-0">
          <h2 className=" text-[19px] font-bold leading-snug text-[#063120] sm:text-[21px]">
            {(parseInt(section.number, 10) || section.number)}. {section.title}
          </h2>

          <p className="mt-2 text-sm font-medium leading-normal text-[#666666] sm:text-[15px]">
            {section.text}
          </p>
        </div>
      </div>
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
