import Image from "next/image";
import wellness from "@/assets/about/wellness.webp"
import { Container } from "../ui/Container";
import { Download, Phone } from "lucide-react";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrCatalogOption } from "react-icons/gr";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import { getImageUrl } from "@/lib/api/api";

export interface WellnessBannerContent { // Renamed to WellnessBannerContent
  title?: string;
  description?: string;
  imageurl?: { imageUrl: string; alt?: string }; // Changed to imageurl to match usage
  primaryAction: { label: string; url: string }; // Changed to primaryAction
  secondaryAction: { label: string; url: string }; // Changed to secondaryAction
}

interface WellnessBannerProps { // Renamed to WellnessBannerProps for the component
  sectionContent: WellnessBannerContent; // Use the new interface
}

export default function WellnessBanner({
sectionContent
}: WellnessBannerProps) {
  return (
    <section className="w-full relative">
          <div className="absolute inset-0">
          <Image
            src={sectionContent.imageurl ? getImageUrl(sectionContent?.imageurl?.imageUrl) : wellness}
            alt={sectionContent.imageurl?.alt || sectionContent.title || "Wellness Banner"} // Added fallback for alt
            className="h-full w-full object-cover"
            fill
            crossOrigin="anonymous"
            sizes="100vw"
          />
        </div>
      <Container className="relative mx-auto overflow-hidden rounded-md py-4!">
        {/* Background Image */}
      

        {/* Content */}
        <div className="relative z-10 grid min-h-[180px] grid-cols-1 items-center gap-8 px-0 md:grid-cols-2 md:px-0 lg:px-0">
          {/* Left Side */}
          <div className="max-w-xl">
            <h2 className="    text-[28px]
            font-semibold
            tracking-[2px] leading-[120%]
            uppercase
            font-serif text-[#f5efe6]">
              {sectionContent.title}
            </h2>

            <p className="mt-3 text-sm text-[#ddd1c1] md:text-[15px] ">
              {sectionContent.description}
            </p>

            {/* Buttons */}
            <div className="mt-3 flex flex-wrap gap-4">

<GreenButton leftIcon={<Phone className="text-[#050A1A]" size={16} />} text={sectionContent.primaryAction.label} path={sectionContent.primaryAction.url} rightIcon={<FaArrowRightLong />} />
  <BookButton leftIcon={<GrCatalogOption className="text-white" size={16} />} text={sectionContent.secondaryAction.label} rightIcon={<Download size={16} className="text-white" />}  path={sectionContent.secondaryAction.url} />
</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
