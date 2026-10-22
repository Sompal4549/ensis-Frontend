import type { Product } from "@/constants/index";
import img1 from "@/assets/home/img-1.webp";
import img2 from "@/assets/home/img-2.webp";
import img3 from "@/assets/home/img-3.webp";
import img4 from "@/assets/home/img-4.webp";
import img10 from "@/assets/home/img-10.webp";
import img11 from "@/assets/home/img-11.webp";
import img12 from "@/assets/home/img-12.webp";
import img13 from "@/assets/home/img-13.webp";
import img14 from "@/assets/home/img-14.webp";
import img15 from "@/assets/home/img-15.webp";
import cat1 from "@/assets/products/ayurveda_clinics.webp";
import cat2 from "@/assets/products/panchkarma_rooms.webp";
import cat3 from "@/assets/products/hotel_and_spa_quality.png";
import cat4 from "@/assets/products/handmade_excellence.png";
import cat5 from "@/assets/products/made_in_india.webp";
import cat6 from "@/assets/products/expert_consultation.webp";

const mk = (
  n: number,
  title: string,
  slug: string,
  price: number,
  discountPrice: number,
  category: { name: string; slug: string },
  material: string,
  image: string,
  shortDescription: string,
  tags: string[],
  isFeatured = false
): Product =>
  ({
    _id: `static-product-${n}`,
    id: `static-product-${n}`,
    title,
    slug,
    code: `ENS-PT-${String(n).padStart(3, "0")}`,
    description: `<p>${shortDescription}</p>`,
    shortDescription,
    price,
    discountPrice,
    gstRate: 18,
    category,
    material,
    images: [image],
    stock: 10,
    tags,
    averageRating: 4.5,
    reviews: [],
    isActive: true,
    isFeatured,
    orderBy: n,
    createdAt: new Date("2025-01-01").toISOString(),
    overview: {
      seeItInRealSpaces: { title: "", images: [] },
      productPricingFeatures: [],
      customSize: true,
      emiOptions: true,
      productSpecifications: [],
      whatisInclueded: [],
    },
  }) as unknown as Product;

export const staticCategories = [
  { _id: "static-cat-1", slug: "panchakarma-equipment", name: "Panchakarma Equipment", image: cat1.src },
  { _id: "static-cat-2", slug: "wellness-rooms", name: "Wellness Rooms", image: cat2.src },
  { _id: "static-cat-3", slug: "spa-furniture", name: "Spa Furniture", image: cat3.src },
  { _id: "static-cat-4", slug: "handcrafted-woodwork", name: "Handcrafted Woodwork", image: cat4.src },
  { _id: "static-cat-5", slug: "ayurvedic-accessories", name: "Ayurvedic Accessories", image: cat5.src },
  { _id: "static-cat-6", slug: "custom-solutions", name: "Custom Solutions", image: cat6.src },
];

const panchakarma = { name: "Panchakarma Equipment", slug: "panchakarma-equipment" };
const wellnessRooms = { name: "Wellness Rooms", slug: "wellness-rooms" };
const spaFurniture = { name: "Spa Furniture", slug: "spa-furniture" };
const accessories = { name: "Ayurvedic Accessories", slug: "ayurvedic-accessories" };

export const staticProducts: Product[] = [
  mk(1, "Ayurvedic Steam Bath Chamber", "ayurvedic-steam-bath-chamber", 45000, 39999, panchakarma, "Teak Wood", img1.src,
    "Traditional steam bath chamber crafted in seasoned teak wood for authentic Ayurvedic steam therapy.", ["BESTSELLER"], true),
  mk(2, "Panchakarma Massage Table", "panchakarma-massage-table", 28000, 24999, spaFurniture, "Mahogany", img2.src,
    "Ergonomic panchakarma massage table with cushioned top and drainage, built for professional therapy rooms.", ["PREMIUM"], true),
  mk(3, "Shirodhara Pot & Stand Set", "shirodhara-pot-stand-set", 12000, 9999, accessories, "Brass", img3.src,
    "Hand-finished brass shirodhara pot with adjustable stand for continuous oil therapy.", ["NEW"]),
  mk(4, "Herbal Steam Cabinet", "herbal-steam-cabinet", 52000, 47500, panchakarma, "Stainless Steel", img4.src,
    "Herbal steam cabinet with temperature control and herb compartment for clinical wellness spaces.", ["BESTSELLER"]),
  mk(5, "Ayurvedic Oil Warmer", "ayurvedic-oil-warmer", 6500, 5499, accessories, "Brass", img10.src,
    "Compact ayurvedic oil warmer with precise heat control for abhyanga and shirodhara therapies.", ["NEW"]),
  mk(6, "Luxury Spa Lounge Chair", "luxury-spa-lounge-chair", 34000, 29999, spaFurniture, "Teak Wood", img11.src,
    "Reclining spa lounge chair in solid teak with premium upholstery for reception and relaxation zones.", ["PREMIUM"], true),
  mk(7, "Detox Dry Brushing Station", "detox-dry-brushing-station", 9800, 8499, accessories, "Beech Wood", img12.src,
    "Dry brushing station with natural fibre brushes and wall-mount organizer for detox therapies.", []),
  mk(8, "Abhyanga Therapy Table", "abhyanga-therapy-table", 36500, 32999, spaFurniture, "Mahogany", img13.src,
    "Oil-friendly abhyanga table with sloped drainage and height-adjustable frame.", ["BESTSELLER"]),
  mk(9, "Nasya Steam Inhalation Chair", "nasya-steam-inhalation-chair", 18500, 16499, panchakarma, "Teak Wood", img14.src,
    "Dedicated nasya chair with steam inhalation setup for ENT and head-therapy procedures.", []),
  mk(10, "Wellness Room Partition Screen", "wellness-room-partition-screen", 15500, 13999, wellnessRooms, "Cane & Teak", img15.src,
    "Handcrafted cane and teak partition screen for elegant wellness room separation.", ["NEW"]),
];

export const getStaticProduct = (idOrSlug: string): Product | undefined =>
  staticProducts.find((p) => p.slug === idOrSlug || p._id === idOrSlug || p.id === idOrSlug);
