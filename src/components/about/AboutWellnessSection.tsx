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

const AboutWellnessSection = () => {
  const stats = [
    { title: "2003", subtitle: "In Wellness Industry", image: since},
    { title: "1000+", subtitle: "Successful Projects", image: successfull_projects},
    { title: "200+", subtitle: "Satisfied Clients", image: happy_clients},
    { title: "28", subtitle: "States Across India", image: states},
    { title: "In-house", subtitle: "Manufacturing Unit", image: in_house},
    { title: "100%", subtitle: "Quality Promise", image: quality_promise},
  ];

  const values = [
    {text:"Ayurveda Centric Design", image:ayurved},
    {text:"Quality & Durability", image:quality},
    {text:"Innovation & Functionality", image:innovation},
   {text: "Customer Satisfaction", image:customer_satisfaction},
   {text: "Integrity & Transparency", image:integrity},
  ];

  return (
    <section className="w-full relative">
        <div className="absolute left-0 w-[35%] top-0 bottom-8 z-10">
            <Image
              src={our_story_image}
              alt="Wellness Building"
              className="w-full h-full object-cover"
            />
        </div>
  {/* <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_20%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,1)_100%)] z-10" /> */}
      <Container className="relative z-20 p-0! ">
       <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1.6fr_0.8fr] gap-4 items-stretch overflow-hidden h-full">
  {/* Gradient Overlay */}

          {/* Left Image */}
          <div className="overflow-hidden rounded-2xl">
        
          </div>

          {/* Center Content */}
          <div className=" px-6 py-7 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[2px] bg-[#e5c18e] border-[#e29222] border text-center rounded-2xl text-[#5e3b0a] inline-block font-semibold mb-2 w-25 ">
              Our Story
            </span>

            <h2 className="text-[28px] leading-[1.15] font-semibold max-w-[520px]">
              From Vision to India’s
              <br/> Wellness Manufacturing Leader
            </h2>

            <p className="text-xs font-semibold leading-6 mt-4">
              ENSIS, the wellness division of Design House India Pvt. Ltd.,
              was established in 2003 with a vision to create authentic,
              durable and aesthetically superior wellness solutions.
            </p>

            <p className="text-xs font-semibold leading-6 ">
              We combine the wisdom of Ayurveda with modern engineering to
              build products and spaces that deliver healing, comfort and
              long-term value.
            </p>

            <p className="text-xs font-semibold leading-6 ">
              Today, ENSIS is a preferred partner for clinics, hospitals,
              resorts, spas and wellness entrepreneurs across India.
            </p>
          </div>

          {/* Right Values Card */}
        <div className="bg-[#efe5d5] rounded-2xl px-5 py-6">
            <h3 className="text-lg font-semibold mb-5">
              Our Core Values
            </h3>

            <div className="space-y-2">
              {values.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* Icon Placeholder */}
                  <div className="w-9 h-9">
                    <Image alt={item.text} src={item.image} width={30} height={30} className="object-contain" />
                  </div>

                  <span className="text-xs  font-semibold">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-4 bg-[#033d2f] rounded-2xl py-5 px-5 border-3 border-[#e8c37a]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 border-r border-[#aa8f47] last:border-r-0 px-4"
              >
                {/* Icon Placeholder */}
                <div className="w-10 h-10">
                    <Image alt={item.title} src={item.image} width={40} height={40} className="object-contain"/>
                </div>

                <div>
                  <h4 className="text-[#e8c37a] text-lg font-semibold leading-none">
                    {item.title}
                  </h4>

                  <p className="text-[10px] text-white mt-1 leading-4">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutWellnessSection;