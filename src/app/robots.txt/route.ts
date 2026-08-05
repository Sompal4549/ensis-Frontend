import { getAdvancedSeo } from "@/lib/api/seo";

const DEFAULT_SITE_URL = "https://ensis.in";

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`;

export async function GET() {
  const advSeo = await getAdvancedSeo();
  const content = advSeo?.robotsTxt?.content?.trim();
  const robots = content || DEFAULT_ROBOTS;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600",
    },
  });
}