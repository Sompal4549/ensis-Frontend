import { StaticImageData } from 'next/image';
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

export interface Product {
  id: number;
  category: string;
  categoryKey: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  badge?: string;
  slug: string;
}





export const categories = [
  { key: "all", label: "All Products", icon: panchkarma, count: 128 },
  { key: "panchkarma", label: "Panchkarma Equipment", icon: panchkarma, count: 18 },
  { key: "spa", label: "Spa Furniture", icon: spa, count: 16 },
  { key: "ayurvedic", label: "Ayurvedic Accessories", icon: ayurvedic, count: 24 },
  { key: "steam", label: "Steam & Sauna", icon: steam, count: 10 },
 
  { key: "decor", label: "Wellness Decor", icon:interior, count: 18 },
  { key: "brass", label: "Brass Ritual Items", icon: wellness_assossries_icon, count: 22 },
  {key:"table", label:"Panchkarma Table", icon:table, count:1},
   {key:"shirodha", label:"Shirodhara Equipment", icon:shirodhara_eqipment, count:1}
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

export const allProducts: Product[] = [
  {
    id: 1,
    slug: "handcrafted_panchkarma_therapy_table",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Handcrafted Panchkarma Therapy Table",
    price: 58999,
    image: img12,
  },
  {
    id: 2,
    slug: "luxury_steam_sauna_cabin",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Luxury Steam Sauna Cabin",
    price: 120000,
    image: img13,
  },
  {
    id: 3,
    slug: "brass_ayurvedic_bowl_set",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Brass Ayurvedic Bowl Set",
    price: 12500,
    image: img3,
  },
  {
    id: 4,
    slug: "wellness_aroma_oil_collection",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Wellness Aroma Oil Collection",
    price: 4800,
    image: img4,
  },
  {
    id: 5,
    slug: "spa_lounge_wooden_chair",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Spa Lounge Wooden Chair",
    price: 18000,
    image: img14,
  },
  {
    id: 6,
    slug: "shirodhara_therapy_stand",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Shirodhara Therapy Stand",
    price: 24000,
    image: img5,
  },
  {
    id: 7,
    slug: "brass_deepam_lamp",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Brass Deepam Lamp",
    price: 6500,
    image: img16,
  },
  {
    id: 8,
    slug: "massage_table_with_storage",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Massage Table with Storage",
    price: 36000,
    image: img6,
  },
  {
    id: 9,
    slug: "copper_jal_neti_pot",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Copper Jal Neti Pot",
    price: 2200,
    image: img1,
  },
  {
    id: 10,
    slug: "therapeutic_oil_set_of_6",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Therapeutic Oil Set of 6",
    price: 7200,
    image: img2,
  },
  {
    id: 11,
    slug: "aromatherapy_diffuser",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Aromatherapy Diffuser",
    price: 3800,
    image: img3,
  },
  {
    id: 12,
    slug: "steam_bath_laydown",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Steam Bath Laydown",
    price: 53350,
    image: img4,
  },
  {
    id: 13,
    slug: "ceremonial_pooja_thali_set",
    categoryKey: "brass",
    category: "BRASS RITUAL ITEMS",
    name: "Ceremonial Pooja Thali Set",
    price: 5500,
    image: img5,
  },
  {
    id: 14,
    slug: "herbal_powder_steam_cabinet",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Herbal Powder Steam Cabinet",
    price: 45000,
    image: img6,
  },
  {
    id: 15,
    slug: "teak_reception_desk",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Teak Reception Desk",
    price: 62000,
    image: img7,
  },
  {
    id: 16,
    slug: "kansa_wand_facial_massager",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Kansa Wand Facial Massager",
    price: 1850,
    image: img8,
  },
  {
    id: 17,
    slug: "ashwagandha_infused_body_oil",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Ashwagandha Infused Body Oil",
    price: 3200,
    image: img12,
  },
  {
    id: 18,
    slug: "hand-painted_mandala_wall_panel",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Hand-Painted Mandala Wall Panel",
    price: 8900,
    image: img13,
  },
  {
    id: 19,
    slug: "singing_bowl_with_mallet",
    categoryKey: "brass",
    category: "BRASS RITUAL ITEMS",
    name: "Singing Bowl with Mallet",
    price: 4100,
    image: img9,
  },
  {
    id: 20,
    slug: "compact_herbal_steam_box",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Compact Herbal Steam Box",
    price: 28000,
    image: img8,
  },
  {
    id: 21,
    slug: "abhyanga_drizzle_stand",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Abhyanga Drizzle Stand",
    price: 19500,
    image: img7,
  },
  {
    id: 22,
    slug: "recliner_zero-gravity_chair",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Recliner Zero-Gravity Chair",
    price: 42000,
    image: img12,
  },
  {
    id: 23,
    slug: "marble_mortar_&_pestle",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Marble Mortar & Pestle",
    price: 3600,
    image: img15,
  },
  {
    id: 24,
    slug: "bamboo_zen_water_fountain",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Bamboo Zen Water Fountain",
    price: 9200,
    image: img16,
  },
];
export const PAGE_SIZE = 12;
