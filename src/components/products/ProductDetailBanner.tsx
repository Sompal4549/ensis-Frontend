"use client";

import { useState, useCallback, useEffect } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import ProductPriceSection from "@/components/products/ProductPriceSection";
import { type Product as ProductBase } from "@/constants";
import { Container } from "../ui/Container";

export default function ProductHeroBanner({
  product,
  originalPrice,
  shopProduct,
  finish,
  size,
}: {
  product: ProductBase & { _id: string };
  originalPrice?: number;
  shopProduct?: any; // Changed to any for now, can be more specific if needed
  finish?: string;
  size?: string;
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
      {/* Full-bleed banner — images span the viewport */}
      <section className="relative w-full h-72 md:h-145 overflow-hidden bg-white">

        {/* SLIDES — always full viewport width */}
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute left-0 top-0 bottom-0 right-0 transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"
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

            {/* Background Image — fixed width, centered, responsive */}
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[70vw] md:w-[450px] bg-cover bg-center bg-no-repeat"
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

        {/* TEXT READABILITY SCRIM — keeps light text visible on light/white images */}
        <div
          className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none w-full md:w-[58%]"
          style={{
            background:
              "linear-gradient(to right, rgba(15,13,9,0.68) 0%, rgba(15,13,9,0.42) 35%, transparent 75%)",
          }}
        />

        {/* Container constrains all content */}
        <Container className="relative h-full z-30">

          {/* LEFT TEXT — desktop only */}
          <div className="hidden md:flex absolute inset-y-0 left-0 flex-col justify-center md:justify-start md:pt-20 w-full md:max-w-[55%] box-border pl-6 md:pl-10">
            {(product.subcategory || product.category?.name) && (
              <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e0b472]">
                {product.subcategory || product.category?.name}
              </span>
            )}

            <h1 className="mb-4 hidden text-[#f5ede0] md:block">
              {product.title ?? "Luxury Panchkarma Therapy Table"}
            </h1>

            {product.description && (
              <p className="max-w-85 hidden text-sm md:text-base leading-6 mb-6 text-white/90 md:block" dangerouslySetInnerHTML={{__html:product.description}}>
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

          {/* RIGHT WHITE CARD — desktop only */}
          <div className="hidden md:flex absolute top-8  bottom-8 rounded-lg w-105 max-w-[44%] bg-white shadow-2xl overflow-y-auto flex-col border border-[#f0e8d8] right-6 md:right-10">
            <div className="p-4 flex-1">
              <ProductPriceSection
                shopProduct={shopProduct}
                product={product}
                originalPrice={originalPrice ?? 0}
                finish={finish}
                size={size}
              />
            </div>
          </div>

          {/* THUMBNAIL STRIP */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 md:bottom-14 left-0 flex items-center gap-4 pl-6 md:pl-10 w-full md:w-[55%]">
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {slides.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`relative w-[72px] h-[54px] md:w-[100px] md:h-[75px] rounded overflow-hidden border-2 transition-all duration-200 shrink-0 bg-white ${i === current
                        ? "border-[#c8921a] opacity-100"
                        : "border-[#8d6a3a]/40 opacity-60 hover:opacity-85"
                      }`}
                  >
                    <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="100px" className="object-cover" />
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
            finish={finish}
            size={size}
          />
        </div>
      </div>
    </div>
  );
}