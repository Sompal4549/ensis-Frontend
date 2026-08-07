import ProductHeroCarousel from "./ProductHeroCarousel";
import type { ProductHeroSlideData } from "./ProductHeroSlideContent";
import { productApi } from "@/lib/api/api";
import { Product } from "@/constants";
import WellnessFeatureStrip from "./WellnessFeatureStrip";

// ─── Dummy fallback data (jab tak API load na ho / fail ho jaye) ─────────────
const dummyProducts: Product[] = [
  {
    _id: "dummy-1",
    id: "dummy-1",
    title: "Ayurvedic Steam Bath Chamber",
    slug: "ayurvedic-steam-bath-chamber",
    price: 45000,
    description: "Premium handcrafted steam therapy chamber for wellness centers.",
    shortDescription: "Premium handcrafted steam therapy chamber.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.5,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-2",
    id: "dummy-2",
    title: "Panchkarma Massage Table",
    slug: "panchkarma-massage-table",
    price: 28000,
    description: "Solid wood therapeutic massage table with oil drainage system.",
    shortDescription: "Solid wood therapeutic massage table.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.7,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-3",
    id: "dummy-3",
    title: "Shirodhara Pot & Stand Set",
    slug: "shirodhara-pot-stand-set",
    price: 12000,
    description: "Traditional copper Shirodhara vessel with adjustable stand.",
    shortDescription: "Traditional copper Shirodhara vessel.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.6,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-4",
    id: "dummy-4",
    title: "Herbal Steam Cabinet",
    slug: "herbal-steam-cabinet",
    price: 52000,
    description: "Full-body herbal steam cabinet with digital temperature control.",
    shortDescription: "Full-body herbal steam cabinet.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.4,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
  {
    _id: "dummy-5",
    id: "dummy-5",
    title: "Ayurvedic Oil Warmer",
    slug: "ayurvedic-oil-warmer",
    price: 6500,
    description: "Compact dual-chamber oil warmer for Abhyanga therapy.",
    shortDescription: "Compact dual-chamber oil warmer.",
    category: "",
    subcategory: "",
    material: "",
    weight: "",
    images: [],
    stock: 0,
    tags: [],
    averageRating: 4.8,
    reviews: [],
    isActive: true,
    isFeatured: true,
  },
] as unknown as Product[];

function toSlides(
  items: { title: string; description?: string; price?: number; image?: string; slug?: string; productLayout: boolean; primaryButton?: { label?: string; url?: string } | null; secondaryButton?: { label?: string; url?: string } | null }[],
  withButtons: boolean
): ProductHeroSlideData[] {
  return items.map((item, i) => ({
    id: `${item.slug || "slide"}-${i}`,
    title: item.title,
    description: item.description || undefined,
    price: item.price && item.price > 0 ? item.price : undefined,
    image: item.image || undefined,
    productLayout: item.productLayout,
    primaryButton: item.primaryButton?.label ? item.primaryButton : withButtons ? { label: "Buy Now", url: `/products/${item.slug}` } : null,
    secondaryButton: item.secondaryButton?.label ? item.secondaryButton : withButtons ? { label: "View Details", url: `/products/${item.slug}` } : null,
  }));
}

// ─── Main export (server component) ────────────────────────────────────────────
export default async function ProductSlider({ sectionContent }: { sectionContent?: any }) {
  const adminSlides = (sectionContent?.slides || []).filter(
    (s: any) => s && (s.title || s.bgImage || s.image)
  );

  if (adminSlides.length) {
    const slides = toSlides(
      adminSlides.map((s: any, i: number) => ({
        slug: `admin-${i}`,
        title: s.title || "",
        description: s.description || undefined,
        price: Number(s.price) > 0 ? Number(s.price) : undefined,
        image: s.bgImage || s.image || undefined,
        productLayout: false,
        primaryButton: s.primaryButton,
        secondaryButton: s.secondaryButton,
      })),
      false
    );

    return (
      <section
        aria-label="Wellness product collection"
        className="relative w-full mb-0 md:mb-20"
      >
        <ProductHeroCarousel slides={slides} />
        <WellnessFeatureStrip />
      </section>
    );
  }

  let products: Product[] = dummyProducts;

  try {
    const data = await productApi.list(5);

    if (data?.products?.length) {
      products = data.products.slice(0, 5) as Product[];
    }
  } catch (err) {
    console.error("Failed to fetch products, using dummy data", err);
  }

  const slides = toSlides(
    products.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.shortDescription,
      price: p.price,
      image: p.images?.[0] || undefined,
      productLayout: true,
    })),
    true
  );

  return (
    <section
      aria-label="Wellness product collection"
      className="relative w-full mb-0 md:mb-20"
    >
      <ProductHeroCarousel slides={slides} />
      <WellnessFeatureStrip />
    </section>
  );
}
