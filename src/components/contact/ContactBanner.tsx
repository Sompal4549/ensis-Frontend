"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Container } from "../ui/Container";
import Image, { StaticImageData } from "next/image";
import HtmlRenderer from "../layout/HtmlRender";
import BookButton from "../ui/BookButton";

export interface ContactBannerProps {
  phone?: string;
  whatsappLink?: string;
  image?: string|StaticImageData;
  title?: string;
  availableTime?: string;
  description?: string;
}

const ContactCtaBanner = ({ sectionContent }: { sectionContent: ContactBannerProps }) => {
  return (
    <section className="py-2 relative">
      <Container>
        <div
          className="
          "
        >

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Section */}
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D9B25F] shadow-lg">
                <Phone
                  className="text-[#0D3A2E]"
                  size={30}
                  strokeWidth={2}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#D9B25F] md:text-2xl">
                  {sectionContent?.title||'Need Immediate Assistance?'}
                </h2>

                <HtmlRenderer content={sectionContent?.description||`Call us now or send a message. Our team will get back to you
                  shortly.`} className="mt-2 max-w-xl text-sm leading-7 text-white/90 md:text-base max-w-[400px]">
                  
                </HtmlRenderer>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-16 w-px bg-[#D9B25F]/40 lg:block" />

            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone
                className="text-[#D9B25F]"
                size={28}
                strokeWidth={2}
              />

              <div>
                <p className="text-xl font-semibold text-white">
                  {sectionContent?.phone}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {sectionContent?.availableTime||'Mon - Sat: 9:00 AM - 6:00 PM'}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-16 w-px bg-[#D9B25F]/40 lg:block" />

            {/* Button */}
            <BookButton leftIcon={
              <MessageCircle className="mr-2" size={15} />

            } rightIcon text="&nbsp; Chat on WhatsApp" path={sectionContent?.whatsappLink}  />
          </div>

          {/* Right Decorative Image */}
        </div>
      </Container>
  
  {/* Background Image */}
  {sectionContent?.image && (
    <Image
      fill
      src={sectionContent.image}
      alt="Spa"
      className="absolute inset-0 h-full w-full object-cover pointer-events-none bg-fill"
    />
  )}

    </section>
  );
};

export default ContactCtaBanner;