import Image from "next/image";
import suppport from "@/assets/blog/support.webp"
import { Container } from "../ui/Container";
import BookButton from "../ui/BookButton";
const SupportSection = ({ sectionContent }: { sectionContent: any }) => {
  return (
    <Container>
    <div className="relative overflow-hidden rounded-2xl border border-[#e4d5c2] bg-gradient-to-r from-[#f6eddc] via-[#f1dfc7] to-[#d8b078]  flex flex-col lg:flex-row">
      {/* Left Content */}
      <div className="relative z-10 p-3 md:p-4 flex flex-col justify-center max-w-[420px]">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#3b4a22] flex items-center justify-center shrink-0 shadow-md">
            <svg
              className="w-8 h-8 text-[#e9d6b5]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 20a6 6 0 00-12 0M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-[#2e2318] text-2xl leading-tight font-serif font-semibold">
              We're Here to Support Your Wellness Journey
            </h2>

            <p className="text-[#4e4336] mt-2 text-sm">
              Have questions or need expert guidance?
              <br />
              Our team is here to help.
            </p>
            <div className="mt-2 w-45">
            <BookButton text="Contact Our Experts" path="/contact" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Decorative Image */}
      <div className="absolute inset-0 flex-1">
        <Image fill
          src={suppport}
          alt="Wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />

      </div>
    </div>
    </Container>
  );
};
export default SupportSection;