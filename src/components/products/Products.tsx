"use client";
import { useSearchParams } from "next/navigation";
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
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PAGE_SIZE } from "@/constants";
import ProductCard, { Checkbox } from "./ProductCard";
import Image from "next/image";
import lotus from "@/assets/about/lotus.png";
import { categoryApi, getImageUrl, productApi } from "@/lib/api/api";
import { API_URL } from "@/lib/api/api";
import { Container } from "../ui/Container";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Products(props: any = {}) {
  const { materials: adminMaterials, idealFor: adminIdealFor, priceRange: adminPriceRange } = props;
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("Featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", category: "", message: "", });
  const [enquiryStatus, setEnquiryStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  // Infinite scroll
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLDivElement | null>(null); // 👈 new ref
  const [products, setProducts] = useState<any[]>([]);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const maxPrice = useMemo(() => {
    const adminMax = adminPriceRange?.end && Number(adminPriceRange.end) > 0 ? Number(adminPriceRange.end) : 0;
    return Math.max(adminMax, ...products.map((p) => p.price), 0);
  }, [products, adminPriceRange]);

const minPrice = useMemo(() => {
  const adminMin = adminPriceRange?.start && Number(adminPriceRange.start) >= 0 ? Number(adminPriceRange.start) : 0;
  if (!products.length) return adminMin;
  return Math.min(adminMin, ...products.map((p) => p.price));
}, [products, adminPriceRange]);

const [priceRange, setPriceRange] = useState(0);
const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
const [selectedIdealFor, setSelectedIdealFor] = useState<string[]>([]);

useEffect(() => {
    if (maxPrice) {
        setPriceRange(maxPrice);
    }
}, [maxPrice]);
  // Sync activeCategory whenever URL param changes (e.g. navigation from another page)
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Scroll to products section if category param is present
  useEffect(() => {
    if (categoryParam && mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [categoryParam]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          productApi.list(100),
          categoryApi.list()
        ]);

        // Actual API shape is { status, data: { products, total, page, limit } }.
        // Fall back to pRes.products in case some other call site returns the
        // unwrapped shape, so this doesn't silently break either way.
        const productList = pRes.products ?? [];

        // Categories may come back as a plain array, or wrapped the same way
        // as products ({ status, data: [...] } or { status, data: { categories } }).
        const categoryList = cRes;

        const normalized = productList.map((item: any) => ({
          ...item,
          id: item._id,
          name: item.title,
          image: item.images?.[0] ? getImageUrl(item.images[0]) : "",
          categoryKey: typeof item.category === 'object' ? item.category?.slug : item.category
        }));
        setProducts(normalized);
        setApiCategories(categoryList);
      } catch (e) {
        console.error("Error loading products/categories:", e);
        // setProducts(allProducts);
      }
    };
    loadData();
  }, []);

  const handleEnquirySubmit = async () => {
    setEnquiryStatus(null);

    if (!enquiry.email.trim()) {
      setEnquiryStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setEnquiryLoading(true);

    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: enquiry.email.trim(), type: "product" }),
      });

      const payload = await res.json().catch(() => ({}));

      if (res.ok && payload.status !== "error") {
        setEnquiryStatus({ type: "success", message: "Thank you! Our wellness experts will contact you soon." });
        setEnquiry({ name: "", email: "", phone: "", category: "", message: "" });
      } else {
        setEnquiryStatus({ type: "error", message: payload.message || "Something went wrong. Please try again." });
      }
    } catch {
      setEnquiryStatus({ type: "error", message: "Failed to send enquiry. Please try again." });
    } finally {
      setEnquiryLoading(false);
    }
  };

  const displayCategories = useMemo(() => {
  if (!Array.isArray(apiCategories)) return [
    {
      key: "all",
      label: "All",
      icon: "",
      count: products.length,
    },
  ];
  return [
    {
      key: "all",
      label: "All",
      icon: apiCategories.find((c) => c?.slug === "all")?.image || "",
      count: products.length,
    },

    ...apiCategories
      .filter((c) => c && c.slug !== "all")
      .map((c) => ({
        key: c.slug,
        label: c.name,
        icon: getImageUrl(c.image),
        count: products.filter(
          (p) => p.category?.slug === c.slug
        ).length,
      })),
  ];
}, [apiCategories, products]);

const materialOptions = useMemo(() => {
  if (Array.isArray(adminMaterials) && adminMaterials.length) {
    return adminMaterials.map((m: any) => m.title).filter(Boolean);
  }
  return [...new Set(products.map((p) => p.material).filter(Boolean))];
}, [adminMaterials, products]);

const idealForOptions = useMemo(() => {
  if (Array.isArray(adminIdealFor) && adminIdealFor.length) {
    return adminIdealFor.map((i: any) => i.title).filter(Boolean);
  }
  return [...new Set(products.map((p) => p.overview?.idealFor).filter(Boolean))];
}, [adminIdealFor, products]);

