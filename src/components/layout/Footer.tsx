import React from 'react';
import { getComponentContent, getImageUrl } from '@/lib/api/api';
import FooterView, { FooterNavSection, FooterNavLink } from './FooterView';
import footerLogoImg from "@/assets/footer/Ensys Wellness Furniture Logo.webp";
import designHouseLogo from "@/assets/icons/design_house.webp";

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
  company: {
    name: "Design House India Pvt. Ltd.",
    description:
      "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
    socialLinks: [],
    maplink: "",
  },
  navigation: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about-us" },
        { label: "Products", href: "/products" },
        { label: "Turnkey Solutions", href: "/turnkey" },
        { label: "Projects", href: "/projects-and-clients" },
        { label: "Blog", href: "/blog" },
        { label: "Enquiry", href: "/contact#enquiry" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Product Categories",
      links: [
        { label: "Panchkarma Tables & Equipment", href: "/products" },
        { label: "Ayurveda Therapy Equipment", href: "/products" },
        { label: "Spa & Wellness Furniture", href: "/products" },
        { label: "Hydrotherapy Equipment", href: "/products" },
        { label: "Massage & Treatment Tables", href: "/products" },
        { label: "Consultation & Examination Furniture", href: "/products" },
        { label: "Hospitality & Resort Spa Setup", href: "/products" },
        { label: "Accessories & Consumables", href: "/products" },
      ],
    },
    {
      title: "Our Solutions",
      links: [
        { label: "Panchkarma Clinic Setup", href: "/solutions/panchkarma-clinic-setup" },
        { label: "Resort & Spa Setup", href: "/solutions/resort-spa-setup" },
        { label: "Wellness Retreat Design", href: "/solutions/wellness-retreat-design" },
        { label: "Ayurveda Hospital Setup", href: "/solutions/ayurveda-hospital-setup" },
        { label: "Interior & Equipment Integration", href: "/solutions/interior-equipment-integration" },
        { label: "Customised Solutions", href: "/turnkey" },
        { label: "Turnkey Project Execution", href: "/turnkey" },
        { label: "Consultancy & Support", href: "/consultancy" },
      ],
    },
  ],
  contact: {
    address: "12/29, Site-II, Loni Road, Industrial Area, Mohan Nagar - 201007, India, Uttar Pradesh, India",
    phone: "+91 9654900525",
    email: "info@ensis.in",
    whatsappPhone: "+919654900525",
  },
  copyright: {
    text: "© 2026 Design House India Pvt. Ltd. All rights reserved.",
    links: [
      { label: "Sitemap", href: "/sitemap.xml" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    developer: {
      label: "Designed & Developed by :",
      name: "enCodency",
      href: "https://encodency.com",
      logoUrl: "",
    },
  },
};



import encodencyLogoImg from "@/assets/footer/encodency-logo.jpg";

const defaultFeatures = [
  { title: "Premium Quality", desc: "Durable & Reliable Products" },
  { title: "Ayurvedic Expertise", desc: "Rooted in Ancient Wisdom" },
  { title: "End to End Support", desc: "From Planning to Installation" },
  { title: "Customized Solutions", desc: "Tailored For Your Unique Needs" },
  { title: "Pan India Service", desc: "Delivering Wellness Across India" },
];

export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);
  const rawDeveloper = (content.copyright as { developer?: FooterDeveloper } | undefined)?.developer
    || (content as unknown as { developer?: FooterDeveloper })?.developer;

  const rawLogoUrl = rawDeveloper?.logoUrl;
  const devLogoString = typeof rawLogoUrl === "string"
    ? rawLogoUrl.trim()
    : (rawLogoUrl as unknown as { imageUrl?: string })?.imageUrl?.trim() || "";

  const developer: FooterDeveloper = {
    ...defaultFooter.copyright.developer,
    ...rawDeveloper,
    logoUrl: devLogoString || defaultFooter.copyright.developer.logoUrl,
  };
  const extras = content as unknown as FooterExtras;
  const copyrightYear = new Date().getFullYear();

  // Admin footer logo; bundled logo when none is set
  const footerLogo = (content.company as { ensisLogo?: { imageUrl?: string; alt?: string } })?.ensisLogo;
  const headerContent = await getComponentContent<{ logo?: { imageUrl?: string; alt?: string } }>("layout.header", {});
  const backendLogoUrl = footerLogo?.imageUrl || headerContent?.logo?.imageUrl;
  const footerLogoSrc = backendLogoUrl ? getImageUrl(backendLogoUrl, 600) : footerLogoImg;

  // Design House logo from the admin (Cloudinary URL); bundled logo fallback
  const designHouseUrl = extras.company?.designHouselogo?.imageUrl || "";
  const designHouseSrc = /^https?:\/\//i.test(designHouseUrl) ? getImageUrl(designHouseUrl, 600) : designHouseLogo;

  // Developer logo: uploaded logo or fallback to bundled encodency logo
  const developerLogoSrc = devLogoString ? getImageUrl(devLogoString, 400) : encodencyLogoImg;

  const strapItems = defaultFeatures.map((item, i) => ({
    ...item,
    title: extras.strap?.[i]?.title?.trim() || item.title,
    desc: extras.strap?.[i]?.desc?.trim() || item.desc,
    iconUrl: extras.strap?.[i]?.iconUrl?.trim() || "",
  }));

  return (
    <FooterView
      footerLogoSrc={footerLogoSrc}
      designHouseSrc={designHouseSrc}
      developerLogoSrc={developerLogoSrc}
      developer={developer}
      strapItems={strapItems}
      copyrightYear={copyrightYear}
    />
  );
};