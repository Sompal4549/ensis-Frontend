import { Container } from "../ui/Container";

type IndustryItem = {
  title: string;
  icon: string;
};

const industries: IndustryItem[] = [
  {
    title: "Ayurveda Hospitals",
    icon: "✚",
  },
  {
    title: "Wellness Resorts",
    icon: "♨",
  },
  {
    title: "Luxury Spas",
    icon: "❀",
  },
  {
    title: "Panchkarma Centers",
    icon: "☸",
  },
  {
    title: "Yoga Retreats",
    icon: "🧘",
  },
  {
    title: "Wellness Clinics",
    icon: "⌂",
  },
  {
    title: "Hotels & Retreats",
    icon: "🏛",
  },
  {
    title: "Naturopathy Centers",
    icon: "✿",
  },
];

export default function IndustriesWeServe() {
  return (
    <section className="w-full bg-[#f8f5f1] py-10 px-4 md:px-8">
      <Container>
        {/* Heading */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-[#e5ddd2]" />

          <div className="flex flex-col items-center">
            <h2 className="text-[18px] md:text-[24px] font-semibold tracking-wide text-[#2e2a26] uppercase">
              Industries We Serve
            </h2>

            <div className="mt-2 h-[2px] w-10 rounded-full bg-[#c8a16a]" />
          </div>

          <div className="h-px flex-1 bg-[#e5ddd2]" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center rounded-md border border-[#e7dfd5] bg-white px-3 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#e7d7c2] bg-[#fbf8f4] text-[24px] text-[#b78a56] transition-all duration-300 group-hover:scale-105">
                {industry.icon}
              </div>

              {/* Title */}
              <p className="text-[11px] md:text-[12px] font-semibold leading-5 tracking-wide text-[#403831]">
                {industry.title}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}