import React from 'react';
import { ArrowRight, Building, Home, Activity, Cross, Ruler } from 'lucide-react';
import { Container } from '../ui/Container';
import img15 from '@/assets/home/img-15.webp';
import god from '@/assets/icons/ihouse.webp';
import resort from '@/assets/icons/resort.webp';
import wellness from '@/assets/icons/wellness.webp';
import ayurveda from '@/assets/icons/ayurveda.webp';
import interior from '@/assets/icons/interior.webp';


import info from "@/assets/icons/info.png"
import tf3 from "@/assets/icons/tf3.png"
import info1 from "@/assets/icons/info1.png"
import info2 from "@/assets/icons/info2.webp"
import Image from 'next/image';
import SubHeading from './SubHeading';
import { getComponentContent, getImageUrl } from '@/app/lib/api';

export const TurnkeySolutions = async () => {
  const fallback = {
    eyebrow: "TURNKEY WELLNESS SOLUTIONS",
    heading: "From Concept to\nComplete Wellness Setup",
    description: "We provide end-to-end solutions for Panchkarma Clinics, Resorts, Hospitals & Wellness Centers.",
    buttonText: "BOOK DESIGN CONSULTATION",
    backgroundImage: img15,
    solutions: [
    { imgUrl:god, title: "Panchkarma Clinic Setup" },
    { imgUrl:resort, title: "Resort & Spa Setup" },
    { imgUrl:wellness, title: "Wellness Retreat Design" },
    { imgUrl:ayurveda, title: "Ayurveda Hospital Equipment" },
    { imgUrl:interior, title: "Interior & Equipment Integration" }
    ],
  };
  const content = await getComponentContent<typeof fallback>("home.turnkeySolutions", fallback);
  const backgroundImage = typeof content.backgroundImage === "string" && content.backgroundImage ? getImageUrl(content.backgroundImage) : img15.src;

  return (
    <section className="relative overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Container className="">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-center md:w-[85%]">
          <div className="border-r-0 border-[#d6b67c]/30 pr-0 lg:border-r lg:pr-12">
          <SubHeading className=' text-[#d5ad6a]' text={content.eyebrow} />
            <h2 className="mt-2 whitespace-pre-line font-serif text-3xl leading-tight md:text-4xl">{content.heading}</h2>
            <p className="mt-4 max-w-[420px] text-sm leading-6 text-[#ddd6ca]">
              {content.description}
            </p>
            <button className="mt-6 inline-flex items-center gap-3 border border-[#d6b67c]/70 px-5 py-3 text-[11px] font-bold tracking-wide text-white transition-colors hover:bg-white/10 rounded-md">
              {content.buttonText} <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {content.solutions.map((solution, index) => {
              const fallbackIcon = fallback.solutions[index % fallback.solutions.length].imgUrl;
              const icon = solution.imgUrl || fallbackIcon;
              return (
              <div key={index} className="text-center items-center text-center sm:flex-row sm:items-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center text-[#d5ad6a]">
                  {typeof icon === "string" ? (
                    <Image src={getImageUrl(icon)} alt={solution.title} width={250} height={150} className="object-contain" />
                  ) : (
                    <Image src={icon} alt={solution.title} width={250} height={150} className="object-contain" />
                  )}
                </div>
                <span className="text-xs font-semibold text-[#f3eee6] !w-20 leading-2">{solution.title}</span>
              </div>
            )})}
          </div>
        </div>
      </Container>
    </section>
  );
};
