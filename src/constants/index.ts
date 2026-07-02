import { StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import img3 from '@/assets/home/img-3.webp';
import img2 from '@/assets/home/img-2.webp';
import img1 from '@/assets/home/img-1.webp';
import img4 from '@/assets/home/img-4.webp';
import img5 from '@/assets/home/img-5.webp';
import img14 from '@/assets/home/img-14.webp';
import img16 from '@/assets/home/img-16.webp';
import img12 from '@/assets/home/img-12.webp';
import img6 from '@/assets/home/img-6.webp';
import img13 from '@/assets/home/img-13.webp';
import img7 from '@/assets/home/img-7.webp';
import img8 from '@/assets/home/img-8.webp';
import img9 from '@/assets/home/img-9.webp';
import img15 from '@/assets/home/img-15.webp';
import panchkarma from "@/assets/icons/panchkarma.webp";
import spa from "@/assets/icons/luxury_spas.webp";
import ayurvedic from "@/assets/icons/authentic_ayurveda.webp";
import steam from "@/assets/icons/steam_sauna_icon.webp";
import interior from "@/assets/icons/ihouse.webp";
import wellness_assossries_icon from "@/assets/home/wellness_assossries_icon.webp"
import table from "@/assets/home/table.webp";
import shirodhara_eqipment from "@/assets/icons/shirodhara_eqipment.webp";


export type SocialLink = {
  _id?: string;
  platform: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order: number;
};

export type SocialClick = {
  _id?: string;
  platform: string;
  ip?: string;
  userAgent?: string;
  country?: string;
  createdAt?: string;
};
export interface Product {
  id:string;
  _id:string;
  title: string;
  slug: string;
  code?: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  category: any;
  subcategory?: string;
  material?: string;
  weight?: string;
  images: string[];
  stock: number;
  tags: string[];
  averageRating: number;
  reviews: any;
  isActive: boolean;
  isFeatured: boolean;
  overview?: {
    title?: string;
    description?: string;
    overviewList?: string[];
    specifications?: {
      title?: string;
      specificationsList?: { title: string; description: string }[];
    };
    seeItInRealSpaces:{title:string; images:{image:string; imageAlt:string}[]};
    productPricingFeatures:{title:string; image:string}[];
    emiOptions:boolean;
    customSize:boolean;
    keyFeatures?: {
      title?: string;
      keyFeaturesList?: string[];
    };
    dimensions?: { title: string; dimensionsList: { title: string; description: string }[] };
    materialAndCare?: { title: string; description: string };
    productSpecifications?: { highlight: string; title: string; image: string; specifications: { title: string; description: string }[] }[];
    whatisInclueded?: string[];
    items?: { image: string; title: string; description: string }[];
    smartDesignAppearance?: {
      highlight?: string;
      title?: string;
      woodFinish?: {image:string; title:string}[];
      sizeOptions?: { title: string; description: string }[];
    };
    faqs?: { question: string; description: string }[];
  };
}

const defaultProductDetails = {
  warranty: "5 Years",
  stock: 12,
  rating: 4.9,
  reviews: 128,
  origin: "India",
  careInstructions: "Wipe with dry cloth",
  deliveryTime: "10-15 Business Days",
  installation: "Included",
  certification: "Quality Assured",
  usage: "Commercial & Residential",
  features: [
    "Handcrafted",
    "Premium Finish",
    "Commercial Grade",
    "Easy Maintenance",
  ],
};

const panchkarmaSpecs = {
  material: "Premium Teak Wood",
  finish: "Natural Walnut",
  weight: "85 kg",
};

const spaSpecs = {
  material: "Premium Teak Wood",
  finish: "Luxury Walnut",
  weight: "65 kg",
};

const steamSpecs = {
  material: "Marine Grade Wood",
  finish: "Moisture Resistant",
  weight: "120 kg",
};

const ayurvedicSpecs = {
  material: "Pure Brass & Copper",
  finish: "Hand Polished",
  weight: "2 kg",
};

const decorSpecs = {
  material: "Premium Brass & Wood",
  finish: "Artisan Crafted",
  weight: "5 kg",
};

export const categories = [
  { key: "all", label: "All Products", icon: panchkarma, count: 128 },
  { key: "panchkarma", label: "Panchkarma Equipment", icon: panchkarma, count: 18 },
  { key: "spa", label: "Spa Furniture", icon: spa, count: 16 },
  { key: "ayurvedic", label: "Ayurvedic Accessories", icon: ayurvedic, count: 24 },
  { key: "steam", label: "Steam & Sauna", icon: steam, count: 10 },

  { key: "decor", label: "Wellness Decor", icon: interior, count: 18 },
  { key: "brass", label: "Brass Ritual Items", icon: wellness_assossries_icon, count: 22 },
  { key: "table", label: "Panchkarma Table", icon: table, count: 1 },
  { key: "shirodha", label: "Shirodhara Equipment", icon: shirodhara_eqipment, count: 1 }
];
export const materials = [
  "Teak Wood",
  "Brass",
  "Copper",
  "Stainless Steel",
  "Natural Stone",
  "FRP / Composite",
];

export const idealFor = [
  "Spa & Wellness Centers",
  "Ayurvedic Clinics",
  "Resorts & Hotels",
  "Home Wellness",
];


export const PAGE_SIZE = 12;
export const bannerHeight = "md:h-[calc(100vh-146px)]"