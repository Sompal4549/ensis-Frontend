import { generateSchema } from "@/lib/api/seo";

export default async function SchemaScript({ page }: { page: string }) {
  const schema = await generateSchema(page);
  console.log(schema,"schema")
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}