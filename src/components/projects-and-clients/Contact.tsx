"use client";

import Image, { StaticImageData } from "next/image";
import { Container } from "../ui/Container";
import flower from "@/assets/about/lotus.png";
import left from "@/assets/icons/arrow_left.webp"
import right from "@/assets/icons/arrow_right.webp"
import Link from "next/link";
import GreenButton from "../ui/GreenButton";
import quote from '@/assets/icons/quote.webp';
import contact from "@/assets/projects-and-clients/contact.png"
import contact2 from "@/assets/projects-and-clients/contact2.png"
import client1 from "@/assets/projects-and-clients/client1.webp"
import client2 from "@/assets/projects-and-clients/client2.webp"
import client3 from "@/assets/projects-and-clients/client3.webp"
import arrow from "@/assets/icons/arrow.png"
interface Testimonial {
  logo: string | StaticImageData;
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

export interface ContactSection {
  quote: string;

  testimonials: Testimonial[];

  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;

  contact: ContactInfo;

  leftImage: StaticImageData;
  rightImage: string;

  bottomText: string;
}

const fallbackContactBanner: ContactSection = {
  quote:
    "ENSIS transforms ideas into timeless wellness spaces that create impact, build trust and heal lives.",

  testimonials: [
    {
      logo: client1, // Dummy image for Kairali logo
      company: "Kairali Ayurvedic Group",
      person: "Ms. Anagha Joshi",
      designation: "Managing Director",
    },
    {
      logo: client2, // Dummy image for Somatheeram logo
      company: "Somatheeram Ayurveda Group",
      person: "Dr. Pradeep Sharma",
      designation: "CEO",
    },
    {
      logo: client3, // Dummy image for Arogyadhama logo
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

  leftImage: contact2, // Dummy image for leftImage (even if commented out in JSX)
  rightImage: "https://placehold.co/600x400?text=Contact+Banner",

  bottomText: "Crafting Wellness Spaces. Creating Lasting Legacies.",
};


interface Props {
  sectionContent?: ContactSection;
}

export default function ProjectsContactBanner({
  sectionContent = fallbackContactBanner,
}: Props) {
  return (
    <section className="overflow-hidden bg-[#002112] ">
      <Container className="!py-0">
        <div className="flex">
          {/* Top */}
          <div>

            {/* Middle */}
           <div className="grid lg:grid-cols-[3fr_2fr]">
              {/* CTA */}
              <div className="relative bg-[#002112] pl-10">
                <Image
                  src={sectionContent.leftImage}
                  alt="Wellness"
                  fill
                  className="object-fill z-10 max-w-40"
                />

                {/* <div className="absolute inset-0 bg-[#002112] z-20" /> */}

                <div className="absolute inset-0 flex flex-col justify-center  text-white z-20 pl-50">
                  <h3 className="text-lg  mb-4">
                    {sectionContent.ctaTitle}
                  </h3>

                  <p className="max-w-md mb-6 text-base">
                    {sectionContent.ctaDescription}
                  </p>
                  <div className="max-w-62.5">

                    <GreenButton text={sectionContent.ctaButtonText} path="/projects-and-clients" />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="relative bg-[#f8f2e8] flex">

                <div className="relative z-10 py-4 pl-12">
                  <h3 className="text-xl  font-semibold">
                    Get in Touch
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">

                      <div>
                        <h4 className="font-semibold">
                          {sectionContent.contact.officeName}
                        </h4>

                        <p>{sectionContent.contact.address}</p>
                      </div>
                      <div className="flex gap-4 items-center justify-center">
                         <Image src={arrow} alt='arrow' width={150} height={40} className="max-w-55 sm:max-w-75 md:max-w-87.5" crossOrigin="anonymous" />
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div>

                        <p>{sectionContent.contact.phone}</p>
                        <p>{sectionContent.contact.email}</p>
                        <p>{sectionContent.contact.website}</p>
                      </div>
                      <div className="">
                        <h4 className="font-semibold">
                          Working Hours
                        </h4>

                        <p>{sectionContent.contact.workingDays}</p>
                        <p>{sectionContent.contact.workingHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
          <Image src={contact} alt="contact" width={150} height={150} className="object-fill max-h-[100%]" />

              </div>
            </div>
          </div>
        </div>

      </Container>
        {/* Bottom Strip */}
        <div className="bg-[#032c22] px-4 py-4 text-center">
          <p className="text-base md:text-lg text-[#e4c27c]">
            {sectionContent.bottomText}
          </p>
        </div>

    </section>
  );
}