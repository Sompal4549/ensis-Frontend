import Image from "next/image";
import { Container } from "../ui/Container";
import abouteEnsis from "@/assets/home/about_ensis.webp";
import experience from "@/assets/images/experience.webp"
import projects from "@/assets/images/projects.webp"
import happy_clients from "@/assets/images/happy_clients.webp"
import states from "@/assets/images/states_served.webp"
import experts from "@/assets/images/professionals.webp"


export default function AboutEnsisSection() {
  const features = [
    'In-house Manufacturing Unit',
    'Ayurveda Focused Innovation',
    'Custom Designed Solutions',
    'End-to-end Turnkey Execution',
    'Pan India & Global Delivery',
    'After Sales Support',
  ];

  const stats = [
    {
      value: '20+',
      label: 'Years of Experience',
      icon: '◎',
      image: experience
    },
    {
      value: '1000+',
      label: 'Projects Completed',
      icon: '⬡',
      image: projects
    },
    {
      value: '200+',
      label: 'Happy Clients',
      icon: '✿',
      image: happy_clients
    },
    {
      value: '28',
      label: 'States Served',
      icon: '❋',
      image: states
    },
    {
      value: '50+',
      label: 'Expert Professionals',
      icon: '✺',
      image: experts
    },
  ];

  return (
    <section className="w-full bg-[#f7f3ee]">
      <Container className="overflow-hidden rounded-2xl bg-gray">
        {/* Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_0.9fr]">
          {/* Left Image */}
          <div className="relative min-h-[320px] overflow-hidden">
            <Image
              width={500}
              height={320}
              src={abouteEnsis}
              crossOrigin="anonymous"
              alt="Workshop"
              className="h-full w-full object-cover rounded-tl-xl rounded-tr-xl"
            />

            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Middle Content */}
          <div className="flex flex-col justify-center px-6 py-8 md:px-8 lg:px-10">

            <h2
              className="
            text-[#2d2b28]
            text-[28px]
            font-semibold
            tracking-[2px]
            uppercase
            font-serif
          "
            >
              About ENSIS
            </h2>
            <div className="h-[1px] w-25 bg-[#ca8e42] mb-5 rounded-full"></div>

            <div className="space-y-4 text-xs font-medium md:text-[15px]">
              <p>
                ENSIS is the wellness division of <b>Design House India Pvt.
                  Ltd.</b>, a trusted name in turnkey interiors and manufacturing
                since 2003.
              </p>

              <p>
                With a passion for Ayurveda and a commitment to excellence, we
                design and manufacture premium Panchakarma equipment, wellness
                furniture and complete wellness interiors for spas, clinics,
                resorts and hospitals.
              </p>

              <p>
                Every product is crafted in our state-of-the-art production
                unit using high-quality materials, advanced technology and
                timeless craftsmanship.
              </p>
            </div>
          </div>

          {/* Right Features */}
          <div className="flex items-center border-t border-[#eee7de] px-6 py-2 lg:border-l lg:border-t-0 lg:px-8">
            <div className="w-full space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 text-sm font-medium text-[#3d3a36] md:text-[15px]"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#123f2d] text-xs text-white shadow-sm">
                    ✓
                  </div>

                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 bg-[#0d3828] rounded-bl-2xl rounded-br-2xl overflow-hidden border border-[#295240]">
          {stats.map((item, index) => (
            <div
              key={index}
              className={`
        flex items-center gap-4 px-5 py-5
        border-b border-[#295240]
        md:border-b-0
        md:border-r
        last:border-b-0
        md:last:border-r-0
      `}
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-[#153f30] border border-[#295240] flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.label}
                  width={26}
                  height={26}
                  className="object-contain"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <p className="text-2xl md:text-3xl font-medium text-white leading-none">
                  {item.value}
                </p>

                <p className="mt-1 text-xs md:text-sm leading-snug text-[#d8d2ca]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
