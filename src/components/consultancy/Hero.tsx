import React from "react";
import { Container } from "../ui/Container";
import Image, { StaticImageData } from "next/image";

import { Download } from "lucide-react";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import { getComponentContent } from "@/lib/api/api";

type Feature = {
  title: string; // Used for item.title
  description: string; // Used for item.description
items:{title:string;
  image:string;
  heading:string;
  description:string
}[]// Used for item.image
};

type Stat = {
  value: string; // Used for item.heading
  title: string;
  description: string;
  icon: string | StaticImageData;
};



interface ConsultancyHeroContent {
  bgImage: string;
  heading: string;
  title: string;
  titlepart1: string;
  description:string;
  titleHighlight: string;
  titlepart2: string;
  features: Array<{
    image: any;
    title: string;
    description: string;
  }>;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
}

export default async function ConsultancyHero({ sectionContent }: { sectionContent: ConsultancyHeroContent }) { // Changed to async function
 const features = await getComponentContent("consultancy.features", {}) as { items: { title: string; image: string; heading: string; description: string }[] };
return (
  <section className="relative bg-[#f7f5f2] md:pb-16">
    {/* Hero */}
    <div className="relative h-auto md:h-[calc(100vh-146px)]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${sectionContent.bgImage})`,
        }}
      />

      <Container className="relative z-10 h-full">
        <div className="grid h-full grid-cols-1 lg:grid-cols-2 items-start pt-10 md:pt-14 lg:pt-20 xl:pt-24 pb-10 lg:pb-24">
          {/* LEFT */}
          <div className="max-w-[700px] flex flex-col justify-center">
            <p className="mb-4 text-[12px] font-bold tracking-[1.8px] uppercase text-[#d66a38]">
              {sectionContent.heading}
            </p>

            <h1 className="max-w-[650px] text-[34px] font-semibold leading-[1.1] lg:text-5xl">
              <span className="font-sans">
                {sectionContent.title}
                <br />
                {sectionContent.titlepart1}{" "}
                <span className="text-[#2563eb]">
                  {sectionContent.titleHighlight}
                </span>{" "}
                {sectionContent.titlepart2}
              </span>
            </h1>

            <p
              className="mt-4 max-w-[520px] text-[15px]"
              dangerouslySetInnerHTML={{
                __html: sectionContent.description,
              }}
            />

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {sectionContent.features.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="object-contain shrink-0"
                  />

                  <div>
                    <h3 className="text-xs font-semibold line-clamp-3">{item.title}</h3>

                    <p
                      className="mt-1 text-[11px] line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <BookButton
                text={sectionContent.primaryButton.label}
                path={sectionContent.primaryButton.href}
              />

              <GreenButton
                text={sectionContent.secondaryButton.label}
                path={sectionContent.secondaryButton.href}
                rightIcon={<Download size={16} />}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* DESKTOP CARD — moved inside the hero's own relative wrapper so
          bottom-0 anchors to the hero's actual bottom edge. Previously this
          was a direct child of <section>, which has lg:pb-32; bottom-0 is
          measured from the padding box, so the card was anchoring 128px
          below the hero (plus the translate-y-1/2 on top of that), making
          it land fully below the banner instead of half-overlapping it. */}
      <div className="hidden lg:block absolute left-0 right-0 bottom-0 translate-y-1/2 z-30">
        <Container>
          <div className="rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-4">
              {features.items.map((item, index) => (
                <div
                  key={item.title}
                  className="relative flex items-center gap-5 px-8 py-5"
                >
                  {index !== 0 && (
                    <div className="absolute left-0 top-1/2 h-[58px] -translate-y-1/2 border-l border-[#e6e8ee]" />
                  )}

                  <Image
                    src={item.image}
                    alt={item.title}
                    width={52}
                    height={52}
                    className="object-contain"
                  />

                  <div>
                    <div className="font-bold">
                      {item.heading}
                    </div>

                    <div className="text-sm font-semibold mt-1">
                      {item.title}
                    </div>

                    <div
                      className="text-xs mt-1"
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>

    {/* MOBILE CARD */}
    <div className="block lg:hidden mt-6">
      <Container>
        <div className="rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
            {features.items.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={52}
                  height={52}
                  className="object-contain"
                />

                <div>
                  <div className="font-bold">
                    {item.heading}
                  </div>

                  <div className="font-semibold text-sm">
                    {item.title}
                  </div>

                  <div
                    className="text-xs mt-1"
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  </section>
);
}