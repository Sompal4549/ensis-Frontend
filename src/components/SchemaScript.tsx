import { generateSchema } from "@/lib/api/seo";
import { toJsonLd } from "@/lib/seo-text";

export default async function SchemaScript({ page }: { page: string }) {
  const schema = toJsonLd(await generateSchema(page));
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}