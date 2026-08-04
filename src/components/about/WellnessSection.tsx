import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getComponentContent, getImageUrl } from "@/lib/api/api";

import flower from "@/assets/about/lotus.png";
import { Container } from "../ui/Container";
import welcome from "@/assets/about/welcome_to_ensis.webp";
import table from "@/assets/home/table.webp";
import shirodhara_eqipment from "@/assets/icons/shirodhara_eqipment.webp";
import steam_sauna from "@/assets/icons/steam_sauna_icon.webp";
import wellness_assossries from "@/assets/home/wellness_assossries_icon.webp";

interface WellnessData{
                welcomeImage: string;
                eyebrow: string;
                heading: string;
                description: string;
                buttonText: string;
                buttonHref: string;
                services:
                    {
                        image: string;
                        "title": string;
                        "description":string;
                        link:string;
                    }[]
            }
            interface WellnessSectionProps {
  sectionContent: WellnessData;
}
const WellnessSection: React.FC<WellnessSectionProps> = async ({
  sectionContent,
}) => {

  return (
    <section>
      <Container className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.8fr] gap-4 items-stretch pt-2">
        
        {/* Left Content */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-md h-full min-h-[200px] relative">
            <Image 
              src={sectionContent.welcomeImage}
              alt="Ayurveda"
              fill
              className="object-cover"
              crossOrigin="anonymous"
            />
          </div>

          {/* Text */}
          <div className="h-full flex flex-col py-5">
            <div className="flex gap-1 mb-2 flex-col">
              <span className="uppercase tracking-[2px] text-[#a9742a] text-sm font-semibold">
                {sectionContent.eyebrow}
              </span>
              <div className="flex gap-4 items-center">
                <div className="w-16 h-[1px] bg-[#c9a870]" />
                <Image 
                  src={flower} 
                  height={20} 
                  width={20} 
                  alt="flower" 
                  className="h-full object-contain object-center w-auto max-w-5" 
                  crossOrigin="anonymous" 
                  style={{ width: "auto" }} 
                />
                <div className="w-16 h-[1px] bg-[#c9a870]" />
              </div>
            </div>

            <h2 className="text-[#0f2518] text-[24px] leading-[1.2] max-w-[450px] font-semibold">
              {sectionContent.heading}
            </h2>

            <p 
              dangerouslySetInnerHTML={{ __html: sectionContent.description || "" }} 
              className="text-[#0f2518] mt-2 text-xs max-w-[480px] leading-6" 
            />

            <Link href={sectionContent.buttonHref || "/about"} className="group flex items-center gap-4 text-[#b78942] uppercase tracking-[1px] text-xs font-semibold pt-2 w-fit py-2">
              {sectionContent.buttonText || "Know More"}
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
         {sectionContent.services.map((service, index) => {
  const serviceImageSrc =
    typeof service.image === "string" && service.image
      ? getImageUrl(service.image)
      : "/images/placeholder.png";

  return (
    <div
      key={index}
      className="bg-[#f8f2ea] border border-[#e6d8c5] rounded-2xl px-4 py-4 text-center shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-stretch h-full"
    >
      {/* Icon Circle */}
      <div className="w-16 h-16 p-2 mx-auto rounded-full border-[2.5px] border-[#c9a870] flex items-center justify-center mb-2">
        <Image
          src={serviceImageSrc}
          alt={service.title}
          width={30}
          height={30}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Title */}
      <p className="text-[#0f2518] text-[14px] font-semibold uppercase tracking-wide">
        {service.title}
      </p>

      {/* Description */}
      <div
        className="text-[#0f2518] text-[11px] mt-2 min-h-[60px]"
        dangerouslySetInnerHTML={{
          __html: service.description || "",
        }}
      />

      {/* Footer */}
      <div>
        <div className="w-full h-[1px] bg-[#d5bc94] mx-auto my-2" />

        <Link
          href={service.link || "/products"}
          className="group flex items-center justify-center gap-1 mx-auto text-[#0f2518] text-[10px] uppercase tracking-wide font-semibold py-2"
        >
          View Products

          <ChevronRight
            size={16}
            className="text-[#b78942] transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
})}
        </div>
      </Container>
    </section>
  );
};

export default WellnessSection;