"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui/Container";
import {
  Search,
  Calendar,
  ChevronRight,
  Flower2,
  Clock,
  Phone,
  Sprout,
  Landmark,
  Bath,
  FileText,
  TrendingUp,
} from "lucide-react";
import { staticBlogs } from "@/data/blogs";
import needExpertBg from "@/assets/need_expert.png";

type CategoryItem = {
  name: string;
  icon?: React.ReactNode;
  count?: number;
};

const CATEGORIES: CategoryItem[] = [
  { name: "All" },
  { name: "Ayurveda Knowledge", icon: <Sprout size={14} className="text-[#a9742a]" />, count: 12 },
  { name: "Wellness & Lifestyle", icon: <Flower2 size={14} className="text-[#a9742a]" />, count: 8 },
  { name: "Clinic & Spa Design", icon: <Landmark size={14} className="text-[#a9742a]" />, count: 10 },
  { name: "Panchkarma Equipment", icon: <Bath size={14} className="text-[#a9742a]" />, count: 9 },
  { name: "Project Insights", icon: <FileText size={14} className="text-[#a9742a]" />, count: 7 },
  { name: "Industry Trends", icon: <TrendingUp size={14} className="text-[#a9742a]" />, count: 6 },
];

function getCategoryBadgeStyle(category: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("wellness") || norm.includes("equipment") || norm.includes("project")) {
    return "bg-[#fef4e8] text-[#a9742a] border border-[#f5dfc6]";
  }
  return "bg-[#edf2e6] text-[#063120] border border-[#d8e4cb]";
}

