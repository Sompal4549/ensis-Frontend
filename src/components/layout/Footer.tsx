import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Link as LinkIcon,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdPhoneInTalk } from 'react-icons/md';
import { Container } from '../ui/Container';
import BackToTop from './BackToTop';
import logoImg from '@/assets/logo.webp';
import GlowLogo from './GlowLogo';
import SparkleLogo from './SparkleLogo';
import { getComponentContent, getImageUrl } from '@/lib/api/api';
import designHouseLogo from "@/assets/icons/design_house.webp"
import { splitPhoneNumbers } from '@/lib/phone';
import { DEFAULT_OFFICES, DEFAULT_EMAIL_TEXT } from '@/lib/contactDefaults';
import footerLeft from "@/assets/footer/left.png"
import footerRight from "@/assets/footer/right.png"
import footerStrapRight from "@/assets/footer/strap_right.png"
import footerLogoImg from "@/assets/footer/Ensys Wellness Furniture Logo.png"
import arrow from "@/assets/icons/arrow.png"
import strapLeaf from "@/assets/footer/strap-leaf.png"
import strapSprout from "@/assets/footer/strap-sprout.png"
import strapGear from "@/assets/footer/strap-gear.png"
import strapDiamond from "@/assets/footer/strap-diamond.png"
import strapTruck from "@/assets/footer/strap-truck.png"

interface FooterNavLink {
  label: string;
  href: string;
}

interface FooterNavSection {
  title: string;
  links: FooterNavLink[];
}

interface FooterContent {
  company: {
    name: string;
    description: string;
    socialLinks: any[];
    maplink: string;
  };
  navigation: FooterNavSection[];
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsappPhone: string;
  };
  copyright: {
    text: string;
    links: FooterNavLink[];
    developer?: FooterDeveloper;
  };
}

/** Footer fields the admin can edit on top of the base layout.footer record; each falls back to the bundled design */
interface FooterExtras {
  footerColumns?: FooterNavSection[];
  strap?: { title?: string; desc?: string; iconUrl?: string }[];
  callUs?: { label?: string };
  brandText?: string;
  bottom?: { brand?: string; tagline?: string; rights?: string; links?: FooterNavLink[] };
  company?: { designHouselogo?: { imageUrl?: string; alt?: string } };
}

/** "Designed & Developed by" credit in the copyright bar; logoUrl replaces the text badge */
interface FooterDeveloper {
  label?: string;
  name?: string;
  href?: string;
  logoUrl?: string;
}

const defaultFooter = {
  "company": {
    "name": "Design House India Pvt. Ltd.",
    "description": "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
    "socialLinks": [],
    "maplink": ""
  },
  "navigation": [
    {
      "title": "Quick Links",
      "links": [
        { "label": "Home", "href": "/" },
        { "label": "About Us", "href": "/about-us" },
        { "label": "Our Solutions", "href": "/solutions" },
        { "label": "Our Products", "href": "/products" },
        { "label": "Our Projects", "href": "/projects-and-clients" },
        { "label": "Our Clients", "href": "/projects-and-clients" },
        { "label": "Why Choose Us", "href": "/about-us" },
        { "label": "Blogs", "href": "/blog" },
        { "label": "Careers", "href": "/career" },
        { "label": "Contact Us", "href": "/contact" }
      ]
    },
    {
      "title": "Product Categories",
      "links": [
        { "label": "Panchkarma Tables & Equipment", "href": "/products" },
        { "label": "Ayurveda Therapy Equipment", "href": "/products" },
        { "label": "Spa & Wellness Furniture", "href": "/products" },
        { "label": "Hydrotherapy Equipment", "href": "/products" },
        { "label": "Massage & Treatment Tables", "href": "/products" },
        { "label": "Consultation & Examination Furniture", "href": "/products" },
        { "label": "Hospitality & Resort Spa Setup", "href": "/products" },
        { "label": "Accessories & Consumables", "href": "/products" },
        { "label": "Herbal & Oil Preparation Equipment", "href": "/products" }
      ]
    },
    {
      "title": "Our Solutions",
      "links": [
        { "label": "Panchkarma Clinic Setup", "href": "/solutions/panchkarma-clinic-setup" },
        { "label": "Resort & Spa Setup", "href": "/solutions/resort-spa-setup" },
        { "label": "Wellness Retreat Design", "href": "/solutions/wellness-retreat-design" },
        { "label": "Ayurveda Hospital Setup", "href": "/solutions/ayurveda-hospital-setup" },
        { "label": "Interior & Equipment Integration", "href": "/solutions/interior-equipment-integration" },
        { "label": "Customised Solutions", "href": "/turnkey" },
        { "label": "Turnkey Project Execution", "href": "/turnkey" },
        { "label": "Consultancy & Support", "href": "/consultancy" },
        { "label": "AMC & Service Support", "href": "/contact" }
      ]
    }
  ],
  "contact": {
    "address": "12/29, Site-II, Loni Road, Industrial Area, Mohan Nagar - 201007, India, Uttar Pradesh, India",
    "phone": "+91 9654900525",
    "email": "info@ensis.in",
    "whatsappPhone": "+919654900525"
  },
  "copyright": {
    "text": "© 2026 Design House India Pvt. Ltd. All rights reserved.",
    "links": [
      { "label": "Sitemap", "href": "/sitemap.xml" }
    ],
    "developer": {
      "label": "Designed & Developed by",
      "name": "enCodency",
      "href": "https://encodency.com",
      "logoUrl": ""
    }
  }
};

