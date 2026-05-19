import { Container } from "../ui/Container";
import AboutTitle from "./AboutTitle";

export default function OurProductsSection() {
  const products = [
    {
      title: 'PANCHKARMA',
      subtitle: 'EQUIPMENT',
      image:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'SHIRODHARA',
      subtitle: 'EQUIPMENT',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'STEAM & SAUNA',
      subtitle: 'SOLUTIONS',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'WELLNESS',
      subtitle: 'FURNITURE',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'WELLNESS',
      subtitle: 'ACCESSORIES',
      image:
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'WELLNESS',
      subtitle: 'INTERIORS',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
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
                <img
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
