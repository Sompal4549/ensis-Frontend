import Image from "next/image";
import luxury from "@/assets/trunkey_solutions/featured_trunkey1.webp";
import ayurveda from "@/assets/trunkey_solutions/featured_trunkey_2.webp";  
import resort from "@/assets/trunkey_solutions/featured_trunkey_3.webp";
import retreat from "@/assets/trunkey_solutions/featured_trunkey_4.webp";
import integrated from "@/assets/trunkey_solutions/featured_trunkey_5.webp";
import spa from "@/assets/trunkey_solutions/featured_trunkey_6.webp";
import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
import decorationLeft from "@/assets/icons/decoration_left.png"
import decorationRight from "@/assets/icons/decoration_right.png"

const projects = [
  {
    title: "Luxury Panchkarma Centre",
    location: "Kerala",
    image:luxury,
  },
  {
    title: "Ayurveda Hospital",
    location: "Maharashtra",
    image:ayurveda,
  },
  {
    title: "Wellness Resort & Spa",
    location: "Karnataka",
    image:resort,
  },
  {
    title: "Health Retreat",
    location: "Himachal Pradesh",
    image:retreat,
  },
  {
    title: "Integrative Clinic",
    location: "Delhi",
    image:integrated,
  },
  {
    title: "Spa & Wellness Facility",
    location: "Goa",
    image:spa,
  },
];

export default function FeaturedProjects() {
  return (
    <section className="w-full bg-[#f7f3eb]">
      <Container>
        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-3">
         <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" />
          <h2 className="text-base font-semibold uppercase">
            Featured Turnkey Projects
          </h2>
          <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" />
        </div>

        {/* Cards */}
 <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
  {projects.map((project, index) => (
    <div
      key={index}
      className="overflow-hidden rounded-md border border-[#d8d2c6] bg-white"
    >
      {/* Image with fixed height container */}
      <div className="relative h-[160px] w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover scale-110"
        />
      </div>

      {/* Content */}
      <div className="px-2 py-2 mt-2">
        <h3 className="text-sm font-semibold leading-[1.2]">
          {project.title}
        </h3>
        <p className="mt-1 text-xs leading-none">
          {project.location}
        </p>
      </div>
    </div>
  ))}
</div>

        {/* Button */}
        <div className="mt-2 flex justify-center">
        <BookButton text="View All Projects" />
       
        </div>
      </Container>
    </section>
  );
}