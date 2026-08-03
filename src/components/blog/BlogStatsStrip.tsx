import twenty from "@/assets/about_new/years_experience.webp";
import projects from "@/assets/about_new/project.webp";
import twohundred from "@/assets/about_new/happy_clients.webp";
import states from "@/assets/about_new/states_served.webp";
import in_house from "@/assets/about_new/in_house.webp";
import pan_india from "@/assets/about_new/pan_india.webp";
import Image from "next/image";
import { Container } from "../ui/Container";
import { getComponentContent, getImageUrl } from "@/lib/api/api";

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
    "blog.features_strip",
    {
      items: defaultStats,
    }
  );
  const stats = content.items?.length ? content.items : defaultStats;

  const resolvedStats: StatItem[] = stats.map(
    (item: StatItem, i: number) => ({
      ...defaultStats[i],
      ...item,
      image: item.imageurl?.imageUrl
        ? {
          src: getImageUrl(item.imageurl.imageUrl),
          alt: item.imageurl.alt,
        }
        : item.image ?? defaultStats[i]?.image,
    })
  );

  return (
    <Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 py-0">
      <div
        className="
          rounded-xl
          border border-[#C9972A]
          bg-[#0f2e22]
          py-3 px-3
          ring-1 ring-[#C9972A]/50
          ring-offset-2 ring-offset-transparent
        "
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {resolvedStats.map((item, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 pr-6 ${index !== resolvedStats.length - 1
                  ? "xl:border-r border-[#C9972A]/40"
                  : ""
                }`}
            >
              <div className="mt-1 shrink-0 w-14 h-14 flex items-center justify-center">
                <Image
                  src={item.image.imageUrl
                    ?? item.image}
                  alt={item.image.alt || item.title}
                  width={70}
                  height={50}
                  className="object-contain object-center"
                  style={{ height: "auto" }}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#faf6ef]">
                  {item.title}
                </p>

                <p className="mt-1 text-xs leading-4 text-[#faf6ef]/90 font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}