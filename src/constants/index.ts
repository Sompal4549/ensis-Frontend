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

const panchkarmaImages = [img12, img13, img14, img15];
const steamImages = [img13, img4, img8, img12];
const ayurvedicImages = [img1, img3, img8, img15];
const oilImages = [img2, img4, img12, img13];
const spaImages = [img14, img6, img7, img12];
const decorImages = [img16, img13, img9, img15];
const brassImages = [img5, img9, img16, img3];

export interface Product {
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
  images: string | StaticImageData[];
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
    specifications?: { title: string; specificationsList: { title: string; description: string }[] }[];
    keyFeatures?: { title: string; keyFeaturesList: string[] };
    dimensions?: { title: string; dimensionsList: { title: string; description: string }[] }[];
    materialAndCare?: { title: string; description: string };
    productSpecifications?: { highlight: string; title: string; image: string; specifications: { title: string; description: string }[] }[];
    whatisInclueded?: string[];
    items?: { image: string; title: string; description: string }[];
    smartDesignAppearance?: {
      highlight?: string;
      title?: string;
      woodFinish?: string[];
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

export const allProducts: Product[] = [
  {
    id: '1',
    slug: "handcrafted_panchkarma_therapy_table",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Handcrafted Panchkarma Therapy Table",
    title: "Handcrafted Panchkarma Therapy Table",
    price: 58999,
    image: img12,
    badge: "Panchkarma Collection",
    images: panchkarmaImages,
    tag: "Panchkarma Collection",
    description: "Premium handcrafted therapy table designed for authentic Panchkarma treatments. Built with seasoned teak wood and finished with a natural walnut polish for lasting durability.",
    ...defaultProductDetails,
    ...panchkarmaSpecs
  },
  {
    id: '2',
    slug: "luxury_steam_sauna_cabin",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Luxury Steam Sauna Cabin",
    title: "Luxury Steam Sauna Cabin",
    price: 120000,
    image: img13,
    badge: "Steam & Sauna",
    images: steamImages,
    tag: "Steam & Sauna",
    description: "Full-body luxury steam cabin with digital temperature controls, aromatic herb infuser, and tempered glass door. Ideal for professional spas and wellness resorts.",
    ...defaultProductDetails,
    ...spaSpecs
  },
  {
    id: '3',
    slug: "brass_ayurvedic_bowl_set",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Brass Ayurvedic Bowl Set",
    title: "Brass Ayurvedic Bowl Set",
    price: 12500,
    image: img3,
    badge: "Authentic Ayurveda",
    images: ayurvedicImages,
    tag: "Authentic Ayurveda",
    description: "Hand-finished brass bowl set for traditional Ayurvedic preparations. Includes three graduated sizes perfect for mixing herbal pastes and oils.",
    ...defaultProductDetails,
    ...spaSpecs,
  },
  {
    id: '4',
    slug: "wellness_aroma_oil_collection",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Wellness Aroma Oil Collection",
    title: "Wellness Aroma Oil Collection",
    price: 4800,
    image: img4,
    badge: "Essential Oils",
    images: oilImages,
    tag: "Essential Oils",
    description: "Curated collection of therapeutic-grade essential oils sourced from organic farms. Includes lavender, eucalyptus, peppermint, and sandalwood blends.",
    ...defaultProductDetails,
    ...steamSpecs
  },
  {
    id: '5',
    slug: "spa_lounge_wooden_chair",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Spa Lounge Wooden Chair",
    title: "Spa Lounge Wooden Chair",
    price: 18000,
    image: img14,
    badge: "Luxury Spa",
    images: spaImages,
    tag: "Luxury Spa",
    description: "Ergonomically designed wooden lounge chair crafted from premium teak. Features adjustable recline positions and a smooth hand-polished finish.",
    ...defaultProductDetails,
    ...spaSpecs
  },
  {
    id: '6',
    slug: "shirodhara_therapy_stand",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Shirodhara Therapy Stand",
    title: "Shirodhara Therapy Stand",
    price: 24000,
    image: img5,
    badge: "Dhara Therapy",
    images: panchkarmaImages,
    tag: "Dhara Therapy",
    description: "Precision-engineered Shirodhara stand with adjustable height and flow-control valve. Designed for consistent oil drip therapy in clinical settings.",
    ...defaultProductDetails,
    ...ayurvedicSpecs
  },
  {
    id: '7',
    slug: "brass_deepam_lamp",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Brass Deepam Lamp",
    title: "Brass Deepam Lamp",
    price: 6500,
    image: img16,
    badge: "Wellness Decor",
    images: decorImages,
    tag: "Wellness Decor",
    description: "Traditional brass Deepam lamp with intricate hand-engraved motifs. Creates a warm, meditative ambiance for wellness spaces and therapy rooms.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '8',
    slug: "massage_table_with_storage",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Massage Table with Storage",
    title: "Massage Table with Storage",
    price: 36000,
    image: img6,
    badge: "Luxury Spa",
    images: spaImages,
    tag: "Luxury Spa",
    description: "Sturdy massage table with built-in storage compartments for oils, towels, and accessories. Features a cushioned top and moisture-resistant finish.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '9',
    slug: "copper_jal_neti_pot",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Copper Jal Neti Pot",
    title: "Copper Jal Neti Pot",
    price: 2200,
    image: img1,
    badge: "Authentic Ayurveda",
    images: ayurvedicImages,
    tag: "Authentic Ayurveda",
    description: "Pure copper Jal Neti pot for traditional nasal cleansing. Ergonomically shaped spout ensures comfortable and effective sinus irrigation.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '10',
    slug: "therapeutic_oil_set_of_6",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Therapeutic Oil Set of 6",
    title: "Therapeutic Oil Set of 6",
    price: 7200,
    image: img2,
    badge: "Essential Oils",
    images: oilImages,
    tag: "Essential Oils",
    description: "Set of six therapeutic-grade oils formulated for massage, aromatherapy, and body treatments. Cold-pressed and free from synthetic additives.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '11',
    slug: "aromatherapy_diffuser",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Aromatherapy Diffuser",
    title: "Aromatherapy Diffuser",
    price: 3800,
    image: img3,
    badge: "Wellness Decor",
    images: decorImages,
    tag: "Wellness Decor",
    description: "Ultrasonic aromatherapy diffuser with ambient LED lighting. Disperses essential oil mist evenly across treatment rooms for a calming atmosphere.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '12',
    slug: "steam_bath_laydown",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Steam Bath Laydown",
    title: "Steam Bath Laydown",
    price: 53350,
    image: img4,
    badge: "Steam & Sauna",
    images: steamImages,
    tag: "Steam & Sauna",
    description: "Professional steam bath laydown unit with integrated steam generator and adjustable temperature settings. Constructed with marine-grade moisture-resistant materials.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '13',
    slug: "ceremonial_pooja_thali_set",
    categoryKey: "brass",
    category: "BRASS RITUAL ITEMS",
    name: "Ceremonial Pooja Thali Set",
    title: "Ceremonial Pooja Thali Set",
    price: 5500,
    image: img5,
    badge: "Brass Ritual",
    images: brassImages,
    tag: "Brass Ritual",
    description: "Complete brass Pooja thali set with diya, incense holder, bell, and kumkum container. Each piece is handcrafted with traditional artisan techniques.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '14',
    slug: "herbal_powder_steam_cabinet",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Herbal Powder Steam Cabinet",
    title: "Herbal Powder Steam Cabinet",
    price: 45000,
    image: img6,
    badge: "Panchkarma Collection",
    images: panchkarmaImages,
    tag: "Panchkarma Collection",
    description: "Enclosed herbal steam cabinet for Swedana therapy. Features a built-in herb chamber and digital timer for precise treatment sessions.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '15',
    slug: "teak_reception_desk",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Teak Reception Desk",
    title: "Teak Reception Desk",
    price: 62000,
    image: img7,
    badge: "Luxury Spa",
    images: spaImages,
    tag: "Luxury Spa",
    description: "Elegant teak wood reception desk designed for wellness centers and luxury spas. Features ample storage and a hand-polished natural finish.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '16',
    slug: "kansa_wand_facial_massager",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Kansa Wand Facial Massager",
    title: "Kansa Wand Facial Massager",
    price: 1850,
    image: img8,
    badge: "Authentic Ayurveda",
    images: ayurvedicImages,
    tag: "Authentic Ayurveda",
    description: "Traditional Kansa metal facial massager for natural skin rejuvenation. The rounded tip provides gentle lymphatic drainage and improves circulation.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '17',
    slug: "ashwagandha_infused_body_oil",
    categoryKey: "oils",
    category: "ESSENTIAL OILS",
    name: "Ashwagandha Infused Body Oil",
    title: "Ashwagandha Infused Body Oil",
    price: 3200,
    image: img12,
    badge: "Essential Oils",
    images: oilImages,
    tag: "Essential Oils",
    description: "Organic Ashwagandha-infused body oil for deep tissue relaxation and stress relief. Cold-pressed with a blend of sesame and almond base oils.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '18',
    slug: "hand-painted_mandala_wall_panel",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Hand-Painted Mandala Wall Panel",
    title: "Hand-Painted Mandala Wall Panel",
    price: 8900,
    image: img13,
    badge: "Wellness Decor",
    images: decorImages,
    tag: "Wellness Decor",
    description: "Artisan hand-painted Mandala wall panel crafted on premium wood. Adds a meditative focal point to therapy rooms, yoga studios, and spa interiors.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '19',
    slug: "singing_bowl_with_mallet",
    categoryKey: "brass",
    category: "BRASS RITUAL ITEMS",
    name: "Singing Bowl with Mallet",
    title: "Singing Bowl with Mallet",
    price: 4100,
    image: img9,
    badge: "Brass Ritual",
    images: brassImages,
    tag: "Brass Ritual",
    description: "Hand-hammered brass singing bowl with a wooden mallet. Produces rich, resonant tones ideal for sound therapy, meditation, and chakra balancing.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '20',
    slug: "compact_herbal_steam_box",
    categoryKey: "steam",
    category: "STEAM & SAUNA",
    name: "Compact Herbal Steam Box",
    title: "Compact Herbal Steam Box",
    price: 28000,
    image: img8,
    badge: "Steam & Sauna",
    images: steamImages,
    tag: "Steam & Sauna",
    description: "Compact portable steam box for home and small clinic use. Features a foldable design with a built-in herb compartment and quick heat-up system.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '21',
    slug: "abhyanga_drizzle_stand",
    categoryKey: "panchkarma",
    category: "PANCHKARMA EQUIPMENT",
    name: "Abhyanga Drizzle Stand",
    title: "Abhyanga Drizzle Stand",
    price: 19500,
    image: img7,
    badge: "Panchkarma Collection",
    images: panchkarmaImages,
    tag: "Panchkarma Collection",
    description: "Adjustable Abhyanga oil drizzle stand with precision flow control. Ensures consistent warm oil application during traditional massage therapies.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '22',
    slug: "recliner_zero-gravity_chair",
    categoryKey: "spa",
    category: "SPA FURNITURE",
    name: "Recliner Zero-Gravity Chair",
    title: "Recliner Zero-Gravity Chair",
    price: 42000,
    image: img12,
    badge: "Luxury Spa",
    images: spaImages,
    tag: "Luxury Spa",
    description: "Zero-gravity recliner chair with padded cushioning and smooth recline mechanism. Designed for post-treatment relaxation in premium wellness spaces.",
    ...defaultProductDetails,
    ...spaSpecs
  },
  {
    id: '23',
    slug: "marble_mortar_&_pestle",
    categoryKey: "ayurvedic",
    category: "AYURVEDIC ACCESSORIES",
    name: "Marble Mortar & Pestle",
    title: "Marble Mortar & Pestle",
    price: 3600,
    image: img15,
    badge: "Authentic Ayurveda",
    images: ayurvedicImages,
    tag: "Authentic Ayurveda",
    description: "Heavy-duty marble mortar and pestle set for grinding herbs, spices, and medicinal pastes. Polished finish ensures hygienic and easy cleaning.",
    ...defaultProductDetails,
    ...decorSpecs
  },
  {
    id: '24',
    slug: "bamboo_zen_water_fountain",
    categoryKey: "decor",
    category: "WELLNESS DECOR",
    name: "Bamboo Zen Water Fountain",
    title: "Bamboo Zen Water Fountain",
    price: 9200,
    image: img16,
    badge: "Wellness Decor",
    images: decorImages,
    tag: "Wellness Decor",
    description: "Natural bamboo water fountain with a calming cascading flow. Creates soothing ambient sound ideal for spa reception areas and relaxation lounges.",
    ...defaultProductDetails,
    ...spaSpecs
  },
];
export const PAGE_SIZE = 12;
