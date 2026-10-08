import ProductDetailClient from "@/components/products/ProductDetailClient";
import img6 from "@/assets/home/img-6.webp";
import { generateSeo } from "@/lib/api/seo";
import { productApi, getImageUrl } from "@/lib/api/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { SITE_HOST } from "@/lib/site";

const FALLBACK_TITLE = "Ensis - Premium Panchkarma & Wellness Spaces";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const base = await generateSeo(`products/${slug}`);

  // Pull the product so we can auto-populate the OG image / title even
  // when no per-product SEO record has been configured in the admin.
  let apiProduct: any = null;
  try {
    apiProduct = await productApi.detail(slug);
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let apiProduct: any;
  try {
    apiProduct = await productApi.detail(slug);
  } catch (err) {
    console.error("Error fetching product detail:", err);
    return notFound();
  }

  if (!apiProduct) return notFound();

  // Transform API data to component-friendly object
  const product: any = {
    ...apiProduct,
    id: apiProduct._id ?? apiProduct.id ?? slug,
    name: apiProduct.title,
    image: apiProduct.images?.[0] ? getImageUrl(apiProduct.images[0], 1600) : "",
    images: apiProduct.images?.length
      ? apiProduct.images.map((img: string) => getImageUrl(img, 900))
      : [img6, img6, img6, img6],
    categoryKey: apiProduct.category?.slug || apiProduct.category
  };

  const originalPrice = product.price ? Math.round(product.price * 1.18) : 0;

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    SITE_HOST;
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const productUrl = `${protocol}://${host}/products/${product.slug || slug}`;

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
      <ProductDetailClient
        originalPrice={originalPrice}
        product={product}
        shopProduct={product}
      />
    </div>
  );
}