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

export default function OurProductsSection({ sectionContent }: { sectionContent: OurProductsSectionContent }) {
  const products = sectionContent.products; // Use products from sectionContent
  const title = sectionContent.title; // Use title from sectionContent


  return (
    <section className="w-full bg-[#f7f2ec]">
      <Container>
        {/* Header */}

       <div className="relative flex items-center justify-center mb-4">
  <AboutTitle title="Our Products" />
  <button className="group absolute right-0 inline-flex items-center gap-4 px-1 py-1 text-[13px] font-medium text-[#8a6b47] transition-colors hover:text-[#6b5134]">
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
                  <p className="text-xs font-bold tracking-[0.08em] text-[#3d3227] uppercase leading-tight">
                    {product.title}
                  </p>

                  <p className="mt-1 text-xs font-bold tracking-[0.08em] text-[#5b524a] uppercase leading-tight">
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
