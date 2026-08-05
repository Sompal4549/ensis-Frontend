import Image from "next/image";

import { Carousel } from "../ui/Carousel";
import { Container } from "../ui/Container";
import { productApi, getImageUrl } from "@/lib/api/api";
import { Product } from "@/constants";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";
import WellnessFeatureStrip from "./WellnessFeatureStrip";

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
  const image = product.images?.[0] ? getImageUrl(product.images[0], 1600) : "";

  const price = product.discountPrice ?? product.price;

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  return (
 <div className="relative h-full min-h-[470px] overflow-hidden bg-[#0b0b0b]">

      {/* Image */}
      <div className="absolute inset-0 md:left-[42%]">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            priority
            className="object-cover object-center md:object-cover md:object-right scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full bg-[#111]" />
        )}
      </div>

      {/* Global Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Left Overlay */}
      <div className="absolute inset-y-0 left-0 z-10 w-full md:w-[58%]">
        <div className="h-full w-full bg-gradient-to-r from-black via-black/85 to-transparent" />
      </div>

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Glow */}
      <div className="absolute left-1/3 top-1/2 hidden h-[650px] w-[650px] -translate-y-1/2 rounded-full bg-[#0f6a4a]/10 blur-[140px] lg:block" />

      {/* Content */}
      <Container className="relative z-20 flex h-full items-center pt-10 md:pt-0">

        <div className="max-w-full md:max-w-[620px]">

          {hasDiscount && (
            <span className="mb-5 inline-flex rounded-full border border-[#b87333]/40 bg-[#b87333] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
              SALE
            </span>
          )}

          <h1 className="mb-5 text-white">
            {product.title}
          </h1>

          {product.shortDescription && (
            <p className="mb-8 max-w-[520px] text-sm leading-7 text-white/80 line-clamp-3 sm:text-base">
              {product.shortDescription}
            </p>
          )}

          <div className="mb-8 flex flex-wrap items-end gap-4">

            <span className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              ₹{price?.toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="pb-1 text-base text-white/40 line-through sm:text-lg">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
            )}

          </div>

          <div className="flex flex-col gap-4 sm:flex-row">

            <BookButton
              text="Buy Now"
              path={`/products/${product.slug}`}
            />

            <GreenButton
              text="View Details"
              path={`/products/${product.slug}`}
            />

          </div>

        </div>

      </Container>
    </div>
  );
}

// ─── Main export (server component) ────────────────────────────────────────────
export default async function ProductSlider() {
  let products: Product[] = dummyProducts;

  try {
    const data = await productApi.list(5);

    if (data?.products?.length) {
      products = data.products.slice(0, 5) as Product[];
    }
  } catch (err) {
    console.error("Failed to fetch products, using dummy data", err);
  }

  return (
    <section
      aria-label="Wellness product collection"
      className="relative w-full mb-0 md:mb-20"
    >
<div className="relative min-h-[470px] md:h-[calc(100vh-146px)] w-full">
  <Carousel autoplayDelay={5000}>
    {products.map((product) => (
      <ProductSlideContent
        key={product._id}
        product={product}
      />
    ))}
  </Carousel>
</div>

      <WellnessFeatureStrip />
    </section>
  );
}