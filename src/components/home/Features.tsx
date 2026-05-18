import React from 'react';
import { Factory, Settings, Award, Layers } from 'lucide-react';
import { Container } from '../ui/Container';
import inhouse from "@/assets/icons/in_house.webp"
import info2 from "@/assets/icons/customized.webp"
import trunkey from "@/assets/icons/trunkey.webp"
import Image from 'next/image';
import exportIcon from "@/assets/icons/export.webp"

export const Features = () => {
  const features = [
    {
      imgurl: inhouse,
      title: "In-house Manufacturing",
      desc: "Premium quality products crafted in our own facility"
    },
    {
      imgurl: info2,
      title: "Customized Solutions",
      desc: "Tailored equipment as per your space & requirement"
    },
    {
      imgurl: exportIcon,
      title: "Export Quality Standards",
      desc: "International standards with strict quality control"
    },
    {
      imgurl: trunkey,
      title: "Turnkey Wellness Solutions",
      desc: "From concept to complete wellness setup"
    }
  ];

  return (
    <section className=" relative z-10 -top-16">
      <div className='container mx-auto px-6 md:px-10 max-w-[1200px] py-4 md:py-6 border-y border-[#e5dccf] bg-[#f3eee6] rounded-xl'>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-5 ">
              <div className="mt-1 shrink-0 text-[#a17d4a] rounded-full w-15 h-15">
                <Image src={feature.imgurl} alt={feature.title} width={70} height={50} className='rounded-full object-contain object-center' />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1f261b]">{feature.title}</h3>
                <p className="mt-2 max-w-[220px] text-xs leading-5 text-[#5f5a50]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
