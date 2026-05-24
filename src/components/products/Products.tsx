"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGrid,
  List,
  ChevronDown,
  Phone,
  Mail,
  Globe,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { allProducts, categories, idealFor, materials, PAGE_SIZE } from "@/constants";
import ProductCard, { Checkbox } from "./ProductCard";
import BookButton from "../ui/BookButton";
import Image from "next/image";
import SubHeading from "../home/SubHeading";
import lotus from "@/assets/about/lotus.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Products() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState(150000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", category: "", message: "", });
  // Infinite scroll
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    let data = allProducts.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.categoryKey === activeCategory;

      const matchesPrice = product.price <= priceRange;

      return matchesCategory && matchesPrice;
    });

    if (sortBy === "Price: Low to High") {
      data = [...data].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "Price: High to Low") {
      data = [...data].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "Newest") {
      data = [...data].reverse();
    }

    return data;
  }, [activeCategory, priceRange, sortBy]);

  // Reset visible products on filter/category change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, priceRange, sortBy]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          visibleCount < filtered.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filtered.length)
          );
        }
      },
      {
        threshold: 0.2,
      }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, filtered.length]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const selectedCategory =
    categories.find((cat) => cat.key === activeCategory)?.label ||
    "All Products";

  return (
    <>
      <div className="ws-body min-h-screen bg-[#faf6f1] text-[#1a1a1a]">
        <div className="max-w-[1340px] mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-7">

          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-[#183b17] text-white rounded-full text-xs font-[600] tracking-wider"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <Package size={14} />
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="flex gap-5 xl:gap-6 items-start">

            {/* ── LEFT SIDEBAR ── */}
            <aside
              className={`shrink-0 w-[175px] xl:w-[188px] flex flex-col gap-5 transition-all duration-300 ${
                sidebarOpen ? "block" : "hidden lg:flex"
              } lg:sticky lg:top-5`}
            >
              {/* Categories */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 overflow-hidden">
                <p className="text-xs font-[700] tracking-[0.18em] text-[#c8a45d] uppercase mb-3">
                  Categories
                </p>

                <ul className="space-y-0.5">
                  {categories.map((cat) => (
                    <li key={cat.key}>
                      <button
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[12px] transition-all ${
                          activeCategory === cat.key
                            ? "bg-[#183b17] text-white font-[600]"
                            : "text-[#4a3f30] hover:bg-[#f5ede0]"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-base leading-none">
                           <Image src={cat.icon} alt={cat.label} width={20} height={15} className="object-fill object-center" />
                          </span>

                          <span className="truncate">
                            {cat.label}
                          </span>
                        </span>

                        <span
                          className={`shrink-0 text-[10px] font-[600] ml-1 ${
                            activeCategory === cat.key
                              ? "text-white/70"
                              : "text-[#c8a45d]"
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-4">
                <p className="text-xs font-[700] tracking-[0.18em] text-[#c8a45d] uppercase mb-3">
                  Filter By
                </p>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-[11px] font-[600] text-[#1a1a1a] mb-3">
                    Price Range
                  </p>

                  <input
                    type="range"
                    min={1000}
                    max={150000}
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(Number(e.target.value))
                    }
                    className="w-full range-gold"
                  />

                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-[#8a7560]">
                      ₹1,000
                    </span>

                    <span className="text-[10px] text-[#8a7560]">
                      {fmt(priceRange)}+
                    </span>
                  </div>
                </div>

                {/* Material */}
                <div className="mb-5">
                  <p className="text-xs font-[600] text-[#1a1a1a] mb-3">
                    Material
                  </p>

                  <div className="space-y-2">
                    {materials.map((m) => (
                      <Checkbox key={m} label={m} />
                    ))}
                  </div>
                </div>

                {/* Ideal */}
                <div className="mb-5">
                  <p className="text-xs font-[600] text-[#1a1a1a] mb-3">
                    Ideal For
                  </p>

                  <div className="space-y-2">
                    {idealFor.map((f) => (
                      <Checkbox key={f} label={f} />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPriceRange(150000)}
                  className="flex items-center gap-1.5 text-[11px] font-[600] text-[#183b17] border border-[#183b17] rounded-full px-3 py-1.5 hover:bg-[#183b17] hover:text-white transition-colors"
                >
                  <RefreshCw size={11} />
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 min-w-0">

              {/* Selected Category Title */}
              <div className="mb-5">
                  <SubHeading text=" Wellness Collection" className=' text-[#d5ad6a]' />
                <h2 className="text-lg text-center font-semibold text-[#1a1a1a] leading-none">
                  {selectedCategory}
                </h2>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                {/* <p className="text-[12px] sm:text-[13px] text-[#7a6a55]">
                  Showing 1–
                  {visibleProducts.length} of{" "}
                  <span className="font-[600] text-[#1a1a1a]">
                    {filtered.length}
                  </span>{" "}
                  products
                </p> */}

                <div className="flex items-center gap-3">

                  {/* Sort */}
                  <div className="flex items-center gap-2 text-[12px] text-[#7a6a55]">
                    <span className="hidden sm:inline">
                      Sort by:
                    </span>

                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value)
                        }
                        className="appearance-none bg-white border border-[#ede8e0] rounded-lg px-3 py-1.5 pr-7 text-[12px] text-[#1a1a1a] outline-none cursor-pointer"
                      >
                        {[
                          "Featured",
                          "Price: Low to High",
                          "Price: High to Low",
                          "Newest",
                        ].map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>

                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9a8870] pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* View */}
                  <div className="flex items-center gap-1 bg-white border border-[#ede8e0] rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === "grid"
                          ? "bg-[#183b17] text-white"
                          : "text-[#9a8870]"
                      }`}
                    >
                      <LayoutGrid size={14} />
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded transition-colors ${
                        viewMode === "list"
                          ? "bg-[#183b17] text-white"
                          : "text-[#9a8870]"
                      }`}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div
                className={`grid gap-3 sm:gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Infinite Scroll Loader */}
              <div
                ref={loadMoreRef}
                className="h-20 flex items-center justify-center"
              >
                {visibleCount < filtered.length ? (
                  <div className="flex items-center gap-2 text-[#8a7560] text-sm">
                    <div className="w-5 h-5 border-2 border-[#c8a45d] border-t-transparent rounded-full animate-spin" />
                    Loading more products...
                  </div>
                ) : (
                  <p className="text-sm text-[#9a8870]">
                    You’ve reached the end
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <aside className="hidden xl:flex shrink-0 w-[210px] flex-col gap-4 sticky top-5">

              {/* Enquire */}
           <div className="bg-white rounded-2xl border border-[#ede8e0] p-5">
    
    {/* Lotus icon */}
    <div className="flex justify-center mb-1">
      <Image width={35} height={20}
        src={lotus}
        alt="decoration"
        className="object-contain opacity-90"
      />
    </div>

    <h3 className="text-xl font-semibold text-center text-[#1a1a1a] mb-1.5">
      Enquire Now
    </h3>

    <p className="text-xs text-[#7a6a55] text-center leading-relaxed mb-2">
      Tell us about your requirements and our wellness experts
      will contact you.
    </p>

    <div className="space-y-2.5">

      {/* Name */}
      <input
        type="text"
        placeholder="Your Name"
        value={enquiry.name}
        onChange={(e) =>
          setEnquiry((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] outline-none focus:border-[#c8a45d] transition-colors placeholder:text-[#b0a090]"
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        value={enquiry.email}
        onChange={(e) =>
          setEnquiry((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] outline-none focus:border-[#c8a45d] transition-colors placeholder:text-[#b0a090]"
      />

      {/* Phone */}
      <input
        type="tel"
        placeholder="Phone Number"
        value={enquiry.phone}
        onChange={(e) =>
          setEnquiry((prev) => ({
            ...prev,
            phone: e.target.value,
          }))
        }
        className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] outline-none focus:border-[#c8a45d] transition-colors placeholder:text-[#b0a090]"
      />

      {/* Category Select */}
      <div className="relative">
        <select
          value={enquiry.category}
          onChange={(e) =>
            setEnquiry((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
          className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 pr-7 text-[12px] outline-none focus:border-[#c8a45d] transition-colors appearance-none text-[#6f6254]"
        >
          <option value="">Select Product Category</option>

          {categories.slice(1).map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={11}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9a8870] pointer-events-none"
        />
      </div>

      {/* Message */}
      <textarea
        rows={3}
        placeholder="Your Message"
        value={enquiry.message}
        onChange={(e) =>
          setEnquiry((prev) => ({
            ...prev,
            message: e.target.value,
          }))
        }
        className="w-full rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 py-2 text-[12px] outline-none focus:border-[#c8a45d] transition-colors resize-none placeholder:text-[#b0a090]"
      />

      {/* Button */}
      <BookButton text="Send Enquiry" />
    </div>
  </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 space-y-3">
                {[
                  {
                    Icon: Phone,
                    title: "Call Us",
                    value: "+91 9654900525",
                    url: "tel:+919654900525",
                  },
                  {
                    Icon: Mail,
                    title: "Email Us",
                    value: "info@ensis.in",
                    url: "mailto:info@ensis.in",
                  },
                  {
                    Icon: Globe,
                    title: "Global Shipping",
                    value: "Delivering Worldwide",
                  },
                  {
                    Icon: Package,
                    title: "Secure Packaging",
                    value: "100% Safe Delivery",
                  },
                ].map(({ Icon, title, value, url }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#f0e8d8] flex items-center justify-center shrink-0 bg-[#faf6f1]">
                      <Icon
                        size={13}
                        className="text-[#c8a45d]"
                      />
                    </div>

                    <div>
                      {url ? (
                        <Link href={url}>
                          <p className="text-[11px] font-[600] text-[#1a1a1a] leading-none mb-0.5">
                            {title}
                          </p>

                          <p className="text-[10px] text-[#7a6a55] leading-snug">
                            {value}
                          </p>
                        </Link>
                      ) : (
                        <>
                          <p className="text-[11px] font-[600] text-[#1a1a1a] leading-none mb-0.5">
                            {title}
                          </p>

                          <p className="text-[10px] text-[#7a6a55] leading-snug">
                            {value}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
