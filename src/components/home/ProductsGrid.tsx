import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Container } from '../ui/Container';

import img3 from '@/assets/home/img-3.webp';
import img4 from '@/assets/home/img-4.webp';
import img5 from '@/assets/home/img-5.webp';
import img14 from '@/assets/home/img-14.webp';
import img16 from '@/assets/home/img-16.webp';
import img12 from '@/assets/home/img-12.webp';
import img6 from '@/assets/home/img-6.webp';
import img13 from '@/assets/home/img-13.webp';

import SubHeading from './SubHeading';
import { getComponentContent, getImageUrl, productApi, type Product } from '@/app/lib/api';

const fallbackImageMap: Record<string, any> = {
  "panchkarma-beds": img12,
  "steam-chambers": img16,
  "spa-massage-tables": img13,
  "sauna-systems": img4,
  "bronze-accessories": img5,
  "spa-furniture": img6,
  "steam-generators": img14,
  "yoga-wellness": img3,
};

const defaultContent = {
  subtitle: "OUR PRODUCTS",
  heading: "Premium Wellness Equipment",
  description: "Wide range of Ayurvedic, Spa & Wellness equipment crafted\nfor modern wellness spaces.",
  buttonText: "VIEW ALL PRODUCTS",
  buttonPath: "/products",
  productsLimit: 8,
  products: [
    { id: "panchkarma-beds", title: "Panchkarma Beds", image: "" },
    { id: "steam-chambers", title: "Steam Chambers", image: "" },
    { id: "spa-massage-tables", title: "Spa Massage Tables", image: "" },
    { id: "sauna-systems", title: "Sauna Systems", image: "" },
    { id: "bronze-accessories", title: "Bronze Accessories", image: "" },
    { id: "spa-furniture", title: "Spa Furniture", image: "" },
    { id: "steam-generators", title: "Steam Generators", image: "" },
    { id: "yoga-wellness", title: "Yoga & Wellness", image: "" },
  ],
};

export const ProductsGrid = async () => {
  const content = await getComponentContent("home.productsGrid", defaultContent);

  // Use the CMS products list (which doubles as fallback category cards)
  const products = content.products;

  return (
    <section className="bg-[#fbf8f2] relative z-10">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SubHeading text={content.subtitle} className='text-[#8d6a3a]'/>
            <h2 className="font-serif text-3xl leading-tight text-[#0f2518] md:text-3xl font-semibold">{content.heading}</h2>
            <p className="max-w-[380px] text-xs leading-4.5 text-[#0f2518]">
              {content.description}
            </p>
          </div>
          <Link href={content.buttonPath} className="inline-flex w-fit items-center gap-5 border border-[#d7cbbd] bg-white px-3 py-2 text-[11px] font-bold tracking-wide text-[#0f2518] transition-colors hover:bg-[#f3eee6] rounded-md">
            {content.buttonText} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product: { id: string; title: string; image: string }) => {
            const imageUrl = product.image
              ? getImageUrl(product.image)
              : fallbackImageMap[product.id] || img12;

            return (
            <Link href={`/products/${product.id}`} key={product.id} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1 rounded-xl">
              <div className="relative aspect-[2/1] overflow-hidden bg-[#e5dccf] rounded-tl-xl rounded-tr-xl">
                   <Image 
                     src={imageUrl} 
                     alt={product.title} 
                     fill 
                     className="object-cover" 
                     crossOrigin="anonymous" 
                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                   />
              </div>
              <div className="p-5">
                <p className="text-base font-semibold text-[#0f2518]">{product.title}</p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f2518]">Explore Now <ArrowRight size={14} /></span>
              </div>
            </Link>
          )})}
        </div>
      </Container>
    </section>
  );
};
