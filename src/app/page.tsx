import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/home/Hero").then((mod) => mod.Hero));
const Features = dynamic(() => import("@/components/home/Features").then((mod) => mod.Features));
const ProductsGrid = dynamic(() => import("@/components/home/ProductsGrid").then((mod) => mod.ProductsGrid));
const TurnkeySolutions = dynamic(() => import("@/components/home/TurnkeySolutions").then((mod) => mod.TurnkeySolutions));
const ManufacturingAndProjects = dynamic(() => import("@/components/home/ManufacturingAndProjects").then((mod) => mod.ManufacturingAndProjects));
const GlobalPresence = dynamic(() => import("@/components/home/GlobalPresence").then((mod) => mod.GlobalPresence));
const Testimonials = dynamic(() => import("@/components/home/Testimonials").then((mod) => mod.Testimonials));
const BlogInsights = dynamic(() => import("@/components/home/BlogInsights").then((mod) => mod.BlogInsights));
const WellnessRoomSetups = dynamic(() => import("@/components/home/WellnessRoomSetups").then((mod) => mod.default));
const WellnessSection = dynamic(() => import("@/components/about/WellnessSection").then((mod) => mod.default));
const FullWidthFeatures = dynamic(() => import("@/components/home/FullWidthFeatures").then((mod) => mod.default));
import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata() {
  return generateSeo("home");
}

export default function Home() {

  return (
    <>
      <Hero />
      <WellnessSection />
      <FullWidthFeatures/>
      <ProductsGrid />
      <TurnkeySolutions />
      <WellnessRoomSetups/>
      <ManufacturingAndProjects />
      <GlobalPresence />
      <Testimonials />
      <BlogInsights />
    </>
  );
}
