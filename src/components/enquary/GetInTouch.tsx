import { Building2, Clock3, Globe, Mail, Phone, Sparkles } from "lucide-react";
import { Container } from "../ui/Container";

interface ContactItem {
  id: string;
  label: string;
  lines: string[];
}

interface GetInTouchBannerData {
  heading: string;
  items: ContactItem[];
}

interface GetInTouchBannerProps {
  data?: GetInTouchBannerData;
}

const fallbackGetInTouchBanner: GetInTouchBannerData = {
  heading: "Get In Touch",
  items: [
    {
      id: "corporate-office",
      label: "Corporate Office",
      lines: ["ENSIS Head Office, Kochi,", "Kerala, India"],
    },
    {
      id: "phone",
      label: "Phone",
      lines: ["+91 73560 55555"],
    },
    {
      id: "email",
      label: "Email",
      lines: ["info@ensis.in"],
    },
    {
      id: "website",
      label: "Website",
      lines: ["www.ensis.in"],
    },
    {
      id: "working-hours",
      label: "Working Hours",
      lines: ["Mon - Sat :", "9:00 AM - 6:00 PM"],
    },
  ],
};

const iconMap: Record<string, React.ElementType> = {
  "corporate-office": Building2,
  phone: Phone,
  email: Mail,
  website: Globe,
  "working-hours": Clock3,
};

export default function GetInTouchBanner({
  data,
}: GetInTouchBannerProps) {
  const banner = data ?? fallbackGetInTouchBanner;

  return (
    <section className="w-full bg-[#f7f1e3]">
      <Container>
        <div className="rounded-2xl border border-[#e3d2b0]">

        {/* Heading */}
        <div className="mb-2 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#b1793d]/50 sm:w-16" />
          <h2 className="text-lg font-semibold uppercase text-[#1f2c25] sm:text-xl">
            {banner.heading}
          </h2>
          <span className="h-px w-10 bg-[#b1793d]/50 sm:w-16" />
        </div>

        {/* Contact Items */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-[#e3d2b0]">
          {banner.items.map((item) => {
            const Icon = iconMap[item.id] || Sparkles;

            return (
              <div
                key={item.id}
                className="flex flex-col items-center px-2 text-center lg:px-4"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center">
                  <Icon
                    size={32}
                    strokeWidth={1.75}
                    className="text-[#b1793d]"
                  />
                </div>

                <h3 className="mb-1 text-sm font-semibold text-[#1f2c25] sm:text-base">
                  {item.label}
                </h3>

                {item.lines.map((line, idx) => (
                  <p
                    key={idx}
                    className="text-base leading-snug text-[#5a5248] sm:text-sm"
                  >
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        {/* Bottom Divider */}
        <div className="mt-2 flex justify-center">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-[#b1793d]/40" />
            <Sparkles
              size={18}
              strokeWidth={1.5}
              className="text-[#b1793d]"
            />
            <span className="h-px w-12 bg-[#b1793d]/40" />
          </div>
        </div>
        </div>

      </Container>
    </section>
  );
}