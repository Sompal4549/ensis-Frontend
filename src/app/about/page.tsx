import AboutEnsisSection from "@/components/about/AboutEnsis";
import AboutHero from "@/components/about/Banner";
import IndustriesWeServe from "@/components/about/Industries";
import OurProductsSection from "@/components/about/OurProducts";
import TurnkeyProcess from "@/components/about/TrunkeyProcess";
import WellnessBanner from "@/components/about/WellnessBanner";
import WhyChooseEnsis from "@/components/about/WhyChoose";
import { Testimonials } from "@/components/home/Testimonials";

export default function About() {
  return (
    <>
    <AboutHero/>
    <OurProductsSection />
    <AboutEnsisSection/>
    <WhyChooseEnsis/>
    <TurnkeyProcess/>
    <IndustriesWeServe/>
    <Testimonials/>
    <WellnessBanner/>
    </>
  )
}