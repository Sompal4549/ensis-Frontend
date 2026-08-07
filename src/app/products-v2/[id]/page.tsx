import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import {  type Product } from "@/constants";
import YouMightCarousel from "@/components/ui/YouMightCarousel";
import CartAndDetailHeroBanner from "@/components/products/ProductDetailBannerV2";
import ProductInfoSection from "@/components/products/ProductInfoSection";
import { formatPrice } from "@/utils";
import ProductFeatureStrip from "@/components/products/ProductFeatureStrip";
import img6 from "@/assets/home/img-6.webp";
import ProductInfoTabs from "@/components/products/ProductInfoTabs";
import Planning from "@/components/products/Planning";
import FaqSection from "@/components/products/Faq";
import RealSpacesCarousel from "@/components/products/RealSpacesCarousel";
import { generateSeo } from "@/lib/api/seo";
import { productApi, getImageUrl } from "@/lib/api/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

const FALLBACK_TITLE = "Ensis - Premium Panchkarma & Wellness Spaces";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  // Await the params promise to get the actual values
  const { id } = await params;

  const base = await generateSeo(`products/${id}`);

  // Pull the product so we can auto-populate the OG image / title even
  // when no per-product SEO record has been configured in the admin.
  let apiProduct: any = null;
  try {
    apiProduct = await productApi.detail(id);
  } catch {
    apiProduct = null;
  }

  const pageTitled = !!base.title && base.title !== FALLBACK_TITLE;
  const title = pageTitled ? base.title : apiProduct?.title || base.title || FALLBACK_TITLE;

  const description =
    apiProduct?.shortDescription ||
    apiProduct?.overview?.description ||
    apiProduct?.description ||
    (base.description as string) ||
    "";

  // Prefer an explicitly configured og:image from admin page SEO,
  // otherwise fall back to the product's first image.
  const adminOgImage = (base.openGraph?.images as { url?: string }[] | undefined)?.[0]?.url;
  const ogImage =
    adminOgImage ||
    (apiProduct?.images?.[0] ? getImageUrl(apiProduct.images[0], 1200) : "");

  return {
    title,
    description,
    keywords: base.keywords,
    alternates: base.alternates,
    robots: base.robots,
    openGraph: {
      title: base.openGraph?.title || title,
      description: base.openGraph?.description || description,
      url: base.openGraph?.url,
      siteName: base.openGraph?.siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}


export function getImageSource(image: string | StaticImageData | undefined) {
  if (!image) return img6;
  return typeof image === "string" ? image : image.src;
}

function RelatedProductCard({ product }: { product: Product }) {
  const description =
    product.description ||
    product.shortDescription ||
    product.overview?.description ||
    "Premium handcrafted ENSIS wellness furniture, built for luxury therapy spaces.";
  const cleanDescription = description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group/card block h-full transition-transform duration-500 hover:-translate-y-1 hover:z-10 [perspective:2000px]"
    >
      <div className="relative h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover/card:[transform:rotateY(180deg)]">
        {/* FRONT */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-white [backface-visibility:hidden]">
          <div className="relative flex-1 overflow-hidden rounded-lg bg-[#f7f3ec]">
            <Image
              src={product.images[0]}
              alt={product.title}
              crossOrigin="anonymous"
              fill
              sizes="(max-width: 768px) 45vw, 180px"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#263016]/55 to-transparent px-2 pb-1.5 pt-6">
              <p className="line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                {product.title}
              </p>
            </div>
          </div>
          <div className="px-2 py-2.5">
            <h3 className="line-clamp-1 text-xs font-semibold text-[#1a1a1a]">
              {product.title}
            </h3>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#1a1a1a]">
                {formatPrice(product.price)}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e2d6c7] text-[#313b30]">
                <ShoppingCart size={12} />
              </span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-[#263016] p-3.5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#c8a45d]">
              About This
            </p>
            <p className="mt-2 line-clamp-5 text-[11px] leading-5 text-white/85">
              {cleanDescription}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <span className="text-sm font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c8a45d]">
              View <ArrowRight size={11} />
            </span>
          </div>
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

  let apiProduct: any;
  try {
    apiProduct = await productApi.detail(id);
  } catch (err) {
    console.log(err)
    return notFound();
  }

  if (!apiProduct) return notFound();

  // Transform API data to component-friendly object
  const product: any = {
    ...apiProduct,
    id: apiProduct._id ?? apiProduct.id ?? id,
    name: apiProduct.title,
    image: apiProduct.images?.[0] ? getImageUrl(apiProduct.images[0], 1600) : "",
    images: apiProduct.images?.length
      ? apiProduct.images.map((img: string) => getImageUrl(img, 900))
      : [img6, img6, img6, img6],
    categoryKey: apiProduct.category?.slug || apiProduct.category
  };

  // const shopProduct = {
  //   id: product.id,
  //   slug: product.slug,
  //   name: product.title,
  //   category: typeof product.category === 'object' ? product.category.name : product.category,
  //   price: product.price || 0,
  //   image: product.image,
  // };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;

  let suggestionsList: any[] = [];
  try {
    const listRes = await productApi.list(100);
    if (listRes && listRes.products && listRes.products.length > 0) {
      suggestionsList = listRes.products.map((item: any) => ({
        ...item,
        id: item._id,
        name: item.title,
        image: item.images?.[0] ? getImageUrl(item.images[0]) : "",
        images: item.images?.length
          ? item.images.map((img: string) => getImageUrl(img))
          : [img6, img6, img6, img6],
        categoryKey: item.category?.slug || item.category,
        category: typeof item.category === 'object' ? item.category.name : item.category
      }));
    }
  } catch (err) {
    console.error("Failed to fetch suggestions from backend:", err);
  }

  // Fallback to local allProducts if backend list fails or is empty
  // if (suggestionsList.length === 0) {
  //   suggestionsList = allProducts;
  // }

  const suggestions = suggestionsList
    .filter((item) =>
      item.slug !== product.slug &&
      (item.categoryKey === product.categoryKey || item.category === product.category)
    )
    .slice(0, 8);

  const finalSuggestions = suggestions.length > 0
    ? suggestions
    : suggestionsList.filter(i => i.slug !== product.slug).slice(0, 8);

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "ensis.in";
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const productUrl = `${protocol}://${host}/products/${product.slug || id}`;

  const productImages = product.images?.length ? product.images : [product.image];
  const inStock = (product.stock ?? 0) > 0;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: product.name || product.title,
    description:
      product.shortDescription ||
      product.description ||
      product.overview?.description ||
      product.title,
    sku: product.code || product.id,
    image: productImages,
    brand: { "@type": "Brand", name: "ENSIS" },
    category:
      typeof product.category === "object" && product.category
        ? product.category.name
        : product.categoryKey || product.category || undefined,
    ...(product.averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            bestRating: 5,
            ratingCount: product.reviews?.length || 1,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: (product.price || 0).toString(),
      priceCurrency: "INR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      ...(product.discountPrice && product.discountPrice < product.price
        ? { priceValidUntil: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0] }
        : {}),
    },
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <CartAndDetailHeroBanner
        originalPrice={originalPrice}
        product={product}
        shopProduct={product}
      />
      <ProductFeatureStrip />
      <ProductInfoTabs product={product} />

      <Container>
        <section className="grid lg:items-start xl:gap-8">
          {<ProductInfoSection product={product} />}
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
              <div className="mt-5 grid grid-cols-3 gap-4 text-center text-[11px] font-semibold text-[#313b30]">
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
                  <li key={item} className="flex gap-4">
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


        {/* <section className="mt-8 grid gap-4 rounded-lg border border-[#eee5d8] bg-white p-4 sm:grid-cols-4">
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
                className="flex items-center gap-4 border-[#eee5d8] sm:border-r sm:last:border-r-0"
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

      <RealSpacesCarousel images={product?.overview?.seeItInRealSpaces?.images||[]} title={product?.overview?.seeItInRealSpaces?.title||""} />
      {/* <ReviewSection
        productId={product.id}
        productTitle={product.title}
        productSlug={product.slug}
      /> */}
      <Container>

        <section className="mt-2">
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">You May Also Like</h2>
          <div className="mt-2">
            <YouMightCarousel
              containerClassName="flex"
              stopOnMouseEnter
              slideClassName="min-w-0 shrink-0 grow-0 basis-1/2 px-2 sm:basis-1/3 lg:basis-1/5 h-[220px]"
            >
              {finalSuggestions.map((item) => (
                <RelatedProductCard key={item.id} product={item} />
              ))}
            </YouMightCarousel>
          </div>
        </section>

      </Container>
      <Planning />

      <FaqSection product={product} />
      {/* <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e5ded5] bg-white/95 px-2 shadow-[0_-10px_30px_rgba(49,59,48,0.08)] backdrop-blur">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
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