"use client";

import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Container } from "../ui/Container";
import leaf from "@/assets/leaf.webp"
import Image from "next/image";
import BookButton from "../ui/BookButton";
import HtmlRenderer from "../layout/HtmlRender";
export interface PremiumMapProps {
  mapUrl?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  directionsUrl?: string;
  leafImage?: string;
}

const PremiumMap = ({ sectionContent }: { sectionContent: PremiumMapProps }) => {
  return (
    <section className="relative">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          {/* Map */}
          <div className="overflow-hidden rounded-[28px] border border-[#E7E7E7] bg-white shadow-sm">
            <iframe
              src={sectionContent?.mapUrl||"https://www.google.com/maps/dir/28.6654464,77.4012928/Ensis+(Best+Ayurvedic,+Spa+%26+Panchkarma+Equipment+Manufacturer+in+Delhi+NCR),+12%2F29+2nd+Floor,+Site-2,+Sunrise,+Industrial+Area,+Sahibabad,+Ghaziabad,+Uttar+Pradesh+201007/@28.6734721,77.3754897,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x390cf1ead9e1d9e5:0x31a2384cd903039b!2m2!1d77.3887281!2d28.6814285?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"}
              title="Google Maps location of Ensis"
              className="h-[280px] w-full md:h-[350px] lg:h-[430px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {/* Info Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#E7E7E7] bg-[#F8F8F4] p-8 lg:p-10">
            {/* Background Leaves */}
        

            {/* Icon */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9B25F] bg-white shadow-sm">
                <MapPin
                  className="text-[#D9B25F]"
                  size={28}
                  strokeWidth={1.8}
                />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-center lg:text-left text-3xl font-serif font-semibold text-[#0D3A2E]">
              {sectionContent?.title||""}
            </h2>

            <div className="mt-3 mb-6 h-[3px] w-12 rounded-full bg-[#D9B25F]" />

            <HtmlRenderer className="text-center lg:text-left text-base leading-8 text-[#374151]" content={sectionContent?.description||""}>
              
            </HtmlRenderer>
            <div className="max-w-[250px] mt-4">

            <BookButton path={sectionContent?.directionsUrl||"https://www.google.com/maps/dir/28.6654464,77.4012928/Ensis+(Best+Ayurvedic,+Spa+%26+Panchkarma+Equipment+Manufacturer+in+Delhi+NCR),+12%2F29+2nd+Floor,+Site-2,+Sunrise,+Industrial+Area,+Sahibabad,+Ghaziabad,+Uttar+Pradesh+201007/@28.6734721,77.3754897,14z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x390cf1ead9e1d9e5:0x31a2384cd903039b!2m2!1d77.3887281!2d28.6814285?entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"} leftIcon={<MapPin color="#D9B25F" size={18} />} rightIcon text={sectionContent?.buttonText||""} />
            </div>
          </div>
        </div>
      </Container>
          <Image
              src={sectionContent?.leafImage||leaf}
              alt="Leaves"
              className="pointer-events-none absolute bottom-0 right-0 w-28 opacity-30 md:w-36"
              width={36}
              height={36}
            />
    </section>
  );
};

export default PremiumMap;