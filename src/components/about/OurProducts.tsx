import { Container } from "../ui/Container";
import AboutTitle from "./AboutTitle";
import img12 from "@/assets/home/img-12.webp"
import panchkarma_2 from "@/assets/home/panchkarma_2.webp"
import steam from "@/assets/home/steam.webp"
import wellness_assosries from "@/assets/home/wellness_assossories.webp"
import wellness_furniture from "@/assets/home/wellness_furniture.webp"
import wellnessInteriors from "@/assets/home/wellness_interiors.webp"
import Image from "next/image";
interface ProductItem {
  title: string;
  subtitle: string;
  image: string; // Assuming this is an image URL or path
}

export interface OurProductsSectionContent {
  title: string;
  products: ProductItem[];
}

const fallbackContent: OurProductsSectionContent = {
  title: "Our Products",
  products: [
    { title: "Steam & Sauna", subtitle: "Room", image: steam.src },
    { title: "Panchkarma", subtitle: "Equipment", image: panchkarma_2.src },
    { title: "Wellness", subtitle: "Accessories", image: wellness_assosries.src },
    { title: "Wellness", subtitle: "Furniture", image: wellness_furniture.src },
    { title: "Wellness", subtitle: "Interiors", image: wellnessInteriors.src },
    { title: "Treatment", subtitle: "Tables", image: img12.src },
  ],
};

export default function OurProductsSection({ sectionContent = {} as OurProductsSectionContent }: { sectionContent?: OurProductsSectionContent }) {
  const resolved = { ...fallbackContent, ...sectionContent };
  if (!resolved.products || resolved.products.length === 0) {
    resolved.products = fallbackContent.products;
  }
  const products = resolved.products;
  const title = resolved.title;


  return (
    <section className="w-full bg-[#f7f2ec]">
      <Container>
        {/* Header */}

       <div className="relative flex items-center justify-center mb-4">
  <AboutTitle title="Our Products" />
  <button className="group absolute right-0 inline-flex items-center gap-4 px-1 py-1 text-base font-medium text-[#8a6b47] transition-colors hover:text-[#6b5134]">
    View All Products
    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
  </button>
</div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl border border-[#eadfce] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[1.2/1] overflow-hidden bg-[#eee]">
                <Image
                  width={250}
                  height={350}
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex items-end justify-between p-3">
                <div>
                  <p className="text-base font-bold tracking-[0.08em] text-[#3d3227] uppercase leading-tight">
                    {product.title}
                  </p>

                  <p className="mt-1 text-base font-bold tracking-[0.08em] text-[#5b524a] uppercase leading-tight">
                    {product.subtitle}
                  </p>
                </div>

                <button className="ml-2 text-[#8b6a46] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
