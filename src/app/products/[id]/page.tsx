import { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { allProducts, type Product } from "@/constants";
import { getImageUrl, productApi } from "@/app/lib/api";
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetailActions from "@/components/products/ProductDetailActions";

type ApiProduct = {
  title?: string;
  name?: string;
  price?: number;
  discountPrice?: number;
  description?: string;
  images?: string[];
};

type ProductView = {
  id: string;
  title: string;
  code: string;
  price?: number;
  category: string;
  description: string;
  dimension: string;
  customization: string;
  images: Array<string | StaticImageData>;
  slug: string;
};

function titleFromSlug(slug: string) {
  return slug
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function codeFromId(id: string | number) {
  return `Ens - ${id.toString().padStart(3, "0")}`;
}

function getLocalProduct(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

function buildLocalView(product: Product): ProductView {
  const productIndex = allProducts.findIndex((item) => item.id === product.id);
  const galleryImages = Array.from({ length: 4 }, (_, index) => {
    const imageProduct =
      allProducts[(productIndex + index + allProducts.length) % allProducts.length];
    return imageProduct?.image || product.image;
  });

  return {
    id: product.id.toString(),
    title: product.name,
    code: codeFromId(product.id),
    price: product.price,
    category: product.category,
    description: `${product.name} is crafted for professional wellness spaces with durable materials, refined finishing, and practical day-to-day usability.`,
    dimension: '7 ft 10 inch x W 2 ft 10 inch x H 2 ft 10 inch',
    customization:
      "Available in custom dimensions, polish tones, wood finish, and upholstery options to suit your wellness space.",
    images: galleryImages,
    slug: product.slug,
  };
}

function buildApiView(slug: string, product: ApiProduct | null): ProductView {
  const title = product?.title || product?.name || titleFromSlug(slug);
  const apiImages =
    product?.images?.map(getImageUrl).filter((image): image is string =>
      Boolean(image)
    ) || [];

  return {
    id: slug,
    title,
    code: codeFromId("002"),
    price: product?.discountPrice || product?.price,
    category: "PREMIUM EQUIPMENT",
    description:
      product?.description ||
      `${title} is designed for modern Ayurveda, spa, and wellness facilities with reliable construction and a premium finish.`,
    dimension: '7 ft 10 inch x W 2 ft 10 inch x H 2 ft 10 inch',
    customization:
      "Available in custom dimensions, polish tones, wood finish, and upholstery options to suit your wellness space.",
    images: apiImages,
    slug,
  };
}

function getImageSource(image: string | StaticImageData | undefined) {
  if (!image) return "/next.svg";
  return typeof image === "string" ? image : image.src;
}

function InfoPanel({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[12px] border border-[#e5ded5] bg-[#f8f8f8] px-2 py-2"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#001b10] marker:hidden md:text-md">
        <span>{title}</span>
        <ArrowUpRight
          size={20}
          className="shrink-0 transition-transform group-open:hidden"
        />
        <ArrowDownRight
          size={20}
          className="hidden shrink-0 transition-transform group-open:block"
        />
      </summary>
      <div className="mt-2 border-t border-[#e4ded6] pt-4 text-xs text-[#777d84]">
        {children}
      </div>
    </details>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const localProduct = getLocalProduct(id);
  let apiProduct: ApiProduct | null = null;

  if (!localProduct) {
    try {
      apiProduct = await productApi.detail(id);
    } catch {
      apiProduct = null;
    }
  }

  const product = localProduct
    ? buildLocalView(localProduct)
    : buildApiView(id, apiProduct);
  const gallery =
    product.images.length > 0
      ? product.images
      : ["/next.svg", "/next.svg", "/next.svg", "/next.svg"];
  const shopProduct = {
    id: product.id,
    slug: product.slug,
    name: product.title,
    category: product.category,
    price: product.price || 0,
    image: getImageSource(gallery[0]),
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-8">
      <Container>
        <Link
          href="/products"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#001b10] transition-colors hover:text-[#8d6a3a]"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>

        <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10 xl:gap-12">
          <ProductGallery images={gallery.slice(0, 4)} title={product.title} />

          <div>
            <h2 className="text-xl font-semibold leading-tight text-[#001b10] md:text-2xl">
              {product.title}
            </h2>
           
            <ProductDetailActions product={shopProduct} />

            <div className="mt-5 space-y-4">
              <InfoPanel title="Product Information">
                <p>{product.description}</p>
                <div className="mt-3 grid gap-1.5 text-xs font-semibold text-[#4d555b] md:text-sm">
                  <p>Category: {product.category}</p>
                  <p>
                    Price:{" "}
                    {product.price
                      ? `\u20b9${product.price.toLocaleString("en-IN")}`
                      : "Ask for Price"}
                  </p>
                </div>
              </InfoPanel>

              <InfoPanel title="Dimensions" defaultOpen>
                <p>{product.dimension} Centimeter</p>
              </InfoPanel>

              <InfoPanel title="customization Option">
                <p>{product.customization}</p>
              </InfoPanel>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
