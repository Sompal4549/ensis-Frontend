import Image from "next/image";
import React from "react";
import ready_to_build2 from "@/assets/trunkey_solutions/ready_to_build (2).webp";

import { Container } from "../ui/Container";
import Link from "next/link";
import HtmlRenderer from "../layout/HtmlRender";


export interface WellnessCtaBannerContent {
  title: string;
  heading: string; // Changed from heading to description in JSX, but keeping heading here for consistency with other components
  description: string;
  buttons: Array<{
    id?: string; // Added id for unique key prop
    title: string;
    description: string;
    image: { imageUrl: string; alt?: string };
    link: string;
  }>;
}

const defaultButtons = [
  { id: "1", title: "Schedule a Call", description: "Talk to our project engineers", link: "/contact", image: { imageUrl: ready_to_build2.src || ready_to_build2, alt: "Call" } },
  { id: "2", title: "Download Brochure", description: "Get the complete 2026 catalog", link: "/contact", image: { imageUrl: ready_to_build2.src || ready_to_build2, alt: "Catalog" } },
  { id: "3", title: "Visit Center", description: "See our setups in Mohan Nagar, NCR", link: "/contact", image: { imageUrl: ready_to_build2.src || ready_to_build2, alt: "Visit" } },
];

const WellnessCtaBanner: React.FC<{ sectionContent?: WellnessCtaBannerContent }> = ({ sectionContent }) => {
  const title = sectionContent?.title || "Ready to Build Your Dream Wellness Space?";
  const heading = sectionContent?.heading || "Connect with our turnkey architects and consultants today.";
  const description = sectionContent?.description || "<p>From concept layout to full equipment installation, Ensis delivers end-to-end excellence.</p>";
  const buttons = (sectionContent?.buttons && sectionContent.buttons.length > 0) ? sectionContent.buttons : defaultButtons;

  return (
    <section className="relative overflow-hidden border border-[#8B6B2E] bg-[#062A22]">
      {/* Absolute Left Image */}
      <div className="absolute left-0 top-0 h-full w-52 hidden lg:block z-10">
        <Image
          src={ready_to_build2}
          alt="Wellness Cta Banner"
          fill
          className="object-cover"
        />
      </div>

      <Container className="z-20">
        {/* pl-[190px] pushes content past the absolute image on lg */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:pl-[150px] py-2">
          {/* Content */}
          <div className="px-4 pt-4 lg:pt-5 lg:flex-1 flex flex-col gap-4">
            <h2 className="text-[#E7C17A] text-lg md:text-xl leading-none font-bold">
              {title}
            </h2>

            <p className="mt-1.5 text-sm text-white leading-relaxed max-w-[520px]">
              {heading}
            </p>
            <HtmlRenderer className="font-semibold text-[#E7C17A]" content={description} />
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 pb-4 lg:pb-0 lg:pr-4">
            {buttons.map((item, idx) => (
              <Link href={item.link || "/contact"}
                key={item.id || item.title || idx}
                className="group flex items-center gap-4 rounded border-2 border-[#8B6B2E] px-3 py-5 h-full text-left transition-all hover:bg-[#0B3A30]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded">
                  <Image
                    src={typeof item.image === 'string' ? item.image : (item.image?.imageUrl || ready_to_build2)}
                    height={28}
                    width={28}
                    alt={item.image?.alt || item.title || ""}
                  />
                </div>

                <div>
                  <div className="text-base text-[#E7C17A] font-semibold leading-none">
                    {item.title}
                  </div>
                  <HtmlRenderer content={item.description || ""}
                   className="mt-0.5 text-base leading-tight text-white mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* Decorative Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(173,130,45,0.15),transparent_40%)]" />
    </section>
  );
};

export default WellnessCtaBanner;