import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
const Container = dynamic(() => import('@/components/ui/Container').then((mod) => mod.Container));
import { getImageUrl, productApi, type Product } from '@/app/lib/api';

export default async function ProductsPage() {
  let products: Product[] = [];

  try {
    const result = await productApi.list(48);
    products = result.products;
  } catch {
    products = [];
  }

  return (
    <main className="bg-[#fbf8f2] py-10 md:py-14">
      <Container>
        <div className="mb-8">
          <span className="text-[11px] font-bold tracking-widest text-[#b87f33]">OUR PRODUCTS</span>
          <h1 className="mt-2 font-serif text-4xl text-[#0f2518] font-semibold">Premium Wellness Equipment</h1>
        </div>

        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const imageUrl = getImageUrl(product.images?.[0]);
              return (
                <Link href={`/products/${product.slug || product._id}`} key={product._id} className="group overflow-hidden border border-[#ded3c4] bg-white transition-transform hover:-translate-y-1">
                  <div className="relative aspect-[1.75/1] overflow-hidden bg-[#e5dccf]">
                    {imageUrl && <Image src={imageUrl} alt={product.title} fill className="object-cover" />}
                  </div>
                  <div className="p-5">
                    <h2 className="text-base font-bold text-[#1f261b]">{product.title}</h2>
                    <p className="mt-2 text-sm font-semibold text-[#334022]">{product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Ask for Price'}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#7c6a53]">Explore Now <ArrowRight size={14} /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="border border-[#ded3c4] bg-white p-8 text-[#5f5a50]">
            Products will appear here after they are added from the admin panel.
          </div>
        )}
      </Container>
    </main>
  );
}
