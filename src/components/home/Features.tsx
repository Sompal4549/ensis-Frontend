import React from 'react';
import { Factory, Settings, Award, Layers } from 'lucide-react';
import { Container } from '../ui/Container';
import inhouse from "@/assets/icons/in_house_manufacture.webp"
import info2 from "@/assets/icons/customized.webp"
import trunkey from "@/assets/icons/trunkey.webp"
import Image from 'next/image';
import exportIcon from "@/assets/icons/export_quality.webp"
import { getComponentContent, getImageUrl } from '@/app/lib/api';

type FeatureItem = {
  imgurl: any;
  title: string;
  desc: string;
};

export const Features = async () => {
  const fallbackFeatures: FeatureItem[] = [
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
  const content = await getComponentContent<{ features: FeatureItem[] }>("home.features", { features: fallbackFeatures });
  const features = content.features?.length ? content.features : fallbackFeatures;

  return (
   <section className="static lg:absolute lg:z-10 lg:-bottom-16 lg:left-1/2 lg:-translate-x-1/2 container mx-auto max-w-300">
      <div className=' border-y border-[#e5dccf] bg-[#f3eee6] rounded-xl py-4 md:py-6 px-6 md:px-10'>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const fallbackIcon = fallbackFeatures[index % fallbackFeatures.length].imgurl;
            const icon = feature.imgurl || fallbackIcon;
            return (
            <div key={index} className="flex items-start gap-5 ">
              <div className="mt-1 shrink-0 text-[#a17d4a] rounded-full w-15 h-15 p-2 bg-white flex items-center justify-center">
                {typeof icon === "string" ? (
                  <Image src={getImageUrl(icon)} alt={feature.title} width={70} height={50} className="rounded-full object-contain object-center" />
                ) : (
                  <Image src={icon} alt={feature.title} width={70} height={50} className='rounded-full object-contain object-center' />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1f261b]">{feature.title}</h3>
                <p className="mt-2 max-w-[220px] text-xs leading-5 text-[#5f5a50]">{feature.desc}</p>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
};
