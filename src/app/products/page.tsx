import { Testimonials } from "@/components/home/Testimonials";
import HeroSlider from "@/components/products/HeroSlider";
import Products from "@/components/products/Products";
import TrustedBrandsStrip from "@/components/products/TrustedBrandsStrip";
import WellnessFeatureStrip from "@/components/products/WellnessFeatureStrip";
import WhyChoose from "@/components/products/WhyChoose";
import React from "react"

export default async function ProductsPage() {
  // let products: Product[] = [];

  // try {
  //   const result = await productApi.list(48);
  //   products = result.products;
  // } catch {
  //   products = [];
  // }

  return (
   <>
   <HeroSlider />
   <WellnessFeatureStrip/>
   <Products />
   <TrustedBrandsStrip/>
  <WhyChoose />
  <Testimonials />
   </>
  );
}