export default function BlogSection({
  sectionContent,
}: {
  sectionContent?: any;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const blogsList = useMemo(() => {
    return staticBlogs;
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      const matchesCategory =
        selectedCategory === "All" ||
        blog.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(blog.category.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [blogsList, selectedCategory, searchQuery]);

  const recentPosts = useMemo(() => {
    return blogsList.slice(0, 3);
  }, [blogsList]);

  const sidebarCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c.name !== "All");
  }, []);

  return (
    <div className="bg-[#faf7f2] pt-4 pb-4">
      <Container className="py-0">
        {/* =====================================================
            CATEGORY PILLS BAR & SEARCH (Compact spacing, 1-row scroll)
        ===================================================== */}
        <div className="mb-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* CATEGORY TABS (One single row with horizontal scroll) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto flex-nowrap pb-1 lg:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? "bg-[#063120] text-white shadow-sm font-semibold"
                    : "bg-transparent text-[#333333] hover:bg-[#efe8dc]/70 hover:text-[#063120]"
                    }`}
                >
                  {cat.icon && !isActive && cat.icon}
                  {cat.icon && isActive && (
                    <span className="text-[#e2b768]">{cat.icon}</span>
                  )}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* SEARCH BOX */}
          <div className="flex w-full items-center gap-2 sm:w-auto lg:shrink-0">
            <div className="relative w-full sm:w-[240px] md:w-[270px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics or keywords..."
                className="w-full rounded-lg border border-[#dcd4c6] bg-white px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm text-[#333333] placeholder-[#8c8275] transition-colors focus:border-[#063120] focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="flex h-[34px] w-[34px] sm:h-[38px] sm:w-[38px] shrink-0 items-center justify-center rounded-lg bg-[#063120] text-white transition-colors hover:bg-[#0c442e] cursor-pointer"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* =====================================================
            TWO-COLUMN MAIN CONTENT (CARDS GRID + SIDEBAR)
        ===================================================== */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_310px] xl:grid-cols-[1fr_370px]">
          {/* ===================================================
              LEFT: 3x2 BLOG CARDS GRID
          =================================================== */}
          <div>
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBlogs.map((article) => (
                  <article
                    key={article.slug}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#ede7dc] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
                  >
                    {/* CARD IMAGE */}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="relative block h-40 w-full overflow-hidden bg-[#f4eee5] sm:h-44"
                    >
                      <Image
                        src={article.blogImage?.image || article.banner?.backgroundImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* CARD BODY */}
                    <div className="flex flex-1 flex-col p-4 sm:p-4.5">
                      {/* CATEGORY BADGE & DATE */}
                      <div className="mb-2.5 flex items-center justify-between gap-2 text-xs">
                        <span
                          className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyle(
                            article.category
                          )}`}
                        >
                          {article.category}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#788492]">
                          <Calendar size={12} className="text-[#a9742a]" />
                          {article.date}
                        </span>
                      </div>

                      {/* TITLE */}
                      <h3 className="mb-2  text-[16px] font-bold leading-snug text-[#063120] transition-colors group-hover:text-[#a9742a] sm:text-[17px] line-clamp-2">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mb-2 flex-1 text-xs leading-relaxed text-[#666666] line-clamp-3">
                        {article.description}
                      </p>

                      {/* READ MORE LINK */}
                      <div>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#063120] transition-all group-hover:gap-2 group-hover:text-[#a9742a]"
                        >
                          Read More <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[#ede7dc] bg-white p-12 text-center">
                <p className="text-base font-medium text-[#666666]">
                  No articles found matching your criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 inline-flex items-center rounded-lg bg-[#063120] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0c442e]"
                >
                  View All Articles
                </button>
              </div>
            )}
          </div>

          {/* ===================================================
              RIGHT: SIDEBAR WIDGETS
          =================================================== */}
          <aside className="space-y-4">
            {/* WIDGET 1: BLOG CATEGORIES */}
            <div className="rounded-xl border border-[#ede7dc] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="mb-3 flex items-center gap-2">
                <Flower2 size={18} className="text-[#c9972a]" />
                <h3 className=" text-base font-bold text-[#063120] sm:text-[17px]">
                  Blog Categories
                </h3>
              </div>

              <div className="divide-y divide-[#f2ede4]">
                {sidebarCategories.map((cat) => {
                  const isCatActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`group flex w-full items-center justify-between py-2 text-left text-xs sm:text-[13px] transition-colors ${isCatActive
                        ? "font-bold text-[#063120]"
                        : "font-medium text-[#4a5568] hover:text-[#063120]"
                        }`}
                    >
                      <span className="group-hover:font-semibold transition-all">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#f4f6ea] px-2 py-0.5 text-[11px] font-semibold text-[#6b7280]">
                          {cat.count}
                        </span>
                        <ChevronRight
                          size={13}
                          className="text-[#a0aec0] transition-all group-hover:translate-x-0.5 group-hover:text-[#063120]"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WIDGET 2: RECENT POSTS */}
            <div className="rounded-xl border border-[#ede7dc] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="mb-3 flex items-center gap-2">
                <Clock size={18} className="text-[#c9972a]" />
                <h3 className=" text-base font-bold text-[#063120] sm:text-[17px]">
                  Recent Posts
                </h3>
              </div>

              <div className="divide-y divide-[#f2ede4]">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex items-center gap-3 py-3 transition-colors"
                  >
                    <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-lg border border-[#ede7dc] bg-[#f4eee5]">
                      <Image
                        src={post.blogImage?.image || post.banner?.backgroundImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-bold leading-snug text-[#063120] transition-colors group-hover:text-[#a9742a]">
                        {post.title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-[#788492]">
                        {post.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="shrink-0 text-[#a0aec0] transition-all group-hover:translate-x-0.5 group-hover:text-[#063120]"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* WIDGET 3: NEED EXPERT GUIDANCE? (Full background image) */}
            <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-md min-h-[175px] flex flex-col justify-center">
              {/* Full background image */}
              <Image
                src={needExpertBg}
                alt="Need Expert Guidance"
                fill
                className="object-cover object-right pointer-events-none select-none"
              />
              {/* Subtle gradient overlay to guarantee text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a2f23]/95 via-[#0a2f23]/80 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-[200px] sm:max-w-[215px]">
                <h3 className=" text-lg font-bold leading-tight text-white">
                  Need Expert Guidance?
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/90 font-normal">
                  Talk to our Ayurveda &amp; Wellness space experts for personalised solutions.
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href="tel:+919810242841"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#235845] bg-[#134434] text-[#e5a83b] transition-colors hover:bg-[#1a5542]"
                    aria-label="Call Expert"
                  >
                    <Phone size={14} />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#e5a83b] px-2 py-2 text-xs font-bold text-[#1a1a1a] transition-colors hover:bg-[#d6982e]"
                  >
                    Get Free Consultation <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}