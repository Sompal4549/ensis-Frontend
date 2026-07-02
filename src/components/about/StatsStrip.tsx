import twenty from "@/assets/about_new/years_experience.webp"
import projects from "@/assets/about_new/project.webp"
import twohundred from "@/assets/about_new/happy_clients.webp"
import states from "@/assets/about_new/states_served.webp";
import in_house from "@/assets/about_new/in_house.webp"
import pan_india from "@/assets/about_new/pan_india.webp"
import Image from "next/image";
import { Container } from "../ui/Container";
import { getComponentContent, getImageUrl } from "@/lib/api/api";
import StatsContainer from "../layout/StatsContainer";

const defaultStats = [
  { image: twenty, number: "20+", subTitle: "Years Experience" },
  { image: projects, number: "1000+", subTitle: "Projects Completed" },
  { image: twohundred, number: "200+", subTitle: "Happy Clients" },
  { image: states, number: "28", subTitle: "States Served" },
  { image: in_house, number: "In-house", subTitle: "Manufacturing" },
  { image: pan_india, number: "Pan India", subTitle: "Installation & Support" },
];

interface StatItem {
  image: any;
  number: string;
  subTitle: string;
  imageurl?: { imageUrl: string; alt: string; };
}

interface StatsStripContent {
  stats: StatItem[];
}

function resolveImageSrc(image: any): string {
  if (!image) return "";
  if (typeof image === "string") return getImageUrl(image);
  // API shape: { src, width, height, ... }
  if (typeof image === "object" && image.src) return image.src;
  // Next.js static import shape (already handled by next/image)
  return image;
}

export default async function StatsStrip({ sectionContent }: { sectionContent: StatsStripContent }) {
const resolvedStats: StatItem[] = sectionContent.stats.map((item: StatItem, i: number) => ({
  ...defaultStats[i], // Fallback to defaultStats if API doesn't provide all fields
  ...item,
  image: item.imageurl?.imageUrl ? { src: getImageUrl(item.imageurl.imageUrl) } : (item.image ?? defaultStats[i].image),
}));
  return (
    <section className="bg-[#f2ede6]">
      <Container>
        <StatsContainer>

        <div className="mx-auto grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 py-2">
          {resolvedStats.map((item, index) => (
            <div
              key={index}
              className="flex flex-1 items-center gap-3 md:border-r border-black/10 px-4 last:border-r-0 md:min-w-0"
            >
              <div className="h-9 w-9">
                <Image
                  src={item.image.src} // Use item.image.src from resolvedStats
                  alt={item.image.alt || item.subTitle} // Use item.image.alt from resolvedStats
                  height={36}
                  width={36}
                  className="object-contain"
                  style={{ height: "auto" }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-none text-black">
                  {item.number}
                </span>
                <span className="mt-1 text-[10px] font-medium leading-[1.3] text-black/70">
                  {item.subTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
        </StatsContainer>

      </Container>
    </section>
  );
}