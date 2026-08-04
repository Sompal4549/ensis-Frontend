import Image from "next/image";
import bannerImage from "@/assets/home/home_banner2.webp";
import lotus from "@/assets/about/lotus.png";
import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ArrowRight, Link } from "lucide-react";
import logo from "@/assets/logo.webp"
interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  page?: string
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  page
}: AuthLayoutProps) {
  return (
    <section className="relative min-n-[70vh] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={bannerImage}
          fill
          priority
          alt="ENSIS"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08130c]/80 via-[#08130c]/50 to-[#08130c]/30" />
      </div>

      <Container className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          className="
    w-full
    lg:w-[50vw]
    max-w-[1100px]
    overflow-hidden
    rounded-3xl
    bg-white
    border-[4px]
    border-[#c7a45d]
    shadow-[0_20px_60px_rgba(0,0,0,0.18)]
  "
        >
          <div className="flex flex-col md:flex-row">

            {/* LEFT SECTION */}
            <div className="hidden md:flex md:w-1/2 bg-[#1f261b] text-white pl-10 pr-6 py-6 flex-col justify-center">

              <Image
                src={lotus}
                alt="Lotus"
                width={40}
                height={40}
              />

              <h1 className="mt-5">
                Premium {" "}
                <span className="text-[#d9c49d]">
                  Wellness
                </span>
                <span className="block">

                  Solutions
                </span>
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-white">
                Engineering sustainable wellness spaces with
                innovative turnkey solutions for resorts,
                spas, Panchkarma centres and wellness clinics.
              </p>

              <div className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-[#d9c49d]">
                    150+
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Projects
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-[#d9c49d]">
                    25+
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Years
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-[#d9c49d]">
                    100%
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Support
                  </p>
                </div>
              </div>
              {page === "login" && (
                <div className="mt-3 flex flex-col">
                  <a href="/register" className="inline-flex items-center gap-4 text-sm font-bold text-white hover:text-[#d9c49d] transition-colors mb-2">
                    Don't have an account? Register <ArrowRight size={16} />
                  </a>
                  <a href={process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"} target="_blank" className="inline-flex items-center gap-4 text-sm font-bold text-[#d9c49d] mt-1">
                    Admin Login <ArrowRight size={16} />
                  </a>
                </div>
              )}
              {page === "register" && (

                <div className="mt-8 flex flex-col gap-4">
                  <a href="/login" className="inline-flex items-center justify-center gap-4 rounded-md border border-[#d9c49d]/30 bg-[#d9c49d]/10 px-3 py-3 text-xs font-bold uppercase tracking-wide text-[#d9c49d] transition-colors hover:bg-[#d9c49d]/20">
                    Already have an account? Sign In <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full md:w-1/2 p-6 md:p-8">
              <div className="text-center flex items-center justify-center flex-col">
                <div className="flex items-center justify-center w-full">
                  <Image src={logo} alt="ENSIS Logo" className="h-[54px] w-auto object-contain brightness-125" style={{ width: "auto" }} />
                </div>

                <p className="mt-2 text-xs font-semibold max-w-55">
                  {subtitle}
                </p>
              </div>

              <div className="mt-5">
                {children}
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}