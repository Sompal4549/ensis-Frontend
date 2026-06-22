"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { Calendar, Clock, Tag, Flower2 } from "lucide-react";
import { Container } from "../ui/Container";
import bgImage from "@/assets/career/blog_detail.webp"
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BlogHeroBannerContent {
  breadcrumbs: BreadcrumbItem[];
  title: {
    line1: string;
    line2Start: string;
    line2Highlight: string;
  };
  date: string;
  readTime: string;
  category: string;
  bgImage: string|StaticImageData;
}

export const fallbackBlogHeroBanner: BlogHeroBannerContent = {
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "The Power of Panchakarma" },
  ],
  title: {
    line1: "The Power of Panchakarma:",
    line2Start: "Ancient Healing for",
    line2Highlight: "Modern Living",
  },
  date: "May 20, 2024",
  readTime: "6 Min Read",
  category: "Wellness Design",
  bgImage: bgImage,
};

interface BlogHeroBannerProps {
  content?: BlogHeroBannerContent;
}

// BlogDetailBanner.tsx mein
interface BlogHeroBannerProps {
  sectionContent?: BlogHeroBannerContent; // ← content → sectionContent
}

const BlogDetailBanner: React.FC<BlogHeroBannerProps> = ({
  sectionContent = fallbackBlogHeroBanner, // ← content → sectionContent
}) => {
  const { breadcrumbs, title, date, readTime, category, bgImage } = sectionContent;

  return (
    <section className="relative overflow-hidden bg-[#0f2e22]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={title.line1}
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>

      {/* Dark gradient fade, left to right */}
      <div className="absolute inset-0 z-10 w-[68%] bg-gradient-to-r from-[#0f2e22] from-40% via-[#0f2e22]/90 via-70% to-transparent" />

      {/* Decorative lotus line art */}
      {/* <Flower2
        strokeWidth={0.4}
        className="pointer-events-none absolute -bottom-12 left-[26%] z-10 h-72 w-72 text-[#e8c766]/10 md:h-96 md:w-96"
      /> */}

      {/* Content */}
      <Container className="relative z-20 mx-auto px-6 py-8 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/75">
          {breadcrumbs.map((item, idx) => (
            <span key={item.label} className="flex items-center gap-2">
              {idx > 0 && <span className="text-white/40">{">"}</span>}
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-[#C9972A]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white/90">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="max-w-xl font-serif leading-snug text-white">
          <span className="block text-2xl sm:text-3xl md:text-4xl">{title.line1}</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl">
            {title.line2Start}{" "}
            <span className="text-[#C9972A]">{title.line2Highlight}</span>
          </span>
        </h1>

        {/* Meta row */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
          <span className="flex items-center gap-2">
            <Calendar size={15} className="text-[#C9972A]" />
            {date}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={15} className="text-[#C9972A]" />
            {readTime}
          </span>
          <span className="flex items-center gap-2">
            <Tag size={15} className="text-[#C9972A]" />
            {category}
          </span>
        </div>
      </Container>
    </section>
  );
};

export default BlogDetailBanner;