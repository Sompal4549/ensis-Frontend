import Image, { StaticImageData } from "next/image";
import { Container } from "../ui/Container";
import decorationLeft from "@/assets/icons/decoration_left.png"
import decorationRight from "@/assets/icons/decoration_right.png"
import flower from "@/assets/about/lotus.png";
import projects from "@/assets/images/projects.webp"
import experience from "@/assets/images/experience.webp"
import professionals from "@/assets/images/professionals.webp"
import pan_india from "@/assets/products/pan_india.webp"
import customized from "@/assets/icons/customized.webp"
import hotels_and_retreats from "@/assets/icons/hotels_and_retreats.webp"
import panchkarma2 from "@/assets/icons/panchkarma2.webp"
import partner from "@/assets/projects-and-clients/ourclients.webp"
import client1 from "@/assets/projects-and-clients/client1.webp"
import client2 from "@/assets/projects-and-clients/client2.webp"
import client3 from "@/assets/projects-and-clients/client3.webp"
import ourClients from "@/assets/projects-and-clients/ourclients.webp"

export interface ClientLogo {
  id: string;
  name: string;
  imageSrc: StaticImageData | string;
  imageAlt: string;
  width: number;
  height: number;
}

export interface TrustStat {
  id: string;
  iconSrc: string|StaticImageData;
  iconAlt: string;
  value: string;
  label: string;
}

export interface OurClients {
  heading: string;
  subheading: string;
  clients: ClientLogo[];
  stats: TrustStat[];
  decorativeImageSrc: string | StaticImageData;
  decorativeImageAlt: string;
}
export const clientsBannerFallback: OurClients = {
  heading: "Our Clients",
  subheading: "Trusted by Leading Wellness Brands Across India.",
  decorativeImageSrc:ourClients, // Dummy image for decorativeImageSrc
  decorativeImageAlt: "Ayurvedic spa items with diya, leaves and towels",
  clients: [
    {
      id: "ayurvaid",
      name: "AyurVAID Hospitals",
      imageSrc: flower,
      imageAlt: "AyurVAID Hospitals logo",
      width: 160,
      height: 48,
    },
    {
      id: "jiva",
      name: "JIVA Ayurveda",
      imageSrc: client1,
      imageAlt: "JIVA Ayurveda logo",
      width: 160,
      height: 48,
    },
    {
      id: "kairali",
      name: "Kairali Ayurvedic Group",
      imageSrc:client2,
      imageAlt: "Kairali Ayurvedic Group logo",
      width: 160,
      height: 48,
    },
    {
      id: "somatheeram",
      name: "Somatheeram Ayurveda Group",
      imageSrc: client3,
      imageAlt: "Somatheeram Ayurveda Group logo",
      width: 160,
      height: 48,
    },
    {
      id: "srisri",
      name: "Sri Sri Tattva",
      imageSrc: client1,
      imageAlt: "Sri Sri Tattva logo",
      width: 160,
      height: 48,
    },
    {
      id: "vaidyaratnam",
      name: "Vaidyaratnam",
      imageSrc: client2,
      imageAlt: "Vaidyaratnam logo",
      width: 160,
      height: 48,
    },
    {
      id: "arogyadhama",
      name: "Arogyadhama Ayurveda",
      imageSrc:client3,
      imageAlt: "Arogyadhama Ayurveda logo",
      width: 160,
      height: 48,
    },
    {
      id: "sahayog",
      name: "Sahayog Wellness",
      imageSrc: client1,
      imageAlt: "Sahayog Wellness logo",
      width: 160,
      height: 48,
    },
  ],
  stats: [
    {
      id: "happy-clients",
      iconSrc: flower, // Dummy image for flower icon
      iconAlt: "Lotus icon",
      value: "500+",
      label: "Happy Clients",
    },
    {
      id: "projects-completed",
      iconSrc: projects, // Dummy image for projects icon
      iconAlt: "Projects icon",
      value: "1000+",
      label: "Projects Completed",
    },
    {
      id: "years-trust",
      iconSrc: experience, // Dummy image for experience icon
      iconAlt: "Shield icon",
      value: "20+",
      label: "Years of Trust",
    },
    {
      id: "expert-professionals",
      iconSrc: professionals, // Dummy image for professionals icon
      iconAlt: "Professionals icon",
      value: "50+",
      label: "Expert Professionals",
    },
    {
      id: "pan-india",
      iconSrc: pan_india, // Dummy image for pan_india icon
      iconAlt: "Location pin icon",
      value: "Pan India",
      label: "Presence",
    },
    {
      id: "client-satisfaction",
      iconSrc: customized, // Dummy image for customized icon
      iconAlt: "Satisfaction icon",
      value: "100%",
      label: "Client Satisfaction",
    },
  ],
};

interface OurClientsBannerProps {
  data?: OurClients;
}

export default function WhyPartner({ sectionContent }: {sectionContent: OurClientsBannerProps}) {
  const banner = sectionContent?.data ?? clientsBannerFallback;

  return (
    <section className="relative w-full bg-[#FBF3E7]">
      <Container className="rounded-2xl border border-[#E3D2B0] bg-[#FBF3E7] ">
        {/* Heading */}
        <div className="mb-2 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
           <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" />
            <h2 className="text-xs font-semibold text-[#1F3325] sm:text-xl">
              {banner.heading}
            </h2>
           <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />
          </div>
          <p className="text-sm  sm:text-base font-semibold">{banner.subheading}</p>
        </div>

        {/* Client logos */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-8">
          {banner.clients.map((client) => (
            <div
              key={client.id}
              className="flex h-20 items-center justify-center rounded-xl border border-[#E3D2B0] bg-white px-3 py-2 sm:h-24"
            >
              <div className="relative h-10 w-full sm:h-12">
                <Image
                  src={client.imageSrc}
                  alt={client.imageAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 12vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="mb-8 h-px w-full bg-[#E3D2B0]" />

        {/* Stats + decorative image */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6 relative pr-20">
    <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:flex-1 lg:grid-cols-6 lg:gap-4">
  {banner.stats.map((stat, index) => (
    <div
      key={stat.id}
      className={`flex items-center gap-2 ${
        index !== banner.stats.length - 1
          ? "border-r border-[#d8d2c6]"
          : ""
      }`}
    >
                <div className="relative h-8 w-8 sm:h-9 sm:w-9  ">
                  <Image
                    src={stat.iconSrc}
                    alt={stat.iconAlt}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <div>
                  <div>
                <p className="font-serif text-lg font-semibold text-[#E8C766] sm:text-xl">
                  {stat.value}
                </p>
                <p className="text-xs">{stat.label}</p>
                </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -right-10 -top-10 bottom-0 w-40 shrink-0 sm:h-28 sm:w-48 lg:h-24 lg:w-44">
            <Image
              src={ourClients}
              alt={"Image"}
              fill
              className="object-contain object-right"
              sizes="(max-width: 1024px) 200px, 180px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}