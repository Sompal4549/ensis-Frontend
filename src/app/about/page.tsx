import dynamic from "next/dynamic";
const AboutEnsisSection = dynamic(() => import("@/components/about/AboutEnsis").then((mod) => mod.default));
const AboutHero = dynamic(() => import("@/components/about/Banner").then((mod) => mod.default));
const IndustriesWeServe = dynamic(() => import("@/components/about/Industries").then((mod) => mod.default));
const OurProductsSection = dynamic(() => import("@/components/about/OurProducts").then((mod) => mod.default));
const TurnkeyProcess = dynamic(() => import("@/components/about/TrunkeyProcess").then((mod) => mod.default));
const WellnessBanner = dynamic(() => import("@/components/about/WellnessBanner").then((mod) => mod.default));
const WhyChooseEnsis = dynamic(() => import("@/components/about/WhyChoose").then((mod) => mod.default));
const Testimonials = dynamic(() => import("@/components/home/Testimonials").then((mod) => mod.Testimonials));
const ExpertiseSection = dynamic(() => import("@/components/about/OurExperties").then((mod) => mod.default));

export default function About() {
  return (
    <>
    <AboutHero/>
    <OurProductsSection />
    <AboutEnsisSection/>
    <WhyChooseEnsis/>
    <ExpertiseSection/>
    <TurnkeyProcess/>
    <IndustriesWeServe/>
    <Testimonials/>
    <WellnessBanner/>
    </>
  )
}