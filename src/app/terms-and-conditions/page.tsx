"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Globe,
  Headphones,
  Mail,
  Phone,
  Shield,
  Clock,
  Users,
  Award,
} from "lucide-react";
import StickyScrollSpy from "@/components/ui/StickyScrollSpy";
import { Container } from "@/components/ui/Container";
import MobileScrollSpy from "@/components/ui/MobileScrollSpy";
import termsBg from "@/assets/privacy-terms/terms_bg.png";
import privacyCta from "@/assets/privacy-terms/privacy_cta.png";

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
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fetchTermsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/component-content/policy.terms`
        );
        if (response.ok) {
          const data = await response.json();
          const termsData = data.data;
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

  const navItems = sections.map((section) => ({
    id: section.id,
    number: section.number,
    title: section.title,
  }));

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

      <section className="relative z-10 min-h-[350px] overflow-visible lg:min-h-[450px] lg:mb-10">
        {/* HERO IMAGE */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={termsBg.src}
            alt="ENSIS Terms and Conditions"
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="relative mx-auto flex min-h-[350px] max-w-[1400px] items-center px-4 py-10 lg:min-h-[450px] lg:px-10">
          <div className="max-w-[570px]">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#a9742a]">
              ENSIS LEGAL
            </p>

            <h1 className="font-['Playfair_Display',serif] text-[clamp(2rem,3vw+0.75rem,2.875rem)] leading-[1.12] text-[#1f261b]">
              Terms & Conditions
            </h1>

            <p className="mt-6 max-w-[480px] text-base font-medium leading-7 text-[#666666]">
              Please review the terms that govern your use of the ENSIS
              website, products, services and business interactions.
            </p>

            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-[#666666]">
              <span className="text-[#a9742a]">●</span>
              <span>Last Updated: 20 May 2025</span>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="relative z-20 px-4 sm:px-10 lg:absolute lg:left-0 lg:right-0 lg:bottom-0 lg:translate-y-1/2 lg:px-10">
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

      <section className="relative mx-auto max-w-[1400px] px-5 py-4 sm:px-10 lg:py-6 overflow-visible">
        {/* <img
          src={onThisPageDecoration.src}
          alt=""
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 object-contain object-right max-h-[300px] w-auto"
        /> */}
        {/* ===================================================
            INTRO CARD
        =================================================== */}

        <div style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" }} className="rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] p-4 sm:p-5 lg:p-4">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1fr]">
            {/* INTRO TEXT */}
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#c7a45d]">
                <svg
                  viewBox="0 0 60 60"
                  className="h-12 w-12"
                  fill="none"
                >
                  <path
                    d="M30 52V10"
                    stroke="#a9742a"
                    strokeWidth="2"
                  />
                  <path
                    d="M30 22C20 20 14 14 17 8C25 9 30 14 30 22Z"
                    stroke="#a9742a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M30 31C40 28 46 22 43 16C35 18 30 23 30 31Z"
                    stroke="#a9742a"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M30 41C21 38 15 33 18 27C26 29 30 34 30 41Z"
                    stroke="#a9742a"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div>
                <h2 className="font-['Playfair_Display',serif] text-[24px] leading-tight text-[#1f261b] sm:text-[28px]">
                  Terms That Govern Your Experience
                </h2>

                <p className="mt-3 max-w-[600px] text-base font-medium leading-6 text-[#666666]">
                  ENSIS provides clarity on how our website, products,
                  services and business interactions are governed. Please
                  review these terms carefully.
                </p>
              </div>
            </div>

            {/* FEATURES */}
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:divide-x sm:divide-[#e6d6b9]">
              <Feature
                icon={
                  <svg viewBox="0 0 60 60" className="h-7 w-7" fill="none">
                    <path d="M15 30L25 40L45 20" stroke="#a9742a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title="Clear &"
                subtitle="Transparent"
              />

              <Feature
                icon={
                  <svg viewBox="0 0 60 60" className="h-7 w-7" fill="none">
                    <path d="M30 10V50M15 25H45M15 35H45" stroke="#a9742a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
                title="Legally"
                subtitle="Binding"
              />

              <Feature
                icon={
                  <svg viewBox="0 0 60 60" className="h-7 w-7" fill="none">
                    <circle cx="30" cy="30" r="18" stroke="#a9742a" strokeWidth="1.5"/>
                    <path d="M30 20V30L38 34" stroke="#a9742a" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                }
                title="Always"
                subtitle="Updated"
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            CONTENT GRID
        =================================================== */}

        <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
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
              <PolicySection
                key={section.id}
                section={section}
                isLast={index === sections.length - 1}
                isActive={activeSection === section.id}
              />
            ))}
          </div>
        </div>

        {/* ===================================================
            CONTACT CARD
        =================================================== */}

        <div className="mt-8 overflow-hidden rounded-xl border border-[#e6d6b9] bg-[#fdfaf3] shadow-[0_8px_30px_rgba(139,107,55,0.15)]">
            <div className="grid lg:grid-cols-[240px_1fr]">
            {/* IMAGE */}
            <div className="h-[140px] overflow-hidden lg:h-full">
              <img
                src={privacyCta.src}
                alt="ENSIS contact for terms questions"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* CONTENT */}
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr] lg:p-8">
              {/* LEFT */}
              <div className="flex flex-col gap-4">
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0f2518] text-white shadow-[0_2px_12px_rgba(15,37,24,0.35)]">
                    <Headphones size={25} strokeWidth={1.5} />
                  </div>

                  <h2 className="font-['Playfair_Display',serif] text-[24px] leading-tight text-[#1f261b]">
                    Have a Terms Question?
                    <br />
                    Contact Our Team
                  </h2>
                </div>

                <p className="max-w-[470px] text-base font-medium leading-6 text-[#666666]">
                  We are here to help with any questions regarding
                  our terms, products, services or business
                  interactions.
                </p>
              </div>

              {/* CONTACT DETAILS */}
              <div className="flex flex-col justify-center gap-5 border-t border-[#e6d6b9] pt-6 lg:flex-row lg:items-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <ContactRow
                  icon={<Phone size={17} strokeWidth={1.5} />}
                  text="+91 9654900525"
                  href="tel:+919654900525"
                />

                <ContactRow
                  icon={<Mail size={17} strokeWidth={1.5} />}
                  text="info@ensis.in"
                  href="mailto:info@ensis.in"
                />

                <ContactRow
                  icon={<Globe size={17} strokeWidth={1.5} />}
                  text="www.ensis.in"
                  href="https://www.ensis.in"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-[105px] flex-col items-center justify-center px-3 text-center">
      <div className="mb-3 text-[#a9742a]">{icon}</div>

      <p className="text-sm font-semibold leading-5 text-[#333333]">
        {title}
      </p>

      <p className="text-sm font-semibold leading-5 text-[#333333]">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   POLICY SECTION COMPONENT
========================================================= */

function PolicySection({
  section,
  isLast,
  isActive,
}: {
  section: PolicySection;
  isLast: boolean;
  isActive: boolean;
}) {
  return (
    <article
      id={section.id}
      style={isActive ? { boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" } : undefined}
      className={`scroll-mt-28 rounded-xl px-2 py-3 transition-all duration-300 sm:px-0 ${
        !isLast ? "border-b border-[#e6d6b9]" : ""
      }`}
    >
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[68px_1fr] sm:gap-5">
        {/* NUMBER */}
        <div className="hidden sm:flex sm:items-start sm:justify-center">
          <div className="flex items-center gap-4">
            <span className="font-['DM_Sans',sans-serif] text-[23px] font-medium text-[#a9742a]">
              {section.number}
            </span>

            <span className="h-7 w-px bg-[#c7a45d]" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          <span className="font-['DM_Sans',sans-serif] text-[23px] font-medium text-[#a9742a]">
            {section.number}
          </span>
          <span className="h-7 w-px bg-[#c7a45d]" />
        </div>

        {/* CONTENT */}
        <div className="pl-2 sm:pl-0">
          <h2 className="font-['Playfair_Display',serif] text-[23px] leading-tight text-[#1f261b] sm:text-[25px]">
            {section.title}
          </h2>

          <p className="mt-2 max-w-[850px] text-base font-medium leading-6 text-[#666666]">
            {section.text}
          </p>

          {section.extra && (
            <p className="mt-2 max-w-[850px] text-base font-medium leading-6 text-[#666666]">
              {section.extra}
            </p>
          )}

          {section.extra2 && (
            <p className="mt-2 max-w-[850px] text-base font-medium leading-6 text-[#666666]">
              {section.extra2}
            </p>
          )}

          {section.bullets && (
            <ul className="mt-2 space-y-1 pl-4">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-1 text-base font-medium leading-5 text-[#666666]"
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
              className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#0f2518] underline underline-offset-4 transition-colors hover:text-[#a9742a]"
            >
              {section.link.label}
              <ArrowRight size={16} />
            </a>
          )}
          </div>
        </div>
    </article>
  );
}

/* =========================================================
   CONTACT ROW
========================================================= */

function ContactRow({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 text-sm font-semibold text-[#333333] transition-colors hover:text-[#a9742a]">
      <span className="flex w-5 justify-center text-[#333333]">
        {icon}
      </span>

      <span>{text}</span>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
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
