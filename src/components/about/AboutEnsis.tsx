import Image from "next/image";
import { Container } from "../ui/Container";
import abouteEnsis from "@/assets/home/about_ensis.webp";
import experience from "@/assets/about/experience.webp"
import projects from "@/assets/about/projects.webp"
import happy_clients from "@/assets/about/happy_clients.webp"
import states from "@/assets/about/states.webp"
import experts from "@/assets/about/experts.webp"


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
      image:experience
    },
    {
      value: '1000+',
      label: 'Projects Completed',
      icon: '⬡',
      image:projects
    },
    {
      value: '200+',
      label: 'Happy Clients',
      icon: '✿',
      image:happy_clients
    },
    {
      value: '28',
      label: 'States Served',
      icon: '❋',
      image:states
    },
    {
      value: '50+',
      label: 'Expert Professionals',
      icon: '✺',
      image:experts
    },
  ];

  return (
    <section className="w-full bg-[#f7f3ee]">
      <Container>

      <Container className="overflow-hidden rounded-2xl border border-[#e2d8cb] bg-white shadow-sm px-0! py-0!">
        {/* Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_0.9fr]">
          {/* Left Image */}
          <div className="relative min-h-[320px] overflow-hidden">
            <Image
            width={500}
            height={320}
              src={abouteEnsis}
              alt="Workshop"
              className="h-full w-full object-cover"
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
              <div className="h-[3px] w-25 bg-red-500 mb-5 rounded-full"></div>

            <div className="space-y-4 text-sm leading-7 text-[#5a534d] md:text-[15px]">
              <p>
                ENSIS is the wellness division of Design House India Pvt.
                Ltd., a trusted name in turnkey interiors and manufacturing
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
            <div className="w-full space-y-5">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 text-sm font-medium text-[#3d3a36] md:text-[15px]"
                >
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#123f2d] text-xs text-[#d8b06a] shadow-sm">
                    ✓
                  </div>

                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 divide-y divide-[#295240] bg-[#0d3828] sm:grid-cols-3 md:grid-cols-5 md:divide-x md:divide-y-0">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center px-4 py-2 text-center"
            >
              <div className="mb-2 text-2xl text-[#cba25f]">
                <Image
                  src={item.image}
                  alt={item.label} width={50} height={50} />
              </div>

              <h3 className="text-3xl font-semibold text-white">
                {item.value}
              </h3>

              <p className="mt-2 text-xs font-medium tracking-wide text-[#d8d2ca] md:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
      </Container>

    </section>
  );
}
