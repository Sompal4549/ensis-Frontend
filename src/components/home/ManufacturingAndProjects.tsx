"use client"
import React, { useState, useEffect } from 'react';
import { CheckSquare2 } from 'lucide-react';
import { Container } from '../ui/Container';
import Image from 'next/image';

import img11 from '@/assets/home/img-11.webp';
import img12 from '@/assets/home/img-12.webp';
import img13 from '@/assets/home/img-13.webp';
import img14 from '@/assets/home/img-14.webp';
import img15 from '@/assets/home/img-7.webp';
import img16 from '@/assets/home/img-1.webp';
import SubHeading from './SubHeading';
import BookButton from '../ui/BookButton';
import { getComponentContent, getImageUrl } from '@/lib/api/api';
import DOMPurify from "isomorphic-dompurify";
const mfgFallbackImages = [img11, img12, img13];
const projFallbackImages = [img12, img13, img14, img15, img16];



export const ManufacturingAndProjects: React.FC<{ sectionContent?: any }> = ({ sectionContent = {} }) => {
  const defaultContent = {
  // --- Admin API fields ---
  mfgSubtitle: sectionContent.subtitle||"MANUFACTURING EXCELLENCE",
  heading: sectionContent.heading||"Crafted with Precision,\nDelivered Worldwide",
  description: sectionContent.description||"Our advanced manufacturing facility combines traditional craftsmanship with modern technology to deliver world-class wellness equipment.",
  stats:sectionContent.stats|| [
    { value: "25+", label: "Countries" },
    { value: "500+", label: "Projects" },
    { value: "10+", label: "Years" },
  ],
  // --- Local-only fields (not from admin, kept as frontend defaults) ---
  mfgFeatures: sectionContent.features||[
    "Premium Quality Raw Materials",
    "Skilled Artisans & Modern Machinery",
    "Multi-Level Quality Testing",
    "International Export Packing",
  ],
  mfgButtonText: sectionContent.mfgButtonText||"OUR MANUFACTURING",
  mfgButtonPath: sectionContent.mfgButtonHref||"/manufacturing",
  
mfgImages: sectionContent.mfgImages||["", "", ""],
  projSubtitle:sectionContent.projSubtitle ||"OUR PROJECTS",
  projHeading: sectionContent.projHeading||"Creating Wellness\nSpaces Worldwide",
  projDescription: sectionContent.projDescription||"Proud to be a trusted partner for 500+ wellness projects across the globe.",
  projButtonText: sectionContent.projButtonText||"VIEW ALL PROJECTS",
  projButtonPath: sectionContent.mfgButtonPath||"/projects",
  projects: sectionContent.projects||[
    { image: "", title: "Project 1", location: "" },
    { image: "", title: "Project 2", location: "" },
    { image: "", title: "Project 3", location: "" },
    { image: "", title: "Project 4", location: "" },  
    { image: "", title: "Project 5", location: "" },
  ],
};
  const [hovered, setHovered] = useState<number | null>(null);
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getComponentContent("home.manufacturingAndProjects", defaultContent);
        setContent(data);
      } catch {
        // Keep defaults
      }
    };
    fetchContent();
  }, []);
  // Manufacturing images: use local fallbacks (admin doesn't send mfg images)
  const getMfgImage = (index: number) => {
    const cmsImg = content.mfgImages?.[index].image;
    return cmsImg ? getImageUrl(cmsImg) : mfgFallbackImages[index] || img11;
  };
   const getMfgImageTitle = (index: number) => {
    const cmsImg = content.mfgImages?.[index].title;
    return cmsImg ? getImageUrl(cmsImg) : mfgFallbackImages[index] || "";
  };

  // Project images: use admin `projects` array images, fallback to local
  const projects = content.projects?.length ? content.projects : defaultContent.projects;
  const getProjImage = (index: number) => {
    const proj = projects[index];
    return proj?.image ? getImageUrl(proj.image) : projFallbackImages[index] || img12;
  };

  // Use admin fields for the main heading area, fallback to local fields
  const sectionSubtitle = content.mfgSubtitle || defaultContent.mfgSubtitle;
  const sectionHeading = content.heading || defaultContent.heading;
  const sectionDescription = content.description || defaultContent.description;

  const mfgHeadingLines = sectionHeading.split("\n");
  const projHeadingLines = (content.projHeading || defaultContent.projHeading).split("\n");

  // Stats from admin
  const stats = content.stats?.length ? content.stats : defaultContent.stats;

  return (
    <section className="border-b border-[#e7ddd1] bg-[#fbf8f2]">
      <Container className="pb-4">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-4 items-stretch">

          {/* LEFT SIDE */}
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] h-full">

            {/* Content */}
            <div className="flex flex-col justify-center">
              <SubHeading className=' text-black font-normal' text={sectionSubtitle} />
              <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
                {mfgHeadingLines.map((line: string, i: number) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < mfgHeadingLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
<div
  className="mt-2 text-base text-[#5f5a50]"
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sectionDescription || "") }}
/>

              {/* Stats from admin API */}
              {/* {stats.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {stats.map((stat: { value: string; label: string }, i: number) => (
                    <div key={i} className="text-center">
                      <span className="block text-xl font-bold text-[#334022]">{stat.value}</span>
                      <span className="block text-[10px] font-semibold text-[#5f5a50] uppercase tracking-wide">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )} */}

              <ul className="mt-2 space-y-2">
                {content.mfgFeatures.map((item: string) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 text-base font-bold text-[#3f3a32]"
                  >
                    <CheckSquare2
                      size={16}
                      className="shrink-0 text-[#b08b57]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="w-60 mt-2">
                <BookButton text={content.mfgButtonText} path={content.mfgButtonPath} />
              </div>
            </div>

            {/* Manufacturing Images */}
            <div className="grid grid-cols-2 gap-4 self-start h-[240px] md:h-[320px] lg:h-full">

              {/* Top Large */}
              <div className="relative col-span-2 h-[100%] overflow-hidden rounded-2xl">
                <Image
                  src={getMfgImage(0)}
                  alt={getMfgImageTitle(0)||"Manufacturing Excellence"}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Bottom Left */}
              <div className="relative h-[100%] overflow-hidden rounded-xl">
                <Image
                  src={getMfgImage(1)}
                  alt={getMfgImageTitle(0)||"Manufacturing Excellence"}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>

              {/* Bottom Right */}
              <div className="relative h-[100%] overflow-hidden rounded-2xl">
                <Image
                  src={getMfgImage(2)}
                  alt={getMfgImageTitle(0)||"Manufacturing Excellence"}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="border-[#e7ddd1] lg:border-l lg:pl-4 h">
            <SubHeading className=' text-black font-normal' text={content.projSubtitle} />
            <h2 className="mt-2 font-serif text-[26px] font-semibold leading-[1.08] text-[#1f261b] lg:text-[28px]">
              {projHeadingLines.map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i < projHeadingLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <p className="mt-2 max-w-[320px] text-base text-[#5f5a50]">
              {content.projDescription}
            </p>
            <div className="w-60 mt-2">
              <BookButton text={content.projButtonText} path={content.projButtonPath} />
            </div>

            {/* Project Grid — uses admin `projects` array */}
            <div className="mt-2">
              <div className="grid h-50 grid-cols-3 grid-rows-[1fr_1fr] gap-4">

                {/* Left Tall */}
                <div className="relative row-span-2 h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={getProjImage(0)}
                    alt={projects[0]?.title || ""}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    sizes="(max-width: 1024px) 33vw, 15vw"
                  />
                  {(projects[0]?.title || projects[0]?.location) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      {projects[0]?.location && <p className="text-white/80 text-base">{projects[0].location}</p>}
                    </div>
                  )}
                </div>

                {/* Top Middle */}
                <div className="relative h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={getProjImage(1)}
                    alt={projects[1]?.title || ""}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    sizes="(max-width: 1024px) 33vw, 10vw"
                  />
                  {(projects[1]?.title || projects[1]?.location) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      {projects[1]?.location && <p className="text-white/80 text-base">{projects[1].location}</p>}
                    </div>
                  )}
                </div>

                {/* Top Right */}
                <div className="relative h-full overflow-hidden rounded-xl group">
                  <Image
                    src={getProjImage(2)}
                    alt={projects[2]?.title || ""}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    sizes="(max-width: 1024px) 33vw, 10vw"
                  />
                  {(projects[2]?.title || projects[2]?.location) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      {projects[2]?.location && <p className="text-white/80 text-base">{projects[2].location}</p>}
                    </div>
                  )}
                </div>

                {/* Bottom Middle */}
                <div className="relative h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={getProjImage(3)}
                    alt={projects[3]?.title || ""}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    sizes="(max-width: 1024px) 33vw, 10vw"
                  />
                  {(projects[3]?.title || projects[3]?.location) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      {projects[3]?.location && <p className="text-white/80 text-base">{projects[3].location}</p>}
                    </div>
                  )}
                </div>

                {/* Bottom Right */}
                <div className="relative h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={getProjImage(4)}
                    alt={projects[4]?.title || ""}
                    fill
                    className="object-cover"
                    crossOrigin="anonymous"
                    sizes="(max-width: 1024px) 33vw, 10vw"
                  />
                  {(projects[4]?.title || projects[4]?.location) && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      {projects[4]?.location && <p className="text-white/80 text-base">{projects[4].location}</p>}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};