import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  ArrowRight,
  Link2,
  LayoutGrid,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaWhatsapp, FaTwitter, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Container } from '../ui/Container';
import BackToTop from './BackToTop';
import logoImg from '@/assets/logo.webp';
import GlowLogo from './GlowLogo';
import SparkleLogo from './SparkleLogo';
import { getComponentContent, getImageUrl, socialApi } from '@/lib/api/api';
import type { IconType } from "react-icons";
import SocialIconLink from './SocialLink';
import footerLeft from "@/assets/footer/left.png"
import footerRight from "@/assets/footer/right.png"
import footerStrapRight from "@/assets/footer/strap_right.png"
import footerLogoImg from "@/assets/footer/Ensys Wellness Furniture Logo.png"
import arrow from "@/assets/icons/arrow.png"
import HtmlRenderer from './HtmlRender';
import { splitPhoneNumbers } from '@/lib/phone';
import { LeafIcon, SproutIcon, GearIcon, DiamondIcon, TruckIcon } from './StrapIcons';

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

/** "Designed & Developed by" credit in the copyright bar; logoUrl replaces the text badge */
interface FooterDeveloper {
  label?: string;
  name?: string;
  href?: string;
  logoUrl?: string;
}
const iconMap: Record<string, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  x: FaTwitter,
};

// Footer icon order as designed: Facebook, LinkedIn, Instagram, YouTube, Twitter/X
const SOCIAL_ORDER = ["facebook", "linkedin", "instagram", "youtube", "twitter", "x", "whatsapp"];
const socialRank = (platform: string) => {
  const i = SOCIAL_ORDER.indexOf((platform || "").toLowerCase());
  return i === -1 ? SOCIAL_ORDER.length : i;
};

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
        { "label": "Products", "href": "/products" },
        { "label": "Turnkey Solutions", "href": "/turnkey" },
        { "label": "Projects", "href": "/projects-and-clients" },
        { "label": "Blog", "href": "/blog" },
        { "label": "Enquiry", "href": "/enquiry" },
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
        { "label": "Accessories & Consumables", "href": "/products" }
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
        { "label": "Consultancy & Support", "href": "/consultancy" }
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

/** The head office address is laid out as in the approved footer design (company line + 3 address lines) */
function formatOfficeAddress(text: string): string {
  if (/loni/i.test(text) && /mohan\s*nagar/i.test(text) && /201007/.test(text)) {
    return "Design House India Pvt. Ltd.\n12/29, Site–II, Loni Road,\nIndustrial Area, Mohan Nagar – 201007,\nGhaziabad, Uttar Pradesh, India";
  }
  return text;
}

const navIcons = [Link2, LayoutGrid, Lightbulb];
const navIconColors = [
  { bg: "bg-[#0f7b6e]", text: "text-white" },
  { bg: "bg-[#2e7d32]", text: "text-white" },
  { bg: "bg-[#5c3d8f]", text: "text-white" },
];

const features = [
  { title: "Premium Quality", desc: "Durable & Reliable Products", icon: LeafIcon, color: "text-[#bd7a1c]" },
  { title: "Ayurvedic Expertise", desc: "Rooted in Ancient Wisdom", icon: SproutIcon, color: "text-[#c9971c]" },
  { title: "End to End Support", desc: "From Planning to Installation", icon: GearIcon, color: "text-[#c28625]" },
  { title: "Customized Solutions", desc: "Tailored For Your Unique Needs", icon: DiamondIcon, color: "text-[#c28625]" },
  { title: "Pan India Service", desc: "Delivering Wellness Across India", icon: TruckIcon, color: "text-[#c28625]" },
];

