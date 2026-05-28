"use client";

import { useState, useEffect, useCallback } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import ProductPriceSection from "@/components/products/ProductPriceSection";
import { type Product } from "@/constants";
import { Container } from "../ui/Container";

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


  const visibleThumbs = slides.slice(0, 5);
  const extraCount = slides.length > 5 ? slides.length - 5 : 0;

  return (
    <div className="w-full">
      {/* Full-bleed banner — images span the viewport */}
      <section className="relative w-full h-[480px] md:h-[580px] overflow-hidden bg-white">

        {/* SLIDES — always full viewport width */}
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute left-0 top-0 bottom-0 right-[20%] transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${typeof src === "string" ? src : src.src
                  })`,
              }}
            />

            {/* Right-side blur effect (10%) */}
            <div
              className="absolute top-0 right-0 h-full w-[10%] backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              }}
            />
          </div>
        ))}

        {/* DARK OVERLAY */}
        <div
          className="absolute left-0 right-[50%] top-0 bottom-0 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(10,8,4,0.82) 0%, rgba(10,8,4,0.65) 40%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 z-20 pointer-events-none md:hidden" style={{ background: "rgba(10,8,4,0.55)" }} />

        {/* Container constrains all content */}
        <Container className="relative h-full z-30">

          {/* LEFT TEXT */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-end md:justify-start md:pt-20 w-full md:max-w-[52%] box-border pl-6 md:pl-10">
            {product.tag && (
              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c8921a]">
                {product.tag}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 text-[#f5ede0] max-w-md">
              {product.title ?? "Luxury Panchkarma Therapy Table"}
            </h1>

            {product.description && (
              <p className="text-sm leading-relaxed mb-6 max-w-[340px] text-white">
                {product.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 text-xs font-medium text-[#f5ede0] transition-all duration-200 hover:bg-white/10">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <polygon points="6.5,5 11.5,8 6.5,11" fill="currentColor" />
                </svg>
                Watch Video
              </button>
              <button className="flex items-center gap-2 text-xs font-medium text-[#f5ede0] transition-all duration-200 hover:bg-white/10">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M8 2l6 3.5v5L8 14l-6-3.5v-5L8 2z" />
                  <path d="M8 2v12M2 5.5l6 3.5 6-3.5" />
                </svg>
                View in Your Space
              </button>
            </div>
          </div>

          {/* RIGHT WHITE CARD — desktop only */}
          <div className="hidden md:flex absolute top-8  bottom-8 rounded-lg w-[420px] max-w-[44%] bg-white shadow-2xl overflow-y-auto flex-col border border-[#f0e8d8] right-6 md:right-10">
            <div className="p-4 flex-1">
              <ProductPriceSection
                shopProduct={shopProduct}
                product={product}
                originalPrice={originalPrice ?? 0}
              />
            </div>
          </div>

          {/* THUMBNAIL STRIP */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-0 flex gap-2 pl-6 md:pl-10">
              {visibleThumbs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative w-12 h-9 md:w-16 md:h-12 rounded overflow-hidden border-2 transition-all duration-200 shrink-0 ${i === current
                      ? "border-[#c8921a] opacity-100"
                      : "border-white/30 opacity-60 hover:opacity-85"
                    }`}
                >
                  <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="64px" className="object-cover" />
                </button>
              ))}
              {extraCount > 0 && (
                <div className="w-12 h-9 md:w-16 md:h-12 rounded flex flex-col items-center justify-center text-white shrink-0 bg-[#1e3c28]/85">
                  <span className="text-xs font-bold leading-none">+{extraCount}</span>
                  <span className="text-[8px] uppercase tracking-wide opacity-80 mt-0.5">More</span>
                </div>
              )}
            </div>
          )}

        </Container>
      </section>

      {/* PRICE SECTION — mobile only, below banner */}
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