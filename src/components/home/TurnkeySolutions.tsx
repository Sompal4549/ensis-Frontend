import React from 'react';
import { ArrowRight, Building, Home, Activity, Cross, Ruler, ChartNoAxesGanttIcon, MessageCircle } from 'lucide-react';
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
import { BiChat } from 'react-icons/bi';

export const TurnkeySolutions = async () => {
  const fallback = {
    eyebrow: "TURNKEY WELLNESS SOLUTIONS",
    heading: "From Concept to\nComplete Wellness Setup",
    description: "We provide end-to-end solutions for Panchkarma Clinics, Resorts, Hospitals & Wellness Centers.",
    buttonText: "BOOK DESIGN CONSULTATION",
    backgroundImage: img15,
    solutions: [
      { imgUrl: god, title: "Panchkarma Clinic Setup" },
      { imgUrl: resort, title: "Resort & Spa Setup" },
      { imgUrl: wellness, title: "Wellness Retreat Design" },
      { imgUrl: ayurveda, title: "Ayurveda Hospital Equipment" },
      { imgUrl: interior, title: "Interior & Equipment Integration" }
    ],
  };
  const content = await getComponentContent<typeof fallback>("home.turnkeySolutions", fallback);
  const backgroundImage = typeof content.backgroundImage === "string" && content.backgroundImage ? getImageUrl(content.backgroundImage) : img15.src;

  return (
    <section className="relative overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Container className="py-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-center md:w-[85%]">
          <div className="flex">
            <div className="">
              <SubHeading className=' text-[#d5ad6a]' text={content.eyebrow} />
              <h2 className="mt-2 text-xl md:text-3xl">{content.heading}</h2>
              <p className="mt-2 max-w-[420px] text-xs leading-5 text-[#ddd6ca]">
                {content.description}
              </p>
              <button className="mt-4 inline-flex items-center gap-3 border border-white px-3 py-3 text-[11px] font-semibold tracking-wide text-white transition-colors hover:bg-white/10 rounded-md">
                <MessageCircle size={16} /> {content.buttonText} <ArrowRight size={16} />
              </button>
            </div>
         <div className="py-8 self-stretch hidden lg:flex items-stretch px-6">
  <div className="w-px bg-white/40 h-full" />
</div>
          </div>
          <div className="grid gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {content.solutions.map((solution, index) => {
              const fallbackIcon = fallback.solutions[index % fallback.solutions.length].imgUrl;
              const icon = solution.imgUrl || fallbackIcon;
              return (
                <div key={index} className="text-center items-center sm:flex-row sm:items-center">
                  <div className="mx-auto mb-2 flex size-14 items-center justify-center text-[#d5ad6a]">
                    {typeof icon === "string" ? (
                      <Image src={getImageUrl(icon)} alt={solution.title} width={250} height={150} className="object-contain" />
                    ) : (
                      <Image src={icon} alt={solution.title} width={250} height={150} className="object-contain" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#f3eee6] w-20!">{solution.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
