import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Check,
  Clock,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { allProducts, type Product } from "@/constants";
import { getImageUrl, productApi } from "@/app/lib/api";
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import YouMightCarousel from "@/components/ui/YouMightCarousel";

type ApiProduct = {
  title?: string;
  name?: string;
  price?: number;
  discountPrice?: number;
  description?: string;
  images?: string[];
};

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

function titleFromSlug(slug: string) {
  return slug
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
    dimension: '7 ft 10 inch x W 2 ft 10 inch x H 2 ft 10 inch',
    customization:
      "Available in custom dimensions, polish tones, wood finish, and upholstery options to suit your wellness space.",
    images: galleryImages,
    slug: product.slug,
  };
}

function buildApiView(slug: string, product: ApiProduct | null): ProductView {
  const title = product?.title || product?.name || titleFromSlug(slug);
  const apiImages =
    product?.images?.map(getImageUrl).filter((image): image is string =>
      Boolean(image)
    ) || [];

  return {
    id: slug,
    title,
    code: codeFromId("002"),
    price: product?.discountPrice || product?.price,
    category: "PREMIUM EQUIPMENT",
    description:
      product?.description ||
      `${title} is designed for modern Ayurveda, spa, and wellness facilities with reliable construction and a premium finish.`,
    dimension: '7 ft 10 inch x W 2 ft 10 inch x H 2 ft 10 inch',
    customization:
      "Available in custom dimensions, polish tones, wood finish, and upholstery options to suit your wellness space.",
    images: apiImages,
    slug,
  };
}

function getImageSource(image: string | StaticImageData | undefined) {
  if (!image) return "/next.svg";
  return typeof image === "string" ? image : image.src;
}

function formatPrice(price?: number) {
  return price ? `\u20b9${price.toLocaleString("en-IN")}` : "Ask for Price";
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#eee5d8] bg-white p-5 shadow-[0_8px_24px_rgba(49,59,48,0.04)]">
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="mt-4 text-sm">{children}</div>
    </section>
  );
}

