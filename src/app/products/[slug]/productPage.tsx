import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { Container } from "@/components/ui/Container";
import img6 from "@/assets/home/img-6.webp";
import { generateSeo } from "@/lib/api/seo";
import { productApi, getImageUrl } from "@/lib/api/api";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import type { CityPage } from "@/lib/solutions";

const FALLBACK_TITLE = "Ensis - Premium Panchkarma & Wellness Spaces";

export async function loadProduct(slug: string): Promise<any | null> {
  try {
    return (await productApi.detail(slug)) || null;
  } catch {
    return null;
  }
}

/** Active city pages of a product */
const activeCities = (product: any): CityPage[] =>
  (Array.isArray(product?.cities) ? product.cities : []).filter((c: CityPage) => c?.slug && c.isActive !== false);

/** The product's city page, or null when it does not exist or is switched off */
export const findCity = (product: any, citySlug: string): CityPage | null =>
  activeCities(product).find((c) => c.slug === citySlug.toLowerCase()) || null;

/** Product titles may carry markup such as <br> for the hero layout; titles and meta need plain text */
const plain = (value: unknown) =>
  String(value ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

const productDescription = (p: any, fallback = "") => p?.shortDescription || p?.overview?.description || p?.description || fallback;

export async function buildProductMetadata(slug: string, apiProduct: any, city?: CityPage | null): Promise<Metadata> {
  const base = await generateSeo(`products/${slug}`);

  const pageTitled = !!base.title && base.title !== FALLBACK_TITLE;
  let title = String((pageTitled ? base.title : plain(apiProduct?.title) || base.title) || FALLBACK_TITLE);
  let description = productDescription(apiProduct, (base.description as string) || "");
  let alternates = base.alternates;
  let ogUrl = base.openGraph?.url;

  if (city) {
    const name = plain(apiProduct?.title) || slug.replace(/-/g, " ");
    title = city.metaTitle || `${name} in ${city.city} | ENSIS`;
    description =
      city.metaDescription ||
      city.description ||
      `${description} Supplied and installed by ENSIS in ${city.city}.`.trim();
    const canonical = `${SITE_URL}/products/${slug}/${city.slug}`;
    alternates = { canonical };
    ogUrl = canonical;
  }

  // Prefer an explicitly configured og:image from admin page SEO,
  // otherwise fall back to the product's first image.
  const adminOgImage = (base.openGraph?.images as { url?: string }[] | undefined)?.[0]?.url;
  const ogImage = adminOgImage || (apiProduct?.images?.[0] ? getImageUrl(apiProduct.images[0], 1200) : "");

  // Prefer base SEO keywords, otherwise auto-populate from product search tags
  const productTags = Array.isArray(apiProduct?.tags) ? apiProduct.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];
  if (city && apiProduct?.title) productTags.unshift(`${plain(apiProduct.title)} in ${city.city}`);

  let keywords: string | undefined = undefined;
  if (base.keywords) {
    const baseList = Array.isArray(base.keywords)
      ? base.keywords
      : String(base.keywords).split(",").map((k) => k.trim()).filter(Boolean);
    const combined = Array.from(new Set([...baseList, ...productTags]));
    keywords = combined.length > 0 ? combined.join(", ") : undefined;
  } else if (productTags.length > 0) {
    keywords = productTags.join(", ");
  }

  return {
    title,
    description,
    keywords,
    alternates,
    robots: base.robots,
    openGraph: {
      title: city ? title : base.openGraph?.title || title,
      description: city ? description : base.openGraph?.description || description,
      url: ogUrl,
      siteName: base.openGraph?.siteName,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage
        ? [ogImage]
        : Array.isArray(base.openGraph?.images) && base.openGraph.images[0]
          ? [
              typeof base.openGraph.images[0] === "string"
                ? base.openGraph.images[0]
                : "url" in base.openGraph.images[0]
                  ? (base.openGraph.images[0] as { url: string }).url
                  : base.openGraph.images[0].toString(),
            ]
          : undefined,
    },
  };
}

