"use client";

import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { Link as LinkIcon, LayoutGrid, ArrowRight, ChevronRight } from "lucide-react";
import { FaMapMarkerAlt, FaRegEnvelope } from "react-icons/fa";
import { MdPhoneInTalk } from "react-icons/md";
import BackToTop from "./BackToTop";
import SparkleLogo from "./SparkleLogo";
import { getImageUrl } from "@/lib/api/api";

// Imported webp assets
import designHouseLogo from "@/assets/icons/design_house.webp";
import footerLeft from "@/assets/footer/left.webp";
import footerRight from "@/assets/footer/right.webp";
import footerRightTop from "@/assets/footer/right-top.webp";
import footerRightBottom from "@/assets/footer/right-bottom.webp";
import footerLogoImg from "@/assets/footer/Ensys Wellness Furniture Logo.webp";
import footerMap from "@/assets/footer/map.webp";
import strapLeaf from "@/assets/footer/strap-leaf.webp";
import strapSprout from "@/assets/footer/strap-sprout.webp";
import strapGear from "@/assets/footer/strap-gear.webp";
import strapDiamond from "@/assets/footer/strap-diamond.webp";
import strapTruck from "@/assets/footer/strap-truck.webp";
import encodencyLogoImg from "@/assets/footer/encodency-logo.jpg";

export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterNavSection {
  title: string;
  links: FooterNavLink[];
}

export interface FooterViewProps {
  footerLogoSrc: string | StaticImageData;
  designHouseSrc: string | StaticImageData;
  developerLogoSrc?: string | StaticImageData;
  developer: {
    label?: string;
    name?: string;
    href?: string;
    logoUrl?: string;
  };
  strapItems?: {
    title: string;
    desc: string;
    iconUrl?: string;
  }[];
  copyrightYear?: number;
}

/** Lightbulb with rays matching the approved footer design */
const BulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 -3 24 27"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.3 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
    <path d="M12 -2.2v1.6M4.4 1.2l1.1 1.1M19.6 1.2l-1.1 1.1M1.6 7.6h1.6M20.8 7.6h1.6" />
  </svg>
);

const navIcons = [LinkIcon, LayoutGrid, BulbIcon];
const navIconColors = [
  { bg: "bg-[#0e8a8f]", text: "text-white" },
  { bg: "bg-[#2e7d32]", text: "text-white" },
  { bg: "bg-[#6a1b9a]", text: "text-white" },
];

const fallbackFeatures = [
  { title: "Premium Quality", desc: "Durable & Reliable Products", icon: strapLeaf },
  { title: "Ayurvedic Expertise", desc: "Rooted in Ancient Wisdom", icon: strapSprout },
  { title: "End to End Support", desc: "From Planning to Installation", icon: strapGear },
  { title: "Customized Solutions", desc: "Tailored For Your Unique Needs", icon: strapDiamond },
  { title: "Pan India Service", desc: "Delivering Wellness Across India", icon: strapTruck },
];

