import { notFound } from "next/navigation";
import { productApi, getImageUrl } from "@/lib/api/api";
import img6 from "@/assets/home/img-6.webp";
import ProductDetailPageV3 from "@/components/products/ProductDetailPageV3";

export const metadata = {
  title: "Product – ENSIS",
};

export default async function ProductV3Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let apiProduct: any;
  try {
    apiProduct = await productApi.detail(id);
  } catch (err) {
    console.log(err);
    return notFound();
  }

  if (!apiProduct) return notFound();

  const product: any = {
    ...apiProduct,
    id: apiProduct._id ?? apiProduct.id ?? id,
    name: apiProduct.title,
    image: apiProduct.images?.[0] ? getImageUrl(apiProduct.images[0], 1600) : "",
    images: apiProduct.images?.length
      ? apiProduct.images.map((img: string) => getImageUrl(img, 900))
      : [img6, img6, img6, img6],
    categoryKey: apiProduct.category?.slug || apiProduct.category,
  };

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
        category:
          typeof item.category === "object" ? item.category.name : item.category,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch suggestions from backend:", err);
  }

  const suggestions = suggestionsList
    .filter(
      (item) =>
        item.slug !== product.slug &&
        (item.categoryKey === product.categoryKey ||
          item.category === product.category)
    )
    .slice(0, 8);

  const finalSuggestions =
    suggestions.length > 0
      ? suggestions
      : suggestionsList.filter((i) => i.slug !== product.slug).slice(0, 8);

  return (
    <ProductDetailPageV3
      product={product}
      originalPrice={originalPrice}
      shopProduct={product}
      related={finalSuggestions}
    />
  );
}
