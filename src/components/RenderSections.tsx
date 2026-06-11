import AboutHero from "@/components/about/AboutBanner";
import StatsStrip from "@/components/about/StatsStrip";
import IndustriesWeServe from "@/components/about/Industries";
import OurProductsSection from "@/components/about/OurProducts";
import ExpertiseSection from "@/components/about/OurExperties";
import WellnessSection from "@/components/about/WellnessSection";
import TurnkeyProcess from "@/components/about/TrunkeyProcess";
import AboutWellnessSection from "@/components/about/AboutWellnessSection";
import AboutEnsisSection from "@/components/about/AboutEnsis";
import WhyChooseEnsis from "@/components/about/WhyChoose";
import WellnessBanner from "@/components/about/WellnessBanner";
import FounderSection from "@/components/about/FounderSection";
import { Testimonials } from "@/components/home/Testimonials";
import { Hero } from "@/components/home/Hero";
import FullWidthFeatures from "@/components/home/FullWidthFeatures";
import { TurnkeySolutions } from "@/components/home/TurnkeySolutions"
import { GlobalPresence } from "@/components/home/GlobalPresence";
import { ManufacturingAndProjects } from "@/components/home/ManufacturingAndProjects";
import { ProductsGrid } from "@/components/home/ProductsGrid";
import WellnessRoomSetups from "@/components/home/WellnessRoomSetups";
import ConsultancyCTA from "@/components/consultancy/ConsultancyCTA";
import ConsultancyHero from "@/components/consultancy/Hero";
import HowWeWork from "@/components/consultancy/HowWeWork";
import ProductSlider from "@/components/products/HeroSlider";
import Products from "@/components/products/Products";
import React from "react"
import ConsultancyServices from "@/components/consultancy/Services";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import SupportHighlights from "@/components/contact/SupportHightlights";
import FacilitiesWeBuild from "@/components/turnkey/FacilitiesWeBuild";
import TurnkeyHero from "@/components/turnkey/HeroBanner";
import TurnkeySolutionsSection from "@/components/turnkey/TurnkeySolutions";
import WellnessCtaBanner from "@/components/turnkey/WellnessCtaBanner";
import BlogSection from "@/components/blog/BlogSection";
import BlogHeroSection from "@/components/blog/HeroSection";
import SupportSection from "@/components/blog/SupportSection";
import WellnessResources from "@/components/blog/WellnessResource";
import NewsletterCard from "@/components/blog/NewsletterCard";
import TrustedBrandsStrip from "@/components/products/TrustedBrandsStrip";
import WellnessFeatureStrip from "@/components/products/WellnessFeatureStrip";
import ProductWhyChoose from "@/components/products/WhyChoose";
import { BlogInsights } from "./home/BlogInsights";
import TurnkeyWhyChoose from '@/components/turnkey/WhyChoose'

interface RenderSectionProps {
  componentKey: string;
  data: Record<string, any>;
}

export default function RenderSection({ componentKey, data }: RenderSectionProps) {
  switch (componentKey) {
    case "home.hero":
      return <Hero slides={data.slides} />;

    case "home.fullWidthFeatures":
      return <FullWidthFeatures {...data} />;
    case "home.globalPresence":
      return <GlobalPresence sectionData={data} />;
    case "home.blogInsights":
      return <BlogInsights subtitle={data.subtitle} heading={data.heading} buttonText={data.buttonText} buttonPath={data.buttonPath} />;
    case "home.manufacturingAndProjects":
      return <ManufacturingAndProjects sectionContent={data} />;
    case "home.productsGrid":
      return <ProductsGrid sectionContent={data} />;
    case "home.testimonials":
      return <Testimonials title={data.subtitle} />;
    case "home.turnkeySolutions":
      return <TurnkeySolutions sectionData={data} />;
    case "home.wellnessRoomSetups":
      return <WellnessRoomSetups sectionContent={data} />;
      
    case "about.hero":
      return <AboutHero sectionContent={data} />;

    case "about.ourStory":
      return <AboutWellnessSection sectionContent={data} />;

    case "about.statsStrip":
      return <StatsStrip sectionContent={data} />;

    case "about.industriesWeServe":
      return <IndustriesWeServe sectionContent={data} />;

    case "about.ourProducts":
      return <OurProductsSection sectionContent={data} />;

    case "about.ourExpertise":
      return <ExpertiseSection sectionContent={data} />;

    case "about.wellnessSection":
      return <WellnessSection sectionContent={data} />;

    case "about.ourTurnkeyProcess":
      return <TurnkeyProcess sectionContent={data} />;

    case "about.aboutEnsis":
      return <AboutEnsisSection sectionContent={data} />;

    case "about.whyChooseEnsis":
      return <WhyChooseEnsis sectionContent={data} />;

    case "about.testimonials":
      return <WellnessBanner sectionContent={data} />;

    case "about.founderSection":
      return <FounderSection sectionContent={data} />;

    case "turnkey.banner":
      return <TurnkeyHero sectionContent={data} />;
    case "turnkey.completeSolutions":
      return <TurnkeySolutionsSection sectionContent={data} />;
    case "turnkey.customized":
      return <TurnkeyWhyChoose sectionContent={data} />;
    case "turnkey.facilities":
      return <FacilitiesWeBuild sectionContent={data} />;
    case "turnkey.whatIsTurnkey":
      return <WellnessCtaBanner sectionContent={data} />

    case "consultancy.hero":
      return <ConsultancyHero sectionContent={data} />;
    case "consultancy.readyToGetStarted":
      return <ConsultancyCTA sectionContent={data} />;
    case 'consultancy.whatWeOffer':
      return <HowWeWork sectionContent={data} />
    case "consultancy.whyChooseOurProcess":
      return <ConsultancyServices sectionContent={data} />


    case "contact.featuresStrip":
      return <SupportHighlights sectionContent={data} />
    case "contact.getInTouch":
      return <ContactSection sectionContent={data} />
    case "contact.hero":
      return <ContactHero sectionContent={data} />

    case "blog.allBlogs":
      return <BlogSection sectionContent={data} />
    case "blog.mediaResources":
      return <SupportSection sectionContent={data} />
    case 'blog.hero':
      return <BlogHeroSection sectionContent={data} />
    case "blog.stayInspired":
      return <NewsletterCard sectionContent={data} />
    case "blog.supportWellness":
      return <WellnessResources sectionContent={data} />

    case "product.hero":
      return <ProductSlider sectionContent={data} />
    case "product.featureStrip":
      return <WellnessFeatureStrip sectionContent={data} />
    case "product.trustedBy":
      return <TrustedBrandsStrip sectionContent={data} />
    case "product.whyChoose":
      return <ProductWhyChoose sectionContent={data} />
    case "product.testimonials":
      return <Testimonials  sectionContent={data} />
    case "product.productsection":
      return <Products sectionContent={data} />
    default:
      return null;
  }
}