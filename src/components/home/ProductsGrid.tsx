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
import { getImageUrl, productApi, type Product } from '@/app/lib/api';

export const ProductsGrid = async () => {
  const fallbackProducts = [
    { id: 'panchkarma-beds', title: 'Panchkarma Beds', image: img12 },
    { id: 'steam-chambers', title: 'Steam Chambers', image: img16 },
    { id: 'spa-massage-tables', title: 'Spa Massage Tables', image: img13 },
    { id: 'sauna-systems', title: 'Sauna Systems', image: img4 },
    { id: 'bronze-accessories', title: 'Bronze Accessories', image: img5 },
    { id: 'spa-furniture', title: 'Spa Furniture', image: img6 },
    { id: 'steam-generators', title: 'Steam Generators', image: img14 },
    { id: 'yoga-wellness', title: 'Yoga & Wellness', image: img3 },
  ];
  let apiProducts: Product[] = [];

  try {
    const result = await productApi.list(8);
    apiProducts = result.products;
  } catch {
    apiProducts = [];
  }

  const products = apiProducts.length ? apiProducts : fallbackProducts;

  return (
    <section className="bg-[#fbf8f2] relative z-10">
      <Container>
        <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SubHeading text={'OUR PRODUCTS'} className='text-[#8d6a3a]'/>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-[#1f261b] md:text-4xl">Premium Wellness Equipment</h2>
            <p className="mt-3 max-w-[380px] text-sm leading-6 text-[#5f5a50]">
              Wide range of Ayurvedic, Spa & Wellness equipment crafted for modern wellness spaces.
            </p>
          </div>
          <Link href="/products" className="inline-flex w-fit items-center gap-5 border border-[#d7cbbd] bg-white px-6 py-4 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:bg-[#f3eee6] rounded-xl">
            VIEW ALL PRODUCTS <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const productId = '_id' in product ? product.slug || product._id : product.id;
            const imageUrl = '_id' in product ? getImageUrl(product.images?.[0]) : '';

            return (
            <Link href={`/products/${productId}`} key={productId} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1">
              <div className="relative aspect-[1.75/1] overflow-hidden bg-[#e5dccf] rounded-tl-xl rounded-tr-xl">
                {'_id' in product && imageUrl ? (
                  <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                ) : (
                  <Image src={img12} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-[#1f261b]">{product.title}</h3>
                {'_id' in product && (
                  <p className="mt-2 text-sm font-semibold text-[#334022]">
                    {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Ask for Price'}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#7c6a53]">Explore Now <ArrowRight size={14} /></span>
              </div>
            </Link>
          )})}
        </div>
      </Container>
    </section>
  );
};
