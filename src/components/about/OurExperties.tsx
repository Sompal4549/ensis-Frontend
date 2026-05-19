import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import panchkarmaImage from "@/assets/home/panchkarma_2.webp";
import wellnessImage from "@/assets/home/wellness_interiors.webp";
import steamImage from "@/assets/home/steam_sauna.webp";
import turnkeyImage from "@/assets/home/trunkey_projects.webp";
import Image from "next/image";

const expertiseData = [
    {
        title: "PANCHKARMA EQUIPMENT",
        description:
            "Authentic therapy systems crafted for comfort, durability and precision.",
        image:
            panchkarmaImage,
    },
    {
        title: "WELLNESS INTERIORS",
        description:
            "Complete luxury wellness architecture for clinics, spas, resorts and more.",
        image:
            wellnessImage,
    },
    {
        title: "STEAM & SAUNA SOLUTIONS",
        description:
            "Modern steam chambers and detox wellness systems with elegance.",
        image:
            steamImage,
    },
    {
        title: "TURNKEY PROJECTS",
        description:
            "End-to-end execution including interiors, branding and equipment.",
        image:
            turnkeyImage,
    },
];

const ExpertiseSection: React.FC = () => {
    return (
        <section >
            <Container>
                {/* Heading */}
                <div className="flex justify-center mb-8">
                    <span className="text-[12px] md:text-sm font-semibold tracking-[1.5px] text-[#3b3b3b] uppercase">
                        Our Expertise
                    </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {expertiseData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#f7f3ed] border border-[#e5ddd2] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-[180px] overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={350}
                                    height={350}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col gap-3">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base font-bold uppercase tracking-wide text-[#2d2d2d] leading-tight w-[65%]">
                                            {item.title}
                                        </h3><button className="w-9 h-9 rounded-full bg-[#0f3b2e] text-white flex items-center justify-center hover:scale-105 transition">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                    <p className="text-[12px] text-[#7a756f] leading-relaxed mt-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default ExpertiseSection;