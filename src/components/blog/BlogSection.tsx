"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { API_URL, getImageUrl } from "@/lib/api/api";
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
    return "bg-[#fef4e8] text-[#a9742a]";
  }
  return "bg-[#e8eedd] text-[#063120]";
}

const defaultImages = staticBlogs.map((b) => b.blogImage?.image || b.banner?.backgroundImage);

function getBlogImage(article: any, index: number): string {
  const raw =
    article.blogImage?.image ||
    article.banner?.backgroundImage ||
    (typeof article.image === "string" ? article.image : "");
  if (raw && typeof raw === "string" && raw.trim() !== "") {
    return getImageUrl(raw);
  }
  return defaultImages[index % defaultImages.length] || "";
}

function getBlogTitle(article: any): string {
  return article.title || article.banner?.title || "ENSIS Blog";
}

function getBlogDescription(article: any): string {
  if (article.description) return article.description;
  if (article.seo?.metaDescription) return article.seo.metaDescription;
  if (article.banner?.highlight) return article.banner.highlight;
  if (article.article?.content) {
    return article.article.content.replace(/<[^>]*>?/gm, "").slice(0, 130) + "...";
  }
  return "";
}

function formatBlogDate(rawDate?: string | Date | null): string {
  if (!rawDate) return "05 Oct 2026";
  const str = String(rawDate).trim();
  const m = str.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (m) {
    return `${m[1].padStart(2, "0")} ${m[2]} ${m[3]}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = parsed.toLocaleString("en-US", { month: "short" });
    const year = parsed.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return str;
}

function getBlogDate(article: any): string {
  if (article.banner?.date) return formatBlogDate(article.banner.date);
  if (article.date) return formatBlogDate(article.date);
  if (article.createdAt) return formatBlogDate(article.createdAt);
  if (article.updatedAt) return formatBlogDate(article.updatedAt);
  return "05 Oct 2026";
}

function getBlogCategory(article: any): string {
  return article.category || article.banner?.category || "Clinic & Spa Design";
}

export default function BlogSection({
  sectionContent,
}: {
  sectionContent?: any;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [blogsList, setBlogsList] = useState<any[]>(staticBlogs);

  useEffect(() => {
    let isMounted = true;
    async function loadRealBlogs() {
      try {
        const res = await fetch(`${API_URL}/blogs`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];
          if (isMounted && items.length > 0) {
            setBlogsList(items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch real blogs:", err);
      }
    }
    void loadRealBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      const cat = getBlogCategory(blog).toLowerCase();
      const selCat = selectedCategory.toLowerCase();
      const matchesCategory =
        selectedCategory === "All" ||
        cat.includes(selCat) ||
        selCat.includes(cat);

      const query = searchQuery.trim().toLowerCase();
      const title = getBlogTitle(blog).toLowerCase();
      const desc = getBlogDescription(blog).toLowerCase();
      const matchesSearch =
        !query ||
        title.includes(query) ||
        desc.includes(query) ||
        cat.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [blogsList, selectedCategory, searchQuery]);

  const recentPosts = useMemo(() => {
    return blogsList.slice(0, 3);
  }, [blogsList]);

  const sidebarCategories = useMemo(() => {
    return CATEGORIES.filter((c) => c.name !== "All").map((cat) => {
      const realCount = blogsList.filter((b) => {
        const bCat = getBlogCategory(b).toLowerCase();
        const cName = cat.name.toLowerCase();
        return bCat.includes(cName) || cName.includes(bCat);
      }).length;
      return { ...cat, count: realCount || cat.count };
    });
  }, [blogsList]);

  return (
    <div className="bg-[#faf7f2] pt-2 pb-4">
      <Container className="py-0">
        {/* =====================================================
            CATEGORY PILLS BAR & SEARCH (Compact spacing, 1-row scroll)
        ===================================================== */}
        <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          {/* CATEGORY TABS (One single row with horizontal scroll) */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto flex-nowrap pb-1 lg:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0 flex-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 sm:px-3 sm:py-1.2 text-xs sm:text-[12.5px] font-medium transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? "bg-[#063120] text-white shadow-xs font-semibold"
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
          <div className="flex w-full items-center gap-1.5 sm:w-auto lg:shrink-0">
            <div className="relative w-full sm:w-[220px] md:w-[250px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics..."
                className="h-[34px] w-full rounded-md border border-[#dcd4c6] bg-white px-3 text-xs sm:text-[13px] text-[#333333] placeholder-[#8c8275] transition-colors focus:border-[#063120] focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-[#063120] text-white transition-colors hover:bg-[#0c442e] cursor-pointer"
              aria-label="Search"
            >
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* =====================================================
            TWO-COLUMN MAIN CONTENT (CARDS GRID + SIDEBAR)
        ===================================================== */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_300px]">
          {/* ===================================================
              LEFT: 3x2 BLOG CARDS GRID
          =================================================== */}
          <div>
            {filteredBlogs.length > 0 ? (
              <div className="max-h-[660px] overflow-y-auto pr-0">
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBlogs.map((article, idx) => {
                    const title = getBlogTitle(article);
                    const image = getBlogImage(article, idx);
                    const category = getBlogCategory(article);
                    const date = getBlogDate(article);
                    const desc = getBlogDescription(article);

                    return (
                      <article
                        key={article.slug || article._id || idx}
                        className="group flex flex-col overflow-hidden rounded-xl border border-[#ede7dc] bg-white shadow-xs transition-all duration-300 hover:shadow-md"
                      >
                        {/* CARD IMAGE */}
                        <Link
                          href={`/blog/${article.slug}`}
                          className="relative block h-36 w-full shrink-0 overflow-hidden bg-[#f4eee5] sm:h-38"
                        >
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {/* CARD BODY */}
                        <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                          {/* CATEGORY BADGE & DATE */}
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyle(
                                category
                              )}`}
                            >
                              {category}
                            </span>

                            <span className="flex items-center gap-1 text-[11px] font-medium text-[#788492]">
                              <Calendar size={11} className="text-[#788492]" />
                              {date}
                            </span>
                          </div>

                          {/* TITLE - PLAYFAIR SERIF */}
                          <h3 className="mb-1.5 text-[16px] sm:text-[17px] font-bold text-[#063120] transition-colors group-hover:text-[#a9742a] line-clamp-2">
                            <Link href={`/blog/${article.slug}`}>
                              {title}
                            </Link>
                          </h3>

                          {/* DESCRIPTION */}
                          <p className="mb-2.5 flex-1 text-[12px] sm:text-[12.5px] font-normal leading-[1.5] text-[#5c6779] line-clamp-2">
                            {desc}
                          </p>

                          {/* READ MORE LINK */}
                          <div className="mt-auto pt-0.5">
                            <Link
                              href={`/blog/${article.slug}`}
                              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#063120] transition-all group-hover:gap-2 group-hover:text-[#a9742a]"
                            >
                              Read More <span>→</span>
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
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
          <aside className="space-y-3">
            {/* WIDGET 1: BLOG CATEGORIES */}
            <div className="rounded-xl border border-[#ede7dc] bg-white p-3.5 shadow-xs sm:p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <Flower2 size={16} className="text-[#c9972a]" />
                <h3 className="text-[15px] font-bold text-[#063120]">
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
                      className={`group flex w-full items-center justify-between py-1.5 text-left text-xs transition-colors cursor-pointer ${isCatActive
                        ? "font-bold text-[#063120]"
                        : "font-medium text-[#4a5568] hover:text-[#063120]"
                        }`}
                    >
                      <span className="group-hover:font-semibold transition-all">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-[#f4f6ea] px-1.5 py-0.5 text-[10px] font-semibold text-[#6b7280]">
                          {cat.count}
                        </span>
                        <ChevronRight
                          size={12}
                          className="text-[#a0aec0] transition-all group-hover:translate-x-0.5 group-hover:text-[#063120]"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WIDGET 2: RECENT POSTS */}
            <div className="rounded-xl border border-[#ede7dc] bg-white p-3.5 shadow-xs sm:p-4">
              <div className="mb-2.5 flex items-center gap-2">
                <Clock size={16} className="text-[#c9972a]" />
                <h3 className="text-[15px] font-bold text-[#063120]">
                  Recent Posts
                </h3>
              </div>

              <div className="divide-y divide-[#f2ede4]">
                {recentPosts.map((post, pIdx) => {
                  const title = getBlogTitle(post);
                  const image = getBlogImage(post, pIdx);
                  const date = getBlogDate(post);

                  return (
                    <Link
                      key={post.slug || pIdx}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center gap-2.5 py-2 transition-colors"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#ede7dc] bg-[#f4eee5]">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs font-bold leading-snug text-[#063120] transition-colors group-hover:text-[#a9742a]">
                          {title}
                        </p>
                        {date && (
                          <span className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-[#788492]">
                            <Calendar size={10} className="text-[#788492]" />
                            {date}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        size={12}
                        className="shrink-0 text-[#a0aec0] transition-all group-hover:translate-x-0.5 group-hover:text-[#063120]"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* WIDGET 3: NEED EXPERT GUIDANCE? (Full background image) */}
            <div className="relative overflow-hidden rounded-xl p-4 text-white shadow-xs min-h-[145px] flex flex-col justify-center">
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
                <h3 className="text-[15px] font-bold leading-tight text-white">
                  Need Expert Guidance?
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-white/90 font-normal">
                  Talk to our Ayurveda &amp; Wellness space experts for personalised solutions.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href="tel:+919810242841"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#235845] bg-[#134434] text-[#e5a83b] transition-colors hover:bg-[#1a5542]"
                    aria-label="Call Expert"
                  >
                    <Phone size={13} />
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 rounded-md bg-[#e5a83b] px-2.5 py-1.5 text-[11px] font-bold text-[#1a1a1a] transition-colors hover:bg-[#d6982e]"
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