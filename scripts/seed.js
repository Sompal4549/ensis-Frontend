/**
 * Seed Script — Live API (api.ensis.in) → Render Backend (backend-g2k6.onrender.com)
 *
 * Usage:
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN --type=products
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN --type=blogs
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN --type=categories
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN --type=component-content
 *   node scripts/seed.js --token=YOUR_ADMIN_TOKEN --type=all
 *
 * Admin token kaise milega:
 *   1. Render backend pe admin login karo (WhatsApp OTP se)
 *   2. Browser me localStorage se token nikalo
 *   3. Ya Postman se POST /api/v1/auth/login karke token lo
 */

const https = require("https");
const http = require("http");

// ─── Config ──────────────────────────────────────────────────────────────────
const LIVE_API = "https://api.ensis.in/api/v1";
const RENDER_API = "https://backend-g2k6.onrender.com/api/v1";

// ─── Parse CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace("--", "").split("=");
  acc[key] = val || true;
  return acc;
}, {});

const ADMIN_TOKEN = args.token;
const SEED_TYPE = args.type || "all";

if (!ADMIN_TOKEN) {
  console.error("❌ Token chahiye! Usage: node scripts/seed.js --token=YOUR_TOKEN");
  process.exit(1);
}

// ─── HTTP helper ─────────────────────────────────────────────────────────────
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.request(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on("error", reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

// ─── Fetch all pages from live API ───────────────────────────────────────────
async function fetchAllProducts() {
  console.log("📦 Fetching products from live API...");
  const all = [];
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await request(`${LIVE_API}/products?limit=${limit}&page=${page}`);
    if (res.status !== 200 || !res.data?.data?.products) break;
    const products = res.data.data.products;
    all.push(...products);
    if (products.length < limit) break;
    page++;
  }

  console.log(`   ✅ Fetched ${all.length} products`);
  return all;
}

async function fetchAllBlogs() {
  console.log("📝 Fetching blogs from live API...");
  const res = await request(`${LIVE_API}/blogs`);
  if (res.status !== 200 || !res.data?.data) {
    console.log("   ❌ Failed to fetch blogs");
    return [];
  }
  const blogs = res.data.data;
  console.log(`   ✅ Fetched ${blogs.length} blogs`);
  return blogs;
}

async function fetchAllCategories() {
  console.log("📂 Fetching categories from live API...");
  const res = await request(`${LIVE_API}/categories`);
  if (res.status !== 200 || !res.data?.data) {
    console.log("   ❌ Failed to fetch categories");
    return [];
  }
  const cats = res.data.data;
  console.log(`   ✅ Fetched ${cats.length} categories`);
  return cats;
}

async function fetchComponentContent(slug) {
  console.log(`   📄 Fetching CMS content for "${slug}"...`);
  const res = await request(`${LIVE_API}/component-content/page/${slug}`);
  if (res.status !== 200 || !res.data?.data) return [];
  return res.data.data;
}

// ─── Seed into Render backend ────────────────────────────────────────────────
const authHeaders = { Authorization: `Bearer ${ADMIN_TOKEN}` };

async function seedProducts(products) {
  console.log(`\n📦 Seeding ${products.length} products to Render backend...`);
  let success = 0, fail = 0, skip = 0;

  for (const product of products) {
    // Strip _id, __v, createdAt, updatedAt — let Render generate new ones
    const { _id, __v, createdAt, updatedAt, ...cleanProduct } = product;

    // Check if product already exists by slug
    const existing = await request(`${RENDER_API}/products?limit=1`);
    const existingProducts = existing.data?.data?.products || [];
    const alreadyExists = existingProducts.some(
      (p) => p.slug === cleanProduct.slug || p.title === cleanProduct.title
    );

    if (alreadyExists) {
      skip++;
      process.stdout.write(`   ⏭ ${cleanProduct.title} (already exists)\n`);
      continue;
    }

    try {
      const res = await request(`${RENDER_API}/products`, {
        method: "POST",
        headers: authHeaders,
        body: cleanProduct,
      });

      if (res.status >= 200 && res.status < 300) {
        success++;
        process.stdout.write(`   ✅ ${cleanProduct.title}\n`);
      } else {
        fail++;
        process.stdout.write(`   ❌ ${cleanProduct.title} — ${JSON.stringify(res.data?.message || res.status)}\n`);
      }
    } catch (err) {
      fail++;
      process.stdout.write(`   ❌ ${cleanProduct.title} — ${err.message}\n`);
    }
  }

  console.log(`\n📊 Products: ${success} created, ${skip} skipped, ${fail} failed`);
}

async function seedBlogs(blogs) {
  console.log(`\n📝 Seeding ${blogs.length} blogs to Render backend...`);
  let success = 0, fail = 0, skip = 0;

  for (const blog of blogs) {
    const { _id, __v, createdAt, updatedAt, ...cleanBlog } = blog;

    // Check if already exists
    const existing = await request(`${RENDER_API}/blogs`);
    const existingBlogs = existing.data?.data || [];
    const alreadyExists = existingBlogs.some(
      (b) => b.slug === cleanBlog.slug || b.title === cleanBlog.title
    );

    if (alreadyExists) {
      skip++;
      process.stdout.write(`   ⏭ ${cleanBlog.title} (already exists)\n`);
      continue;
    }

    try {
      const res = await request(`${RENDER_API}/blogs`, {
        method: "POST",
        headers: authHeaders,
        body: cleanBlog,
      });

      if (res.status >= 200 && res.status < 300) {
        success++;
        process.stdout.write(`   ✅ ${cleanBlog.title}\n`);
      } else {
        fail++;
        process.stdout.write(`   ❌ ${cleanBlog.title} — ${JSON.stringify(res.data?.message || res.status)}\n`);
      }
    } catch (err) {
      fail++;
      process.stdout.write(`   ❌ ${cleanBlog.title} — ${err.message}\n`);
    }
  }

  console.log(`\n📊 Blogs: ${success} created, ${skip} skipped, ${fail} failed`);
}

async function seedCategories(categories) {
  console.log(`\n📂 Seeding ${categories.length} categories to Render backend...`);
  let success = 0, fail = 0, skip = 0;

  for (const cat of categories) {
    const { _id, __v, createdAt, updatedAt, ...cleanCat } = cat;

    // Check if already exists
    const existing = await request(`${RENDER_API}/categories`);
    const existingCats = existing.data?.data || [];
    const alreadyExists = existingCats.some(
      (c) => c.slug === cleanCat.slug || c.name === cleanCat.name
    );

    if (alreadyExists) {
      skip++;
      process.stdout.write(`   ⏭ ${cleanCat.name} (already exists)\n`);
      continue;
    }

    try {
      const res = await request(`${RENDER_API}/categories`, {
        method: "POST",
        headers: authHeaders,
        body: cleanCat,
      });

      if (res.status >= 200 && res.status < 300) {
        success++;
        process.stdout.write(`   ✅ ${cleanCat.name}\n`);
      } else {
        fail++;
        process.stdout.write(`   ❌ ${cleanCat.name} — ${JSON.stringify(res.data?.message || res.status)}\n`);
      }
    } catch (err) {
      fail++;
      process.stdout.write(`   ❌ ${cleanCat.name} — ${err.message}\n`);
    }
  }

  console.log(`\n📊 Categories: ${success} created, ${skip} skipped, ${fail} failed`);
}

async function seedComponentContent() {
  const slugs = ["home", "about", "turnkey", "consultancy", "contact", "blog", "career", "projects"];
  console.log(`\n📄 Seeding component-content for ${slugs.length} pages...`);
  let success = 0, fail = 0;

  for (const slug of slugs) {
    const sections = await fetchComponentContent(slug);
    if (!sections.length) {
      console.log(`   ⏭ ${slug} — no content`);
      continue;
    }

    for (const section of sections) {
      const key = section.key || section.componentKey;
      if (!key) continue;

      try {
        const res = await request(`${RENDER_API}/component-content`, {
          method: "POST",
          headers: authHeaders,
          body: {
            key: key,
            label: section.label || key,
            page: slug,
            data: section.data || {},
          },
        });

        if (res.status >= 200 && res.status < 300) {
          success++;
          process.stdout.write(`   ✅ ${key}\n`);
        } else {
          fail++;
          process.stdout.write(`   ❌ ${key} — ${JSON.stringify(res.data?.message || res.status)}\n`);
        }
      } catch (err) {
        fail++;
        process.stdout.write(`   ❌ ${key} — ${err.message}\n`);
      }
    }
  }

  console.log(`\n📊 Component Content: ${success} created, ${fail} failed`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  ENSIS Seed Script — Live API → Render Backend");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Live API:    ${LIVE_API}`);
  console.log(`  Render API:  ${RENDER_API}`);
  console.log(`  Seed Type:   ${SEED_TYPE}`);
  console.log("═══════════════════════════════════════════════════\n");

  try {
    if (SEED_TYPE === "all" || SEED_TYPE === "categories") {
      const categories = await fetchAllCategories();
      if (categories.length) await seedCategories(categories);
    }

    if (SEED_TYPE === "all" || SEED_TYPE === "products") {
      const products = await fetchAllProducts();
      if (products.length) await seedProducts(products);
    }

    if (SEED_TYPE === "all" || SEED_TYPE === "blogs") {
      const blogs = await fetchAllBlogs();
      if (blogs.length) await seedBlogs(blogs);
    }

    if (SEED_TYPE === "all" || SEED_TYPE === "component-content") {
      await seedComponentContent();
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("  ✅ Seed complete!");
    console.log("═══════════════════════════════════════════════════");
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    process.exit(1);
  }
}

main();
