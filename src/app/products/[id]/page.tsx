import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import {  type Product } from "@/constants";
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
import { generateSeo } from "@/lib/api/seo";
import { productApi, getImageUrl } from "@/lib/api/api";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params promise to get the actual values
  const { id } = await params;

  return generateSeo(
    `products/${id}`
  );
}


export function getImageSource(image: string | StaticImageData | undefined) {
  if (!image) return img6;
  return typeof image === "string" ? image : image.src;
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-lg bg-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(49,59,48,0.08)]"
    >
      <div className="relative aspect-[2/1] overflow-hidden rounded-md bg-[#f7f3ec]">
        <Image
          src={product.images[0]}
          alt={product.title}
          crossOrigin="anonymous"
          fill
          sizes="(max-width: 768px) 45vw, 180px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-1 py-3">
        <h3 className="line-clamp-2 text-xs font-semibold">{product.title}</h3>
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

  let apiProduct: any;
  try {
    apiProduct = await productApi.detail(id);
  } catch (err) {
    console.log(err)
    return notFound();
  }

  if (!apiProduct) return notFound();

  // Normalize category to string name/slug consistently, since API can return
  // category either as a populated object ({ name, slug, ... }) or as a raw string/id.
  const productCategoryName =
    typeof apiProduct.category === "object"
      ? apiProduct.category?.name
      : apiProduct.category;
  const productCategoryKey =
    typeof apiProduct.category === "object"
      ? apiProduct.category?.slug
      : apiProduct.category;

  // Transform API data to component-friendly object
  const product: any = {
    ...apiProduct,
    id: apiProduct._id ?? apiProduct.id ?? id,
    name: apiProduct.title,
    image: apiProduct.images?.[0] ? getImageUrl(apiProduct.images[0]) : "",
    images: apiProduct.images?.length
      ? apiProduct.images.map((img: string) => getImageUrl(img))
      : [img6, img6, img6, img6],
    categoryKey: productCategoryKey,
    // NOTE: this overwrites the spread-in `category` (which could be an object)
    // with a plain string so it matches the shape used in suggestionsList below.
    category: productCategoryName,
  };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;

  let suggestionsList: any[] = [];
  try {
    const listRes: any = await productApi.list(100);

    // TEMP DEBUG — these print to your SERVER terminal (not browser console)
    // since this is a Server Component. Remove once suggestions are confirmed working.
    console.log(
      "[ProductPage] listRes shape:",
      Array.isArray(listRes) ? "array" : Object.keys(listRes || {})
    );

    const productsArray = Array.isArray(listRes)
      ? listRes
      : (listRes?.products || listRes?.data?.products || listRes?.data || []);

    console.log("[ProductPage] productsArray length:", productsArray?.length);

    if (productsArray && Array.isArray(productsArray) && productsArray.length > 0) {
      suggestionsList = productsArray.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        name: item.title,
        image: item.images?.[0] ? getImageUrl(item.images[0]) : "",
        images: item.images?.length
          ? item.images.map((img: string) => getImageUrl(img))
          : [img6, img6, img6, img6],
        categoryKey: typeof item.category === 'object' ? item.category?.slug : item.category,
        category: typeof item.category === 'object' ? item.category?.name : item.category
      }));
    } else {
      console.warn("[ProductPage] productsArray came back empty. Raw listRes:", listRes);
    }
  } catch (err) {
    // This was being silently swallowed before — now clearly logged.
    // Check your SERVER terminal (where `next dev`/`next start` runs) for this.
    console.error("[ProductPage] Failed to fetch suggestions from backend:", err);
  }

  // Match on categoryKey (slug) since it's a reliable string on both sides now.
  const suggestions = suggestionsList
    .filter((item) =>
      item.slug !== product.slug &&
      item.categoryKey === product.categoryKey
    )
    .slice(0, 8);

  const finalSuggestions = suggestions.length > 0
    ? suggestions
    : suggestionsList.filter(i => i.slug !== product.slug).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
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
      </Container>

      <RealSpacesCarousel images={product?.overview?.seeItInRealSpaces?.images||[]} title={product?.overview?.seeItInRealSpaces?.title||""} />
      <Container>

        <section className="mt-2">
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">You May Also Like</h2>
          <div className="mt-2">
            <YouMightCarousel>
              {finalSuggestions.map((item) => (
                <RelatedProductCard key={item.id} product={item} />
              ))}
            </YouMightCarousel>
          </div>
        </section>

      </Container>
      <Planning />

      <FaqSection product={product} />
    </div>
  );
}