const toggleMaterial = (value: string) => {
  setSelectedMaterials((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
};

const toggleIdealFor = (value: string) => {
  setSelectedIdealFor((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  );
};

  const filtered = useMemo(() => {
    let data = products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" ||
        product.category?.slug === activeCategory;

      const matchesPrice = product.price <= priceRange;

      const matchesMaterial =
        selectedMaterials.length === 0 ||
        selectedMaterials.includes(product.material);

      const matchesIdealFor =
        selectedIdealFor.length === 0 ||
        selectedIdealFor.includes(product.overview?.idealFor);

      return matchesCategory && matchesPrice && matchesMaterial && matchesIdealFor;
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
  }, [products, activeCategory, priceRange, sortBy, selectedMaterials, selectedIdealFor]);

  // Reset visible products on filter/category change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, priceRange, sortBy, selectedMaterials, selectedIdealFor]);

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
    displayCategories.find((cat) => cat.key === activeCategory)?.label ||
    "All Products";

  return (
    <>
      <div ref={mainContentRef} className="flex-1 min-w-0">
        <Container>

          {/* Mobile Filter Toggle */}
          <button
            suppressHydrationWarning
            className="lg:hidden mb-4 flex items-center gap-4 px-4 py-2 bg-[#183b17] text-white rounded-full text-xs font-[600] tracking-wider"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <Package size={14} />
            {sidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="flex gap-5 xl:gap-6 items-start">

            {/* ── LEFT SIDEBAR ── */}
            <aside
              className={`shrink-0 w-[175px] xl:w-[188px] flex flex-col gap-5 transition-all duration-300 ${sidebarOpen ? "block" : "hidden lg:flex"
                } lg:sticky lg:top-5`}
            >
              {/* Filters */}
              <div className="bg-white rounded-2xl border border-[#ede8e0] p-4">
                <p className="text-xs font-medium tracking-[0.18em] uppercase mb-3">
                  Filter By
                </p>

                {/* Price */}
                <div className="mb-5">
                  <p className="text-[11px] font-[600] text-[#1a1a1a] mb-3">
                    Price Range
                  </p>

                  <input
                    type="range"
                    aria-label="Price range filter"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(Number(e.target.value))
                    }
                    className="w-full range-gold"
                  />

                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-medium">
                      {fmt(minPrice)}
                    </span>

                    <span className="text-[10px] font-medium">
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
                    {materialOptions.slice(0, 5).map((m) => (
                      <Checkbox
                        key={m}
                        label={m}
                        checked={selectedMaterials.includes(m)}
                        onChange={() => toggleMaterial(m)}
                      />
                    ))}
                  </div>
                </div>

                {/* Ideal */}
                <div className="mb-5">
                  <p className="text-xs font-[600] text-[#1a1a1a] mb-3">
                    Ideal For
                  </p>

                  <div className="space-y-2">
                    {idealForOptions.slice(0, 5).map((item) => (
                      <Checkbox
                        key={item}
                        label={item}
                        checked={selectedIdealFor.includes(item)}
                        onChange={() => toggleIdealFor(item)}
                      />
                    ))}
                  </div>
                </div>

                <button
                  suppressHydrationWarning
                  onClick={() => {
                    setPriceRange(maxPrice);
                    setSelectedMaterials([]);
                    setSelectedIdealFor([]);
                  }}
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
                <h2 className="text-lg text-center font-semibold text-[#1a1a1a] leading-none">
                  {selectedCategory}
                </h2>
              </div>

              {/* Horizontal Categories Bar */}
              <div className="mb-5">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.key}
                      suppressHydrationWarning
                      onClick={() => setActiveCategory(cat.key)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] transition-all whitespace-nowrap ${
                        activeCategory === cat.key
                          ? "bg-[#183b17] text-white border-[#183b17] font-[600]"
                          : "bg-white text-[#1a1a1a] border-[#ede8e0] font-medium hover:bg-[#f5ede0]"
                      }`}
                    >
                      {cat.icon ? (
                        <span className="h-[15px] w-[20px] overflow-hidden rounded-[3px]">
                          <Image src={cat.icon} alt={cat.label} width={20} height={15} className="object-fill object-center" />
                        </span>
                      ) : (
                        <span className="inline-block h-[15px] w-[20px]" />
                      )}
                      <span>{cat.label}</span>
                      <span className={`text-[10px] font-[600] ${activeCategory === cat.key ? "text-white/70" : "text-[#c8a45d]"}`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                {/* <p className="text-[12px] sm:text-[13px] text-[#7a6a55]">
                  Showing 1–
                  {visibleProducts.length} of{" "}
                  <span className="font-[600] text-[#1a1a1a]">
                    {filtered.length}
                  </span>{" "}
                  products
                </p> */}

                <div className="flex items-center gap-4">

                  {/* Sort */}
                  <div className="flex items-center gap-4 text-[12px] text-[#7a6a55]">
                    <span className="hidden sm:inline">
                      Sort by:
                    </span>

                    <div className="relative">
                      <select
                        suppressHydrationWarning
                        aria-label="Sort products"
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
                      suppressHydrationWarning
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-colors ${viewMode === "grid"
                          ? "bg-[#183b17] text-white"
                          : "text-[#9a8870]"
                        }`}
                    >
                      <LayoutGrid size={14} />
                    </button>

                    <button
                      suppressHydrationWarning
                      aria-label="List view"
                      aria-pressed={viewMode === "list"}
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded transition-colors ${viewMode === "list"
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
                className={`grid gap-4 sm:gap-4 ${viewMode === "grid"
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
                  <div className="flex items-center gap-4 text-[#8a7560] text-sm">
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

                <p className="text-xs font-medium text-center leading-relaxed mb-2">
                  Tell us about your requirements and our wellness experts
                  will contact you.
                </p>

                <div className="space-y-2.5">
                  {/* Name */}
                  <input
                    suppressHydrationWarning
                    type="text"
                    aria-label="Your name"
                    placeholder="Your Name"
                    value={enquiry.name}
                    onChange={(e) =>
                      setEnquiry((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] text-black placeholder:text-black outline-none focus:border-[#c8a45d] transition-colors"
                  />

                  {/* Email */}
                  <input
                    suppressHydrationWarning
                    type="email"
                    aria-label="Email address"
                    placeholder="Email Address"
                    value={enquiry.email}
                    onChange={(e) =>
                      setEnquiry((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] text-black placeholder:text-black outline-none focus:border-[#c8a45d] transition-colors"
                  />

                  {/* Phone */}
                  <input
                    suppressHydrationWarning
                    type="tel"
                    aria-label="Phone number"
                    placeholder="Phone Number"
                    value={enquiry.phone}
                    onChange={(e) =>
                      setEnquiry((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 text-[12px] text-black placeholder:text-black outline-none focus:border-[#c8a45d] transition-colors"
                  />

                  {/* Category Select */}
                  <div className="relative">
                    <select
                      suppressHydrationWarning
                      aria-label="Product category"
                      value={enquiry.category}
                      onChange={(e) =>
                        setEnquiry((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full h-9 rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 pr-7 text-[12px] text-black outline-none focus:border-[#c8a45d] transition-colors appearance-none"
                    >
                      <option value="">Select Product Category</option>

                      {displayCategories.slice(1).map((c, i) => (
                        <option key={c.key || `cat-${i}`} value={c.key}>
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
                    aria-label="Your message"
                    placeholder="Your Message"
                    value={enquiry.message}
                    onChange={(e) =>
                      setEnquiry((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#ede8e0] bg-[#faf6f1] px-3 py-2 text-[12px] text-black placeholder:text-black outline-none focus:border-[#c8a45d] transition-colors resize-none"
                  />

                  {/* Button */}
                  <button
                    suppressHydrationWarning
                    type="button"
                    disabled={enquiryLoading}
                    onClick={handleEnquirySubmit}
                    className="w-full flex items-center justify-center gap-1.5 px-4 h-8 rounded-lg bg-[#0f2518] hover:bg-[#1a3d28] shadow-[0_2px_12px_rgba(15,37,24,0.35)] text-white font-bold text-[10px] tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {enquiryLoading ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-[#c8a45d] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                    {enquiryLoading ? "Sending..." : "Send Enquiry"}
                  </button>

                  {enquiryStatus && (
                    <p className={`text-[11px] font-medium leading-snug ${enquiryStatus.type === "success" ? "text-green-700" : "text-red-600"}`}>
                      {enquiryStatus.message}
                    </p>
                  )}
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
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#f0e8d8] flex items-center justify-center shrink-0 bg-[#faf6f1]">
                      <Icon
                        size={13}
                        className="text-[#c8a45d] font-medium"
                      />
                    </div>

                    <div>
                      {url ? (
                        <Link href={url}>
                          <p className="text-[11px] font-[600] text-[#1a1a1a] leading-none mb-0.5">
                            {title}
                          </p>

                          <p className="text-[10px] font-medium leading-snug">
                            {value}
                          </p>
                        </Link>
                      ) : (
                        <>
                          <p className="text-[11px] font-[600] text-[#1a1a1a] leading-none mb-0.5">
                            {title}
                          </p>

                          <p className="text-[10px] font-medium leading-snug">
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
        </Container>
      </div>
    </>
  );
}