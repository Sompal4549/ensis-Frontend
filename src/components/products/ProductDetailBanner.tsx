"use client";

import Image from "next/image";
import React from "react";
import product_detail from "@/assets/products/product-detail.webp"
import { Container } from "../ui/Container";
interface NasyaHeroBannerProps {
    imageSrc?: string;
    imageAlt?: string;
}

export const CartAndDetailHeroBanner: React.FC<NasyaHeroBannerProps> = ({
    imageSrc = "/therapy-table.png",
    imageAlt = "Nasya Ayurveda Panchakarma therapy table",
}) => {
    return (
        <section
            className="
                relative w-full overflow-hidden
                bg-[#f5ede0]
                [background-image:radial-gradient(ellipse_at_20%_50%,rgba(210,170,110,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(230,200,150,0.12)_0%,transparent_50%)]
               h-[450px]
            "
        >

            {/* Left edge green vignette */}
            <div className="absolute inset-y-0 left-0 w-1/6 pointer-events-none bg-[linear-gradient(to_right,rgba(180,200,150,0.08)_0%,transparent_100%)]" />

            <Container className="relative z-10 flex items-stretch h-full w-full ">

                {/* ── LEFT: Text ── */}
                <div className="flex flex-col justify-center py-10 sm:py-14 lg:py-16 w-1/2 shrink-0 z-10">

                    {/* Thin gold rule */}
                    <div className="mb-6 h-px w-[clamp(80px,14vw,160px)] bg-[linear-gradient(to_right,rgba(184,136,42,0.38),transparent)]" />

                    {/* Headline line 1 — dark */}
                    <h1 className="leading-none mb-2 font-semibold text-[#2a1f12] tracking-[-0.01em] text-4xl">
                        Traditional Healing.
                    </h1>

                    {/* Headline line 2 — gold */}
                    <h1 className="leading-none mb-6 font-semibold tracking-[-0.01em] text-4xl bg-[#b8882a] bg-clip-text [-webkit-text-fill-color:transparent]">
                        Expertly Crafted.
                    </h1>
                    {/* Body copy */}
                    <p className="max-w-[420px] text-sm">
                        Experience authentic Ayurveda with our premium{" "}
                        <br className="hidden sm:block" />
                        Panchakarma therapy cart, designed for comfort,{" "}
                        <br className="hidden sm:block" />
                        balance and complete well-being.
                    </p>
                </div>

                {/* ── RIGHT: Product image ── */}
            </Container>
            <div className="absolute inset-y-0 right-0 w-full pointer-events-none z-0">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-fill object-[30%_center]"
                    priority
                />
            </div>
        </section>
    );
};

export default CartAndDetailHeroBanner;