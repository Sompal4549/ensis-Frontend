import PageBuilder from "@/components/PageBuilder";
import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata() {
  return generateSeo("product");
}
export default async function ProductsPage() {
  // let products: Product[] = [];

  // try {
  //   const result = await productApi.list(48);
  //   products = result.products;
  // } catch {
  //   products = [];
  // }

  return (
   <>
<PageBuilder slug="product" />
   </>
  );
}
