"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Carousel } from "../ui/Carousel";
import { Container } from "../ui/Container";
import { productApi, getImageUrl } from "@/lib/api/api";
import { Product } from "@/constants";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

// ─── Dummy fallback data (jab tak API load na ho / fail ho jaye) ─────────────
const dummyProducts: Product[] = [
  {
    _id: "dummy-1",
    id: "dummy-1",
    title: "Ayurvedic Steam Bath Chamber",
    slug: "ayurvedic-steam-bath-chamber",
    price: 45000,
    discountPrice: 39999,
    description: "Premium handcrafted steam therapy chamber for wellness centers.",
    shortDescription: "Premium handcrafted steam therapy chamber.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.5,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-2",
    id: "dummy-2",
    title: "Panchkarma Massage Table",
    slug: "panchkarma-massage-table",
    price: 28000,
    discountPrice: 24999,
    description: "Solid wood therapeutic massage table with oil drainage system.",
    shortDescription: "Solid wood therapeutic massage table.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.7,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-3",
    id: "dummy-3",
    title: "Shirodhara Pot & Stand Set",
    slug: "shirodhara-pot-stand-set",
    price: 12000,
    discountPrice: 9999,
    description: "Traditional copper Shirodhara vessel with adjustable stand.",
    shortDescription: "Traditional copper Shirodhara vessel.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.6,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-4",
    id: "dummy-4",
    title: "Herbal Steam Cabinet",
    slug: "herbal-steam-cabinet",
    price: 52000,
    discountPrice: 47500,
    description: "Full-body herbal steam cabinet with digital temperature control.",
    shortDescription: "Full-body herbal steam cabinet.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.4,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-5",
    id: "dummy-5",
    title: "Ayurvedic Oil Warmer",
    slug: "ayurvedic-oil-warmer",
    price: 6500,
    discountPrice: 5499,
    description: "Compact dual-chamber oil warmer for Abhyanga therapy.",
    shortDescription: "Compact dual-chamber oil warmer.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.8,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
] as unknown as Product[];

// ─── Individual slide ─────────────────────────────────────────────────────────
function ProductSlideContent({ product }: { product: Product }) {
  const image = product.images?.[0] ? getImageUrl(product.images[0]) : "";
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="ws-banner ws-grain relative md:h-[calc(100vh-146px)] w-full overflow-hidden bg-[#f5efe6]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover md:object-fill object-center"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-[#f5efe6]" />
        )}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full w-full">
        <Container className="flex h-full w-full items-center">
          {/* Text content */}
          <div className="max-w-[680px] bg-white/20">
            {hasDiscount && (
              <span className="mb-3 inline-block rounded-full bg-[#b87333] px-3 py-1 text-[11px] font-semibold text-white">
                SALE
              </span>
            )}

            {/* Heading */}
            <h1 className="ws-title mb-3 text-[2.3rem] font-[500] leading-[1.04] text-[#1a1a1a] sm:mb-4 sm:text-[3rem] md:text-[3.5rem] lg:text-[3.9rem]">
              {product.title}
            </h1>

            {/* Description */}
            {product.shortDescription && (
              <p className="mb-6 max-w-[400px] text-[13px] font-semibold leading-relaxed text-[#5a5040] sm:mb-8 sm:text-[14px] md:text-[15px]">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-2xl font-bold text-[#012c20]">
                ₹{price?.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-base text-[#999] line-through">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <BookButton text="Buy Now" path={`/products/${product.slug}`} />
              <GreenButton text="View Details" path={`/products/${product.slug}`} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ProductSlider() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await productApi.list(5);
        if (isMounted && data?.products?.length) {
          setProducts((data.products.slice(0, 5) as unknown) as Product[]);
        }
        // API empty aaye toh dummyProducts already set hai, kuch nahi karna
      } catch (err) {
        console.error("Failed to fetch products, using dummy data", err);
        // dummyProducts already set hai, fallback automatic
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      aria-label="Wellness product collection"
      className="relative w-full md:h-[calc(100vh-146px)]"
    >
      <Carousel autoplayDelay={5000}>
        {products.map((product) => (
          <ProductSlideContent key={product._id} product={product} />
        ))}
      </Carousel>
    </section>
  );
}