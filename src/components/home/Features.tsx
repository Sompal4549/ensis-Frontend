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
  imgUrl: any;
  title: string;
  desc: string;
};

export const Features = async () => {
  const fallbackFeatures: FeatureItem[] = [
    {
      imgUrl: inhouse,
      title: "In-house Manufacturing",
      desc: "Premium quality products crafted in our own facility"
    },
    {
      imgUrl: info2,
      title: "Customized Solutions",
      desc: "Tailored equipment as per your space & requirement"
    },
    {
      imgUrl: exportIcon,
      title: "Export Quality Standards",
      desc: "International standards with strict quality control"
    },
    {
      imgUrl: trunkey,
      title: "Turnkey Wellness Solutions",
      desc: "From concept to complete wellness setup"
    }
  ];
  const content = await getComponentContent<{ features: FeatureItem[] }>("home.features", { features: fallbackFeatures });
  const features = content.features?.length ? content.features : fallbackFeatures;
  return (
  <Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
      <div className=' border-y border-[#e5dccf] bg-[#f3eee6] rounded-xl py-3 px-3'>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
         {features.map((feature, index) => {
  const fallbackIcon =
    fallbackFeatures[index % fallbackFeatures.length].imgUrl;

  const icon = feature.imgUrl || fallbackIcon;

  return (
    <div
      key={index}
      className={`flex items-start gap-4 pr-6 ${
        index !== features.length - 1
          ? "border-r border-[#d6c2a0]"
          : ""
      }`}
    >
      <div className="mt-1 shrink-0 text-[#a17d4a] rounded-full w-14 h-14 p-2 bg-white flex items-center justify-center border-2 border-[#c8a45d]">
        {typeof icon === "string" ? (
          <Image
            src={getImageUrl(icon)}
            alt={feature.title}
            width={70}
            height={50}
            className="rounded-full object-contain object-center"
            crossOrigin="anonymous"
          />
        ) : (
          <Image
            src={icon}
            alt={feature.title}
            width={70}
            height={50}
            className="rounded-full object-contain object-center"
            crossOrigin="anonymous"
          />
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-[#0f2518]">
          {feature.title}
        </p>

        <p className="mt-1 text-xs leading-4 text-[#0f2518] font-medium " dangerouslySetInnerHTML={{__html:feature.desc}}>
        </p>
      </div>
    </div>
  );
})}
        </div>
      </div>
    </Container>
  );
};
