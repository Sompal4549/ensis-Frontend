"use client";

import { useState } from "react";
import CartAndDetailHeroBanner from "@/components/products/ProductDetailBanner";
import ProductFeatureStrip from "@/components/products/ProductFeatureStrip";
import PremiumProductInfo from "@/components/products/PremiumProductInfo";
import { Container } from "@/components/ui/Container";
import { Product } from "@/constants";

export default function ProductDetailClient({
  product,
  originalPrice,
  shopProduct,
}: {
  product: Product;
  originalPrice: number;
  shopProduct: Product;
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
        <PremiumProductInfo
          product={product}
          finish={finish}
          size={size}
          onFinishChange={setFinish}
          onSizeChange={setSize}
        />
      </Container>
    </>
  );
}