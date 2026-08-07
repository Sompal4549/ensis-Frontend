"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  PackageCheck,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import ProductFeatureStrip from "@/components/products/ProductFeatureStrip";
import ProductInfoTabs from "@/components/products/ProductInfoTabs";
import { formatPrice } from "@/utils";
import { useShop } from "@/context/ShopContext";

const FALLBACK_FINISHES = [
  { title: "Teak", color: "#9a6b3f" },
  { title: "Walnut", color: "#5b4632" },
  { title: "Rosewood", color: "#6b2f1f" },
  { title: "Ash", color: "#d8c8a8" },
];

const FALLBACK_SIZES = ["Standard Size", "Custom Size"];

const DELIVERY_NOTES = [
  { icon: Truck, title: "Dispatch in 5–7 days", text: "Free doorstep delivery" },
  { icon: ShieldCheck, title: "1 Year Manufacturing Warranty", text: "Parts & service support" },
  { icon: PackageCheck, title: "Secure export packing", text: "Pan-India & worldwide shipping" },
  { icon: BadgeCheck, title: "Made in India", text: "Crafted by expert artisans" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9a8f7a]">
      <span className="h-px w-8 bg-[#c8a45d]" />
      {children}
    </p>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0;
        return (
          <span key={i} className="relative h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-[#e7dfcf]" fill="currentColor" strokeWidth={0} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="h-4 w-4 text-[#c8a45d]" fill="currentColor" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

type RelatedProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  images?: string[];
  image?: string;
};

function RelatedCardImage({ product }: { product: RelatedProduct }) {
  return (
    <Image
      src={product.images?.[0] || product.image || ""}
      alt={product.title}
      fill
      sizes="(max-width: 768px) 45vw, 22vw"
      className="relative object-contain p-2 transition-transform duration-700 ease-out group-hover/card:scale-110"
    />
  );
}

function RelatedCardFooter({ product }: { product: RelatedProduct }) {
  return (
    <>
      <div className="relative mt-2.5">
        <h3 className="line-clamp-1 text-sm font-medium text-[#1a1a1a] transition-colors duration-300 group-hover/card:text-[#263016]">
          {product.title}
        </h3>
        <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-[#c8a45d] transition-transform duration-500 ease-out group-hover/card:scale-x-100" />
      </div>
      <p className="mt-2 text-base font-semibold text-[#263016]">
        {formatPrice(product.price)}
      </p>
    </>
  );
}

function RadianceCard({ product }: { product: RelatedProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group/card relative block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e8e2d4] bg-[#f2ede1] transition-all duration-500 group-hover/card:border-[#c8a45d] group-hover/card:shadow-[0_0_0_1px_rgba(200,164,93,0.45),0_30px_60px_-15px_rgba(200,164,93,0.5)]">
        {/* Divine halo blooming from the centre */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,207,150,0.9),rgba(200,164,93,0.35)_50%,transparent_72%)] opacity-0 blur-md transition-all duration-700 ease-out group-hover/card:size-[170%] group-hover/card:opacity-100" />
        <RelatedCardImage product={product} />
        {/* Golden light sweep across the card */}
        <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-[#e9cf96]/70 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/card:left-full group-hover/card:opacity-100" />
      </div>
      <RelatedCardFooter product={product} />
    </Link>
  );
}

function LotusCard({ product }: { product: RelatedProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group/card relative block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e8e2d4] bg-[#f2ede1] transition-all duration-500 group-hover/card:border-[#c8a45d]/70 group-hover/card:shadow-[0_30px_60px_-15px_rgba(200,164,93,0.45)]">
        {/* Soft golden glow */}
        <div className="pointer-events-none absolute inset-0 scale-50 bg-[radial-gradient(circle_at_center,rgba(233,207,150,0.5),transparent_65%)] opacity-0 blur-md transition-all duration-700 ease-out group-hover/card:scale-110 group-hover/card:opacity-100" />
        {/* Expanding lotus ripples */}
        <div className="pointer-events-none absolute inset-0 m-auto size-16 rounded-full border-2 border-[#c8a45d]/80 opacity-0 [animation-play-state:paused] group-hover/card:animate-ping group-hover/card:opacity-100 group-hover/card:[animation-duration:1.6s] group-hover/card:[animation-play-state:running]" />
        <div className="pointer-events-none absolute inset-0 m-auto size-16 rounded-full border-2 border-[#c8a45d]/50 opacity-0 [animation-play-state:paused] group-hover/card:animate-ping group-hover/card:opacity-100 group-hover/card:[animation-duration:1.6s] group-hover/card:[animation-delay:0.4s] group-hover/card:[animation-play-state:running]" />
        <RelatedCardImage product={product} />
      </div>
      <RelatedCardFooter product={product} />
    </Link>
  );
}

function ShimmerCard({ product }: { product: RelatedProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group/card relative block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e8e2d4] bg-[#f2ede1] transition-all duration-500 group-hover/card:border-[#c8a45d]/70 group-hover/card:shadow-[0_30px_60px_-15px_rgba(200,164,93,0.45)]">
        {/* Golden sheen sweeping across */}
        <div className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-12deg] bg-gradient-to-r from-transparent via-[#f5e3b8]/90 to-transparent transition-transform duration-700 ease-out group-hover/card:translate-x-[130%]" />
        {/* Twinkling sparkles */}
        <span className="pointer-events-none absolute left-[16%] top-[22%] size-1.5 rounded-full bg-[#e9cf96] opacity-0 shadow-[0_0_12px_3px_rgba(233,207,150,0.9)] [animation-play-state:paused] group-hover/card:animate-ping group-hover/card:opacity-100 group-hover/card:[animation-duration:1.1s] group-hover/card:[animation-play-state:running]" />
        <span className="pointer-events-none absolute right-[20%] top-[30%] size-1 rounded-full bg-[#e9cf96] opacity-0 shadow-[0_0_10px_3px_rgba(233,207,150,0.9)] [animation-play-state:paused] group-hover/card:animate-ping group-hover/card:opacity-100 group-hover/card:[animation-duration:1.1s] group-hover/card:[animation-delay:0.25s] group-hover/card:[animation-play-state:running]" />
        <RelatedCardImage product={product} />
      </div>
      <RelatedCardFooter product={product} />
    </Link>
  );
}

function MandalaCard({ product }: { product: RelatedProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group/card relative block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#e8e2d4] bg-[#f2ede1] transition-all duration-500 group-hover/card:border-[#c8a45d] group-hover/card:shadow-[0_0_0_1px_rgba(200,164,93,0.4),0_30px_60px_-15px_rgba(200,164,93,0.5)]">
        {/* Rotating mandala rings */}
        <div className="pointer-events-none absolute inset-0 m-auto size-3/4 rounded-full border border-dashed border-[#c8a45d]/70 opacity-0 [animation-play-state:paused] group-hover/card:animate-spin group-hover/card:opacity-100 group-hover/card:[animation-duration:5s] group-hover/card:[animation-play-state:running]" />
        <div className="pointer-events-none absolute inset-0 m-auto size-1/2 rounded-full border border-[#c8a45d]/50 opacity-0 [animation-play-state:paused] group-hover/card:animate-spin group-hover/card:opacity-100 group-hover/card:[animation-duration:5s] group-hover/card:[animation-direction:reverse] group-hover/card:[animation-play-state:running]" />
        <RelatedCardImage product={product} />
      </div>
      <RelatedCardFooter product={product} />
    </Link>
  );
}

const RELATED_CARD_VARIANTS = [RadianceCard, LotusCard, ShimmerCard, MandalaCard];

export default function ProductDetailPageV3({
  product,
  originalPrice,
  shopProduct,
  related = [],
}: {
  product: any;
  originalPrice?: number;
  shopProduct?: any;
  related?: any[];
}) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [finish, setFinish] = useState(0);
  const [size, setSize] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);
  const { toggleLike, isLiked } = useShop();
  const liked = mounted && isLiked(product.id);

  const slides: string[] =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image].filter(Boolean);

  const category =
    product.subcategory ||
    (typeof product.category === "object" && product.category
      ? product.category.name
      : product.category) ||
    "";

  const title = product.title ?? "Luxury Panchkarma Therapy Table";

  const sellingPrice = product.price || 0;
  const mrp =
    product.discountPrice && product.discountPrice > sellingPrice
      ? product.discountPrice
      : originalPrice || Math.round(sellingPrice * 1.18);
  const offPct = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  const rating =
    product.averageRating ||
    (Array.isArray(product.reviews) && product.reviews.length
      ? product.reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / product.reviews.length
      : 0);
  const reviewCount = Array.isArray(product.reviews) ? product.reviews.length : 0;

  const description =
    product.shortDescription || product.description || product.overview?.description || "";

  const finishes =
    Array.isArray(product.overview?.smartDesignAppearance?.woodFinish) &&
    product.overview.smartDesignAppearance.woodFinish.length
      ? product.overview.smartDesignAppearance.woodFinish
      : FALLBACK_FINISHES;

  const sizes =
    Array.isArray(product.overview?.smartDesignAppearance?.sizeOptions) &&
    product.overview.smartDesignAppearance.sizeOptions.length
      ? product.overview.smartDesignAppearance.sizeOptions.map((s: any) => s.title)
      : FALLBACK_SIZES;

  const highlights =
    product.overview?.overviewList ||
    product.overview?.keyFeatures?.keyFeaturesList ||
    [];

  const overviewItems = Array.isArray(product.overview?.items)
    ? product.overview.items
    : [];

  const hasOverview =
    product.overview?.title ||
    product.overview?.description ||
    highlights.length ||
    overviewItems.length;

  const share = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url: window.location.href });
        return;
      }
    } catch {
      // user cancelled native share — fall through to copy
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Container className="py-4 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[52fr_48fr] lg:gap-12">
          {/* GALLERY */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
              {/* Vertical thumbnails — desktop */}
              <div className="hidden flex-col gap-3 lg:flex">
                {slides.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border bg-[#f2ede1] transition-all duration-300 ${
                      i === current
                        ? "border-[#263016] ring-2 ring-[#263016]/15"
                        : "border-[#e8e2d4] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${title} thumbnail ${i + 1}`}
                      fill
                      sizes="88px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="group relative aspect-[3/2] overflow-hidden rounded-[24px] border border-[#e8e2d4] bg-[#f2ede1]">
                <Image
                  src={slides[current]}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority={current === 0}
                  className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.35] md:p-4"
                />

                {offPct > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-[#263016] px-3 py-1 text-[11px] font-semibold text-white">
                    {offPct}% OFF
                  </span>
                )}
                <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[#e8e2d4] bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#263016]">
                  <BadgeCheck size={12} className="text-[#c8a45d]" />
                  Made in India
                </span>

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8e2d4] bg-white/90 text-[#263016] shadow-sm transition-colors hover:bg-white"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8e2d4] bg-white/90 text-[#263016] shadow-sm transition-colors hover:bg-white"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full border border-[#e8e2d4] bg-white/95 py-2 pl-4 pr-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9a8f7a]">
                    {current + 1} / {slides.length}
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-[#f6f2e9] px-3 py-1.5 text-[10px] font-semibold text-[#263016]">
                    <Search size={12} />
                    Hover to Zoom
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal thumbnails — mobile */}
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar lg:hidden">
              {slides.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg border bg-[#f2ede1] ${
                    i === current ? "border-[#263016]" : "border-[#e8e2d4] opacity-70"
                  }`}
                >
                  <Image src={src} alt={`${title} thumbnail ${i + 1}`} fill sizes="80px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col">
            {category && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#263016]">
                {category}
              </p>
            )}

            <h1 className="mt-2 text-3xl font-light leading-[1.15] text-[#1a1a1a] md:text-[2.75rem]">
              {title}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              {rating > 0 ? (
                <>
                  <Stars rating={rating} />
                  <span className="text-sm font-medium text-[#1a1a1a]">{rating.toFixed(1)}</span>
                  <span className="text-sm text-[#9a8f7a]">
                    {reviewCount > 0 ? `· ${reviewCount} Reviews` : "· Add a review"}
                  </span>
                </>
              ) : (
                <span className="text-sm text-[#9a8f7a]">No reviews yet</span>
              )}
              {product.code && (
                <span className="ml-auto text-xs text-[#b4a98f]">SKU: {product.code}</span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-[#e8e2d4] pb-4">
              <span className="text-4xl font-normal tracking-tight text-[#1a1a1a]">
                {formatPrice(sellingPrice)}
              </span>
              {offPct > 0 && (
                <>
                  <span className="pb-1 text-base text-[#a8a294] line-through">
                    {formatPrice(mrp)}
                  </span>
                  <span className="mb-1 rounded-full bg-[#263016]/10 px-3 py-1 text-xs font-semibold text-[#263016]">
                    {offPct}% OFF
                  </span>
                </>
              )}
              <span className="w-full text-xs text-[#9a8f7a]">
                Inclusive of all taxes · GST included
              </span>
            </div>

            {description && (
              <div
                className="mt-5 max-w-85 text-sm leading-7 text-[#5f5c55]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

          </div>
        </div>

        {/* FULL-WIDTH DETAILS */}
        <div className="mt-10 grid gap-10 border-t border-[#e8e2d4] pt-8 lg:grid-cols-2">
          {/* FINISH SELECTION */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
              Wood Finish
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {finishes.map((f: any, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFinish(i)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-300 ${
                    finish === i
                      ? "border-[#263016] bg-white shadow-sm"
                      : "border-[#e8e2d4] bg-transparent hover:border-[#c8c1ae]"
                  }`}
                >
                  {f.image ? (
                    <span className="relative h-7 w-9 overflow-hidden rounded-md">
                      <Image src={f.image} alt={f.title} fill sizes="36px" className="object-cover" />
                    </span>
                  ) : (
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: f.color }}
                    />
                  )}
                  <span className="text-xs font-medium text-[#1a1a1a]">{f.title}</span>
                  {finish === i && <Check size={13} className="text-[#263016]" />}
                </button>
              ))}
            </div>
          </div>

          {/* SIZE SELECTION */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
              Size Options
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {sizes.map((s: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSize(i)}
                  className={`rounded-full border px-5 py-2.5 text-xs font-medium transition-all duration-300 ${
                    size === i
                      ? "border-[#263016] bg-[#263016] text-white"
                      : "border-[#e8e2d4] bg-white text-[#1a1a1a] hover:border-[#c8c1ae]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 border-t border-[#e8e2d4] pt-8 lg:grid-cols-2">
          {/* HIGHLIGHTS */}
          {highlights.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
                Highlights
              </p>
              <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-6 text-[#5f5c55]">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#263016]/10">
                      <Check size={10} className="text-[#263016]" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* DELIVERY & WARRANTY */}
          <div className="grid content-start gap-3 sm:grid-cols-2">
            {DELIVERY_NOTES.map(({ icon: Icon, title: t, text }) => (
              <div key={t} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8e2d4] bg-white text-[#263016]">
                  <Icon size={16} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a]">{t}</p>
                  <p className="mt-0.5 text-[11px] text-[#9a8f7a]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS — full width */}
        <div className="mt-10 border-t border-[#e8e2d4] pt-8">
          <ProductDetailActions
            product={shopProduct}
            twoRows
            trailing={
              <div className="flex items-stretch gap-3">
                <button
                  type="button"
                  onClick={() => toggleLike(shopProduct)}
                  className={`flex h-full flex-1 items-center justify-center gap-3 rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-300 ${
                    liked
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-[#d8cbb9] bg-white text-[#263016] hover:bg-[#fbf8f2]"
                  }`}
                >
                  <Heart size={15} className={liked ? "fill-current" : ""} />
                  {liked ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#d8cbb9] bg-white text-[#263016] transition-colors hover:bg-[#fbf8f2]"
                  aria-label="Share product"
                >
                  {copied ? <Check size={16} /> : <Share2 size={16} />}
                </button>
              </div>
            }
          />
        </div>
      </Container>

      <ProductFeatureStrip />

      {/* EDITORIAL OVERVIEW */}
      {hasOverview && (
        <Container className="py-8 lg:py-12">
          <div className="border-b border-[#e8e2d4] pb-6">
            <Eyebrow>01 — Overview</Eyebrow>
            <h2 className="mt-3 text-2xl font-light text-[#1a1a1a] md:text-3xl">
              {product.overview?.title || "Crafted with intention"}
            </h2>
            {product.overview?.description && (
              <div
                className="mt-3 max-w-3xl text-sm leading-7 text-[#5f5c55]"
                dangerouslySetInnerHTML={{ __html: product.overview.description }}
              />
            )}
          </div>

          {highlights.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((h: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e8e2d4] bg-white px-4 py-2 text-xs text-[#5f5c55]"
                >
                  <Check size={11} className="text-[#263016]" />
                  {h}
                </span>
              ))}
            </div>
          )}

          {overviewItems.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {overviewItems.map((item: any, i: number) => (
                <div key={i} className="overflow-hidden rounded-[16px] border border-[#e8e2d4] bg-white">
                  {item.image && (
                    <div className="relative aspect-video overflow-hidden bg-[#f2ede1]">
                      <Image
                        src={item.image}
                        alt={item.title || ""}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    {item.title && (
                      <p className="truncate text-xs font-semibold text-[#1a1a1a]">{item.title}</p>
                    )}
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#9a8f7a]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      )}

      <ProductInfoTabs product={product} />

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <Container className="py-8 lg:py-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>You May Also Like</Eyebrow>
              <h2 className="mt-3 text-3xl font-light text-[#1a1a1a] md:text-4xl">
                Complete the space
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden shrink-0 border-b border-[#263016] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#263016] transition-colors hover:text-[#c8a45d] sm:block"
            >
              View All
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-4">
            {related.map((p: RelatedProduct, i: number) => {
              const Variant = RELATED_CARD_VARIANTS[i % RELATED_CARD_VARIANTS.length];
              return <Variant key={p.id} product={p} />;
            })}
          </div>
        </Container>
      )}
    </div>
  );
}
