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

const fallbackContent: WellnessBannerContent = {
  title: "Ready to Build Your Wellness Space?",
  description: "<p>From concept to commissioning, we design, manufacture and install complete wellness environments. Let our experts help you create spaces that heal.</p>",
  imageurl: { imageUrl: wellness.src, alt: "Wellness Banner" },
  primaryAction: { label: "Get a Free Consultation", url: "/contact" },
  secondaryAction: { label: "Download Catalogue", url: "/contact" },
};

interface WellnessBannerProps {
  sectionContent?: WellnessBannerContent;
}

export default function WellnessBanner({
  sectionContent = {} as WellnessBannerContent
}: WellnessBannerProps) {
  const resolved = { ...fallbackContent, ...sectionContent };
  if (!resolved.primaryAction) resolved.primaryAction = fallbackContent.primaryAction;
  if (!resolved.secondaryAction) resolved.secondaryAction = fallbackContent.secondaryAction;
  return (
    <section className="w-full relative">
      <div className="absolute inset-0">
        <Image
          src={resolved.imageurl ? getImageUrl(resolved?.imageurl?.imageUrl) : wellness}
          alt={resolved.imageurl?.alt || resolved.title || "Wellness Banner"} // Added fallback for alt
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
            <h2 className="    text-2xl
            md:text-[28px]
            font-semibold
            tracking-[2px] leading-[120%]
            uppercase
             text-[#f5efe6]">
              {resolved.title}
            </h2>

            <p className="mt-3 text-base leading-6 text-[#ddd1c1] " dangerouslySetInnerHTML={{ __html: resolved.description || "" }}>
            </p>

            {/* Buttons */}
            <div className="mt-3 flex flex-wrap gap-4">

              <GreenButton leftIcon={<Phone className="text-[#050A1A]" size={16} />} text={resolved.primaryAction.label} path={resolved.primaryAction.url} rightIcon={<FaArrowRightLong />} />
              <BookButton leftIcon={<GrCatalogOption className="text-white" size={16} />} text={resolved.secondaryAction.label} rightIcon={<Download size={16} className="text-white" />} path={resolved.secondaryAction.url} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
