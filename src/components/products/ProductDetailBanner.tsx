"use client";

import { useState, useEffect, useCallback } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import ProductPriceSection from "@/components/products/ProductPriceSection";
import { type Product } from "@/constants";

export default function ProductHeroBanner({
  product,
  originalPrice,
  shopProduct,
}: {
  product: Product;
  originalPrice?: number;
  shopProduct?: unknown;
}) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Ensure slides is always an array of image sources (string or StaticImageData)
  const slides: (string | StaticImageData)[] = Array.isArray(product.images)
    ? product.images
    : product.images
      ? [product.images]
      : [];


  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating, current]
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const visibleThumbs = slides.slice(0, 5);
  const extraCount = slides.length > 5 ? slides.length - 5 : 0;

  return (
    <div className="w-full">
      {/* ── BANNER ── */}
      <section className="relative w-full h-[480px] md:h-[580px] overflow-hidden bg-[#1a1208]">

        {/* SLIDES */}
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={src}
              alt={`${product.title ?? "Product"} – slide ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* DARK OVERLAY — gradient on desktop */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(10,8,4,0.82) 0%, rgba(10,8,4,0.65) 55%, transparent 100%)",
          }}
        />
        {/* Extra full overlay on mobile only */}
        <div
          className="absolute inset-0 z-20 pointer-events-none md:hidden"
          style={{ background: "rgba(10,8,4,0.55)" }}
        />

        {/* LEFT TEXT */}
        <div className="absolute inset-y-0 left-0 z-30 flex flex-col justify-center px-6 md:px-16 w-full md:max-w-[52%]">
          {product.tag && (
            <span
              className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: "#c8921a" }}
            >
              {product.tag}
            </span>
          )}

          <h1
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
            style={{
              color: "#f5ede0",
              fontFamily: "Georgia, 'Times New Roman', serif",
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
          >
            {product.title ?? "Luxury Panchkarma Therapy Table"}
          </h1>

          {product.description && (
            <p
              className="text-sm leading-relaxed mb-6 max-w-[340px]"
              style={{ color: "rgba(245,237,224,0.78)" }}
            >
              {product.description}
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: "rgba(245,237,224,0.45)", color: "#f5ede0" }}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <polygon points="6.5,5 11.5,8 6.5,11" fill="currentColor" />
              </svg>
              Watch Video
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-200 hover:bg-white/10"
              style={{ borderColor: "rgba(245,237,224,0.45)", color: "#f5ede0" }}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M8 2l6 3.5v5L8 14l-6-3.5v-5L8 2z" />
                <path d="M8 2v12M2 5.5l6 3.5 6-3.5" />
              </svg>
              View in Your Space
            </button>
          </div>

          {slides.length > 1 && (
            <div className="flex gap-2 mt-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    background: i === current ? "#c8921a" : "rgba(245,237,224,0.35)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT WHITE CARD — desktop only, inside banner */}
        <div
          className="hidden md:flex absolute top-6 right-6 bottom-6 rounded-lg z-40 w-[420px] max-w-[44%] bg-white shadow-2xl overflow-y-auto flex-col"
          style={{ borderLeft: "1px solid #f0e8d8" }}
        >
          <div className="p-6 flex-1">
            <ProductPriceSection
              shopProduct={shopProduct}
              product={product}
              originalPrice={originalPrice ?? 0}
            />
          </div>
        </div>

        {/* THUMBNAIL STRIP */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-6 md:left-16 z-30 flex gap-2">
            {visibleThumbs.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative w-12 h-9 md:w-16 md:h-12 rounded overflow-hidden border-2 transition-all duration-200 shrink-0 ${i === current
                  ? "border-[#c8921a] opacity-100"
                  : "border-white/30 opacity-60 hover:opacity-85"
                  }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
            {extraCount > 0 && (
              <div
                className="w-12 h-9 md:w-16 md:h-12 rounded flex flex-col items-center justify-center text-white shrink-0"
                style={{ background: "rgba(30,60,40,0.85)" }}
              >
                <span className="text-xs font-bold leading-none">+{extraCount}</span>
                <span className="text-[8px] uppercase tracking-wide opacity-80 mt-0.5">More</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* PRICE SECTION BELOW BANNER — mobile only */}
      <div className="md:hidden w-full bg-white shadow-md">
        <div className="p-5">
          <ProductPriceSection
            shopProduct={shopProduct}
            product={product}
            originalPrice={originalPrice ?? 0}
          />
        </div>
      </div>
    </div>
  );
}