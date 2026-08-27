import React from "react";
import since from "@/assets/about_new/since.webp"
import Image from "next/image";
import { Container } from "../ui/Container";
import our_story_image from "@/assets/about_new/our_story_image.webp"
import successfull_projects from "@/assets/about_new/successfull_projects.webp"
import happy_clients from "@/assets/about_new/200.webp"
import states from "@/assets/about_new/28.webp"
import in_house from "@/assets/about_new/in_house_manufacture.webp"
import quality_promise from "@/assets/about_new/100.webp"
import ayurved from "@/assets/about_new/ayurveda_centric.png"
import quality from "@/assets/about_new/quality_and_durability.png"
import innovation from "@/assets/about_new/innovation.png"
import customer_satisfaction from "@/assets/about_new/innovation.png"
import integrity from "@/assets/about_new/integrity.png"
import { getImageUrl } from "@/lib/api/api";
import { gridColsClass } from "@/constants/grid";

interface ImageUrlData {
  imageUrl: string;
  alt: string;
}

interface AboutWellnessSectionValue {
  title: string;
  imageurl: ImageUrlData;
}

interface AboutWellnessSectionStat {
  title: string;
  subtitle: string;
  imageurl: ImageUrlData;
}

interface AboutWellnessSectionContent {
  heading: string;
  title: string;
  description: string;
  ourCoreValues: AboutWellnessSectionValue[];
  stats: AboutWellnessSectionStat[];
  imageurl: ImageUrlData; // For the main image
}

const fallbackContent: AboutWellnessSectionContent = {
  heading: "Our Story",
  title: "Crafting Wellness Since 2003",
  description: `
    <p class="text-base font-semibold leading-6 mt-4">
      ENSIS, the wellness division of Design House India Pvt. Ltd.,
      was established in 2003 with a vision to create authentic,
      durable and aesthetically superior wellness solutions.
    </p>
    <p class="text-base font-semibold leading-6 ">
      We combine the wisdom of Ayurveda with modern engineering to
      build products and spaces that deliver healing, comfort and
      long-term value.
    </p>
    <p class="text-base font-semibold leading-6 ">
      Today, ENSIS is a preferred partner for clinics, hospitals,
      resorts, spas and wellness entrepreneurs across India.
    </p>
  `,
  imageurl: { imageUrl: our_story_image.src, alt: "Wellness Building" },
  ourCoreValues: [
    { title: "Ayurveda Centric Design", imageurl: { imageUrl: ayurved.src, alt: "Ayurveda Centric Design" } },
    { title: "Quality & Durability", imageurl: { imageUrl: quality.src, alt: "Quality & Durability" } },
    { title: "Innovation & Functionality", imageurl: { imageUrl: innovation.src, alt: "Innovation & Functionality" } },
    { title: "Customer Satisfaction", imageurl: { imageUrl: customer_satisfaction.src, alt: "Customer Satisfaction" } },
    { title: "Integrity & Transparency", imageurl: { imageUrl: integrity.src, alt: "Integrity & Transparency" } },
  ],
  stats: [
    { title: "2003", subtitle: "In Wellness Industry", imageurl: { imageUrl: since.src, alt: "Years Experience" } },
    { title: "1000+", subtitle: "Successful Projects", imageurl: { imageUrl: successfull_projects.src, alt: "Projects Completed" } },
    { title: "200+", subtitle: "Satisfied Clients", imageurl: { imageUrl: happy_clients.src, alt: "Happy Clients" } },
    { title: "28", subtitle: "States Across India", imageurl: { imageUrl: states.src, alt: "States Served" } },
    { title: "In-house", subtitle: "Manufacturing Unit", imageurl: { imageUrl: in_house.src, alt: "In-house Manufacturing" } },
    { title: "100%", subtitle: "Quality Promise", imageurl: { imageUrl: quality_promise.src, alt: "Quality Promise" } },
  ],
};

const AboutWellnessSection = ({
  sectionContent = {} as AboutWellnessSectionContent,
}: {
  sectionContent?: AboutWellnessSectionContent;
}) => {
  const resolved = { ...fallbackContent, ...sectionContent };

  const gridCols = gridColsClass(resolved.stats?.length || 6);

  return (
    <section className="w-full relative mt-2">
        <div className="absolute left-0 w-[100%] md:w-[40%] top-0 h-50 md:h-full md:bottom-8 z-10">
            <Image
              src={getImageUrl(resolved.imageurl.imageUrl)}
              alt={resolved.imageurl.alt}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              fill
            />
        </div>
  {/* <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_20%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,1)_100%)] z-10" /> */}
      <Container>
        <div  className="relative z-20 md:pt-0 pt-[60%]  mb-12">
       <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1.4fr_0.8fr] gap-4 items-stretch overflow-hidden h-full md:pb-10">
  {/* Gradient Overlay */}

          {/* Left Image */}
          <div className="overflow-hidden rounded-2xl">
        
          </div>

          {/* Center Content */}
          <div className=" md:px-6 md:py-7 flex flex-col justify-center">
            <span className="text-base uppercase tracking-[2px] bg-[#e5c18e] border-[#e29222] border text-center rounded-2xl text-[#5e3b0a] inline-block font-semibold mb-2 w-35 ">
              {resolved.heading}
            </span>

            <h2 className="text-xl md:text-[28px] leading-[1.15] font-semibold ">
            {resolved.title}
            </h2>
            <div className="max-w-[480px]">
              <div
                className="text-base font-semibold md:leading-6 my-2"
                dangerouslySetInnerHTML={{ __html: resolved.description }}
              />
             </div>
          </div>

          {/* Right Values Card */}
          <div>

        <div className="bg-[#efe5d5] rounded-2xl px-5 py-6">
            <h3 className="text-lg font-semibold mb-5">
              Our Core Values
            </h3>

            <div className="space-y-2">
              {resolved.ourCoreValues.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* Icon Placeholder */}
                  <div className="w-9 h-9">
                    <Image alt={item.imageurl.alt} src={getImageUrl(item.imageurl.imageUrl)} width={30} height={30} className="object-contain"
                    crossOrigin="anonymous" style={{ height: "auto" }} />
                  </div>

                  <span className="text-base  font-semibold">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          </div>

        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-4 bg-[#03261b] rounded-2xl py-4 px-5 border-3 border-[#e8c37a] md:absolute -bottom-10 left-0 right-0">
          <div className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-x-4 gap-y-6 ${gridCols}`}>
            {resolved.stats.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pr-6 md:border-r border-[#aa8f47] last:border-r-0"
              >
                {/* Icon Placeholder */}
                <div className="mt-1 shrink-0 w-10 h-10 flex items-center justify-center">
                    <Image alt={item.imageurl.alt} src={getImageUrl(item.imageurl.imageUrl)} width={70} height={50} className="object-contain" crossOrigin="anonymous" style={{ height: "auto" }} />
                </div>

                <div>
                  <p className="text-base font-semibold text-[#e8c37a]">
                    {item.title}
                  </p>

                  <p className="mt-1 text-base leading-5 text-white font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutWellnessSection;