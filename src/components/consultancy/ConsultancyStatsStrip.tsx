import twenty from "@/assets/about_new/years_experience.webp";
import projects from "@/assets/about_new/project.webp";
import twohundred from "@/assets/about_new/happy_clients.webp";
import states from "@/assets/about_new/states_served.webp";
import in_house from "@/assets/about_new/in_house.webp";
import pan_india from "@/assets/about_new/pan_india.webp";
import Image from "next/image";
import { Container } from "../ui/Container";
import { getComponentContent, getImageUrl } from "@/lib/api/api";
import { gridColsClass } from "@/constants/grid";

const defaultStats: StatItem[] = [
  { image: twenty, title: "20+", description: "Years Experience" },
  { image: projects, title: "1000+", description: "Projects Completed" },
  { image: twohundred, title: "200+", description: "Happy Clients" },
  { image: states, title: "28", description: "States Served" },
  { image: in_house, title: "In-house", description: "Manufacturing" },
  { image: pan_india, title: "Pan India", description: "Installation & Support" },
];

interface StatItem {
  image: any;
  title: string;
  description: string;
  imageurl?: {
    imageUrl: string;
    alt: string;
  };
}

interface StatsStripContent {
  items: StatItem[];
}

export default async function ConsultancyStatsStrip () {
  const content = await getComponentContent<StatsStripContent>(
    "consultancy.features_strip",
    {
      items: defaultStats,
    }
  );
  const stats = content.items?.length ? content.items : defaultStats;

  const resolvedStats: StatItem[] = stats.map(
    (item: StatItem, i: number) => {
      const imageUrl = item.imageurl?.imageUrl || (item.image as any)?.imageUrl;
      const alt = item.imageurl?.alt || (item.image as any)?.alt || item.title;
      return {
        ...defaultStats[i],
        ...item,
        image: imageUrl
          ? {
            src: getImageUrl(imageUrl, 200),
            alt,
          }
          : item.image ?? defaultStats[i]?.image,
      };
    }
  );

  const displayStats = resolvedStats.slice(0, 5);
  const gridCols = gridColsClass(displayStats.length);

  return (
    <Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
      <div
        className="
          rounded-xl
          border border-[#C9972A]
          bg-[#0f2e22]
          py-2 px-3
          ring-1 ring-[#C9972A]/50
          ring-offset-2 ring-offset-transparent
        "
      >
        <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridCols}`}>
          {displayStats.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 pr-6 ${index !== displayStats.length - 1
                  ? "xl:border-r border-[#C9972A]/40"
                  : ""
                }`}
            >
              <div className="shrink-0 w-12 h-12 flex items-center justify-center overflow-hidden">
                <Image
                  src={item.image.src
                    ?? item.image}
                  alt={item.image.alt || item.title}
                  width={44}
                  height={44}
                  className="object-contain object-center"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="tabular-nums text-base font-semibold text-[#faf6ef] leading-tight">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}