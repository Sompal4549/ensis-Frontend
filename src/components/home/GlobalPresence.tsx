import React from 'react';
import { Container } from '../ui/Container';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import globe from "@/assets/icons/globe.webp"
import SubHeading from './SubHeading';

export const GlobalPresence = () => {
  const stats = [
    { value: "25+", label: "Countries" },
    { value: "500+", label: "Projects" },
    { value: "10+", label: "Years of Excellence" },
    { value: "100%", label: "Customer Satisfaction" }
  ];

  return (
    <section className="bg-[#f3eee6]">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[0.6fr_1.2fr_1fr]">
          <div>
            <SubHeading className=' text-[#8d6a3a]' text='GLOBAL PRESENCE' />
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[#1f261b]">Trusted by Wellness<br />Professionals Worldwide</h2>
            <p className="mt-3 text-sm leading-6 text-[#5f5a50]">
              Exporting to 25+ countries and growing stronger every day
            </p>
          </div>
          
          <div className="relative min-h-[180px] overflow-hidden">
            <Image src={globe} alt='globe' height={200} width={500} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <span className="block text-3xl font-bold text-[#334022]">{stat.value}</span>
                <span className="mt-1 block text-xs font-semibold text-[#5f5a50]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
