import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import { TurnkeySolutions } from "@/components/home/TurnkeySolutions";
import { ManufacturingAndProjects } from "@/components/home/ManufacturingAndProjects";
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogInsights } from "@/components/home/BlogInsights";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ProductsGrid />
      <TurnkeySolutions />
      <ManufacturingAndProjects />
      <GlobalPresence />
      <Testimonials />
      <BlogInsights />
    </>
  );
}
