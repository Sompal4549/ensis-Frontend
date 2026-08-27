"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  ClipboardCheck,
  Droplets,
  Flower2,
  Frame,
  HandHeart,
  HardHat,
  Lamp,
  LayoutGrid,
  Leaf,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import BookButton from "@/components/ui/BookButton";
import GreenButton from "@/components/ui/GreenButton";
import {
  solutionsMap,
  services,
  process,
  getSolutionCardsExcluding,
} from "@/data/solutions";

const ease = [0.22, 1, 0.36, 1] as const;

const iconMap: Record<string, LucideIcon> = {
  ArrowRight,
  BedDouble,
  ClipboardCheck,
  Droplets,
  Flower2,
  Frame,
  HandHeart,
  HardHat,
  Lamp,
  LayoutGrid,
  Leaf,
  Settings,
  Sparkles,
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Leaf;
}

export default function SolutionClient({ slug }: { slug: string }) {
  const solution = solutionsMap[slug];

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
        <Container>
          <div className="text-center py-20">
            <h1 className="font-serif text-4xl text-[#0f2518]">
              Solution Not Found
            </h1>
            <p className="mt-4 text-[#444] text-lg">
              The solution you&apos;re looking for doesn&apos;t exist.
            </p>
            <div className="mt-8">
              <BookButton text="BACK TO HOME" path="/" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  const solutionCards = getSolutionCardsExcluding(slug);

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf7f2] font-sans text-[#333]">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        className="
          relative
          overflow-visible
          min-h-[550px]
          max-h-[650px]
          md:h-[calc(100vh-146px)]
        "
      >
        <Image
          src={solution.hero.image}
          alt={solution.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-left"
          crossOrigin="anonymous"
        />

        <Container className="relative flex min-h-[550px] items-center">
          <Reveal className="max-w-[620px]">
            <h1
              className="
                font-serif
                text-[42px]
                leading-[1.08]
                md:text-[54px]
                text-[#0e3d21]
              "
            >
              {solution.hero.heading.map((line, i) => (
                <span key={i}>
                  <span className="text-[#0e3d21]">
                    {line}
                  </span>
                  {i < solution.hero.heading.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p
              className="
                mt-4
                text-base
                font-semibold
                tracking-[0.15em]
                text-[#a9742a]
              "
            >
              {solution.hero.eyebrow}
            </p>

            <div className="my-2 h-px w-9 bg-[#a9742a]" />

            <p
              className="
                mt-6
                max-w-[540px]
                text-base
                leading-6
                font-semibold
                text-[#555]
              "
            >
              {solution.hero.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <BookButton
                text={solution.hero.primaryCta}
                path="/contact"
                fontSize="text-xs md:text-base"
              />
              <GreenButton
                text={solution.hero.secondaryCta}
                path="#approach"
                fontSize="text-xs md:text-base"
              />
            </div>
          </Reveal>
        </Container>

        {/* Stats strip — overlapping hero bottom */}
        <Container className="static lg:absolute lg:z-20 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 lg:bottom-0 !py-0 -mt-10 md:mt-0">
          <Reveal
            className="
              rounded-2xl
              border-2
              border-[#c39a5c]
              bg-white/95
              shadow-[0_10px_30px_rgba(95,68,22,0.10)]
              backdrop-blur-sm
              grid
              grid-cols-1
              md:grid-cols-4
              py-2
            "
          >
            {solution.stats.map((item, index) => {
              const Icon = getIcon(item.icon);

              return (
                <div
                  key={item.text}
                  className={`
                    flex
                    min-h-[60px]
                    items-center
                    gap-3
                    px-5
                    py-2
                    ${
                      index < solution.stats.length - 1
                        ? "border-b border-[#c39a5c] md:border-b-0 md:border-r md:border-[#c39a5c]"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={40}
                    strokeWidth={1.25}
                    className="shrink-0 text-[#c39a5c]"
                  />

                  <div>
                    <div
                      className="
                        text-base
                        font-semibold
                        leading-tight
                        text-[#0f2518]
                      "
                    >
                      {item.top}
                    </div>

                    <div
                      className="
                        mt-1
                        text-base
                        leading-4
                        font-normal
                        text-[#333]
                      "
                    >
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </Container>
      </section>

      {/* =========================================================
          APPROACH
      ========================================================= */}

      <section id="approach" className="bg-[#0f2518] border-b border-[#e6d6b9] pt-28 md:pt-14 pb-4">
        <Container className="py-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p
                className="
                  text-base
                  font-semibold
                  tracking-[0.16em]
                  text-[#c39a5c]
                "
              >
                {solution.approach.eyebrow}
              </p>

              <div className="my-3 h-px w-8 bg-[#c39a5c]" />

              <h2
                className="
                  font-serif
                  text-3xl
                  leading-tight
                  text-white
                  md:text-[38px]
                "
              >
                {solution.approach.heading.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < solution.approach.heading.length - 1 && <br />}
                  </span>
                ))}
              </h2>

              <div className="mt-2 space-y-4 text-base leading-6 text-white/70">
                {solution.approach.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal
              className="relative"
              delay={0.1}
            >
              <div
                className="
                  relative
                  w-full
                "
              >
                <Image
                  src={solution.approach.image}
                  alt={solution.approach.imageAlt}
                  width={800}
                  height={600}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-auto object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* =========================================================
          SPACES
      ========================================================= */}

      <section>
        <Container className="py-4">
          <Reveal className="text-center">
            <p
              className="
                text-base
                font-semibold
                tracking-[0.16em]
                text-[#a9742a]
              "
            >
              {solution.spaces.eyebrow}
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                text-[#0f2518]
                md:text-3xl
              "
            >
              {solution.spaces.heading}
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-[720px]
                text-base
                leading-5
                text-[#444]
              "
            >
              {solution.spaces.description}
            </p>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.08,
            }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.07,
                },
              },
            }}
            className="
              mt-7
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-6
            "
          >
            {solution.spaces.items.map((item, index) => {
              const Icon = getIcon(item.icon);

              return (
                <motion.article
                  key={item.title}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="
                    flex
                    flex-col
                    items-center
                    text-center
                    px-2
              py-2
                    border-r
                    border-[#e0d5c5]
                    last:border-r-0
                  "
                >
                  <Icon
                    size={36}
                    strokeWidth={1.15}
                    className="text-[#c39a5c]"
                  />

                  <h3
                    className="
                      mt-4
                      text-base
                      font-bold
                capitalize
                      tracking-wide
                      text-[#0f2518]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-base
                      leading-5
                      text-[#444]
                    "
                  >
                    {item.text}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </Container>
      </section>

      {/* =========================================================
          COMPLETE SOLUTIONS
      ========================================================= */}

      <section className="relative overflow-hidden bg-[#0f2518] text-white">
        <div className="absolute inset-0 opacity-[0.05]">
          <Leaf
            className="absolute -left-12 top-4 h-72 w-72"
            strokeWidth={0.5}
          />

          <Flower2
            className="absolute -right-12 bottom-0 h-72 w-72"
            strokeWidth={0.5}
          />
        </div>

        <Container className="relative pt-2 pb-4">
          <Reveal className="text-center">
            <p
              className="
                text-base
                font-semibold
                tracking-[0.16em]
                text-[#d0a965]
              "
            >
              OUR COMPLETE SETUP SOLUTIONS
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                text-white
                md:text-3xl
              "
            >
              End-to-End Partner for Your Wellness Project.
            </h2>
          </Reveal>

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-y-9
              md:grid-cols-4
              lg:grid-cols-7
            "
          >
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);

              return (
                <Reveal
                  key={service.title}
                  delay={index * 0.05}
                  className={`
                    px-4
                    text-center
                    ${
                      index !== services.length - 1
                        ? "lg:border-r lg:border-white/20"
                        : ""
                    }
                  `}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#c39a5c] shadow-[0_0_6px_1px_rgba(195,154,92,0.3)]">
                    <Icon
                      size={26}
                      strokeWidth={1.2}
                      className="text-white"
                    />
                  </div>

                  <h3
                    className="
                      mt-4
                      text-base
                      font-bold
                      leading-6
                      tracking-wide
                      text-white
                    "
                  >
                    {service.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-base
                      leading-6
                      text-white/65
                    "
                  >
                    {service.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}

      <section className="border-b border-[#e6d6b9] bg-[#faf7f2] relative">
        <Container className="py-4">
          <Reveal className="text-center">
            <p
              className="
                text-base
                font-semibold
                tracking-[0.16em]
                text-[#a9742a]
              "
            >
              OUR PROCESS
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                text-[#0f2518]
                md:text-3xl
              "
            >
              A Structured Journey From Concept To Care.
            </h2>
          </Reveal>

          <div className="mt-6 md:flex md:items-start md:gap-0">
            <div
              className="
                relative
                grid
                grid-cols-2
                gap-8
                md:grid-cols-6
                md:gap-2
                md:flex-1 z-10
              "
            >
              {/* <div
                className="
                  absolute
                  left-[8%]
                  right-[8%]
                  top-5
                  hidden
                  h-px
                  bg-[#e6d6b9]
                  md:block
                "
              /> */}

              {process.map((item, index) => (
                <Reveal
                  key={item.number}
                  delay={index * 0.06}
                  className="relative text-center"
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#c39a5c]
                      text-base
                      font-bold
                      text-white
                    "
                  >
                    {item.number}
                  </div>

                  <h3
                    className="
                      mt-3
                      text-base
                      font-bold
                      tracking-wide
                      text-[#0f2518]
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-[150px]
                      text-base
                      leading-6
                      text-[#444]
                    "
                  >
                    {item.text}
                  </p>

                  {index !== process.length - 1 && (
                    <ArrowRight
                      size={15}
                      className="
                        absolute
                        -right-2
                        top-1/2
                        -translate-y-1/2
                        hidden
                        text-[#0f2518]
                        md:block
                      "
                    />
                  )}
                </Reveal>
              ))}
            </div>

          </div>
        </Container>
            <Reveal className="hidden md:block w-[20%] right-0 top-0 bottom-0 absolute z-0 self-stretch">
              <Image
                src="https://res.cloudinary.com/ddjhixcwh/image/upload/v1782902339/ensis/isou1qrftguelpicwcnh.webp"
                alt="Our Process"
                width={70}
                height={100}
                className="rounded-2xl object-contain w-full h-full object-right"
                crossOrigin="anonymous"
              />
            </Reveal>
      </section>

      {/* =========================================================
          OUR SOLUTIONS
      ========================================================= */}

      <section className="bg-white">
        <Container className="pt-2 pb-4">
          <Reveal
            className="
              flex
              flex-wrap
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-base
                  font-semibold
                  tracking-[0.16em]
                  text-[#a9742a]
                "
              >
                OUR SOLUTIONS
              </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                font-semibold
                text-[#0f2518]
                md:text-3xl
              "
            >
                Thoughtfully Designed. Purposefully Built.
              </h2>
            </div>
          </Reveal>

          <div
            className="
              mt-2
              grid
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {solutionCards.map((solution, index) => (
              <Reveal
                key={solution.title}
                delay={index * 0.07}
              >
                <Link href={solution.href} className="flex flex-col h-full">
                  <article
                    style={{
                      boxShadow: "rgba(60,64,67,0.3) 0px 1px 2px 0px, rgba(60,64,67,0.15) 0px 2px 6px 2px",
                    }}
                    className="
                      group
                      flex
                      flex-col
                      flex-1
                      rounded-2xl
                      bg-[#fdfaf3]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                    "
                  >
                    <div
                      className="
                        relative
                        aspect-[2/1]
                        overflow-hidden
                        rounded-t-2xl
                        bg-[#f3ecdc]
                      "
                    >
                      <Image
                        src={solution.image}
                        alt={solution.title}
                        width={800}
                        height={400}
                        className="
                          absolute
                          right-0
                          top-0
                          h-full
                          w-[200%]
                          object-cover
                          transition
                          duration-700
                          group-hover:scale-105
                        "
                        crossOrigin="anonymous"
                      />
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-end">
                      <h3
                        className="
                          text-base
                          font-semibold
                          text-[#0f2518]
                          line-clamp-1
                        "
                      >
                        {solution.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-base
                          text-[#555]
                          line-clamp-1
                        "
                      >
                        {solution.category}
                      </p>
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="relative overflow-hidden">
        <Image
          src={solution.cta.image}
          alt={solution.cta.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfaf3]/40 to-transparent md:w-1/2" />

        <Container className="relative flex py-4 items-center">
          <Reveal className="max-w-[540px]">
            <p
              className="
                text-sm
                md:text-base
                font-semibold
                tracking-[0.16em]
                text-[#a9742a]
              "
            >
              {solution.cta.eyebrow}
            </p>

            <h2
              className="
                mt-2
                font-serif
                text-2xl
                leading-[1.1]
                text-[#0f2518]
                md:text-[40px]
              "
            >
              {solution.cta.heading.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < solution.cta.heading.length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p
              className="
                mt-4
                max-w-[480px]
                text-sm
                md:text-base
                leading-6
                text-[#333]
              "
            >
              {solution.cta.description}
            </p>

            <div className="mt-5">
              <BookButton
                text={solution.cta.buttonText}
                path="/contact"
                fontSize="text-xs md:text-base"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
