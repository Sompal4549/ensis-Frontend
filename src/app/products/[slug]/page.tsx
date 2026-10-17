import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductMetadata, loadProduct, ProductView } from "./productPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Pull the product so we can auto-populate the OG image / title even
  // when no per-product SEO record has been configured in the admin.
  return buildProductMetadata(slug, await loadProduct(slug));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const apiProduct = await loadProduct(slug);
  if (!apiProduct) return notFound();
  return <ProductView slug={slug} apiProduct={apiProduct} />;
}
