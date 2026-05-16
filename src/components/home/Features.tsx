import React from 'react';
import { Factory, Settings, Award, Layers } from 'lucide-react';
import { Container } from '../ui/Container';
import info1 from "@/assets/icons/info1.png"
import info2 from "@/assets/icons/info2.png"
import info3 from "@/assets/icons/info3.png"
import info4 from "@/assets/icons/info4.png"
import Image from 'next/image';

export const Features = () => {
  const features = [
    {

imgurl:info1,
      title: "In-house Manufacturing",
      desc: "Premium quality products crafted in our own facility"
    },
    {

imgurl:info1,
      title: "Customized Solutions",
      desc: "Tailored equipment as per your space & requirement"
    },
    {

imgurl:info1,
      title: "Export Quality Standards",
      desc: "International standards with strict quality control"
    },
    {

imgurl:info1,
      title: "Turnkey Wellness Solutions",
      desc: "From concept to complete wellness setup"
    }
  ];

  return (
    <section className="border-y border-[#e5dccf] bg-[#f3eee6] ">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-5">
              <div className="mt-1 shrink-0 text-[#a17d4a]">
                <Image src={feature.imgurl} alt={feature.title} width={70} height={50} className='rounded-full' />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1f261b]">{feature.title}</h3>
                <p className="mt-2 max-w-[220px] text-xs leading-5 text-[#5f5a50]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
