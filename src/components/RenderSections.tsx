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
import {Features} from "@/components/home/Features";
import FullWidthFeatures from "@/components/home/FullWidthFeatures";
import {TurnkeySolutions} from "@/components/home/TurnkeySolutions"
import {GlobalPresence} from "@/components/home/GlobalPresence";
import {ManufacturingAndProjects} from "@/components/home/ManufacturingAndProjects";
import {ProductsGrid} from "@/components/home/ProductsGrid";
import WellnessRoomSetups from "@/components/home/WellnessRoomSetups";
import ConsultancyCTA from "@/components/consultancy/ConsultancyCTA";
import ConsultancyHero from "@/components/consultancy/Hero";
import HowWeWork from "@/components/consultancy/HowWeWork";
import ProductSlider from "@/components/products/HeroSlider";
import Products from "@/components/products/Products";
import TurnkeyFacilitiesWeBuild from '@/components/turnkey/FacilitiesWeBuild'
import FeaturedProjects from '@/components/turnkey/FeaturedTrunkeyProjects'
import React from "react"
import ConsultancyServices from "@/components/consultancy/Services";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import SupportHighlights from "@/components/contact/SupportHightlights";
import FacilitiesWeBuild from "@/components/turnkey/FacilitiesWeBuild";
import FeaturedTrunkeyProjects from "@/components/turnkey/FeaturedTrunkeyProjects";
import TurnkeyHero from "@/components/turnkey/HeroBanner";
import TrunkeyMeaning from "@/components/turnkey/TurnkeyMeaning";
import TurnkeySolutionsSection from "@/components/turnkey/TurnkeySolutions";
import WellnessCtaBanner from "@/components/turnkey/WellnessCtaBanner";
import WhyChoose from "@/components/turnkey/WhyChoose";
import BlogSection from "@/components/blog/BlogSection";
import BlogHeroSection from "@/components/blog/HeroSection";
import SupportSection from "@/components/blog/SupportSection";
import WellnessResources from "@/components/blog/WellnessResource";
import NewsletterCard from "@/components/blog/NewsletterCard";
import FeaturedArticles from "@/components/blog/FeaturedArticles";
import PopularPosts from "@/components/blog/PopularPosts";
import ExpertsSection from "@/components/blog/ExpertsSection";
import HeroSlider from "@/components/products/HeroSlider";
import ProductsList from "@/components/products/Products";
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
      return <GlobalPresence {...data} />;
case "home.blogInsights":
       return <BlogInsights {...data} />;
case "home.manufacturingAndProjects":
      return <ManufacturingAndProjects {...data}  />;
case "home.productsGrid":
      return <ProductsGrid {...data} />;
case "home.testimonials":
      return <Testimonials {...data} />;
case "home.turnkeySolutions":
      return <TurnkeySolutions {...data} />;
case "home.wellnessRoomSetups":
      return <WellnessRoomSetups {...data} />;

    case "about.hero":
      return <AboutHero {...data} />;

case "about.ourStory":
      return <AboutWellnessSection {...data} />;

    case "about.statsStrip":
      return <StatsStrip {...data} />;

    case "about.industriesWeServe":
      return <IndustriesWeServe {...data} />;

    case "about.ourProducts":
      return <OurProductsSection {...data} />;

    case "about.ourExpertise":
      return <ExpertiseSection {...data} />;

    case "about.wellnessSection":
      return <WellnessSection {...data} />;

    case "about.ourTurnkeyProcess":
      return <TurnkeyProcess {...data} />;

    case "about.aboutEnsis":
      return <AboutEnsisSection {...data} />;

    case "about.whyChooseEnsis":
      return <WhyChooseEnsis {...data} />;

    case "about.testimonials":
      return <WellnessBanner {...data} />;

    case "about.founderSection":
      return <FounderSection {...data} />;

      case "turnkey.banner":
      return <TurnkeyHero {...data} />;
case "turnkey.completeSolutions":
      return <TurnkeySolutionsSection {...data} />;
case "turnkey.customized":
  return <TurnkeyWhyChoose {...data} />;
case "turnkey.facilities":
  return <FacilitiesWeBuild {...data} />;
case "turnkey.whatIsTurnkey":
  return <WellnessCtaBanner {...data} />

    case "consultancy.hero":
      return <ConsultancyHero {...data} />;
case "consultancy.readyToGetStarted":
      return <ConsultancyCTA {...data} />;
case 'consultancy.whatWeOffer':
  return <HowWeWork {...data} />
case "consultancy.whyChooseOurProcess":
  return <ConsultancyServices {...data} />


  case "contact.featuresStrip":
    return <SupportHighlights {...data} />
  case "contact.getInTouch":
   return <ContactSection {...data} />
    case "contact.hero":
     return <ContactHero {...data} />

    case "blog.allBlogs":
      return <BlogSection {...data} />
      case "blog.mediaResources":
      return  <SupportSection {...data}/>
      case 'blog.hero':
        return <BlogHeroSection {...data}/>
        case "blog.stayInspired":
          return <NewsletterCard {...data} />
          case "blog.supportWellness":
           return <WellnessResources {...data}/>
    default:
      return null;
  }
}