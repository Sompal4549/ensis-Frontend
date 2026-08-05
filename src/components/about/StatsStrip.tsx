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
import { gridColsClass } from "@/constants/grid";

const defaultStats: StatItem[] = [
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
  imageurl?: { imageUrl: string; alt: string };
}

interface StatsStripContent {
  stats: StatItem[];
}

export default async function StatsStrip() {
  const content = await getComponentContent<StatsStripContent>("about.statsStrip", {
    stats: defaultStats,
  });

  const stats = content.stats?.length ? content.stats : defaultStats;

  const resolvedStats: StatItem[] = stats.map((item: StatItem, i: number) => ({
    ...defaultStats[i], // Fallback to defaultStats if API doesn't provide all fields
    ...item,
    image: item.imageurl?.imageUrl
      ? { src: getImageUrl(item.imageurl.imageUrl, 200) }
      : item.image ?? defaultStats[i]?.image,
  }));

  const gridCols = gridColsClass(resolvedStats.length);

  return (
<Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
  <div className="border border-[#C9972A] bg-[#f3eee6] rounded-xl py-2 px-3 ring-1 ring-[#C9972A]/50 ring-offset-2 ring-offset-transparent">
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridCols}`}>
      {resolvedStats.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 pr-6 ${
            index !== resolvedStats.length - 1
              ? "xl:border-r border-[#d6c2a0]"
              : ""
          }`}
        >
          <div className="shrink-0 w-14 h-14 flex items-center justify-center overflow-hidden">
            <Image
              src={item.image.src ?? item.image}
              alt={item.image.alt || item.subTitle}
              width={44}
              height={44}
              className="object-contain object-center"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold text-[#0f2518] leading-tight">
              {item.number}
            </p>

            <p className="text-xs leading-4 text-[#0f2518] font-medium">
              {item.subTitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</Container>
  );
}