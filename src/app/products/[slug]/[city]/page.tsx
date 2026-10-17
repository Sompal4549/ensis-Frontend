import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductMetadata, findCity, loadProduct, ProductView } from "../productPage";

interface ProductCityPageProps {
  params: Promise<{ slug: string; city: string }>;
}

export async function generateMetadata({ params }: ProductCityPageProps): Promise<Metadata> {
  const { slug, city } = await params;
  const apiProduct = await loadProduct(slug);
  const cityPage = apiProduct ? findCity(apiProduct, city) : null;
  if (!cityPage) return { title: "Page Not Found", robots: "noindex, follow" };
  return buildProductMetadata(slug, apiProduct, cityPage);
}

export default async function ProductCityPage({ params }: ProductCityPageProps) {
  const { slug, city } = await params;
  const apiProduct = await loadProduct(slug);
  const cityPage = apiProduct ? findCity(apiProduct, city) : null;
  if (!apiProduct || !cityPage) return notFound();
  return <ProductView slug={slug} apiProduct={apiProduct} city={cityPage} />;
}
