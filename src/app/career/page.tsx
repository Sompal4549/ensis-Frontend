import { generateSeo } from "@/lib/api/seo";
import CareerLanding from "@/components/career-v2/CareerLanding";

export async function generateMetadata() {
  return generateSeo("career");
}

export default function CareerPage() {
  return <CareerLanding />;
}
