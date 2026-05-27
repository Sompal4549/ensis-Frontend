import React from 'react'
import expert_consultation from "@/assets/products/expert_consultation.webp"
import custom_design from "@/assets/products/custom_design.webp"
import installation from "@/assets/products/comlete_installation.webp"
import planning from "@/assets/products/planning_at_right.webp"

import Image from 'next/image'
import { Container } from '../ui/Container'
const features = [
  { icon: expert_consultation, label: "Expert Consultation" },
  { icon: custom_design, label: "Custom Design" },
  { icon: installation, label: "Complete Installation" },
];

const Planning = () => {
  return (
    <section className="relative w-full bg-[#1E2412]">
  {/* Background image already applied by parent */}
 <div className="absolute inset-y-0 right-0 w-[40%] hidden lg:block">
  <Image
    alt="planning bg"
    fill
    src={planning}
    className="object-fill object-center"
  />

  {/* Blend Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f16] via-[#0f1f16]/60 to-transparent" />
</div>
  <Container className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-center py-4 lg:py-8 lg:gap-40">

      {/* Left Content */}
      <div className="max-w-xl">
        <h2 className="font-serif text-white text-3xl leading-tight font-medium">
          Planning a Wellness Center?
        </h2>

        <p className="mt-2 text-white text-base max-w-md">
          We provide end-to-end solutions from concept to completion.
          Let's build your dream wellness space.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5">
          {features.map((feature, index)=>{
            return (
 <div className="flex items-center gap-2" key={index}>
            <Image src={feature.icon} width={30} height={30} className="object-contain" alt="expert_consultation" />
            <span className="text-white text-xs sm:text-sm">
             {feature.label}
            </span>
          </div>
            )
          })}


        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex flex-col gap-3 mt-6 lg:mt-0 lg:items-start">

        <button className="min-w-[220px] py-2 px-4 bg-[#c89a4b] hover:bg-[#d3a85b] text-white text-sm font-medium tracking-wide transition-all rounded-md">
          TALK TO OUR EXPERT
        </button>

        <button className="min-w-[220px] py-2 px-4 border border-[#c89a4b] text-white text-sm font-medium tracking-wide hover:bg-white/5 transition-all rounded-md">
          DOWNLOAD CATALOGUE
        </button>

      </div>

    </div>
  </Container>
</section>
  )
}

export default Planning