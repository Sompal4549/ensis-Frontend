import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Sprout,
  Headphones,
  BadgeCheck,
  Truck,
  ArrowRight,
  Link2,
  LayoutGrid,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import { Container } from '../ui/Container';
import logoImg from '@/assets/logo.webp';
import GlowLogo from './GlowLogo';
import SparkleLogo from './SparkleLogo';
import { getComponentContent, socialApi, categoryApi } from '@/lib/api/api';
import type { IconType } from "react-icons";
import SocialIconLink from './SocialLink';
import footerTop2 from "@/assets/footer-top2.webp"
import footerBottom from "@/assets/footer-bottom.webp"
import arrow from "@/assets/icons/arrow.png"
import HtmlRenderer from './HtmlRender';

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
  };
}
const iconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  x: FaTwitter,
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
        { "label": "About Us", "href": "/about" },
        { "label": "Products", "href": "/products" },
        { "label": "Turnkey Solutions", "href": "/turnkey-solutions" },
        { "label": "Projects", "href": "/projects" },
        { "label": "Blog", "href": "/blog" },
        { "label": "Contact Us", "href": "/contact-us" }
      ]
    },
    {
      "title": "Product Categories",
      "links": [
        { "label": "Panchkarma Beds", "href": "/products/panchkarma-beds" },
        { "label": "Spa Massage Tables", "href": "/products/spa-massage-tables" },
        { "label": "Steam Chambers", "href": "/products/steam-chambers" },
        { "label": "Sauna Systems", "href": "/products/sauna-systems" },
        { "label": "Bronze Accessories", "href": "/products/bronze-accessories" },
        { "label": "Spa Furniture", "href": "/products/spa-furniture" },
        { "label": "Steam Generators", "href": "/products/steam-generators" },
        { "label": "Yoga & Wellness", "href": "/products/yoga-wellness" }
      ]
    },
    {
      "title": "Our Solutions",
      "links": [
        { "label": "Panchkarma Clinic Setup", "href": "/solutions/panchkarma-clinic-setup" },
        { "label": "Resort & Spa Setup", "href": "/solutions/resort-spa-setup" },
        { "label": "Wellness Retreat Design", "href": "/solutions/wellness-retreat-design" },
        { "label": "Ayurveda Hospital Setup", "href": "/solutions/ayurveda-hospital-setup" },
        { "label": "Interior & Equipment Integration", "href": "/solutions/interior-equipment-integration" }
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
    "text": "© 2026 Ensis Panchkarma & Spa Solutions. All Rights Reserved.",
    "links": [
      { "label": "Privacy Policy", "href": "/privacy-policy" },
      { "label": "Terms & Conditions", "href": "/terms-and-conditions" }
    ]
  }
};

const navIcons = [Link2, LayoutGrid, Lightbulb];
const navIconColors = [
  { bg: "bg-[#0f7b6e]", text: "text-white" },
  { bg: "bg-[#2e7d32]", text: "text-white" },
  { bg: "bg-[#5c3d8f]", text: "text-white" },
];

const features = [
  { title: "PREMIUM QUALITY", desc: "Durable & Reliable Products", icon: ShieldCheck, color: "text-[#d0a965]", border: "border-[#d0a965]/40" },
  { title: "AYURVEDIC EXPERTISE", desc: "Rooted in Ancient Wisdom", icon: Sprout, color: "text-[#8ac53f]", border: "border-[#8ac53f]/40" },
  { title: "END TO END SUPPORT", desc: "From Planning to Installation", icon: Headphones, color: "text-[#5da7ff]", border: "border-[#5da7ff]/40" },
  { title: "CUSTOMIZED SOLUTIONS", desc: "Tailored For Your Unique Needs", icon: BadgeCheck, color: "text-[#d057ff]", border: "border-[#d057ff]/40" },
  { title: "PAN INDIA SERVICE", desc: "Delivering Wellness Across India", icon: Truck, color: "text-[#d0a965]", border: "border-[#d0a965]/40" },
];