// export const Footer = async ({image:StaticImageData|string}) => {
export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);
  // Saved footers predate the developer credit, so fill it from the defaults field by field
  const developer: FooterDeveloper = {
    ...defaultFooter.copyright.developer,
    ...(content.copyright as { developer?: FooterDeveloper } | undefined)?.developer,
  };
  // Year always comes from the clock so it rolls over without an admin edit
  const copyrightYear = new Date().getFullYear();
  const copyrightSegments = [
    `© ${copyrightYear} ENSIS - Panchkarma & Spa Solutions`,
    "A Brand of Design House India Pvt. Ltd.",
    "All Rights Reserved.",
  ];
  // Contact page "Get In Touch" details (Our Address / Phone Number) are the single source for the footer contact column
  const getInTouch = await getComponentContent<{ contactDetails?: { id: string; title: string; description: string }[] }>(
    "contact.getInTouch",
    { contactDetails: [] }
  );
  const contactDetails = (getInTouch?.contactDetails ?? []).filter((d) => d?.description?.trim());
  const addressItems = contactDetails.filter((d) => /address|office/i.test(d.title || ""));
  // Line breaks match the design: "…Ayurvedic, / Spa & Wellness equipments. / Crafting premium solutions for a / healthier & better tomorrow."
  const brandDescription = (content.company.description || "")
    .replace(/(Ayurvedic,)\s+/i, "$1<br/>")
    .replace(/(equipments\.)\s+/i, "$1<br/>")
    .replace(/(solutions for a)\s+/i, "$1<br/>");
  // A generic "Our Address" is the head office; a branch office is appended until one is added to the contact page
  const offices: { key: string; title: string; text: string }[] =
    addressItems.length > 0
      ? addressItems.map((d) => ({
          key: d.id,
          title: /^\s*our\s+address\s*$/i.test(d.title) ? "Head Office" : d.title.trim(),
          text: formatOfficeAddress(d.description),
        }))
      : [{ key: "head-office", title: "Head Office", text: formatOfficeAddress(content.contact.address) }];
  if (!offices.some((o) => /branch/i.test(o.title))) {
    offices.push({
      key: "branch-office",
      title: "Branch Office",
      text: "5076, Wakanpada, Nalasopara East,\nVasai-Virar, Maharashtra 401208, India",
    });
  }
  const phoneItems = contactDetails.filter((d) => /phone|mobile|call/i.test(d.title || ""));
  const emailItems = contactDetails.filter((d) => /e-?mail/i.test(d.title || ""));
  // Privacy/Terms are rendered as fixed links in the bar, so drop any copies saved in layout.footer
  const copyrightLinks = (content.copyright.links ?? []).filter(
    (item) => !/privacy|terms|conditions/i.test(item.label || "")
  );
  if (!copyrightLinks.some((item) => /sitemap/i.test(item.label || ""))) {
    copyrightLinks.unshift({ label: "Sitemap", href: "/sitemap.xml" });
  }
  // Admin footer logo (Pages > Footer > Ensis Logo); bundled logo when none is set
  const footerLogo = (content.company as { ensisLogo?: { imageUrl?: string; alt?: string } })?.ensisLogo;
  // The footer sits on the gold panel, so it uses the bundled glossy logo (transparent PNG with white tagline)
  const footerLogoSrc = footerLogoImg;
  const socialLinks = (await socialApi.getLinks())
    .filter((item) => item.isActive)
    .sort((a, b) => socialRank(a.platform) - socialRank(b.platform) || a.order - b.order);
  // ── 8 OFFICIAL PRODUCT CATEGORIES (STATIC FOR PRODUCTION) ──
  // Static list ensures categories always render reliably on live deployment
  const staticProductCategories: FooterNavLink[] = [
    { label: "Panchkarma Tables & Equipment", href: "/products" },
    { label: "Ayurveda Therapy Equipment", href: "/products" },
    { label: "Spa & Wellness Furniture", href: "/products" },
    { label: "Hydrotherapy Equipment", href: "/products" },
    { label: "Massage & Treatment Tables", href: "/products" },
    { label: "Consultation & Examination Furniture", href: "/products" },
    { label: "Hospitality & Resort Spa Setup", href: "/products" },
    { label: "Accessories & Consumables", href: "/products" },
  ];

  /*
  // ── DYNAMIC CATEGORIES LOADER (Uncomment later to load categories dynamically from backend API) ──
  // let dynamicCategories: FooterNavLink[] = [];
  // try {
  //   const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
  //   if (res.ok) {
  //     const data = await res.json();
  //     const list = data?.data || data || [];
  //     if (Array.isArray(list) && list.length > 0) {
  //       dynamicCategories = list
  //         .filter((c: any) => c.isActive !== false)
  //         .map((c: any) => ({
  //           label: c.name,
  //           href: "/products",
  //         }));
  //     }
  //   }
  // } catch (err) {
  //   console.warn("Failed to load dynamic footer categories:", err);
  // }
  */

  // Columns follow the approved footer design exactly (Quick Links, Product Categories, Our Solutions)
  const navigation: FooterNavSection[] = [
    defaultFooter.navigation[0], // Quick Links
    {
      title: "Product Categories",
      links: staticProductCategories,
    },
    defaultFooter.navigation[2], // Our Solutions
  ];

  return (
    <footer className="overflow-hidden bg-white">

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
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative flex items-center gap-3 lg:px-5 lg:first:pl-0 lg:after:absolute lg:after:right-0 lg:after:top-1/2 lg:after:h-9 lg:after:w-px lg:after:-translate-y-1/2 lg:after:bg-[#dfcfad] lg:last:after:hidden"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${item.color}`}>
                    <Icon className="h-10 w-10" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold leading-[1.4] text-[#11151f]">{item.title}</h4>
                    <p className="text-[13px] leading-[1.4] text-[#1c1f26]">{item.desc}</p>
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
              backgroundSize: "26.5vw 100%",
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
              backgroundPosition: "left bottom",
            }}
          />

          <div className="relative z-[2] grid grid-cols-1 gap-6 px-6 py-6 lg:min-h-[300px] lg:grid-cols-[24%_13%_20%_15.5%_1fr] lg:gap-0 lg:px-0 lg:py-0">

            {/* ── BRAND COL ── */}
            <div className="relative -mx-6 -mt-6 px-6 py-6 lg:m-0 lg:px-0 lg:flex lg:flex-col lg:items-start lg:justify-center lg:py-5 lg:pl-6 xl:pl-[3.5vw] 2xl:pl-[5.3vw] lg:pr-2 xl:pr-[2vw] 2xl:pr-[3vw]">
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
                  className="h-[84px] w-auto object-contain lg:h-auto lg:w-[min(16.5vw,255px)]"
                />
              </div>

              <HtmlRenderer content={brandDescription} className="mt-3 max-w-[17rem] text-[13px] xl:text-[14px] text-[#fff6d6]/75 [&_*]:leading-[1.3]">
              </HtmlRenderer>

              {/* social icons */}
              <div className="mt-4 flex flex-wrap gap-1.5 xl:gap-2.5 2xl:gap-3">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.platform.toLowerCase()];
                  if (!Icon) return null;
                  return (
                    <SocialIconLink
                      key={social._id}
                      href={social.url}
                      platform={social.platform}
                      className="flex h-7 w-7 xl:h-8 xl:w-8 2xl:h-9 2xl:w-9 items-center justify-center rounded-full border border-white text-white transition hover:bg-[#0f2e22] hover:text-white"
                    >
                      <Icon size={14} />
                    </SocialIconLink>
                  );
                })}
              </div>
            </div>

            {/* ── NAV COLS ── */}
            {navigation.map((nav: FooterNavSection, i: number) => {
              const Icon = navIcons[i] ?? Link2;
              const color = navIconColors[i] ?? navIconColors[0];
              return (
                <div
                  key={i}
                  className={`relative lg:pb-5 lg:pr-3 xl:pr-5 lg:pt-10 lg:after:absolute lg:after:bottom-5 lg:after:right-0 lg:after:top-10 lg:after:w-px lg:after:bg-[#e4dac7] ${
                    i === 0 ? "lg:pl-2 xl:pl-3 2xl:pl-4" : "lg:pl-3 xl:pl-5 2xl:pl-6"
                  }`}
                >
                  {/* heading with icon */}
                  <div className="mb-2 flex items-center gap-2 xl:gap-3">
                    <div className={`flex h-7 w-7 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`}>
                      <Icon size={14} className="xl:hidden" />
                      <Icon size={15} className="hidden xl:block" />
                    </div>
                    <h3 className="whitespace-nowrap text-[13.5px] xl:text-[15px] font-bold uppercase leading-tight text-[#06143e]">
                      {nav.title}
                    </h3>
                  </div>
                  <div className="mb-4 h-px w-8 bg-[#c8922a]" />

                  <ul className="space-y-[3px]">
                    {nav.links.map((link) => (
                      <li key={`${link.href}-${link.label}`}>
                        <Link
                          href={link.href}
                          className="flex items-start gap-1.5 xl:gap-2 text-[13px] xl:text-[14px] leading-[21px] xl:leading-[22px] text-[#0b1733] transition hover:text-[#d0a965]"
                        >
                          <ChevronRight size={13} strokeWidth={3} className="mt-[4px] shrink-0 text-[#c09540] xl:hidden" />
                          <ChevronRight size={14} strokeWidth={3} className="mt-[4px] shrink-0 text-[#c09540] hidden xl:block" />
                          {link.label === "Interior & Equipment Integration" ? (
                            <span className="leading-[17px] xl:leading-[18px]">
                              Interior &amp; Equipment <br className="hidden lg:inline" />
                              Integration
                            </span>
                          ) : (
                            <span className="whitespace-nowrap">{link.label}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* ── CONTACT COL ── */}
            <div className="lg:pb-5 lg:pl-3 xl:pl-5 lg:pr-3 xl:pr-[35px] 2xl:pr-[50px] lg:pt-10">
              <div className="mb-2 flex items-center gap-2 xl:gap-3">
                <div className="flex h-7 w-7 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full bg-[#c8922a] text-white">
                  <FaPhoneAlt size={12} className="xl:hidden" />
                  <FaPhoneAlt size={13} className="hidden xl:block" />
                </div>
                <h3 className="whitespace-nowrap text-[13.5px] xl:text-[15px] font-bold uppercase text-[#06143e]">
                  Contact Us
                </h3>
              </div>
              <div className="mb-2.5 h-px w-9 bg-[#c8922a]" />

              <div className="space-y-1.5">
                {/* address(es) — same as contact page; falls back to footer content when none */}
                {offices.map((addr, idx) => (
                  <div key={addr.key} className="flex gap-2 xl:gap-2.5">
                    <div className="flex h-7 w-7 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#c8922a]">
                      <FaMapMarkerAlt size={13} className="text-[#c8922a]" />
                    </div>
                    <div className={`min-w-0 flex-1 text-[13px] xl:text-[14px] text-[#0b1733] [&_*]:leading-[1.3] ${idx < offices.length - 1 ? "border-b border-[#e4dac7] pb-1.5" : ""}`}>
                      {addr.title && <p className="font-bold text-[13px] xl:text-[14px] text-[#06143e]">{addr.title}</p>}
                      <p className="whitespace-pre-line text-[13px] xl:text-[14px] leading-[1.3] text-[#0b1733]">{addr.text}</p>
                    </div>
                  </div>
                ))}

                {/* phone */}
                {(phoneItems.length > 0
                  ? phoneItems.map((d) => ({ key: d.id, text: d.description.trim() }))
                  : [{ key: "phone", text: content.contact.phone }]
                ).map((ph) => (
                  <div key={ph.key} className="flex items-center gap-2 xl:gap-2.5">
                    <div className="flex h-7 w-7 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#c8922a]">
                      <FaPhoneAlt size={12} className="text-[#c8922a]" />
                    </div>
                    {/* every number is its own tel: link, so tapping either one dials it on mobile */}
                    <span className="text-[13px] xl:text-[14px] font-bold leading-tight text-[#06143e]">
                      {splitPhoneNumbers(ph.text).map((num, i) => (
                        <React.Fragment key={num.href}>
                          {i > 0 && ", "}
                          <a href={num.href} className="hover:text-[#d0a965]">{num.label}</a>
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}

                {/* email */}
                {(emailItems.length > 0 ? emailItems[0].description.trim() : content.contact.email) && (() => {
                  const email = emailItems.length > 0 ? emailItems[0].description.trim() : content.contact.email;
                  return (
                    <Link href={`mailto:${email}`} className="flex items-center gap-2 xl:gap-2.5">
                      <div className="flex h-7 w-7 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#c8922a]">
                        <Mail size={13} strokeWidth={1.6} className="text-[#c8922a]" />
                      </div>
                      <span className="text-[13px] xl:text-[14px] font-semibold text-[#06143e] hover:text-[#d0a965]">
                        {email}
                      </span>
                    </Link>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── COPYRIGHT BAR ── */}
      <div className="bg-[#001931]">
        <div className="relative px-6 lg:px-[38px]">
          <div className="flex flex-col items-center justify-between gap-3 py-3 text-center min-[1500px]:flex-row min-[1500px]:text-left">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 whitespace-nowrap text-sm font-light text-white/80 min-[1500px]:flex-nowrap lg:justify-start">
              {copyrightSegments.map((seg, i) => (
                <React.Fragment key={seg}>
                  {i > 0 && <span aria-hidden className="h-4 w-px bg-white/25" />}
                  <span>{seg}</span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 whitespace-nowrap min-[1500px]:flex-nowrap">
              {/* Sitemap (and any other admin links) first, then the fixed Privacy/Terms links */}
              {[...copyrightLinks, { label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms & Conditions", href: "/terms-and-conditions" }].map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <span aria-hidden className="h-4 w-px bg-white/25" />}
                  <Link href={item.href} className="text-sm font-light text-white/80 transition hover:text-white">
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}

              {developer.name && (
                <>
                  <span aria-hidden className="hidden h-4 w-px bg-white/25 sm:block" />
                  <span className="flex items-center gap-3 text-sm font-light text-white/80">
                    {developer.label}
                    <a
                      href={developer.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={developer.name}
                      className={`inline-flex h-[38px] items-center overflow-hidden rounded-md transition-opacity hover:opacity-90 ${developer.logoUrl ? "" : "bg-[#e4141e] px-2.5"}`}
                    >
                      {developer.logoUrl ? (
                        // The logo carries its own red background, so it fills the badge edge to edge
                        <Image src={getImageUrl(developer.logoUrl, 400)} alt={developer.name} width={190} height={50} className="h-[38px] w-auto object-contain" />
                      ) : (
                        <span className="flex items-baseline gap-1 text-white">
                          <span className="text-[19px] font-semibold tracking-tight">{developer.name}</span>
                          <span className="text-[8px] font-medium opacity-90">Pvt. Ltd.</span>
                        </span>
                      )}
                    </a>
                  </span>
                </>
              )}

              <div className="min-[1500px]:absolute min-[1500px]:right-1 min-[1500px]:top-1/2 min-[1500px]:-translate-y-1/2 min-[1500px]:[&>button]:size-7"><BackToTop /></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};