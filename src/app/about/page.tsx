const AboutWellnessSection = dynamic(() => import("@/components/about/AboutWellnessSection").then((mod) => mod.default));
import FounderSection from "@/components/about/FounderSection";
const StatsStrip= dynamic(()=>import("@/components/about/StatsStrip").then((mod)=>mod.default));
import dynamic from "next/dynamic";
const AboutEnsisSection = dynamic(() => import("@/components/about/AboutEnsis").then((mod) => mod.default));
const AboutHero = dynamic(() => import("@/components/about/AboutBanner").then((mod) => mod.default));
const IndustriesWeServe = dynamic(() => import("@/components/about/Industries").then((mod) => mod.default));
const OurProductsSection = dynamic(() => import("@/components/about/OurProducts").then((mod) => mod.default));
const TurnkeyProcess = dynamic(() => import("@/components/about/TrunkeyProcess").then((mod) => mod.default));
const WellnessBanner = dynamic(() => import("@/components/about/WellnessBanner").then((mod) => mod.default));
const WhyChooseEnsis = dynamic(() => import("@/components/about/WhyChoose").then((mod) => mod.default));
const Testimonials = dynamic(() => import("@/components/home/Testimonials").then((mod) => mod.Testimonials));
const ExpertiseSection = dynamic(() => import("@/components/about/OurExperties").then((mod) => mod.default));
import { generateSeo } from "@/lib/api/seo";
import PageBuilder from "@/components/PageBuilder";


export async function generateMetadata() {
  return generateSeo("about");
}
export default function About() {
  return (
    <>
<PageBuilder slug="about"/>
    </>
  )
}