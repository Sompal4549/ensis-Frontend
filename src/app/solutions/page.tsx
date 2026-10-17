import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { fetchSolutions, solutionCards } from "@/lib/solutions";
import { generateSeo } from "@/lib/api/seo";
import { SITE_URL } from "@/lib/site";
import { toJsonLd } from "@/lib/seo-text";

export const revalidate = 60;

const description =
  "Explore ENSIS solutions — Panchkarma clinic setup, resort & spa setup, wellness retreat design, Ayurveda hospital setup and interior & equipment integration.";

// SEO comes from Pages & CMS → Custom Solutions & Engineering, like the other pages
export async function generateMetadata(): Promise<Metadata> {
  return generateSeo("solutions");
}

export default async function SolutionsPage() {
  const cards = solutionCards(await fetchSolutions());
  const jsonLd = toJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ENSIS Solutions",
    description,
    url: `${SITE_URL}/solutions`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cards.map((card, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: card.title,
        url: `${SITE_URL}${card.href}`,
      })),
    },
  });

  return (
    <main className="min-h-screen bg-[#faf7f2] font-sans text-[#333]">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <Container className="py-12">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#a9742a]">OUR SOLUTIONS</p>
          <div className="mx-auto my-3 h-px w-9 bg-[#a9742a]" />
          <h1 className="font-serif text-[36px] leading-tight text-[#0e3d21] md:text-[46px]">
            Complete Wellness Spaces, Designed &amp; Delivered.
          </h1>
          <p className="mt-4 text-base font-semibold leading-7 text-[#555]">{description.replace(/^Explore ENSIS solutions — /, "From ")}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e6d6b9] bg-white shadow-[0_10px_30px_rgba(95,68,22,0.08)] transition hover:-translate-y-1"
            >
              <div className="relative h-[220px] w-full bg-[#e8e0d5]">
                {card.image && (
                  <Image src={card.image} alt={card.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold tracking-[0.15em] text-[#a9742a]">{card.category}</p>
                <h2 className="mt-2 font-serif text-[22px] leading-tight text-[#0e3d21]">{card.title}</h2>
                <span className="mt-auto pt-4 text-sm font-semibold text-[#0e3d21] group-hover:underline">Explore solution →</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
