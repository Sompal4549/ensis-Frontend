import { ctaBannerFallbackData } from "@/data/enquaryCtaBanner";
import { CtaBannerProps } from "@/types/enquary/ctaBanner";
import Image from "next/image";
import GreenButton from "../ui/GreenButton";
import { Container } from "../ui/Container";

const CtaBanner = ({ data }: CtaBannerProps) => {
  const { heading, description, ctaLabel, ctaHref, leftImage, rightImage } =
    data ?? ctaBannerFallbackData;

  return (
    <section className="relative isolate overflow-hidden bg-[#001a05]">
      <Image
        src={leftImage.src}
        alt={leftImage.alt}
      width={300}
      height={300}
      className="md:absolute left-0 top-0 bottom-0 w-80 h-full"
      />
      <Container>
<div className="flex justify-between items-center">
      {/* Background image */}



      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-5 text-center justify-center">
        <div className="w-full max-w-xl md:max-w-lg lg:max-w-xl mx-auto">
          <h2 className="font-serif text-2xl leading-snug text-[#E8C77A]">
            {heading}
          </h2>

          {/* Ornamental divider */}
          <div className="my-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#C9972A]/60 sm:w-14" />
            <span className="text-sm text-[#C9972A]">✦</span>
            <span className="h-px w-10 bg-[#C9972A]/60 sm:w-14" />
          </div>

          <p className="mx-auto text-sm leading-relaxed text-[#EDE6D6]/90 sm:text-base md:mx-0 md:text-[1.05rem]" dangerouslySetInnerHTML={{__html:description}}>
          </p>

          <div className="mt-2 flex justify-center">
            <GreenButton text={ctaLabel} path={ctaHref} />
          
          </div>
        </div>
      </div>
        </div>
      </Container>
        <Image
        src={rightImage.src}
        alt={"Lea"}
        width={300}
        height={300}
         className="md:absolute right-0 top-0 bottom-0 w-60 h-full"
        />

    </section>
  );
};

export default CtaBanner;