function FeaturePill({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-h-15 flex-col items-center justify-center gap-2 rounded-md bg-[#f7f3ec] px-3 py-2 text-center text-[11px] font-semibold text-[#313b30]">
      <span className="text-[#8d6a3a]">{icon}</span>
      {label}
    </div>
  );
}

function TrustRow({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f6f0e8] text-[#313b30]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-[#1a1a1a]">{title}</p>
        <p className="mt-0.5 text-[11px] leading-5 text-[#6f756c]">{text}</p>
      </div>
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-lg bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(49,59,48,0.08)]"
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
        <h3 className="line-clamp-2 text-xs font-semibold">
          {product.name}
        </h3>
        {/* <div className="mt-2 flex items-center gap-1 text-[11px]">
          <span>4.8</span>
          <Star size={12} className="fill-[#d5a642] text-[#d5a642]" />
        </div> */}
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
  let apiProduct: ApiProduct | null = null;

  if (!localProduct) {
    try {
      apiProduct = await productApi.detail(id);
    } catch {
      apiProduct = null;
    }
  }

  const product = localProduct
    ? buildLocalView(localProduct)
    : buildApiView(id, apiProduct);
  const gallery =
    product.images.length > 0
      ? product.images
      : ["/next.svg", "/next.svg", "/next.svg", "/next.svg"];
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
  const sameCategory = suggestions.slice(0, 4);
  const keyBenefits = [
    "Crafted for daily wellness center use",
    "Premium finish with practical maintenance",
    "Custom sizing and polish options available",
    "Suitable for spas, resorts, clinics, and retreats",
  ];
  const specs = [
    ["Product Code", product.code],
    ["Category", product.category],
    ["Dimension", product.dimension],
    ["Customization", "Available"],
    ["Use Case", "Professional wellness spaces"],
    ["Warranty", "1 year support"],
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <Container>
        <Link
          href="/products"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#001b10] transition-colors hover:text-[#8d6a3a]"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>

        <section className="grid gap-7 lg:grid-cols-[0.92fr_1fr_250px] lg:items-start xl:gap-8">
          <ProductGallery images={gallery.slice(0, 4)} title={product.title} />

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d6a3a]">
              {product.category}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-tight text-[#001b10] md:text-2xl">
              {product.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#687064]">
              <span className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={15}
                    className="fill-[#d5a642] text-[#d5a642]"
                  />
                ))}
              </span>
              <span className="font-semibold">4.8</span>
              <span>(126 reviews)</span>
              <span className="rounded-full bg-[#e7f0df] px-3 py-1 text-[11px] font-bold text-[#516a35]">
                Bestseller
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-end gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.price ? (
                <>
                  <span className="pb-1 text-sm line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="pb-1 text-sm font-bold text-[#d33b2f]">
                    (15% OFF)
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-2 max-w-2xl text-xs">
              {product.description}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <FeaturePill icon={<Sparkles size={20} />} label="Premium Finish" />
              <FeaturePill icon={<Wrench size={20} />} label="Custom Built" />
              <FeaturePill icon={<Leaf size={20} />} label="Wellness Grade" />
              <FeaturePill icon={<ShieldCheck size={20} />} label="Durable Design" />
            </div>

            <div className="mt-2">
              <p className="mb-2 text-xs font-semibold">
                Material and finish
              </p>
              <div className="flex flex-wrap gap-2">
                {["Teak wood", "Brass details", "Natural polish"].map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-[#e5ded5] bg-white px-4 py-2 text-xs font-semibold text-[#313b30]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <ProductDetailActions product={shopProduct} />

            <p className="mt-2 flex items-center font-medium justify-center gap-2 text-[11px] sm:justify-start">
              <LockKeyhole size={13} />
              Secure checkout | 30-day support | Installation guidance
            </p>
          </div>

          <aside className="space-y-2 lg:sticky lg:top-24">
            <div className="rounded-lg border border-[#eee5d8] bg-[#f7f3ec] p-2">
              <div className="space-y-2">
                <TrustRow
                  icon={<Truck size={18} />}
                  title="Free Shipping"
                  text="On eligible bulk and project orders"
                />
                <TrustRow
                  icon={<RotateCcw size={18} />}
                  title="30-Day Support"
                  text="Help with setup, sizing, and care"
                />
                <TrustRow
                  icon={<ShieldCheck size={18} />}
                  title="1 Year Warranty"
                  text="Quality you can trust"
                />
                <TrustRow
                  icon={<LockKeyhole size={18} />}
                  title="Secure Payments"
                  text="Protected checkout experience"
                />
              </div>
            </div>

            <div className="rounded-lg border border-[#eee5d8] bg-white p-2">
              <h2 className="text-sm font-bold text-[#1a1a1a]">Same Category</h2>
              <div className="mt-2 space-y-4">
                {sameCategory.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="grid grid-cols-[56px_1fr] gap-3"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-[#f7f3ec]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#1a1a1a]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] text-[#6f756c]">
                        4.7 <span className="text-[#d5a642]">*</span> |{" "}
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/products"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md border border-[#313b30] text-xs font-bold text-[#313b30] transition-colors hover:bg-[#313b30] hover:text-white"
              >
                View All
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 border-t border-[#e5ded5] pt-6">
          <div className="flex flex-wrap gap-6 text-xs font-bold text-[#313b30]">
            {["Overview", "Reviews (126)", "Shipping & Returns", "Specifications"].map(
              (tab, index) => (
                <span
                  key={tab}
                  className={`border-b-2 pb-3 ${index === 0
                    ? "border-[#313b30]"
                    : "border-transparent"
                    }`}
                >
                  {tab}
                </span>
              )
            )}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <InfoCard title="Product Overview">
              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                {[
                  ["Dermatologist Tested", BadgeCheck],
                  ["Premium Materials", Box],
                  ["Customizable", Wrench],
                  ["Eco Conscious", Leaf],
                ].map(([label, Icon]) => {
                  const DisplayIcon = Icon as typeof BadgeCheck;
                  return (
                    <div
                      key={label as string}
                      className="flex items-center gap-2 text-xs font-semibold text-[#313b30]"
                    >
                      <DisplayIcon size={15} className="text-[#8d6a3a]" />
                      {label as string}
                    </div>
                  );
                })}
              </div>
              <p className="font-medium">{product.description}</p>
              <ul className="mt-3 space-y-1 font-medium">
                {keyBenefits.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={16} className="mt-1 shrink-0 text-[#516a35]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard title="Key Specifications">
              <div className="grid gap-2">
                {specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[120px_1fr] gap-3 border-b border-[#f0e8dc] pb-2 text-sm last:border-b-0"
                  >
                    <span className="font-semibold">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        </section>

        <section className="mt-9">
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">
            You May Also Like
          </h2>
        <div className="mt-2">
              <YouMightCarousel>
            {suggestions.map((item) => (
              <RelatedProductCard key={item.id} product={item} />
            ))}
            </YouMightCarousel>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
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
                Place the product in a stable, clean treatment area. Follow your
                therapy workflow and wipe surfaces after each session with a
                mild cleaner.
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
        </section>

        <section className="mt-8 grid gap-3 rounded-lg border border-[#eee5d8] bg-white p-4 sm:grid-cols-4">
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
                  <p className="text-xs font-bold text-[#1a1a1a]">
                    {title as string}
                  </p>
                  <p className="text-[11px] text-[#6f756c]">{text as string}</p>
                </div>
              </div>
            );
          })}
        </section>
      </Container>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5ded5] bg-white/95 px-2 shadow-[0_-10px_30px_rgba(49,59,48,0.08)] backdrop-blur">
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
      </div>
    </div>
  );
}
