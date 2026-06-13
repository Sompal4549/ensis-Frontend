import React from 'react'
import expert_consultation from "@/assets/products/expert_consultation.webp"
import custom_design from "@/assets/products/custom_design.webp"
import installation from "@/assets/products/comlete_installation.webp"
import planning from "@/assets/products/planning2.webp"

import Image from 'next/image'
import { Container } from '../ui/Container'
import { DownloadIcon } from 'lucide-react'
import { FaPhone } from 'react-icons/fa'
import Link from 'next/link'
import GreenButton from '../ui/GreenButton'
const features = [
  { icon: expert_consultation, label: "Expert Consultation" },
  { icon: custom_design, label: "Custom Design" },
  { icon: installation, label: "Complete Installation" },
];

const Planning = () => {
  return (
    <section className="relative w-full ">
  {/* Background image already applied by parent */}
 <div className="absolute inset-y-0 right-0 w-[100%] block">
  <Image
    alt="planning bg"
    fill
    src={planning}
    className="object-cover object-center"
  />

  {/* Blend Gradient */}
</div>
  <Container className="relative z-10">
    <div className="flex flex-col lg:flex-row lg:items-center py-16 lg:gap-40">

      {/* Left Content */}
      <div className="max-w-xl">
        <h2 className=" text-white text-3xl leading-tight font-medium">
          Planning a Wellness Center?
        </h2>

        <p className="mt-2 text-white text-sm font-normal max-w-sm">
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

<div className=" flex gap-4 md:gap-2 mt-6 flex-wrap ">
<div className='min-w-[220px] '>
<GreenButton path="tel:+919654900525" text="TALK TO OUR EXPERT" rightIcon={<FaPhone/>}/>

</div>
<Link href="https://ensis.in/pdf/e-broucher.pdf" target='_blank'>
        <button className="min-w-[220px] py-1 px-4 border border-white text-white text-xs font-semibold tracking-wide hover:bg-white/5 transition-all rounded-md flex items-center gap-2 justify-center">
          DOWNLOAD CATALOGUE <DownloadIcon/>
        </button>
</Link>

      </div>
        </div>
      </div>

      {/* Right Buttons */}
      

    </div>
  </Container>
</section>
  )
}

export default Planning