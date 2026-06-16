"use client";

import Image from "next/image";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import left from "@/assets/icons/arrow_left.png"
import right from "@/assets/icons/arrow_right.png"
import Link from "next/link";
import GreenButton from "../ui/GreenButton";


interface Testimonial {
  logo: string;
  company: string;
  person: string;
  designation: string;
}

interface ContactInfo {
  officeName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  workingDays: string;
  workingHours: string;
}

interface ContactBannerContent {
  quote: string;

  testimonials: Testimonial[];

  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;

  contact: ContactInfo;

  leftImage: string;
  rightImage: string;

  bottomText: string;
}

const fallbackContactBanner: ContactBannerContent = {
  quote:
    "ENSIS transforms ideas into timeless wellness spaces that create impact, build trust and heal lives.",

  testimonials: [
    {
      logo: "/images/clients/kairali.png",
      company: "Kairali Ayurvedic Group",
      person: "Ms. Anagha Joshi",
      designation: "Managing Director",
    },
    {
      logo: "/images/clients/somatheeram.png",
      company: "Somatheeram Ayurveda Group",
      person: "Dr. Pradeep Sharma",
      designation: "CEO",
    },
    {
      logo: "/images/clients/arogyadhama.png",
      company: "Arogyadhama Ayurveda",
      person: "Dr. Rakesh Nair",
      designation: "Director",
    },
  ],

  ctaTitle: "Let's Build Your Next Landmark in Wellness",

  ctaDescription:
    "Share your project details and our team will connect with you to bring your vision to life.",

  ctaButtonText: "LET'S CONNECT",

  contact: {
    officeName: "Corporate Office",
    address: "ENSIS Head Office, Kochi, Kerala, India",
    phone: "+91 73560 55555",
    email: "info@ensis.in",
    website: "www.ensis.in",
    workingDays: "Mon - Sat",
    workingHours: "9:00 AM - 6:00 PM",
  },

  leftImage: "/images/contact-banner-left.png",
  rightImage: "/images/contact-banner-right.png",

  bottomText: "Crafting Wellness Spaces. Creating Lasting Legacies.",
};


interface Props {
  content?: ContactBannerContent;
}

export default function ContactBanner({
  content = fallbackContactBanner,
}: Props) {
  return (
    <section className="overflow-hidden border border-[#e3d4bf] bg-[#faf5ed]">
      <Container className="!py-0">

        {/* Top */}
        <div className="grid lg:grid-cols-[1fr_2fr] border-b border-[#e3d4bf]">
          {/* Quote */}
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-[#e3d4bf]">
            <p className="text-lg text-[#2f2f2f] leading-relaxed">
              {content.quote}
            </p>
            <div className="flex gap-2 items-center justify-center">
<Image

 src={left}
                    height={35}
                    width={240}
                    alt="flower"
                    className="object-contain object-center w-auto max-w-20 h-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}/>
               <Image
                    src={flower}
                    height={40}
                    width={40}
                    alt="flower"
                    className="h-full object-contain object-center w-auto max-w-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}
                    />
                    <Image

 src={right}
                    height={35}
                    width={240}
                    alt="flower"
                    className="object-contain object-center w-auto max-w-20 h-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}/>
                    </div>
          </div>

          {/* Clients */}
        <div className="grid items-stretch sm:grid-cols-2 lg:grid-cols-3">
  {content.testimonials.map((item, index) => (
    <div
      key={index}
      className="flex h-full flex-col border-b border-[#e3d4bf] p-6 text-center sm:border-b-0 lg:border-r last:border-r-0"
    >
      {/* Fixed Logo Area */}
      <div className="mb-4 flex h-20 items-center justify-center">
        <Image
          src={item.logo}
          alt={item.company}
          width={120}
          height={60}
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h4 className="font-semibold">{item.person}</h4>

        <p className="text-sm text-[#666]">
          {item.designation}
        </p>

        <p className="mt-auto pt-2 text-xs text-[#888]">
          {item.company}
        </p>
      </div>
    </div>
  ))}
</div>
        </div>

        {/* Middle */}
        <div className="grid lg:grid-cols-2">
          {/* CTA */}
          <div className="relative min-h-[320px] bg-[#002112]">
            {/* <Image
              src={content.leftImage}
              alt="Wellness"
              fill
              className="object-cover"
            /> */}

            <div className="absolute inset-0 bg-[#002112]" />

            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-4xl font-serif mb-4">
                {content.ctaTitle}
              </h3>

              <p className="max-w-md mb-6 text-sm md:text-base">
                {content.ctaDescription}
              </p>
<div>

<GreenButton text={content.ctaButtonText} path="/projects-and-clients"/>
</div>
            </div>
          </div>

          {/* Contact */}
          <div className="relative min-h-[320px] bg-[#f8f2e8]">
            <Image
              src={content.rightImage}
              alt="Contact"
              fill
              className="object-cover opacity-20"
            />

            <div className="relative z-10 p-8 md:p-12">
              <h3 className="text-3xl font-serif">
                Get in Touch
              </h3>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">

                  <div>
                    <h4 className="font-semibold">
                      {content.contact.officeName}
                    </h4>

                    <p>{content.contact.address}</p>
                  </div>
          <div className="flex gap-2 items-center justify-center">
<Image

 src={left}
                    height={35}
                    width={240}
                    alt="flower"
                    className="object-contain object-center w-auto max-w-20 h-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}/>
               <Image
                    src={flower}
                    height={40}
                    width={40}
                    alt="flower"
                    className="h-full object-contain object-center w-auto max-w-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}
                    />
                    <Image

 src={right}
                    height={35}
                    width={240}
                    alt="flower"
                    className="object-contain object-center w-auto max-w-20 h-10"
                    crossOrigin="anonymous"
                    style={{ width: "auto" }}/>
                    </div>
                </div>
                <div className="flex items-baseline justify-between">
                <div>

                  <p>{content.contact.phone}</p>
                  <p>{content.contact.email}</p>
                  <p>{content.contact.website}</p>
                </div>
                <div className="">
                  <h4 className="font-semibold">
                    Working Hours
                  </h4>

                  <p>{content.contact.workingDays}</p>
                  <p>{content.contact.workingHours}</p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="bg-[#032c22] px-4 py-4 text-center">
          <p className="text-sm md:text-lg text-[#e4c27c]">
            {content.bottomText}
          </p>
        </div>
      </Container>

    </section>
  );
}