import Link from "next/link";
import { headers } from "next/headers";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import { Container } from "@/components/ui/Container";
import CityLinks from "@/components/ui/CityLinks";
import img6 from "@/assets/home/img-6.webp";
import { generateSeo } from "@/lib/api/seo";
import { productApi, getImageUrl } from "@/lib/api/api";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import type { CityPage } from "@/lib/solutions";
import { metaDescription } from "@/lib/seo-text";

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

/**
 * Heading HTML that keeps only line breaks: <br> (as in product titles) and new lines become <br />,
 * all other markup is escaped so admin text can never inject tags or scripts.
 */
const headingHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/&lt;br\s*\/?&gt;/gi, "<br />")
    .replace(/\r?\n/g, "<br />");

/** "PREMIUM TEAK WOOD DRONI" → "Premium Teak Wood Droni"; mixed-case text is left as written */
const titleCase = (value: string) =>
  value && value === value.toUpperCase() ? value.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (_m, sep, ch) => sep + ch.toUpperCase()) : value;

const productDescription = (p: any, fallback = "") => p?.shortDescription || p?.overview?.description || p?.description || fallback;

export async function buildProductMetadata(slug: string, apiProduct: any, city?: CityPage | null): Promise<Metadata> {
  const base = await generateSeo(`products/${slug}`);

  const pageTitled = !!base.title && base.title !== FALLBACK_TITLE;
  // Admin titles are often ALL CAPS; search results read better in title case with the brand
  const productName = titleCase(plain(apiProduct?.title));
  let title = String((pageTitled ? base.title : productName ? (productName.length > 56 ? productName : `${productName} | ENSIS`) : base.title) || FALLBACK_TITLE);
  let description = productDescription(apiProduct, (base.description as string) || "");
  let alternates = base.alternates;
  let ogUrl = base.openGraph?.url;

  if (city) {
    const name = productName || slug.replace(/-/g, " ");
    title = city.metaTitle || `${name} in ${city.city} | ENSIS`;
    const baseDescription = description;
    description = city.metaDescription || city.description || "";
    // A city page must not repeat the main product description word for word
    if (!description || plain(description) === plain(baseDescription)) {
      description = `${name} in ${city.city}, supplied and installed by ENSIS. ${baseDescription}`.trim();
    }
    const canonical = `${SITE_URL}/products/${slug}/${city.slug}`;
    alternates = { canonical };
    ogUrl = canonical;
  }
  description = metaDescription(description);

  // Prefer an explicitly configured og:image from admin page SEO,
  // otherwise fall back to the product's first image.
  // The site-wide default image does not count as a product-specific choice
  const configuredOg = (base.openGraph?.images as { url?: string }[] | undefined)?.[0]?.url;
  const adminOgImage = configuredOg && !/\/og-image\.\w+$/.test(configuredOg) ? configuredOg : "";
  const ogImage = adminOgImage || (apiProduct?.images?.[0] ? getImageUrl(apiProduct.images[0], 1200) : configuredOg || "");

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

  const productName = plain(product.name || product.title);

  return (
    <div className="min-h-screen bg-[#fbfaf7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <ProductDetailClient
        originalPrice={originalPrice}
        product={product}
        shopProduct={product}
        // City page: the admin's heading for this city, or "Best <product> in <city>"
        headingHtml={city ? headingHtml(city.heading || `Best ${apiProduct.title || productName} in ${city.city}`) : undefined}
      />

      <CityLinks
        title={productName}
        basePath={`/products/${product.slug || slug}`}
        cities={activeCities(apiProduct)}
        currentSlug={city?.slug}
      />
    </div>
  );
}
