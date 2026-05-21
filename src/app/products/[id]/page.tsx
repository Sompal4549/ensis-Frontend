import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const Container = dynamic(() => import('@/components/ui/Container').then((mod) => mod.Container));
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl, productApi } from '@/app/lib/api';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const fallbackTitle = productId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  let product = null;

  try {
    product = await productApi.detail(productId);
  } catch {
    product = null;
  }

  const title = product?.title || fallbackTitle;
  const images = product?.images?.map(getImageUrl).filter(Boolean) || [];
  const price = product?.discountPrice || product?.price;

  return (
    <div className="bg-[#fbf8f2] py-10 md:py-14">
      <Container>
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[#6f675d]">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-[#334022] hover:text-[#8d6a3a]">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#8d6a3a]">Products</Link>
          <span>/</span>
          <span className="text-[#1f261b]">{title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="relative flex aspect-[1.15/1] items-center justify-center overflow-hidden bg-[#c3a682]">
              {images[0] ? (
                <Image src={images[0]} alt={title} fill className="object-cover" />
              ) : (
                <span className="font-serif text-3xl text-white/90">{title} Image</span>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative aspect-[1.25/1] overflow-hidden bg-[#b59a77]">
                  {images[index] && <Image src={images[index]} alt={`${title} ${index + 1}`} fill className="object-cover" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#8d6a3a]">PREMIUM EQUIPMENT</span>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#1f261b] md:text-5xl">{title}</h1>
            <p className="mt-4 text-xl font-bold text-[#334022]">{price ? `₹${price.toLocaleString('en-IN')}` : 'Ask for Price'}</p>
            
            <p className="mt-5 max-w-[640px] text-base leading-8 text-[#5f5a50]">
              {product?.description || `Experience the pinnacle of wellness with our handcrafted ${title}. Designed specifically for modern spas and Panchkarma clinics, this premium equipment combines traditional ergonomic principles with contemporary aesthetics.`}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 border border-[#e1d7c9] bg-white p-4 text-sm font-semibold text-[#1f261b]">
                <ShieldCheck size={20} className="text-[#8d6a3a]" />
                <span>10 Year Warranty on Structure</span>
              </div>
              <div className="flex items-center gap-3 border border-[#e1d7c9] bg-white p-4 text-sm font-semibold text-[#1f261b]">
                <Truck size={20} className="text-[#8d6a3a]" />
                <span>Worldwide Insured Shipping</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-3 bg-[#334022] px-7 py-4 text-[11px] font-bold tracking-wide text-white hover:bg-[#263016]">
                <ShoppingCart size={18} /> INQUIRE TO BUY
              </button>
              <button className="border border-[#d7cbbd] bg-white px-7 py-4 text-[11px] font-bold tracking-wide text-[#1f261b] hover:bg-[#f3eee6]">
                REQUEST CATALOGUE
              </button>
            </div>
            
            <div className="mt-8 border border-[#e1d7c9] bg-white">
              <div className="flex border-b border-[#e1d7c9] text-sm font-bold">
                <span className="bg-[#334022] px-5 py-4 text-white">Description</span>
                <span className="px-5 py-4 text-[#6f675d]">Specifications</span>
                <span className="px-5 py-4 text-[#6f675d]">Shipping</span>
              </div>
              <div className="p-6 text-sm leading-7 text-[#5f5a50]">
                <p>
                  {product?.description || `Our ${title} is manufactured in our state-of-the-art facility adhering to strict ISO 9001:2015 quality standards.`}
                  We offer extensive customization options including dimensions, wood finishes, and upholstery colors to perfectly match your wellness center&apos;s interior design.
                </p>
                <ul className="mt-5 grid gap-2 text-[#3f3a32]">
                  <li><strong>Material:</strong> Premium Teak Wood / Medicinal Woods</li>
                  <li><strong>Finish:</strong> Non-toxic, oil-resistant PU coating</li>
                  <li><strong>Dimensions:</strong> Customizable (Standard: 84&quot; L x 36&quot; W x 30&quot; H)</li>
                  <li><strong>Weight Capacity:</strong> 400 lbs (180 kg)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
