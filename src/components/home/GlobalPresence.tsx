import React from 'react';
import { Container } from '../ui/Container';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import globe from "@/assets/icons/globe.webp"
import SubHeading from './SubHeading';
import { getComponentContent, getImageUrl } from '@/app/lib/api';

export const GlobalPresence = async () => {
  const fallback = {
    eyebrow: "GLOBAL PRESENCE",
    heading: "Trusted by Wellness\nProfessionals Worldwide",
    description: "Exporting to 25+ countries and growing stronger every day",
    image: globe,
    stats: [
    { value: "25+", label: "Countries" },
    { value: "500+", label: "Projects" },
    { value: "10+", label: "Years of Excellence" },
    { value: "100%", label: "Customer Satisfaction" }
    ],
  };
  const content = await getComponentContent<typeof fallback>("home.globalPresence", fallback);

  return (
    <section className="bg-[#f3eee6]">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr_1fr] py-2">
          <div>
            <SubHeading className=' text-black' text={content.eyebrow} />
            <h2 className="mt-2 whitespace-pre-line font-serif text-3xl leading-[100%] text-[#1f261b] font-semibold">{content.heading}</h2>
            <p className="mt-3 text-xs text-[#5f5a50]">
              {content.description}
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            {typeof content.image === "string" && content.image ? (
              <Image src={getImageUrl(content.image)} alt="globe" width={500} height={150} className="object-cover object-top max-h-[150px]" crossOrigin="anonymous" />
            ) : (
              <Image src={globe} alt="globe" width={500} height={150} className="object-cover object-top max-h-[150px]" crossOrigin="anonymous" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-4">
            {content.stats.map((stat, index) => (
              <div key={index}>
                <span className="block text-3xl font-semibold text-[#334022]">{stat.value}</span>
                <span className="mt-1 block text-xs font-semibold text-[#5f5a50]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
