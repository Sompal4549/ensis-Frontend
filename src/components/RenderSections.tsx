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
import { ProductsGrid, ProductsGridContent } from "@/components/home/ProductsGrid";
import WellnessRoomSetups from "@/components/home/WellnessRoomSetups";
import ConsultancyCTA from "@/components/consultancy/ConsultancyCTA";
import ConsultancyHero from "@/components/consultancy/Hero";
import HowWeWork from "@/components/consultancy/HowWeWork";
import ConsultancyServices from "@/components/consultancy/Services";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import SupportHighlights from "@/components/contact/SupportHightlights";
import FacilitiesWeBuild, { FacilitiesWeBuildContent } from "@/components/turnkey/FacilitiesWeBuild";
import TurnkeyHero, { TurnkeyHeroContent } from "@/components/turnkey/HeroBanner";
import TurnkeySolutionsSection, { TurnkeySolutionsContent } from "@/components/turnkey/TurnkeySolutions";
import WellnessCtaBanner from "@/components/turnkey/WellnessCtaBanner";
import BlogSection from "@/components/blog/BlogSection";
import BlogHeroSection from "@/components/blog/HeroSection";
import SupportSection from "@/components/blog/SupportSection";
import WellnessResources from "@/components/blog/WellnessResource";
import NewsletterCard from "@/components/blog/NewsletterCard";
import TrustedBrandsStrip, { TrustedBrandsStripContent } from "@/components/products/TrustedBrandsStrip";
import WellnessFeatureStrip, { WellnessFeatureStripContent } from "@/components/products/WellnessFeatureStrip";
import ProductWhyChoose, { WhyChooseContent } from "@/components/products/WhyChoose";
import { BlogInsights } from "./home/BlogInsights";
import TurnkeyWhyChoose, { TurnkeyWhyChooseContent } from '@/components/turnkey/WhyChoose'
import HeroSlider, { HeroSliderContent } from "@/components/products/HeroSlider"; // Already imported
import Products from "@/components/products/Products"; // Removed invalid named import
import TrunkeyMeaning, { TurnkeyMeaningContent } from '@/components/turnkey/TurnkeyMeaning' // Already imported
import FeaturedProjects from '@/components/turnkey/FeaturedTrunkeyProjects' // Already imported
import { WellnessCtaBannerContent } from "@/components/turnkey/WellnessCtaBanner";
import { SupportHighlightsContent } from "./contact/SupportHightlights"; // Added import
import { ContactSectionContent } from "./contact/ContactSection"; // Added import
import { ContactHeroContent } from "./contact/ContactHero"; // Added import
import ProjectsBanner from "@/components/projects-and-clients/Banner";
import WhyPartner from "@/components/projects-and-clients/WhyPartnerSection";
import OurClients from "@/components/projects-and-clients/OurClients";
import ContactBanner from "@/components/projects-and-clients/Contact";

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
      return <ProductsGrid sectionContent={data as ProductsGridContent} />;
    case "home.testimonials":
      return <Testimonials title={data.subtitle} />;
    case "home.turnkeySolutions":
      return <TurnkeySolutions sectionData={data} />;
    case "home.wellnessRoomSetups":
      return <WellnessRoomSetups sectionContent={data} />;
    case "home.wellnessSection":
      return <WellnessSection sectionContent={data as any} />;
      
    case "about.hero":
      return <AboutHero sectionContent={data} />;

    case "about.ourStory":
      return <AboutWellnessSection sectionContent={data as any} />;

    case "about.statsStrip":
      return <StatsStrip sectionContent={data as any} />;

    case "about.industriesWeServe":
      const IndustriesComp: any = IndustriesWeServe;
      return <IndustriesComp sectionContent={data} />;

    case "about.ourProducts":
      return <OurProductsSection sectionContent={data as any} />;
    case "about.testimonials":
      return <Testimonials title={data.subtitle} />;
    // case "about.ourExpertise":
    //   return <ExpertiseSection sectionContent={data as any} />;

    case "about.wellnessSection":
      return <WellnessSection {...(data as any)} />;

    case "about.ourTurnkeyProcess":
      const TurnkeyProcessComp: any = TurnkeyProcess;
      return <TurnkeyProcessComp sectionContent={data as any} />;

    case "about.aboutEnsis":
      const AboutEnsisComp: any = AboutEnsisSection;
      return <AboutEnsisComp sectionContent={data as any} />;

    // case "about.whyChooseEnsis":
    //   return <WhyChooseEnsis sectionContent={data as any} />;

    case "about.letsBuild":
      return <WellnessBanner sectionContent={data as any} />;

    case "about.founderVision":
      return <FounderSection sectionContent={data as any} />;

    case "turnkey.banner":
      return <TurnkeyHero sectionContent={data as TurnkeyHeroContent} />;
    case "turnkey.completeSolutions":
      return <TurnkeySolutionsSection sectionContent={data as TurnkeySolutionsContent} />;
    case "turnkey.customized":
      return <TurnkeyWhyChoose sectionContent={data as TurnkeyWhyChooseContent} />;
    case "turnkey.facilities":
      return <FacilitiesWeBuild sectionContent={data as FacilitiesWeBuildContent} />;
    case "turnkey.whatIsTurnkey":
      return <TrunkeyMeaning sectionContent={data as TurnkeyMeaningContent} />
    case "turnkey.readyToBuild":
      return <WellnessCtaBanner sectionContent={data as WellnessCtaBannerContent} />
    case "turnkey.featuredProjects":
      return <FeaturedProjects sectionContent={data as any} />

    case "consultancy.hero":
      return <ConsultancyHero sectionContent={data as any} />;
    case "consultancy.readyToGetStarted":
      return <ConsultancyCTA sectionContent={data as any} />;
    case 'consultancy.whyChooseOurProcess':
      return <HowWeWork sectionContent={data as any} />
    case "consultancy.whatWeOffer":
      return <ConsultancyServices sectionContent={data as any} />


    case "contact.featuresStrip":
      return <SupportHighlights sectionContent={data as SupportHighlightsContent} />;
    case "contact.getInTouch":
      return <ContactSection sectionContent={data as ContactSectionContent} />;
    case "contact.hero":
      return <ContactHero sectionContent={data as ContactHeroContent} />;

    case "blog.allBlogs":
      return <BlogSection sectionContent={data} />;
    case "blog.mediaResources":
      return <SupportSection sectionContent={data} />;
    case 'blog.hero':
      return <BlogHeroSection sectionContent={data} />;
    case "blog.stayInspired":
      return <NewsletterCard sectionContent={data as any} />;
    case "blog.supportWellness":
      return <WellnessResources sectionContent={data as any} />;

    case "product.hero":
      return <HeroSlider sectionContent={data as HeroSliderContent} />
    case "product.featureStrip":
      return <WellnessFeatureStrip sectionContent={data as WellnessFeatureStripContent} />
    case "product.trustedBy":
      return <TrustedBrandsStrip sectionContent={data as TrustedBrandsStripContent} />
    case "product.whyChoose":
      const ProductWhyChooseComp: any = ProductWhyChoose;
      return <ProductWhyChooseComp sectionContent={data as WhyChooseContent} />
    case "product.testimonials":
      return <Testimonials title={data.subtitle} />
    case "product.productsection":
      return <Products {...(data as any)} />
    case "projects.banner":
      return <ProjectsBanner sectionContent={data} />
    case "projects.contactSection":
  return<ContactBanner  sectionContent={data}/> 
  case "projects.ourClients":
    return <OurClients sectionContent={data} />
    case "projects.ourProjects":
  return <FeaturedProjects  sectionContent={data}/> 
  case "projects.whyPartner":
return<WhyPartner sectionContent={data}/>
    default:
      return null;
  }
}