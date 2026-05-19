import { Container } from "../ui/Container";
import AboutTitle from "./AboutTitle";
import img12 from "@/assets/home/img-12.webp"
import panchkarma_2 from "@/assets/home/panchkarma_2.webp"
import steam from "@/assets/home/steam.webp"
import wellness_assosries from "@/assets/home/wellness_assossories.webp"
import wellness_furniture from "@/assets/home/wellness_furniture.webp"
import wellnessInteriors from "@/assets/home/wellness_interiors.webp"
import Image from "next/image";

export default function OurProductsSection() {
  const products = [
    {
      title: 'PANCHKARMA',
      subtitle: 'EQUIPMENT',
      image:
        panchkarma_2,
    },
    {
      title: 'SHIRODHARA',
      subtitle: 'EQUIPMENT',
      image: img12,
    },
    {
      title: 'STEAM & SAUNA',
      subtitle: 'SOLUTIONS',
      image: steam,
    },
    {
      title: 'WELLNESS',
      subtitle: 'FURNITURE',
      image: wellness_furniture,
    },
    {
      title: 'WELLNESS',
      subtitle: 'ACCESSORIES',
      image:
        wellness_assosries,
    },
    {
      title: 'WELLNESS',
      subtitle: 'INTERIORS',
      image:
        wellnessInteriors,
    },
  ];

  return (
    <section className="w-full bg-[#f7f2ec]">
      <Container>
        {/* Header */}

        <AboutTitle
          title="Our Products"
        />
        {/* Top Link */}
        <div className="mb-5 flex justify-end">
          <button className="group flex items-center gap-2 text-[13px] font-medium text-[#8a6b47] transition-colors hover:text-[#6b5134]">
            View All Products
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
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
              <div className="relative aspect-[1/1] overflow-hidden bg-[#eee]">
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
                  <h3 className="text-[14px] font-bold tracking-[0.08em] text-[#3d3227] uppercase leading-tight">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-[14px] font-bold tracking-[0.08em] text-[#5b524a] uppercase leading-tight">
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
