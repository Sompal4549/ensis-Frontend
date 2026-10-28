"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";
import { Container } from "../ui/Container";
import BlogViews from "./BlogViews";

interface BlogBanner {
  backgroundImage: string;
  backgroundImageAlt?: string;
  title: string;
  highlight?: string;
  date?: string;
  readingTime?: string;
  category?: string;
}

interface Blog {
  slug?: string;
  viewCount?: number;
  banner: BlogBanner;
}

interface BlogDetailBannerProps {
  blog: Blog;
}

const BlogDetailBanner: React.FC<BlogDetailBannerProps> = ({ blog }) => {
  return (
    <section className="relative overflow-hidden bg-[#0f2e22]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={blog?.banner?.backgroundImage}
          alt={blog?.banner?.backgroundImageAlt || ""}
          fill
          priority
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>

      {/* Dark gradient fade, left to right */}
      <div className="absolute inset-0 z-10 w-[68%] bg-gradient-to-r from-[#0f2e22] from-40% via-[#0f2e22]/90 via-70% to-transparent" />

      {/* Content */}
      <Container className="relative z-20 flex min-h-[326px] flex-col justify-center py-9 sm:py-12 md:py-14">
        <div className="max-w-3xl">
        {/* Title */}
        <h1 className="text-white text-[clamp(2.1rem,3.2vw+0.75rem,2.85rem)] font-bold leading-tight">
          <span className="block">
            {blog?.banner?.title}
          </span>
          {blog?.banner?.highlight && (
            <span className="text-[#C9972A]">{blog.banner.highlight}</span>
          )}
        </h1>

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-3.5 text-sm text-white/85">
        {blog?.banner?.date && (
  <span className="flex items-center gap-2">
    <Calendar size={15} className="text-[#C9972A]" />
    {new Date(blog.banner.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </span>
)}
          {blog?.banner?.readingTime && (
            <span className="flex items-center gap-2">
              <Clock size={15} className="text-[#C9972A]" />
              {blog.banner.readingTime}
            </span>
          )}
          {blog?.banner?.category && (
            <span className="flex items-center gap-2">
              <Tag size={15} className="text-[#C9972A]" />
              {blog.banner.category}
            </span>
          )}
          {blog?.slug && <BlogViews slug={blog.slug} initial={blog.viewCount} />}
        </div>
        </div>
      </Container>
    </section>
  );
};

export default BlogDetailBanner;