/** Phones, brand text and bottom bar of the approved design — used until the admin sets their own (offices and email defaults are shared with the Contact page) */
const defaultOffices = DEFAULT_OFFICES;
const defaultCallNumbers = "+91 9810242841, +91 9654900525";
const defaultEmail = DEFAULT_EMAIL_TEXT;
const defaultBrandText =
  "Premium Ayurveda, Panchakarma\nand spa equipment designed for clinics,\nresorts and healthcare spaces.\nWe create durable, functional and\naesthetically crafted wellness solutions\nacross India.";
const defaultBottom = {
  brand: "ENSIS",
  tagline: "A Brand of Design House India Pvt. Ltd.",
  rights: "All Rights Reserved.",
  links: [
    { label: "Sitemap", href: "/sitemap.xml" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Disclaimer", href: "/terms-and-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

/** Lightbulb with rays, as in the approved footer design (lucide's bulb has no rays) */
const BulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 -3 24 27" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.3 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6M10 22h4" />
    <path d="M12 -2.2v1.6M4.4 1.2l1.1 1.1M19.6 1.2l-1.1 1.1M1.6 7.6h1.6M20.8 7.6h1.6" />
  </svg>
);
const navIcons = [LinkIcon, LayoutGrid, BulbIcon];
const navIconColors = [
  { bg: "bg-[#0e8a8f]", text: "text-white" },
  { bg: "bg-[#3b7d2a]", text: "text-white" },
  { bg: "bg-[#7a1fa2]", text: "text-white" },
];

const features = [
  { title: "Premium Quality", desc: "Durable & Reliable Products", icon: strapLeaf, height: 42 },
  { title: "Ayurvedic Expertise", desc: "Rooted in Ancient Wisdom", icon: strapSprout, height: 44 },
  { title: "End to End Support", desc: "From Planning to Installation", icon: strapGear, height: 43 },
  { title: "Customized Solutions", desc: "Tailored For Your Unique Needs", icon: strapDiamond, height: 33 },
  { title: "Pan India Service", desc: "Delivering Wellness Across India", icon: strapTruck, height: 35 },
];

// export const Footer = async ({image:StaticImageData|string}) => {
export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);
  // Saved footers predate the developer credit, so fill it from the defaults field by field
  const developer: FooterDeveloper = {
    ...defaultFooter.copyright.developer,
    ...(content.copyright as { developer?: FooterDeveloper } | undefined)?.developer,
  };
  const extras = content as unknown as FooterExtras;
  // Year always comes from the clock so it rolls over without an admin edit
  const copyrightYear = new Date().getFullYear();
  const bottom = {
    brand: extras.bottom?.brand?.trim() || defaultBottom.brand,
    tagline: extras.bottom?.tagline?.trim() || defaultBottom.tagline,
    rights: extras.bottom?.rights?.trim() || defaultBottom.rights,
    links: extras.bottom?.links?.length ? extras.bottom.links : defaultBottom.links,
  };
  const copyrightSegments = [`© ${copyrightYear} ${bottom.brand}`, bottom.tagline, bottom.rights].filter(Boolean);
  const bottomLinks = bottom.links.filter((item) => item?.label && item?.href);
  // Admin footer logo (Pages > Footer > Ensis Logo); bundled logo when none is set
  const footerLogo = (content.company as { ensisLogo?: { imageUrl?: string; alt?: string } })?.ensisLogo;
  // Same logo as the header (admin "layout.header" logo); footer's own admin logo wins, bundled glossy logo is the fallback
  const headerContent = await getComponentContent<{ logo?: { imageUrl?: string; alt?: string } }>("layout.header", {});
  const backendLogoUrl = footerLogo?.imageUrl || headerContent?.logo?.imageUrl;
  const footerLogoSrc = backendLogoUrl ? getImageUrl(backendLogoUrl, 600) : footerLogoImg;
  // Design House logo from the admin (Cloudinary URL); an old relative path would 404, so only absolute URLs count
  const designHouseUrl = extras.company?.designHouselogo?.imageUrl || "";
  const designHouseSrc = /^https?:\/\//i.test(designHouseUrl) ? getImageUrl(designHouseUrl, 600) : designHouseLogo;

  // Offices, phones and email come from Contact page → Get In Touch (single source); bundled design until entries exist
  const getInTouch = await getComponentContent<{ contactDetails?: { id: string; title: string; description: string }[] }>(
    "contact.getInTouch",
    { contactDetails: [] }
  );
  const contactDetails = (getInTouch?.contactDetails ?? []).filter((d) => d?.description?.trim());
  const officeItems = contactDetails.filter((d) => /office/i.test(d.title || ""));
  const offices = officeItems.length
    ? officeItems.map((d) => ({
        key: d.id,
        title: d.title.trim(),
        // The Contact page renders descriptions as HTML, so turn <br> into line breaks and drop other tags
        text: d.description.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "").trim(),
      }))
    : defaultOffices;
  const phoneText = contactDetails.filter((d) => /phone|mobile|call/i.test(d.title || "")).map((d) => d.description).join(", ");
  const callNumbers = splitPhoneNumbers(phoneText || defaultCallNumbers);
  const rawEmailText = contactDetails.find((d) => /e-?mail/i.test(d.title || ""))?.description.trim() || defaultEmail;
  const emailText = rawEmailText.replace(/\s*\([Ee][Nn][Ss][Ii][Ss]\)/g, "").trim();
  const emailAddress = emailText.match(/[^\s()]+@[^\s()]+/)?.[0] || "info@ensis.in";

  const strapItems = features.map((item, i) => ({
    ...item,
    title: extras.strap?.[i]?.title?.trim() || item.title,
    desc: extras.strap?.[i]?.desc?.trim() || item.desc,
    // Uploaded icon (Cloudinary URL); the bundled icon stays until one is uploaded
    iconUrl: extras.strap?.[i]?.iconUrl?.trim() || "",
  }));
  const callUsLabel = extras.callUs?.label?.trim() || "Call Us Today";
  const brandText = extras.brandText?.trim() || defaultBrandText;

  // Link columns (Quick Links, Product Categories, Our Solutions) — admin columns win, bundled design is the fallback
  const navigation: FooterNavSection[] = (extras.footerColumns ?? []).some((col) => col?.links?.length)
    ? (extras.footerColumns as FooterNavSection[])
    : defaultFooter.navigation;

  return (
    <footer className="overflow-hidden bg-white font-medium footer-font">

      {/* ── STRAP + MAIN ── */}
      <div className="relative">
        {/* ── FEATURES STRIP ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#f7e4c8] via-[#fef2e4] to-[#fbe9d3]">
          {/* Right decoration image */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-[140px] bg-no-repeat lg:block"
            style={{
              backgroundImage: `url(${footerStrapRight.src})`,
              backgroundSize: "contain",
              backgroundPosition: "right center",
            }}
          />
          <div className="relative z-[2] grid grid-cols-2 gap-x-2 gap-y-3 px-6 py-2 lg:min-h-[69px] lg:grid-cols-5 lg:items-center lg:gap-0 lg:px-[5%]">
            {strapItems.map((item) => {
              return (
                <div
                  key={item.title}
                  className="relative flex items-center gap-3 lg:px-5 lg:first:pl-0 lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-[62%] lg:after:w-[1.5px] lg:after:-translate-y-1/2 lg:after:bg-[#f59a5c] lg:last:after:hidden"
                >
                  <div className="flex h-[48px] w-[56px] shrink-0 items-center justify-center">
                    {item.iconUrl ? (
                      <Image src={getImageUrl(item.iconUrl, 200)} alt="" aria-hidden width={112} height={96} className="max-h-[48px] w-auto max-w-[56px] object-contain" />
                    ) : (
                      <Image src={item.icon} alt="" aria-hidden style={{ height: item.height, width: "auto" }} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[clamp(13px,0.845vw,17px)] font-semibold leading-[1.4] text-[#11151f]">{item.title}</h4>
                    <p className="text-[clamp(12px,0.79vw,16px)] leading-[1.4] text-[#1c1f26]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAIN SECTION ── */}
        <div className="relative w-full bg-white lg:bg-[#fdf9f5]">
          {/* Mobile / tablet — white background, spa stones bottom-right */}
          <div
            className="absolute inset-0 bg-no-repeat lg:hidden"
            style={{ backgroundImage: `url(${footerRight.src})`, backgroundSize: "35% auto", backgroundPosition: "right bottom" }}
          />
          {/* Desktop — gold curved panel on the left with 3D wavy depth shadow */}
          <div
            className="absolute inset-x-0 top-0 -bottom-0.5 hidden bg-no-repeat transition-all duration-700 lg:block"
            style={{
              backgroundImage: `url(${footerLeft.src})`,
              backgroundSize: "31.5vw 100%",
              backgroundPosition: "left top",
              filter: "drop-shadow(6px 0 16px rgba(60, 35, 5, 0.38)) drop-shadow(14px 0 28px rgba(0, 0, 0, 0.12))",
            }}
          />
          {/* Desktop — spa stones & leaves under features strip, left-positioned with cover size */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-[1] hidden w-[80px] xl:w-[130px] 2xl:w-[170px] bg-no-repeat lg:block"
            style={{
              backgroundImage: `url(${footerRight.src})`,
              backgroundSize: "cover",
              backgroundPosition: "right bottom",
            }}
          />

          <div className="relative z-[2] grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 py-6 lg:min-h-[300px] lg:grid-cols-[28.5%_11.5%_18%_16%_1fr] 2xl:grid-cols-[28.5%_11.5%_18.7%_16.6%_1fr] lg:gap-0 lg:px-0 lg:py-0">

            {/* ── BRAND COL ── */}
            <div className="relative -mx-6 -mt-6 px-6 py-6 sm:col-span-2 lg:col-span-1 lg:m-0 lg:px-0 lg:flex lg:flex-col lg:items-start lg:justify-center lg:py-5 lg:pl-6 xl:pl-[3.5vw] 2xl:pl-[5.3vw] lg:pr-2 xl:pr-[0.8vw] 2xl:pr-[1vw]">
              {/* Mobile / tablet — gold panel image behind the brand block only */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-no-repeat lg:hidden"
                style={{ backgroundImage: `url(${footerLeft.src})`, backgroundSize: "145% auto", backgroundPosition: "left top" }}
              />
              <div>
                <SparkleLogo
                  src={footerLogoSrc}
                  alt={footerLogo?.alt || "ENSIS"}
                  variant="3d"
                  className="h-[84px] w-auto object-contain lg:h-auto lg:w-[min(calc(16.5vw+20px),275px)]"
                />
              </div>

              <p className="mt-3 max-w-[min(100%,26rem)] lg:max-w-none whitespace-normal lg:whitespace-pre text-[13px] xl:text-[14px] text-[#1a1208] [&_*]:leading-[1.3] leading-[1.3] [text-shadow:0_0_2px_#fff,0_0_4px_#fff,0_0_8px_rgba(255,255,255,0.95),0_0_14px_rgba(255,255,255,0.8)]">
                {brandText}
              </p>

              {/* call us today */}
              {(() => {
                const primaryPhoneHref = callNumbers.find((n) => n.href.includes("9654900525"))?.href || "tel:+919654900525";
                return (
                  <div className="mt-5 flex w-full max-w-[16rem] lg:-ml-[25px] items-center gap-[10px] rounded-[clamp(20px,1.6vw,32px)] border-2 border-white bg-[#06214f] py-[6px] pl-[8px] pr-[10px] text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
                    <a
                      href={primaryPhoneHref}
                      aria-label="Call +91 9654900525"
                      className="relative h-[56px] w-[56px] shrink-0 rounded-full bg-[#fbc512] text-[#06214f] transition hover:opacity-90 hover:scale-105"
                    >
                      <MdPhoneInTalk className="absolute inset-[11px] h-[calc(100%-22px)] w-[calc(100%-22px)]" aria-hidden />
                    </a>
                    <div className="min-w-0 flex-1 self-center py-[clamp(5px,0.35vw,8px)]">
                      <p className="text-[14px] font-semibold leading-[1.4] text-[#fbc512]">{callUsLabel}</p>
                      {callNumbers.map((num) => (
                        <a key={num.href} href={num.href} className="block whitespace-nowrap text-[17px] font-medium leading-[1.3] hover:text-[#fbc512]">
                          {num.label}
                        </a>
                      ))}
                    </div>
                    <a
                      href={primaryPhoneHref}
                      aria-label="Call +91 9654900525"
                      className="shrink-0 self-center text-white transition hover:text-[#fbc512] hover:translate-x-0.5"
                    >
                      <ArrowRight strokeWidth={2} className="h-[18px] w-[18px]" />
                    </a>
                  </div>
                );
              })()}
            </div>

            {/* ── NAV COLS ── */}
            {navigation.map((nav: FooterNavSection, i: number) => {
              const Icon = navIcons[i] ?? LinkIcon;
              const color = navIconColors[i] ?? navIconColors[0];
              return (
                <div
                  key={i}
                  className={`relative lg:pb-5 lg:pr-3 xl:pr-6 2xl:pr-7 lg:pt-10 lg:after:absolute lg:after:bottom-[3%] lg:after:right-0 lg:after:top-[6%] lg:after:w-[1.5px] lg:after:bg-[linear-gradient(to_bottom,rgba(198,204,198,0.2)_0%,#c6ccc6_14%,#c6ccc6_100%)] ${i === 0 ? "lg:-ml-[16px] lg:pl-2 xl:pl-3 2xl:pl-4" : "lg:pl-3 xl:pl-4 2xl:pl-4"
                    }`}
                >
                  {/* heading with icon */}
                  <div className="mb-[clamp(6px,0.6vw,12px)] flex items-center gap-2 xl:gap-[clamp(10px,0.9vw,16px)]">
                    <div className={`flex h-[clamp(32px,2.9vw,56px)] w-[clamp(32px,2.9vw,56px)] shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`}>
                      <Icon className="h-[54%] w-[54%]" strokeWidth={1.9} />
                    </div>
                    <h3 className="whitespace-nowrap text-[13.5px] xl:text-[clamp(14px,0.95vw,20px)] font-extrabold uppercase leading-tight text-[#0b2ec4]">
                      {nav.title}
                    </h3>
                  </div>
                  <div className="mb-[clamp(12px,1.1vw,22px)] h-[2.5px] w-[clamp(32px,2.9vw,56px)] bg-[linear-gradient(90deg,#e4401e_0%,#f5a623_28%,#8cc43c_55%,#12a39a_78%,#1f4fc0_100%)]" />

                  <ul className="space-y-[3px]">
                    {nav.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 xl:gap-2 text-[13px] xl:text-[clamp(12px,0.85vw,19px)] leading-[21px] xl:leading-[clamp(21px,calc(1.5vw+0.5px),31px)] text-[#1237a0] transition hover:text-[#f47a1f]"
                        >
                          <ChevronRight size={14} strokeWidth={3.5} className="shrink-0 text-[#f47a1f] xl:hidden" />
                          <ChevronRight size={16} strokeWidth={3.5} className="shrink-0 text-[#f47a1f] hidden xl:block" />
                          <span className="2xl:whitespace-nowrap">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* ── CONTACT COL ── */}
            <div className="sm:col-span-2 lg:col-span-1 lg:pb-5 lg:pl-3 xl:pl-5 lg:pr-3 xl:pr-[35px] 2xl:pr-[50px] lg:pt-4">
              <div className="-mt-[28px] -mb-[2px] ml-[calc(clamp(34px,2.6vw,50px)+8px)] xl:ml-[calc(clamp(34px,2.6vw,50px)+10px)] flex justify-start">
                <SparkleLogo
                  src={designHouseSrc}
                  alt="Design House India Pvt. Ltd."
                  fallback={designHouseLogo}
                  variant="3d"
                  width={600}
                  height={311}
                  className="h-auto w-[clamp(150px,12.4vw,240px)] object-contain"
                />
              </div>

              <div className="space-y-[10px]">
                {/* email */}
                <Link href={`mailto:${emailAddress}`} className="flex items-start gap-2 xl:gap-2.5">
                  <div className="flex h-[clamp(34px,2.6vw,50px)] w-[clamp(34px,2.6vw,50px)] shrink-0 items-center justify-center rounded-full border-2 border-[#e8590c]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="h-[clamp(20px,1.67vw,32px)] w-[clamp(20px,1.67vw,32px)] text-[#e8590c]">
                      <rect x="2.5" y="5" width="19" height="14" rx="2" />
                      <path d="M2.8 6.5L12 13.5L21.2 6.5" />
                      <path d="M3 18.3L9.3 12M21 18.3L14.7 12" />
                    </svg>
                  </div>
                  <div className="min-w-0 text-[13px] xl:text-[clamp(12px,0.84vw,18px)] [&_*]:leading-[1.3] text-[#1237a0] hover:text-[#e8590c]">
                    <p className="font-bold text-[#0a2a8c]">Email Us</p>
                    <p>{emailText}</p>
                  </div>
                </Link>

                {/* offices */}
                {offices.map((addr) => (
                  <div key={addr.key} className="flex items-start gap-2 xl:gap-2.5">
                    <div className="flex h-[clamp(34px,2.6vw,50px)] w-[clamp(34px,2.6vw,50px)] shrink-0 items-center justify-center rounded-full border-2 border-[#e8590c]">
                      <FaMapMarkerAlt className="h-[clamp(20px,1.67vw,32px)] w-[clamp(20px,1.67vw,32px)] text-[#e8590c]" />
                    </div>
                    <div className="min-w-0 flex-1 text-[13px] xl:text-[clamp(12px,0.84vw,18px)] text-[#1237a0] [&_*]:leading-[1.3]">
                      <p className="font-bold text-[#0a2a8c]">{addr.title}</p>
                      <p className="whitespace-pre-line">{addr.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── COPYRIGHT BAR ── */}
      <div className="bg-[#0b2250]">
        <div className="relative px-2 md:px-0 2xl:pl-[38px] 2xl:pr-0">
          <div className="flex flex-col items-start justify-between gap-3 pt-[4px] lg:pt-[6px] pb-[8px] px-4 lg:pr-[52px] min-[1380px]:pl-[8px] text-left min-[1380px]:items-center min-[1380px]:px-0 min-[1380px]:flex-row min-[1380px]:text-left min-[1380px]:gap-x-[clamp(10px,1.2vw,60px)]">
            <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-1 whitespace-nowrap text-[clamp(11.5px,0.78vw,16px)] font-medium text-white min-[1380px]:flex-nowrap lg:justify-start">
              {copyrightSegments.map((seg, i) => (
                <React.Fragment key={seg}>
                  {i > 0 && <span aria-hidden className="hidden h-4 w-[2px] bg-white/40 min-[1380px]:block" />}
                  <span>{seg}</span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-3 whitespace-nowrap min-[1380px]:flex-nowrap">
              {/* Admin bottom-bar links (Pages > Footer) */}
              {bottomLinks.map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <span aria-hidden className="hidden h-4 w-[2px] bg-white/40 min-[1380px]:block" />}
                  <Link href={item.href} className="text-[clamp(11.5px,0.78vw,16px)] font-medium text-white transition hover:text-white">
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}

              {developer.name && (
                <>
                  <span aria-hidden className="hidden h-4 w-[2px] bg-white/40 min-[1380px]:block" />
                  <span className="flex items-center gap-1 text-[clamp(11.5px,0.78vw,16px)] font-medium text-white">
                    {developer.label}:
                    <a
                      href={developer.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={developer.name}
                      className={`inline-flex h-[30px] min-[1380px]:h-[clamp(40px,2.9vw,56px)] shrink-0 items-center overflow-hidden rounded-md transition-opacity hover:opacity-90 ${developer.logoUrl ? "" : "bg-[#e4141e] px-[clamp(10px,0.9vw,18px)]"}`}
                    >
                      {developer.logoUrl ? (
                        // The logo carries its own red background, so it fills the badge edge to edge
                        <Image src={getImageUrl(developer.logoUrl, 400)} alt={developer.name} width={190} height={50} className="h-[30px] min-[1380px]:h-[clamp(40px,2.9vw,56px)] w-auto object-contain" />
                      ) : (
                        <span className="text-[clamp(14px,0.85vw,17px)] font-medium text-white">{developer.name} Pvt. Ltd.</span>
                      )}
                    </a>
                  </span>
                </>
              )}

              <BackToTop />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};