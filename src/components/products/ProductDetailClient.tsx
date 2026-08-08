"use client";

import { useState } from "react";
import CartAndDetailHeroBanner from "@/components/products/ProductDetailBanner";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import ProductFeatureStrip from "@/components/products/ProductFeatureStrip";
import { Container } from "@/components/ui/Container";
import { Product } from "@/constants";

export default function ProductDetailClient({
  product,
  originalPrice,
  shopProduct,
  contactPhone,
}: {
  product: Product;
  originalPrice: number;
  shopProduct: Product;
  contactPhone?: string;
}) {
  const [finish, setFinish] = useState<string>("");
  const [size, setSize] = useState<string>("");

  return (
    <>
      <section className="relative w-full mb-0 md:mb-20">
        <CartAndDetailHeroBanner
          originalPrice={originalPrice}
          product={product}
          shopProduct={shopProduct}
          finish={finish}
          size={size}
        />
        {/* Feature strip — half over the banner, half below (hero-strap pattern) */}
        <ProductFeatureStrip />
      </section>
      <Container>
        <section className="grid lg:items-start xl:gap-8">
          <ProductInfoSection
            product={product}
            finish={finish}
            size={size}
            contactPhone={contactPhone}
            onFinishChange={setFinish}
            onSizeChange={setSize}
          />
        </section>
      </Container>
    </>
  );
}
