import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  Clock,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { allProducts, type Product } from "@/constants";
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import YouMightCarousel from "@/components/ui/YouMightCarousel";
import CartAndDetailHeroBanner from "@/components/products/ProductDetailBanner";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import { formatPrice } from "@/utils";
import ProductFeatureStrip from "@/components/products/ProductFeatureStrip";
import img6 from "@/assets/home/img-6.webp";
import ProductInfoTabs from "@/components/products/ProductInfoTabs";
import Planning from "@/components/products/Planning";
import FaqSection from "@/components/products/Faq";
import RealSpacesCarousel from "@/components/products/RealSpacesCarousel";

type ProductView = {
  id: string;
  title: string;
  code: string;
  price?: number;
  category: string;
  description: string;
  dimension: string;
  customization: string;
  images: Array<string | StaticImageData>;
  slug: string;
};

function codeFromId(id: string | number) {
  return `Ens - ${id.toString().padStart(3, "0")}`;
}

function getLocalProduct(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

function buildLocalView(product: Product): ProductView {
  const productIndex = allProducts.findIndex((item) => item.id === product.id);
  const galleryImages = Array.from({ length: 4 }, (_, index) => {
    const imageProduct =
      allProducts[(productIndex + index + allProducts.length) % allProducts.length];
    return imageProduct?.image || product.image;
  });

  return {
    id: product.id.toString(),
    title: product.name,
    code: codeFromId(product.id),
    price: product.price,
    category: product.category,
    description: `${product.name} is crafted for professional wellness spaces with durable materials, refined finishing, and practical day-to-day usability.`,
    dimension: "7 ft 10 inch x W 2 ft 10 inch x H 2 ft 10 inch",
    customization:
      "Available in custom dimensions, polish tones, wood finish, and upholstery options to suit your wellness space.",
    images: galleryImages,
    slug: product.slug,
  };
}

export function getImageSource(image: string | StaticImageData | undefined) {
  if (!image) return img6;
  return typeof image === "string" ? image : image.src;
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-[#eee5d8] bg-white p-2 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="mt-4 text-sm">{children}</div>
    </section>
  );
}

function FeaturePill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex min-h-15 flex-col items-center justify-center gap-2 rounded-md bg-[#f7f3ec] px-3 py-2 text-center text-[11px] font-semibold text-[#313b30]">
      <span className="text-[#8d6a3a]">{icon}</span>
      {label}
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-lg bg-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(49,59,48,0.08)]"
    >
      <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-[#f7f3ec]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 180px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-1 py-3">
        <h3 className="line-clamp-2 text-xs font-semibold">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-[#1a1a1a]">
            {formatPrice(product.price)}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2d6c7] text-[#313b30]">
            <ShoppingCart size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const localProduct = getLocalProduct(id);
  const product = localProduct ? buildLocalView(localProduct) : null;

  if (!product) return null;

  const gallery =
    product.images.length > 0 ? product.images : [img6, img6, img6, img6];

  const shopProduct = {
    id: product.id,
    slug: product.slug,
    name: product.title,
    category: product.category,
    price: product.price || 0,
    image: getImageSource(gallery[0]),
  };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (item.categoryKey === localProduct?.categoryKey ||
          item.category === product.category)
    )
    .slice(0, 5);
  const fallbackRelated = allProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 5);
  const suggestions = relatedProducts.length > 0 ? relatedProducts : fallbackRelated;

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <CartAndDetailHeroBanner
        originalPrice={originalPrice}
        product={localProduct!}
        shopProduct={shopProduct}
      />
      <ProductFeatureStrip />
      <ProductInfoTabs />

      <Container>
        <section className="grid lg:items-start xl:gap-8">
          <div>
            <ProductInfoSection />
          </div>
        </section>

        {/* <section className="mt-10 border-t border-[#e5ded5] pt-6">
          <div className="flex flex-wrap gap-6 text-xs font-bold text-[#313b30]">
            {["Overview", "Reviews (126)", "Shipping & Returns", "Specifications"].map(
              (tab, index) => (
                <span
                  key={tab}
                  className={`border-b-2 pb-3 ${
                    index === 0 ? "border-[#313b30]" : "border-transparent"
                  }`}
                >
                  {tab}
                </span>
              )
            )}
          </div>
        </section> */}

        {/* <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden rounded-lg bg-[#f7f3ec]">
              <Image
                src={gallery[1] || gallery[0]}
                alt={`${product.title} detail`}
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <InfoCard title="How to Use">
              <p className="font-medium">
                Place the product in a stable, clean treatment area. Follow your therapy
                workflow and wipe surfaces after each session with a mild cleaner.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] font-semibold text-[#313b30]">
                {[
                  ["Step 1", "Prepare"],
                  ["Step 2", "Use"],
                  ["Step 3", "Clean"],
                ].map(([step, label]) => (
                  <div key={step}>
                    <Clock size={18} className="mx-auto mb-2 text-[#8d6a3a]" />
                    <p>{step}</p>
                    <p className="text-[#7d8378]">{label}</p>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden rounded-lg bg-[#f7f3ec]">
              <Image
                src={gallery[2] || gallery[0]}
                alt={`${product.title} materials`}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <InfoCard title="Why You Will Love It">
              <ul className="space-y-2">
                {[
                  "Reliable for repeat professional use",
                  "Looks refined in premium interiors",
                  "Easy to coordinate with custom projects",
                  "Backed by practical after-sales support",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <HeartHandshake
                      size={16}
                      className="mt-1 shrink-0 text-[#8d6a3a]"
                    />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>
        </section> */}


        {/* <section className="mt-8 grid gap-3 rounded-lg border border-[#eee5d8] bg-white p-4 sm:grid-cols-4">
          {[
            [Leaf, "Clean Materials", "No harsh finishes"],
            [BadgeCheck, "Quality Checked", "Safe and effective"],
            [PackageCheck, "Secure Packing", "Protected dispatch"],
            [Truck, "Project Shipping", "Pan-India delivery"],
          ].map(([Icon, title, text]) => {
            const DisplayIcon = Icon as typeof Leaf;
            return (
              <div
                key={title as string}
                className="flex items-center gap-3 border-[#eee5d8] sm:border-r sm:last:border-r-0"
              >
                <DisplayIcon size={24} className="text-[#313b30]" />
                <div>
                  <p className="text-xs font-bold text-[#1a1a1a]">{title as string}</p>
                  <p className="text-[11px] text-[#6f756c]">{text as string}</p>
                </div>
              </div>
            );
          })}
        </section> */}
      </Container>
<Planning />
           <RealSpacesCarousel images={product.images} />
<Container>

        <section className="mt-2">
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">You May Also Like</h2>
          <div className="mt-2">
            <YouMightCarousel>
              {suggestions.map((item) => (
                <RelatedProductCard key={item.id} product={item} />
              ))}
            </YouMightCarousel>
          </div>
        </section>
          <FaqSection />

              </Container>
      {/* <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5ded5] bg-white/95 px-2 shadow-[0_-10px_30px_rgba(49,59,48,0.08)] backdrop-blur">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#f7f3ec]">
                <Image
                  src={gallery[0]}
                  alt={product.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                  {product.title}
                </p>
                <p className="text-xs text-[#6f756c]">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="hidden text-xl font-semibold text-[#1a1a1a] sm:block">
                {formatPrice(product.price)}
              </p>
              <div className="min-w-[260px] flex-1 sm:w-[360px] sm:flex-none">
                <ProductDetailActions product={shopProduct} compact />
              </div>
            </div>
          </div>
        </Container>
      </div> */}
    </div>
  );
}