// Universal navigation sections across all pages
const universalNavSections: FooterNavSection[] = [
  {
    title: "QUICK LINKS",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Our Solutions", href: "/solutions" },
      { label: "Our Products", href: "/products" },
      { label: "Our Projects", href: "/projects-and-clients" },
      { label: "Our Clients", href: "/projects-and-clients" },
      { label: "Why Choose Us", href: "/about-us" },
      { label: "Blogs", href: "/blog" },
      { label: "Careers", href: "/career" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "PRODUCT CATEGORIES",
    links: [
      { label: "Panchkarma Tables & Equipment", href: "/products" },
      { label: "Ayurveda Therapy Equipment", href: "/products" },
      { label: "Spa & Wellness Furniture", href: "/products" },
      { label: "Hydrotherapy Equipment", href: "/products" },
      { label: "Massage & Treatment Tables", href: "/products" },
      { label: "Consultation & Examination Furniture", href: "/products" },
      { label: "Hospitality & Resort Spa Setup", href: "/products" },
      { label: "Accessories & Consumables", href: "/products" },
      { label: "Herbal & Oil Preparation Equipment", href: "/products" },
    ],
  },
  {
    title: "OUR SOLUTIONS",
    links: [
      { label: "Panchkarma Clinic Setup", href: "/solutions/panchkarma-clinic-setup" },
      { label: "Resort & Spa Setup", href: "/solutions/resort-spa-setup" },
      { label: "Wellness Retreat Design", href: "/solutions/wellness-retreat-design" },
      { label: "Ayurveda Hospital Setup", href: "/solutions/ayurveda-hospital-setup" },
      { label: "Interior & Equipment Integration", href: "/solutions/interior-equipment-integration" },
      { label: "Customised Solutions", href: "/turnkey" },
      { label: "Turnkey Project Execution", href: "/turnkey" },
      { label: "Consultancy & Support", href: "/consultancy" },
      { label: "AMC & Service Support", href: "/contact" },
    ],
  },
];

export default function FooterView({
  footerLogoSrc,
  designHouseSrc,
  developerLogoSrc,
  developer,
  strapItems,
  copyrightYear = new Date().getFullYear(),
}: FooterViewProps) {
  const pathname = usePathname();
  // Map only on contact page (/contact), address offices on all other pages
  const isContactPage = pathname === "/contact" || pathname?.startsWith("/contact/");

  const devLogo =
    developerLogoSrc ||
    (developer.logoUrl?.trim()
      ? getImageUrl(developer.logoUrl, 400)
      : /encodency/i.test(developer.name || "")
        ? encodencyLogoImg
        : null);

  const features = fallbackFeatures.map((item, i) => ({
    ...item,
    title: strapItems?.[i]?.title || item.title,
    desc: strapItems?.[i]?.desc || item.desc,
    iconUrl: strapItems?.[i]?.iconUrl || "",
  }));

  return (
    <footer className="overflow-hidden bg-white font-medium footer-font">
      {/* ── 1. TOP FEATURES STRIP ── */}
      <div className="relative border-b border-[#ebd7be] bg-[#fbf8f2] overflow-hidden">
        <div className="mx-auto max-w-[1720px] px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-[#ebd8c1]">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 lg:px-4 lg:first:pl-0 lg:last:pr-0"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center">
                  {item.iconUrl ? (
                    <Image
                      src={item.iconUrl}
                      alt=""
                      aria-hidden
                      width={44}
                      height={44}
                      className="max-h-10 w-auto object-contain"
                    />
                  ) : (
                    <Image
                      src={item.icon}
                      alt=""
                      aria-hidden
                      width={44}
                      height={44}
                      className="max-h-10 w-auto object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13px] sm:text-[13.5px] 2xl:text-[14px] font-bold leading-tight text-[#11151f]">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] sm:text-[12px] 2xl:text-[12.5px] text-[#555d6b] leading-tight mt-0.5 whitespace-nowrap">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. MAIN FOOTER BODY ── */}
      <div className="relative w-full bg-white">
        {/* Desktop Left Background (Gold banner with bokeh & plumeria at bottom left) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[31%] xl:w-[30%] 2xl:w-[29.5%] lg:block bg-no-repeat z-0"
          style={{
            backgroundImage: `url(${footerLeft.src})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "left top",
            filter: "drop-shadow(6px 0 16px rgba(60, 35, 5, 0.38)) drop-shadow(14px 0 28px rgba(0, 0, 0, 0.12))",
          }}
        />

        {/* Right Spa Decoration Visuals */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 z-[1] hidden w-[140px] xl:w-[170px] 2xl:w-[200px] h-[190px] xl:h-[220px] bg-no-repeat lg:block"
          style={{
            backgroundImage: `url(${footerRightTop.src})`,
            backgroundSize: "contain",
            backgroundPosition: "top right",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden w-[170px] xl:w-[210px] 2xl:w-[250px] h-[180px] xl:h-[210px] bg-no-repeat lg:block"
          style={{
            backgroundImage: `url(${isContactPage ? footerRightBottom.src : footerRight.src})`,
            backgroundSize: "contain",
            backgroundPosition: "bottom right",
          }}
        />

        {/* Mobile Right Visual */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-[1] block w-[140px] h-[130px] bg-no-repeat lg:hidden"
          style={{
            backgroundImage: `url(${footerRightBottom.src})`,
            backgroundSize: "contain",
            backgroundPosition: "bottom right",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-[1720px] px-3 sm:px-5 lg:px-5 pt-6 pb-2">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[25%_13%_20%_18%_1fr] 2xl:grid-cols-[25%_13%_20%_18%_1fr] lg:gap-0">

            {/* ── COL 1: BRAND PANEL (UNIVERSAL ACROSS ALL PAGES) ── */}
            <div className="relative rounded-2xl p-6 sm:p-7 lg:rounded-none lg:bg-transparent lg:p-0 lg:pr-3 xl:pr-4 lg:pl-6 xl:pl-8 2xl:pl-9 overflow-hidden lg:overflow-visible">
              {/* Mobile background banner */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-no-repeat lg:hidden"
                style={{
                  backgroundImage: `url(${footerLeft.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center left",
                }}
              />

              {/* Logo with tagline - 3D shining glint effect */}
              <div className="relative">
                <SparkleLogo
                  src={footerLogoSrc || footerLogoImg}
                  alt="ENSIS Wellness Furniture"
                  fallback={footerLogoImg}
                  variant="3d"
                  width={280}
                  height={90}
                  priority
                  className="h-auto w-[190px] sm:w-[215px] xl:w-[235px] 2xl:w-[250px] object-contain drop-shadow-sm"
                />
              </div>

              {/* Brand Description - formatted line-by-line matching reference image */}
              <p className="mt-3.5 text-[12px] sm:text-[12.5px] 2xl:text-[13px] text-[#1a1208] leading-[1.38] font-medium [text-shadow:0_0_2px_#fff,0_0_4px_#fff,0_0_8px_rgba(255,255,255,0.95)]">
                Premium Ayurveda, Panchakarma
                <br />
                and spa equipment designed for clinics,
                <br />
                resorts and healthcare spaces.
                <br />
                We create durable, functional and
                <br />
                aesthetically crafted wellness solutions
                <br />
                across India.
              </p>

              {/* Call Us Today Capsule Button (Enlarged phone icon and numbers) */}
              <div className="mt-4 sm:mt-5 flex w-fit min-w-[240px] sm:min-w-[260px] max-w-[17.5rem] items-center gap-3 rounded-2xl border-[1.5px] border-white bg-[#051c42] py-2 pl-2 pr-3.5 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)]">
                <a
                  href="tel:+919654900525"
                  aria-label="Call +91 9654900525"
                  className="relative flex h-12 w-12 sm:h-[50px] sm:w-[50px] shrink-0 items-center justify-center rounded-full bg-[#fbc512] text-[#051c42] transition hover:scale-105 shadow-sm"
                >
                  <MdPhoneInTalk className="h-6 w-6 sm:h-[26px] sm:w-[26px] text-[#051c42]" aria-hidden />
                </a>
                <div className="min-w-0 flex-1 self-center">
                  <p className="text-[11.5px] sm:text-[12px] font-bold leading-none text-[#fbc512] tracking-wide mb-1 sm:mb-1.5">Call Us Today</p>
                  <a href="tel:+919810242841" className="block text-[15px] sm:text-[15.5px] xl:text-[16px] font-semibold leading-tight hover:text-[#fbc512] text-white tracking-wide whitespace-nowrap">
                    +91 9810242841
                  </a>
                  <a href="tel:+919654900525" className="block text-[15px] sm:text-[15.5px] xl:text-[16px] font-semibold leading-tight hover:text-[#fbc512] text-white tracking-wide whitespace-nowrap mt-1.5 sm:mt-2">
                    +91 9654900525
                  </a>
                </div>
                <a
                  href="tel:+919654900525"
                  aria-label="Call Us Today"
                  className="shrink-0 self-center text-white transition hover:text-[#fbc512] hover:translate-x-0.5"
                >
                  <ArrowRight strokeWidth={2.4} className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>

            {/* ── COLS 2, 3, 4: NAVIGATION COLUMNS (UNIVERSAL ACROSS ALL PAGES) ── */}
            {universalNavSections.map((nav: FooterNavSection, i: number) => {
              const Icon = navIcons[i] ?? LinkIcon;
              const color = navIconColors[i] ?? navIconColors[0];
              return (
                <div
                  key={i}
                  className={`relative lg:after:absolute lg:after:right-0 lg:after:top-2 lg:after:bottom-2 lg:after:w-[1px] lg:after:bg-[#e4e7ec] ${i === 0
                    ? "lg:pl-3 xl:pl-4 2xl:pl-5 lg:pr-2.5 xl:pr-3"
                    : i === 1
                      ? "lg:pl-3 xl:pl-3.5 2xl:pl-4 lg:pr-3 xl:pr-3.5"
                      : "lg:pl-3.5 xl:pl-4 2xl:pl-4.5 lg:pr-4 xl:pr-5 2xl:pr-6"
                    }`}
                >
                  {/* Header */}
                  <div className="mb-2 flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text} shadow-xs`}
                    >
                      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
                    </div>
                    <h3 className="whitespace-nowrap text-[13.5px] sm:text-[14px] 2xl:text-[15px] font-extrabold uppercase tracking-wide text-[#0b2e8c]">
                      {nav.title}
                    </h3>
                  </div>

                  {/* Rainbow underline */}
                  <div className="mb-2.5 h-[2.5px] w-10 sm:w-11 bg-[linear-gradient(90deg,#e4401e_0%,#f5a623_28%,#8cc43c_55%,#12a39a_78%,#1f4fc0_100%)]" />

                  {/* Links List - Strictly single line (whitespace-nowrap) */}
                  <ul className="space-y-0.5">
                    {nav.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-1.5 text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-medium leading-[24px] 2xl:leading-[26px] text-[#102d7b] transition hover:text-[#f37023]"
                        >
                          <ChevronRight
                            size={12}
                            strokeWidth={3.5}
                            className="text-[#f37023] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                          <span className="whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* ── COL 5: DYNAMIC (MAP ONLY ON /contact, ADDRESSES ON ALL OTHER PAGES) ── */}
            <div className="relative lg:pl-2 xl:pl-2.5 2xl:pl-3">
              {isContactPage ? (
                /* ── MAP VARIANT (ON /contact ONLY - IMAGE 3) ── */
                <div>
                  {/* Header Row: Title & Subtitle on left, Design House logo on right */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#e69a00] text-white shadow-xs mt-0.5">
                        <FaMapMarkerAlt className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="whitespace-nowrap text-[13.5px] sm:text-[14px] 2xl:text-[14.5px] font-extrabold uppercase tracking-tight text-[#0b2e8c]">
                          OUR PRESENCE ON MAP
                        </h3>
                        <p className="mt-1 text-[10.5px] sm:text-[11px] 2xl:text-[11.5px] font-medium leading-[1.35] text-[#1a3575]">
                          <span className="block whitespace-nowrap">We are strategically located across</span>
                          <span className="block whitespace-nowrap">India to serve our clients better.</span>
                        </p>
                      </div>
                    </div>

                    {/* Design House Logo - size increased by 15px */}
                    <div className="shrink-0 -mt-1">
                      <SparkleLogo
                        src={designHouseSrc}
                        alt="Design House India Pvt. Ltd."
                        fallback={designHouseLogo}
                        variant="3d"
                        width={200}
                        height={100}
                        wrapperClassName="mt-[-15px] ml-[-10px]"
                        className="h-auto w-[105px] sm:w-[120px] xl:w-[130px] object-contain drop-shadow-xs"
                      />
                    </div>
                  </div>

                  {/* India Map graphic - reduced top spacing */}
                  <div className="-mt-2 sm:-mt-3 relative ml-1 sm:ml-1.5">
                    <div className="relative w-[260px] h-[225px] sm:h-[245px]">
                      <Image
                        src={footerMap}
                        alt="Presence in Delhi, Ghaziabad, Mumbai"
                        fill
                        className="object-contain object-right-top drop-shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ── ADDRESS/OFFICES VARIANT (ON ALL OTHER PAGES - IMAGE 2) ── */
                <div className="w-full max-w-[400px] xl:max-w-[440px]">
                  {/* Top: Design House Logo - aligned with text (not icons), slightly larger */}
                  <div className="-mt-7 sm:-mt-8 lg:-mt-9 xl:-mt-10 -mb-1 sm:-mb-1.5 ml-10 sm:ml-11 xl:ml-12">
                    <SparkleLogo
                      src={designHouseSrc}
                      alt="Design House India Pvt. Ltd."
                      fallback={designHouseLogo}
                      variant="3d"
                      width={240}
                      height={120}
                      className="h-auto w-[150px] sm:w-[165px] xl:w-[180px] object-contain drop-shadow-xs"
                    />
                  </div>

                  {/* 4 Contact Rows with Red-Orange Circular Icons matching reference image */}
                  <div className="space-y-1 sm:space-y-1.5">
                    {/* Email */}
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 xl:h-[42px] xl:w-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] sm:border-2 border-[#e4401e] bg-white text-[#e4401e] mt-0.5 shadow-2xs">
                        <FaRegEnvelope className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] text-[#e4401e]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-extrabold text-[#0b2e8c] leading-tight">
                          Email Us
                        </h4>
                        <a
                          href="mailto:info@ensis.in"
                          className="mt-0.5 block text-[11.5px] sm:text-[12px] 2xl:text-[12.5px] font-medium leading-[1.3] text-[#102d7b] hover:text-[#e4401e] transition-colors"
                        >
                          info@ensis.in (ENSIS)
                        </a>
                      </div>
                    </div>

                    {/* Corporate Office */}
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 xl:h-[42px] xl:w-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] sm:border-2 border-[#e4401e] bg-white text-[#e4401e] mt-0.5 shadow-2xs">
                        <FaMapMarkerAlt className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] text-[#e4401e]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-extrabold text-[#0b2e8c] leading-tight">
                          Corporate Office | Delhi-NCR, India
                        </h4>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] 2xl:text-[12.5px] font-medium leading-[1.3] text-[#102d7b]">
                          Plot No. 12/29, Site-II Industrial Area,
                          <br />
                          Loni Road, Mohan Nagar, Ghaziabad,
                          <br />
                          Uttar Pradesh – 201007, India
                        </p>
                      </div>
                    </div>

                    {/* Regional Office */}
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 xl:h-[42px] xl:w-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] sm:border-2 border-[#e4401e] bg-white text-[#e4401e] mt-0.5 shadow-2xs">
                        <FaMapMarkerAlt className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] text-[#e4401e]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-extrabold text-[#0b2e8c] leading-tight">
                          Regional Office | Delhi, India
                        </h4>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] 2xl:text-[12.5px] font-medium leading-[1.3] text-[#102d7b]">
                          Ground Floor, E-1, Main Market,
                          <br />
                          Opp. KFC, Kalkaji,
                          <br />
                          New Delhi – 110019, India
                        </p>
                      </div>
                    </div>

                    {/* Mumbai Branch */}
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 xl:h-[42px] xl:w-[42px] shrink-0 items-center justify-center rounded-full border-[1.5px] sm:border-2 border-[#e4401e] bg-white text-[#e4401e] mt-0.5 shadow-2xs">
                        <FaMapMarkerAlt className="h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] text-[#e4401e]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[12.5px] sm:text-[13px] 2xl:text-[13.5px] font-extrabold text-[#0b2e8c] leading-tight">
                          Mumbai Branch Office
                        </h4>
                        <p className="mt-0.5 text-[11.5px] sm:text-[12px] 2xl:text-[12.5px] font-medium leading-[1.3] text-[#102d7b]">
                          UNIT-IISR Compound, Plot No 49/459,
                          <br />
                          Opp Dynamic Flow Company,
                          <br />
                          Wakanpada Road, Vasai Phata
                          <br />
                          Vasai East – 401208, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. COPYRIGHT BAR (ALWAYS SINGLE HORIZONTAL ROW) ── */}
      <div className="bg-[#041d40] text-white">
        <div className="mx-auto max-w-[1720px] px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5">
          <div className="flex flex-row flex-nowrap items-center justify-between gap-x-2 sm:gap-x-3 lg:gap-x-4 overflow-x-auto no-scrollbar text-[12px] sm:text-[12px] md:text-[12px] xl:text-[12.5px] font-normal leading-normal select-none">
            {/* Left: Copyright */}
            <div className="flex items-center gap-x-1.5 sm:gap-x-2 text-white/95 whitespace-nowrap shrink-0">
              <span>© {copyrightYear} ENSIS</span>
              <span aria-hidden className="text-white/40">|</span>
              <span>A Brand of Design House India Pvt. Ltd.</span>
              <span aria-hidden className="text-white/40">|</span>
              <span>All Rights Reserved.</span>
            </div>

            {/* Right: Links & Developer Credit with Official enCodency Image Logo */}
            <div className="flex items-center gap-x-1.5 sm:gap-x-1.5 xl:gap-x-2 text-white/90 whitespace-nowrap shrink-0">
              <Link href="/sitemap.xml" className="text-white/90 hover:text-white transition-colors">
                Sitemap
              </Link>
              <span aria-hidden className="text-white/40">|</span>
              <Link href="/privacy-policy" className="text-white/90 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span aria-hidden className="text-white/40">|</span>
              <Link href="/terms-and-conditions" className="text-white/90 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <span aria-hidden className="text-white/40">|</span>
              <Link href="/refund-policy" className="text-white/90 hover:text-white transition-colors">
                Refund Policy
              </Link>
              <span aria-hidden className="text-white/40">|</span>
              <Link href="/disclaimer" className="text-white/90 hover:text-white transition-colors">
                Disclaimer
              </Link>

              {developer.name && (
                <>
                  <span aria-hidden className="text-white/40">|</span>
                  <span className="flex items-center gap-1.5 sm:gap-2 text-white">
                    <span className="hidden sm:inline">{developer.label || "Designed & Developed by:"}</span>
                    <a
                      href={developer.href || "https://encodency.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center overflow-hidden transition hover:opacity-95 shrink-0 max-w-[150px]"
                      title={developer.name || "enCodency Pvt. Ltd."}
                    >
                      {devLogo ? (
                        <Image
                          src={devLogo}
                          alt={developer.name || "enCodency Pvt. Ltd."}
                          width={150}
                          height={46}
                          className="h-7 sm:h-[34px] xl:h-[36px] max-w-[150px] w-auto object-contain rounded-[4px] shadow-xs"
                        />
                      ) : (
                        <span className="font-semibold text-white hover:underline">{developer.name}</span>
                      )}
                    </a>
                  </span>
                </>
              )}

              <BackToTop className="mr-1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
