import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Container } from '../ui/Container';
import img15 from '@/assets/home/img-15.webp';
import god from '@/assets/icons/ihouse.webp';
import resort from '@/assets/icons/resort.webp';
import wellness from '@/assets/icons/wellness.webp';
import ayurveda from '@/assets/icons/ayurveda.webp';
import interior from '@/assets/icons/interior.webp';



import Image, { type StaticImageData } from 'next/image';
import SubHeading from './SubHeading';
import {  getImageUrl } from '@/lib/api/api';
import GreenButton from '../ui/GreenButton';
import HtmlRenderer from '../layout/HtmlRender';

type ImageSource = string | StaticImageData;

interface TurnkeySolutionsProps {
  sectionData?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    backgroundImage?: ImageSource;
    solutions?: {
      imgUrl?: ImageSource;
      title: string;
    }[];
  };
}

export const TurnkeySolutions = async ({ sectionData }: TurnkeySolutionsProps) => {
  const fallback = {
    eyebrow: sectionData?.eyebrow || "TURNKEY WELLNESS SOLUTIONS",
    heading: sectionData?.heading || "From Concept to\nComplete Wellness Setup",
    description: sectionData?.description || "We provide end-to-end solutions for Panchkarma Clinics, Resorts, Hospitals & Wellness Centers.",
    buttonText: sectionData?.buttonText || "BOOK DESIGN CONSULTATION",
    buttonHref: sectionData?.buttonHref || "/contact",
    backgroundImage: sectionData?.backgroundImage || img15,
    solutions: sectionData?.solutions || [
      { imgUrl: god, title: "Panchkarma Clinic Setup" },
      { imgUrl: resort, title: "Resort & Spa Setup" },
      { imgUrl: wellness, title: "Wellness Retreat Design" },
      { imgUrl: ayurveda, title: "Ayurveda Hospital Equipment" },
      { imgUrl: interior, title: "Interior & Equipment Integration" }
    ],
  };
  const content = fallback;
  const backgroundImage = typeof content.backgroundImage === "string" && content.backgroundImage ? getImageUrl(content.backgroundImage) : img15.src;
  return (
    <section className="relative overflow-hidden bg-cover bg-center text-white">
      <Image src={backgroundImage} alt="Background" fill className="object-cover z-0" crossOrigin="anonymous"/>
      <Container className="py-6 relative z-10">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.6fr] lg:items-center md:w-[85%]">
          <div className="flex">
            <div className="">
              <SubHeading className=' text-[#d5ad6a]' text={content.eyebrow} />
              <h2 className="text-xl md:text-3xl">{content.heading}</h2>
              <HtmlRenderer className="mt-2 max-w-[420px] text-base leading-relaxed text-[#ddd6ca]" content={content.description}>
                
              </HtmlRenderer>
              <div className='mt-2 w-[200px]'>
              <GreenButton text={content.buttonText} leftIcon={<MessageCircle className="text-[#050A1A]" size={16}/>} rightIcon={<ArrowRight className="text-[#050A1A]" size={16}/>} path={content.buttonHref || "tel:+919654900525"} />
              </div>
            </div>
         <div className="py-8 self-stretch hidden lg:flex items-stretch px-6">
  <div className="w-px bg-white/40 h-full" />
</div>
          </div>
          <div className="grid gap-4 lg:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {content.solutions.map((solution, index) => {
              const fallbackIcon = fallback.solutions[index % fallback.solutions.length].imgUrl;
              const icon = solution.imgUrl || fallbackIcon;
              return (
                <div key={index} className="text-center items-center sm:flex-row sm:items-center">
                  <div className="mx-auto  flex size-14 items-center justify-center text-[#d5ad6a]">
                    {typeof icon === "string" ? (
                      <Image src={getImageUrl(icon)} alt={solution.title} width={250} height={150} className="object-contain" crossOrigin="anonymous" />
                    ) : (
                      <Image src={icon||""} alt={solution.title} width={250} height={150} className="object-contain" crossOrigin="anonymous" />
                    )}
                  </div>
                  <span className="text-base font-semibold text-[#f3eee6] w-20! leading-snug">{solution.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
