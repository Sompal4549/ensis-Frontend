
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
  console.log(features, "features")
  return (
  <section className="overflow-hidden bg-[#f7f5f2]">
      {/* BG IMAGE */}
   <div className="relative z-0 h-[calc(100vh-96px)]">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${sectionContent.bgImage})`,
      }}
    />

  <Container className="relative z-10 h-full">
      <div className="grid h-full grid-cols-1 lg:grid-cols-2 items-start pt-10 md:pt-14 lg:pt-20 xl:pt-24">
          {/* LEFT CONTENT */}
         <div className="max-w-[700px] flex flex-col justify-center">
    <p className="mb-4 text-[12px] font-bold tracking-[1.8px] text-[#d66a38] uppercase">
              {sectionContent.heading}
            </p>

       <h1 className="max-w-[650px] text-[34px] leading-[1.1] font-semibold lg:text-5xl">
        <span className="font-sans">

        
              {sectionContent.title}
              <br />
              {sectionContent.titlepart1}{" "}
              <span className="text-[#2563eb]">
                {sectionContent.titleHighlight}
              </span>
              {" "}{sectionContent.titlepart2}
              </span>
            </h1>

           <p className="mt-4 max-w-[520px] text-[15px]">
              {sectionContent.description}
            </p>

            {/* FEATURES */}
           <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {sectionContent.features.map((item) => (
                <div key={item.title} className="flex gap-4">
                  {/* ICON */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#edf3ff]">
                    {/* ADD FEATURE ICON HERE */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={24}
                      height={24}
                      />
                  </div>

                  <div>
                   <h3 className="text-xs font-semibold">
                      {item.title}
                    </h3>

                <p className="mt-1 text-[11px]" dangerouslySetInnerHTML={{__html:item.description}}>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <BookButton text={sectionContent.primaryButton.label} path={sectionContent.primaryButton.href}/>
          
<GreenButton text={sectionContent.secondaryButton.label} path={sectionContent.secondaryButton.href} rightIcon={<Download size={16} />} />
            </div>
          </div>
        </div>

    
      </Container>
      </div>
<Container className="relative z-20 md:-mt-[45px]">
            {/* STATS CARD */}
        <div>
          <div className="rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {features.items.map((item, index) => (
                <div
                  key={item.title}
                  className="relative flex items-center gap-5 px-8 py-2 lg:px-10"
                >
                  {/* VERTICAL DIVIDER */}
                  {index !== 0 && (
                    <div className="absolute left-0 top-1/2 hidden h-[58px] -translate-y-1/2 border-l border-[#e6e8ee] xl:block" />
                  )}

                  {/* ICON */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full
                    ${
                      index === 0
                        ? "bg-[#fff3e5]"
                        : index === 1
                        ? "bg-[#eef3ff]"
                        : index === 2
                        ? "bg-[#edf8ef]"
                        : "bg-[#f6ecff]"
                    }`}
                  >
                    {/* ADD STAT ICON HERE */}
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={32}
                      height={32}
                    />
                  </div>

                  <div>
                    <div className="text-md font-bold leading-none"> {/* This should be item.value */}
                      {item.heading}
                    </div>

                    <div className="mt-1 text-sm font-semibold">
                      {item.title}
                    </div>

                    <div className="mt-1 text-xs" dangerouslySetInnerHTML={{__html:item.description}}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
}