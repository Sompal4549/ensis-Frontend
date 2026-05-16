import React from 'react';
import { ArrowRight, Building, Home, Activity, Cross, Ruler } from 'lucide-react';
import { Container } from '../ui/Container';
import img15 from '@/assets/home/img-15.webp';
import god from '@/assets/icons/god.webp';
import info from "@/assets/icons/info.png"
import tf3 from "@/assets/icons/tf3.png"
import info1 from "@/assets/icons/info1.png"
import info2 from "@/assets/icons/info2.webp"
import Image from 'next/image';



export const TurnkeySolutions = () => {
  const solutions = [
    { imgUrl:god, title: "Panchkarma Clinic Setup" },
    { imgUrl:info, title: "Resort & Spa Setup" },
    { imgUrl:tf3, title: "Wellness Retreat Design" },
    { imgUrl:info1, title: "Ayurveda Hospital Equipment" },
    { imgUrl:info1, title: "Interior & Equipment Integration" }
  ];

  return (
    <section className="relative overflow-hidden bg-cover bg-center text-white" style={{ backgroundImage: `url(${img15.src})` }}>
      <Container className="">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-center md:w-[85%]">
          <div className="border-r-0 border-[#d6b67c]/30 pr-0 lg:border-r lg:pr-12">
            <span className="text-[11px] font-bold tracking-widest text-[#d5ad6a]">TURNKEY WELLNESS SOLUTIONS</span>
            <h2 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">From Concept to<br />Complete Wellness Setup</h2>
            <p className="mt-4 max-w-[420px] text-sm leading-6 text-[#ddd6ca]">
              We provide end-to-end solutions for Panchkarma Clinics, Resorts, Hospitals & Wellness Centers.
            </p>
            <button className="mt-6 inline-flex items-center gap-3 border border-[#d6b67c]/70 px-5 py-3 text-[11px] font-bold tracking-wide text-white transition-colors hover:bg-white/10 rounded-md">
              BOOK DESIGN CONSULTATION <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {solutions.map((solution, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-3 flex size-14 items-center justify-center text-[#d5ad6a]">
                  <Image src={solution.imgUrl} alt={solution.title} width={250} height={150} />
                </div>
                <span className="text-xs font-semibold text-[#f3eee6] !w-20 leading-2">{solution.title}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
