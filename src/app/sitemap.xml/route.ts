import { getAdvancedSeo } from "@/lib/api/seo";
import { blogApi, productApi } from "@/lib/api/api";

export const revalidate = 3600;

const DEFAULT_SITE_URL = "https://ensis.in";

const MAX_PER_PAGE = 100;

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changeFrequency?: ChangeFreq;
  priority?: number;
}

const STATIC_ROUTES: {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "products", changeFrequency: "weekly", priority: 0.9 },
  { path: "turnkey", changeFrequency: "weekly", priority: 0.9 },
  { path: "consultancy", changeFrequency: "weekly", priority: 0.8 },
  { path: "projects-and-clients", changeFrequency: "weekly", priority: 0.8 },
  { path: "blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "about-us", changeFrequency: "monthly", priority: 0.5 },
  { path: "contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "enquiry", changeFrequency: "yearly", priority: 0.5 },
  { path: "career", changeFrequency: "monthly", priority: 0.5 },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastmod(date: Date | string | number | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toISOString();
  } catch {
    return "";
  }
}

function buildUrl(siteUrl: string, path: string) {
  return `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}

function createNode(entry: SitemapEntry) {
  const lastmod = entry.lastmod
    ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
    : "";
  const changeFrequency = entry.changeFrequency
    ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
    : "";
  const priority = entry.priority
    ? `\n    <priority>${entry.priority}</priority>`
    : "";
  return `  <url>\n    <loc>${escapeXml(entry.url)}</loc>${lastmod}${changeFrequency}${priority}
  </url>`;
}

export async function GET() {
  const advSeo = await getAdvancedSeo();
  const sitemapConfig = advSeo?.sitemap || {};

  let siteUrl = DEFAULT_SITE_URL;
  try {
    if (sitemapConfig.url) {
      siteUrl = new URL(sitemapConfig.url).origin;
    }
  } catch (error) {
    console.error("Invalid sitemap.url in advanced SEO config:", error);
  }

  const excludePaths = (sitemapConfig.excludePaths || "")
    .split(",")
    .map((p) => p.trim().replace(/^\/+/, ""))
    .filter(Boolean);

  const isExcluded = (path: string) =>
    excludePaths.some((ex) => path === ex || path.startsWith(`${ex}/`));

  const urls = new Set<string>();
  const entries: SitemapEntry[] = [];

  if (sitemapConfig.autoGenerate !== false) {
    STATIC_ROUTES.forEach((route) => {
      if (!isExcluded(route.path)) {
        urls.add(buildUrl(siteUrl, route.path));
        entries.push({
          url: buildUrl(siteUrl, route.path),
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        });
      }
    });

    try {
      const [blogs, products] = await Promise.all([
        blogApi.list(),
        fetchAllProducts(),
      ]);

      blogs.forEach((blog: { slug?: string; link?: string; _id?: string }) => {
        const slug = blog?.slug || blog?.link || blog?._id;
        const path = `blog/${slug}`;
        if (slug && !isExcluded(path)) {
          const loc = buildUrl(siteUrl, path);
          if (!urls.has(loc)) {
            urls.add(loc);
            const blogRecord = blog as { updatedAt?: string; createdAt?: string };
            entries.push({
              url: loc,
              lastmod: formatLastmod(blogRecord.updatedAt || blogRecord.createdAt) || undefined,
              changeFrequency: "monthly",
              priority: 0.7,
            });
          }
        }
      });

      products.forEach((product: { slug?: string; _id?: string }) => {
        const slug = product?.slug || product?._id;
        const path = `products/${slug}`;
        if (slug && !isExcluded(path)) {
          const loc = buildUrl(siteUrl, path);
          if (!urls.has(loc)) {
            urls.add(loc);
            const productRecord = product as { updatedAt?: string; createdAt?: string };
            entries.push({
              url: loc,
              lastmod: formatLastmod(productRecord.updatedAt || productRecord.createdAt) || undefined,
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        }
      });
    } catch (error) {
      console.error("Failed to generate sitemap entries for dynamic routes:", error);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(createNode).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

async function fetchAllProducts(): Promise<{ slug?: string; _id?: string }[]> {
  const products: { slug?: string; _id?: string }[] = [];
  try {
    const first = await productApi.list(MAX_PER_PAGE);
    const total = first?.total || 0;
    products.push(...(first?.products || []));
    const pages = Math.ceil(total / MAX_PER_PAGE);
    for (let page = 2; page <= pages; page++) {
      const next = await productApi.list(MAX_PER_PAGE, page);
      if (!next?.products?.length) break;
      products.push(...(next.products));
    }
  } catch (error) {
    console.error("Failed to fetch all products for sitemap:", error);
  }
  return products;
}