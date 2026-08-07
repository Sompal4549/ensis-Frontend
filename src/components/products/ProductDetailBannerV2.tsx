"use client";

import { useState, useCallback, useEffect } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import ProductPriceSection from "@/components/products/ProductPriceSection";
import { type Product as ProductBase } from "@/constants";
import { Container } from "../ui/Container";

export default function ProductHeroBannerV2({
  product,
  originalPrice,
  shopProduct,
}: {
  product: ProductBase & { _id: string };
  originalPrice?: number;
  shopProduct?: any; // Changed to any for now, can be more specific if needed
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

  // Autoplay — same cadence as the hero slider
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="w-full">
      {/* MOBILE — title & description before the photos */}
      <div className="bg-white px-5 pt-5 pb-4 md:hidden">
        <h1 className="text-2xl font-semibold leading-tight text-[#001b10]">
          {product.title ?? "Luxury Panchkarma Therapy Table"}
        </h1>
        {product.description && (
          <p
            className="mt-2 line-clamp-3 text-xs leading-6 text-[#5f5c55]"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </div>

      {/* Full-bleed banner — images span the viewport */}
      <section className="relative w-full h-[420px] md:h-[640px] overflow-hidden bg-white">

        {/* SLIDES — always full viewport width */}
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute left-0 top-0 bottom-0 right-0 md:left-[3%] md:top-[15px] md:bottom-[15px] md:right-[calc(20%+15px)] transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {/* Blurred fill behind (no white gaps) */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl"
              style={{
                backgroundImage: `url(${typeof src === "string" ? src : src.src
                  })`,
              }}
            />

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${typeof src === "string" ? src : src.src
                  })`,
              }}
            />

            {/* Right-side blur effect (10%) */}
            <div
              className="absolute top-0 right-0 h-full w-0 md:w-[10%] backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              }}
            />
          </div>
        ))}

        {/* DARK OVERLAY */}
        {/* <div
          className="absolute left-0 right-[50%] top-0 bottom-0 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(10,8,4,0.82) 0%, rgba(10,8,4,0.65) 40%, transparent 100%)",
          }}
        /> */}
        {/* <div className="absolute inset-0 z-20 pointer-events-none md:hidden" style={{ background: "rgba(10,8,4,0.55)" }} /> */}

        {/* Container constrains all content */}
        <Container className="relative h-full z-30">

          {/* LEFT TEXT */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center md:justify-start md:pt-20 w-full md:max-w-[38%] box-border pl-6 md:pl-10">
            <div className="w-full max-w-[min(360px,calc(100vw_-_3rem))] rounded-xl border border-[#c8a45d]/30 bg-gradient-to-br from-[#14261a]/75 via-[#1b3321]/60 to-[#14261a]/45 p-4 md:p-5 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              {(product.subcategory || product.category?.name) && (
                <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e0b472]">
                  {product.subcategory || product.category?.name}
                </span>
              )}

              <h1 className="mb-3 hidden text-[#f5ede0] text-2xl md:text-[1.9rem] leading-tight md:block">
                {product.title ?? "Luxury Panchkarma Therapy Table"}
              </h1>

              {product.description && (
                <p className="hidden text-xs md:text-sm leading-6 mb-4 text-white/90 line-clamp-4 md:block" dangerouslySetInnerHTML={{__html:product.description}}>
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-4 text-xs font-medium text-[#f5ede0] transition-all duration-200 hover:bg-white/10">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    <polygon points="6.5,5 11.5,8 6.5,11" fill="currentColor" />
                  </svg>
                  Watch Video
                </button>
                <button className="flex items-center gap-4 text-xs font-medium text-[#f5ede0] transition-all duration-200 hover:bg-white/10">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M8 2l6 3.5v5L8 14l-6-3.5v-5L8 2z" />
                    <path d="M8 2v12M2 5.5l6 3.5 6-3.5" />
                  </svg>
                  View in Your Space
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT WHITE CARD — desktop only */}
          <div
            className="hidden md:flex absolute top-8 rounded-lg w-105 max-w-[44%] bg-white shadow-2xl overflow-y-auto overflow-x-hidden flex-col border border-[#f0e8d8] right-6 md:right-10"
            style={{ maxHeight: "calc(100% - 4rem)" }}
          >
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
            <div className="absolute bottom-6 left-0 flex items-center gap-4 pl-6 md:pl-10 w-full md:w-[55%]">
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {slides.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`relative w-12 h-9 md:w-16 md:h-12 rounded overflow-hidden border-2 transition-all duration-200 shrink-0 ${i === current
                        ? "border-[#c8921a] opacity-100"
                        : "border-white/30 opacity-60 hover:opacity-85"
                      }`}
                  >
                    <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="64px" className="object-contain" />
                  </button>
                ))}
              </div>
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