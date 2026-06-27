import Image, { StaticImageData } from "next/image";
import { Container } from "../ui/Container";
import decorationRight from "@/assets/icons/decoration_right.png"
import flower from "@/assets/about/lotus.png";
import projects from "@/assets/images/projects.webp"
import experience from "@/assets/images/experience.webp"
import professionals from "@/assets/images/professionals.webp"
import pan_india from "@/assets/products/pan_india.webp"
import customized from "@/assets/icons/customized.webp"
import hotels_and_retreats from "@/assets/icons/hotels_and_retreats.webp"
import panchkarma2 from "@/assets/icons/panchkarma2.webp"
import partner from "@/assets/projects-and-clients/ourclients.webp"
 interface PartnerFeature {
  id: string;
  iconSrc: string|StaticImageData;
  iconAlt: string;
  title: string;
  description: string;
}

 interface WhyPartnerBannerData {
  heading: string;
  features: PartnerFeature[];
  decorativeImageSrc: string|StaticImageData;
  decorativeImageAlt: string;
}
interface WhyPartnerBannerProps {
  sectionContent?: WhyPartnerBannerData;
}


 const whyPartnerBannerFallback: WhyPartnerBannerData = {
  heading: "Why Partner with ENSIS?",
  decorativeImageSrc: partner,
  decorativeImageAlt: "Ayurvedic spa items with copper vessels, herbal pouch and candles",
  features: [
    {
      id: "holistic-approach",
      iconSrc: hotels_and_retreats,
      iconAlt: "Building icon representing holistic approach",
      title: "Holistic Approach",
      description: "Blending Ayurveda, design and functionality.",
    },
    {
      id: "end-to-end-solutions",
      iconSrc: customized,
      iconAlt: "Person with gear icon representing end-to-end solutions",
      title: "End-to-End Solutions",
      description: "From concept to completion, we handle it all.",
    },
    {
      id: "authentic-expertise",
      iconSrc:panchkarma2,
      iconAlt: "Mortar and pestle icon representing authentic expertise",
      title: "Authentic Expertise",
      description: "Decades of experience in wellness infrastructure.",
    },
    {
      id: "quality-assured",
      iconSrc:professionals,
      iconAlt: "Badge icon representing quality assurance",
      title: "Quality Assured",
      description: "Premium materials & international standards.",
    },
    {
      id: "timely-delivery",
      iconSrc:projects,
      iconAlt: "Clock icon representing timely delivery",
      title: "Timely Delivery",
      description: "On-time execution with complete transparency.",
    },
    {
      id: "dedicated-support",
      iconSrc: experience,
      iconAlt: "Headset icon representing dedicated support",
      title: "Dedicated Support",
      description: "Continuous support, even after handover.",
    },
  ],
};
export default function WhyPartnerBanner({ sectionContent }: WhyPartnerBannerProps) {
  const banner = sectionContent ?? whyPartnerBannerFallback;

  return (
    <section className="relative w-full overflow-hidden bg-[#0F2E22]">
      {/* Decorative image - hidden on small screens, visible from md up, absolutely positioned on the right */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-56 md:block lg:w-72">
        <Image
          src={banner.decorativeImageSrc}
          alt={banner.decorativeImageAlt}
          fill
          className="object-cover object-left"
          sizes="(max-width: 1024px) 224px, 288px"
        />
      </div>

      <Container className="relative pr-40!">
        {/* Heading */}
        <div className="mb-2 flex items-center gap-3 pt-2">
          <h2 className="font-serif text-xl font-semibold text-[#E8C766] sm:text-2xl">
            {banner.heading}
          </h2>
          <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />
        </div>

        {/* Features */}
     <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6 lg:gap-x-3 lg:divide-x lg:divide-[#E8C766]/20 pb-5 pt-2">
  {banner.features.map((feature) => (
    <div
      key={feature.id}
      className="flex h-full flex-col items-center px-0 text-center lg:px-4 lg:first:px-0"
    >
      {/* Fixed Icon Area */}
      <div className="mb-3 flex h-12 w-12 items-center justify-center">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12">
          <Image
            src={feature.iconSrc}
            alt={feature.iconAlt}
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-1 text-sm font-semibold text-white">
          {feature.title}
        </h3>
        <p className="text-xs leading-snug text-[#CBD5C8] sm:text-sm" dangerouslySetInnerHTML={{__html:feature.description}}>
        </p>
      </div>
    </div>
  ))}
</div>
      </Container>
    </section>
  );
}