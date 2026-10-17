import Link from "next/link";
import { Container } from "./Container";

type City = { city: string; slug: string };

/**
 * Bottom-of-page links to a solution's or product's city pages. The city being viewed is left out,
 * so a page never links to itself.
 */
export default function CityLinks({
  title,
  basePath,
  cities,
  currentSlug,
}: {
  /** e.g. "Panchkarma Clinic Setup" */
  title: string;
  /** e.g. /solutions/panchkarma-clinic-setup */
  basePath: string;
  cities: City[];
  currentSlug?: string;
}) {
  const others = cities.filter((c) => c.slug && c.slug !== currentSlug);
  if (!others.length) return null;

  return (
    <section className="border-t border-[#ece7dc] bg-white" aria-label={`${title} in other cities`}>
      <Container className="py-6">
        <nav className="flex flex-wrap justify-start gap-3">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`${basePath}/${c.slug}`}
              title={`${title} in ${c.city}`}
              className="rounded-[3px] border border-[#dcdcdc] bg-white px-4 py-2 text-[15px] text-[#333] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition hover:border-[#c39a5c] hover:text-[#0e3d21]"
            >
              {c.city}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