export async function ProductView({ slug, apiProduct, city }: { slug: string; apiProduct: any; city?: CityPage | null }) {
  // Transform API data to component-friendly object
  const product: any = {
    ...apiProduct,
    id: apiProduct._id ?? apiProduct.id ?? slug,
    name: apiProduct.title,
    image: apiProduct.images?.[0] ? getImageUrl(apiProduct.images[0], 1600) : "",
    images: apiProduct.images?.length ? apiProduct.images.map((img: string) => getImageUrl(img, 900)) : [img6, img6, img6, img6],
    categoryKey: apiProduct.category?.slug || apiProduct.category,
  };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || SITE_HOST;
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const productUrl = `${protocol}://${host}/products/${product.slug || slug}${city ? `/${city.slug}` : ""}`;

  const productImages = product.images?.length ? product.images : [product.image];
  const inStock = (product.stock ?? 0) > 0;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl,
    name: city ? `${plain(product.name || product.title)} in ${city.city}` : plain(product.name || product.title),
    description: city?.description || product.shortDescription || product.description || product.overview?.description || product.title,
    sku: product.code || product.id,
    image: productImages,
    brand: { "@type": "Brand", name: "ENSIS" },
    ...(product.tags && product.tags.length > 0 ? { keywords: product.tags.filter(Boolean).join(", ") } : {}),
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
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      ...(city ? { areaServed: { "@type": "City", name: city.city } } : {}),
      ...(product.discountPrice && product.discountPrice < product.price
        ? { priceValidUntil: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0] }
        : {}),
    },
  };

  const otherCities = activeCities(apiProduct).filter((c) => c.slug !== city?.slug);
  const productName = plain(product.name || product.title);

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      {city && (
        <section className="border-b border-[#e6d6b9] bg-white">
          <Container className="py-6 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#a9742a]">{city.city.toUpperCase()}</p>
            <h2 className="mt-1 font-serif text-[26px] leading-tight text-[#0e3d21] md:text-[32px]">
              {(city.heading || `${productName} in ${city.city}`).split(/\r?\n/).map((line, i, all) => (
                <span key={i}>
                  {line}
                  {i < all.length - 1 && <br />}
                </span>
              ))}
            </h2>
            {city.description && <p className="mx-auto mt-3 max-w-[820px] text-base font-semibold leading-7 text-[#555]">{city.description}</p>}
            {city.intro &&
              city.intro.split(/\r?\n\s*\r?\n/).map((p, i) => (
                <p key={i} className="mx-auto mt-3 max-w-[820px] text-[15px] leading-7 text-[#555]">
                  {p}
                </p>
              ))}
          </Container>
        </section>
      )}

      <ProductDetailClient originalPrice={originalPrice} product={product} shopProduct={product} />

      {otherCities.length > 0 && (
        <section className="border-t border-[#e6d6b9] bg-[#faf7f2]">
          <Container className="py-8 text-center">
            <p className="text-sm font-semibold tracking-[0.18em] text-[#a9742a]">
              {city ? `${productName.toUpperCase()} IN OTHER CITIES` : `${productName.toUpperCase()} ACROSS INDIA`}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {city && (
                <Link
                  href={`/products/${product.slug || slug}`}
                  className="rounded-full border border-[#c39a5c] bg-white px-4 py-1.5 text-sm font-semibold text-[#0e3d21] transition hover:bg-[#0e3d21] hover:text-white"
                >
                  {productName}
                </Link>
              )}
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${product.slug || slug}/${c.slug}`}
                  className="rounded-full border border-[#c39a5c] bg-white px-4 py-1.5 text-sm font-semibold text-[#0e3d21] transition hover:bg-[#0e3d21] hover:text-white"
                >
                  {productName} in {c.city}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
