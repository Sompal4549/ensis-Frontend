import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  return generateSeo(
    `products/${params.id}`
  );
}

export default async function BlogDetail
 ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
    const {slug} = await params;
    console.log(slug);
    return (
        <h1>{slug}</h1>
    )
}