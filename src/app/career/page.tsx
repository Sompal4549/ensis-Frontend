import CareerBenefits from '@/components/career/Benefits'
import CareersSection from '@/components/career/CareerSection'
import CareersBanner from '@/components/career/Hero'
import TalentCommunityBanner from '@/components/career/TalentCommunityBanner'
import WhyWorkSection from '@/components/career/WhyWorkSection'
import { Testimonials } from '@/components/home/Testimonials'
import WellnessFeatureStrip from '@/components/products/WellnessFeatureStrip'
import sustainable_material from "@/assets/products/sustainable_material.png"
import ayurvedic_heritage from "@/assets/products/ayurvedic_heritage.png"
import handmade_excellence from "@/assets/products/handmade_excellence.png"
import therapist_approved from "@/assets/products/therapist_approved.png"
import hotel_spa_quality from "@/assets/products/hotel_and_spa_quality.png"
import global_shipping from "@/assets/products/global_shippning.png"
import Image from "next/image";

import React from 'react'
import PageBuilder from '@/components/PageBuilder'
import { generateSeo } from '@/lib/api/seo'

const defaultContent = {
  subtitle: "VOICES FROM ENSIS",
  testimonials: [
    {
      text: "ENSIS gives me the freedom to think, create and grow. The work we do truly makes a difference.",
      name: "Arjun Mehta",
      role: "Senior Interior Designer",
      image: "",
    },
    {
      text: "A supportive team, meaningful projects and a culture built on trust—ENSIS feels like home.",
      name: "Neha Sharma",
      role: "Project Manager",
      image: "",
    },
    {
      text: "I love how we blend tradition with innovation. Every day here is fulfilling.",
      name: "Ravi S.",
      role: "Mechanical Engineer",
      image: "",
    },
    {
      text: "Every product that leaves our floor carries our pride. ENSIS taught me precision truly matters.",
      name: "Priya Iyer",
      role: "Production Supervisor",
      image: "",
    },
    {
      text: "The trust our clients place in us pushes me to grow a little more every single day.",
      name: "Karan Patel",
      role: "Business Development Executive",
      image: "",
    },
    {
      text: "Attention to detail isn't just a process here—it's part of who we are.",
      name: "Meera Nair",
      role: "Quality Engineer",
      image: "",
    },
    {
      text: "Working at ENSIS means turning ancient wellness wisdom into spaces people fall in love with.",
      name: "Vikram Rao",
      role: "Design Lead",
      image: "",
    },
    {
      text: "What stands out most is how genuinely ENSIS cares about its people, not just its products.",
      name: "Ananya Das",
      role: "HR Manager",
      image: "",
    },
  ],
};
export async function generateMetadata() {
  return generateSeo("career");
}
const CareerPage = () => {
  return (
    <div>
         <PageBuilder slug="career" />
    </div>
  )
}

export default CareerPage