// export const Footer = async ({image:StaticImageData|string}) => {
export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);
  const socialLinks = (await socialApi.getLinks())
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);
  let apiCategories: any[] = [];
  try {
    apiCategories = await categoryApi.list();
  } catch (e) {
    console.error("Failed to fetch categories for footer", e);
  }
    const categoryLinks = apiCategories.slice(0, 5).map((cat: any) => ({
    label: cat.name,
    href: `/products?category=${cat.slug}`,
  }));
 const navigation = content.navigation.map((nav: FooterNavSection) =>
  nav.title === "Product Categories" && categoryLinks.length > 0
    ? { ...nav, links: categoryLinks }
    : nav
);

  return (
    <footer className="overflow-hidden bg-white">

      {/* ── MAIN SECTION ── full-width bg image */}
      <div
        className="relative w-full bg-no-repeat bg-[#f8f6f2] md:bg-[100%] bg-contain md:bg-cover bg-[bottom] md:bg-[left]"
      >
         <div
    className="absolute inset-0 md:hidden bg-no-repeat"
    style={{
      // backgroundImage: `url(${image.src})`,
        backgroundImage: `url(${footerTop2.src}), url(${footerTop2.src})`,
      backgroundSize: "auto 100%, auto 100%",
      backgroundPosition: "left top, right bottom",
    }}
  />
  {/* Normal bg image — desktop */}
  <div
    className="absolute inset-0 hidden md:block bg-no-repeat"
    style={{
      // backgroundImage: `url(${image.src})`,
      backgroundImage: `url(${footerTop2.src})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center left",
    }}
  />
        {/* subtle overlay so text stays readable */}

        <Container className="relative z-10 pt-8 pb-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">

            {/* ── BRAND COL ── */}
            <div>

            <div className="flex flex-col items-center w-[75%]">

                <SparkleLogo src={logoImg} alt="ENSIS" className="h-16 w-auto" />

              {/* lotus divider */}
              <div className="my-2 flex items-center gap-4">
               <Image src={arrow} alt='arrow' width={150} height={8} />
              </div>

              <HtmlRenderer content={content.company.description} className="text-[12px] leading-4 text-white text-center">
                
              </HtmlRenderer>

              {/* social icons */}
              <div className="mt-3 flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = iconMap[social.platform.toLowerCase()];
                  if (!Icon) return null;
                  return (
                    <SocialIconLink
                      key={social._id}
                      href={social.url}
                      platform={social.platform}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#d0a965] md:text-white transition hover:bg-[#0f2e22] hover:text-white"
                    >
                      <Icon size={14} />
                    </SocialIconLink>
                  );
                })}
              </div>
            </div>
</div>
            {/* ── NAV COLS ── */}
 {navigation.map((nav, i) => {
              const Icon = navIcons[i] ?? Link2;
              const color = navIconColors[i] ?? navIconColors[0];
              return (
                <div key={i} className='border-r-1 border-gray-300 pr-2'>
                  {/* heading with icon */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color.bg} ${color.text}`}>
                      <Icon size={14} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white md:text-[#122544]">
                      {nav.title}
                    </h3>
                  </div>

                  {/* gold underline */}
                  <div className="mb-2 h-[2px] w-8 bg-[#d0a965]" />

                  <ul className="space-y-[4px]">
                    {nav.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex font-medium items-center gap-1 text-xs text-white md:text-[#24334c] transition hover:text-[#d0a965]"
                        >
                          <ChevronRight size={12} className="shrink-0 text-white md:text-[#d0a965] font-semibold" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {/* ── CONTACT COL ── */}
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d0a965] text-white">
                  <Phone size={14} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white md:text-[#122544]">
                  Contact Us
                </h3>
              </div>

              <div className="mb-2 h-[2px] w-8 bg-[#d0a965]" />

              <div className="space-y-2">
                {/* address */}
                <div className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d0a965]">
                    <MapPin size={14} className="text-[#d0a965]" />
                  </div>
                  <p className="text-xs leading-4 text-white md:text-[#24334c] font-semibold">
                    {content.contact.address}
                  </p>
                </div>

                {/* phone */}
                <Link href={`tel:${content.contact.phone}`} className="flex items-center gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d0a965]">
                    <Phone size={14} className="text-[#d0a965]" />
                  </div>
                  <span className="text-xs text-white md:text-[#24334c] hover:text-[#d0a965] font-semibold">
                    {content.contact.phone}
                  </span>
                </Link>

                {/* email */}
                <Link href={`mailto:${content.contact.email}`} className="flex items-center gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d0a965]">
                    <Mail size={14} className="text-[#d0a965]" />
                  </div>
                  <span className="text-xs text-white md:text-[#24334c] hover:text-[#d0a965] font-semibold">
                    {content.contact.email}
                  </span>
                </Link>

                {/* WhatsApp CTA */}
                <Link
                  href={`https://wa.me/${content.contact.whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-between gap-4 rounded-lg bg-[#0f7b3e] px-3 py-2 text-white transition hover:bg-[#0a5e2f]"
                >
                  <div className="flex items-center gap-4 text-white">
                    <FaWhatsapp size={18} color="white" />
                    <div>
                      <p className="text-xs font-bold leading-tight text-white">WHATSAPP CHAT</p>
                      <p className="text-[11px] text-white/80 font-semibold">Chat with our experts</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="white" />
                </Link>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* ── FEATURES STRIP ── */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: `url(${footerBottom.src})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
        }}
      >
        <Container className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-5 py-1 gap-1">
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 md:border-r-2 border-white/10 px-2 md:px-3 py-0 last:border-r-0"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${item.border} ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className={`${item.color} text-[10px] font-bold leading-tight`}>{item.title}</h4>
                    <p className="mt-0.5 text-[11px] text-white/80">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>

      {/* ── COPYRIGHT BAR ── */}
      <div className="px-0 md:px-8">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-2 md:flex-row">
            <p className="text-[12px] text-white/70">{content.copyright.text}</p>

            {/* lotus center */}
            <div className="hidden items-center gap-4 md:flex">
                <Image src={arrow} alt='arrow' width={150} height={8} />
            </div>

            <div className="flex gap-4">
              {content.copyright.links.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12px] text-white/70 transition hover:text-white"
                >
                  <span className='text-white'>

                  {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
      </div>


    </footer>
  );
};