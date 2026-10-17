import { toJsonLd } from "@/lib/seo-text";
import { getPageComponent } from "@/lib/api/api";
import RenderSection from "./RenderSections";
import { generateSchema, generateSeo } from "@/lib/api/seo";
import { SITE_URL } from "@/lib/site";

type PageBuilderProps = {
  slug: string;
  schemaSlug?: string;
};

type PageSection = {
  componentKey?: string;
  key?: string;
  data?: Record<string, any>;
  isActive?: boolean;
  /** Admin page-section toggle */
  enabled?: boolean;
};

const fallbackPageSections: Record<string, PageSection[]> = {
  home: [
    { key: "home.hero", data: {} },
    { key: "home.fullWidthFeatures", data: {} },
    { key: "home.turnkeySolutions", data: {} },
    { key: "home.productsGrid", data: {} },
    { key: "home.globalPresence", data: {} },
    { key: "home.wellnessRoomSetups", data: {} },
    { key: "home.manufacturingAndProjects", data: {} },
    { key: "home.testimonials", data: {} },
    { key: "home.blogInsights", data: {} },
  ],
  about: [
    { key: "about.hero", data: {} },
    { key: "about.ourStory", data: {} },
    { key: "about.industriesWeServe", data: {} },
    { key: "about.ourProducts", data: {} },
    { key: "about.ourTurnkeyProcess", data: {} },
    { key: "about.wellnessSection", data: {} },
    { key: "about.aboutEnsis", data: {} },
    { key: "about.founderVision", data: {} },
    { key: "about.testimonials", data: {} },
    { key: "about.letsBuild", data: {} },
  ],
  turnkey: [
    { key: "turnkey.banner", data: {} },
    { key: "turnkey.whatIsTurnkey", data: {} },
    { key: "turnkey.completeSolutions", data: {} },
    { key: "turnkey.facilities", data: {} },
    { key: "turnkey.customized", data: {} },
    { key: "turnkey.featuredProjects", data: {} },
    { key: "turnkey.readyToBuild", data: {} },
  ],
  consultancy: [
    { key: "consultancy.hero", data: {} },
    { key: "consultancy.whatWeOffer", data: {} },
    { key: "consultancy.whyChooseOurProcess", data: {} },
    { key: "consultancy.readyToGetStarted", data: {} },
  ],
  contact: [
    { key: "contact.hero", data: {} },
    { key: "contact.getInTouch", data: {} },
    { key: "contact.ctaBanner", data: {} },
    { key: "contact.premiumMap", data: {} },
  ],
  blog: [
    { key: "blog.hero", data: {} },
    { key: "blog.allBlogs", data: {} },
    { key: "blog.mediaResources", data: {} },
    { key: "blog.stayInspired", data: {} },
    { key: "blog.supportWellness", data: {} },
  ],
  product: [
    { key: "product.hero", data: {} },
    { key: "product.trustedBy", data: {} },
    { key: "product.productsection", data: {} },
    { key: "product.whyChoose", data: {} },
    { key: "product.testimonials", data: {} },
  ],
  projects: [
    { key: "projects.banner", data: {} },
    { key: "projects.ourProjects", data: {} },
    { key: "projects.ourClients", data: {} },
    { key: "projects.whyPartner", data: {} },
    { key: "projects.contactSection", data: {} },
  ],
  career: [
    { key: "career.banner", data: {} },
    { key: "career.features", data: {} },
    { key: "career.whyWork", data: {} },
    { key: "career.section", data: {} },
    { key: "career.benefits", data: {} },
    { key: "career.talentCommunity", data: {} },
    { key: "career.testimonials", data: {} },
  ],
};

const normalizeSlug = (s: string) => {
  const map: Record<string, string> = {
    "about-us": "about",
    "products": "product",
    "turnkey-solutions": "turnkey",
    "projects-and-clients": "projects",
    "careers": "career",
    "contact-us": "contact",
  };
  return map[s] || s;
};

export default async function PageBuilder({ slug, schemaSlug }: PageBuilderProps) {
  const normalized = normalizeSlug(slug);
  try {
    const [pageData, schema] = await Promise.all([
      getPageComponent(slug),
      generateSchema(schemaSlug || slug),
    ]);
    const rawSections = Array.isArray(pageData)
      ? pageData
      : Array.isArray(pageData?.sections)
      ? pageData.sections
      : Array.isArray(pageData?.data?.sections)
      ? pageData.data.sections
      : Array.isArray(pageData?.page?.sections)
      ? pageData.page.sections
      : null;

    const sections = (rawSections && rawSections.length > 0)
      ? rawSections
      : fallbackPageSections[slug] || fallbackPageSections[normalized] || [];

    const sortedSections = [...sections].sort((a: any, b: any) => {
      const ai = typeof a?.index === "number" ? a.index : Number.MAX_SAFE_INTEGER;
      const bi = typeof b?.index === "number" ? b.index : Number.MAX_SAFE_INTEGER;
      return ai - bi;
    });

    if (sortedSections.length === 0) {
      return (
        <div className="p-20 text-center">
          <p>No sections configured for the {slug} page.</p>
        </div>
      );
    }

    // Admin schema when set and valid; otherwise a basic WebPage schema from the page's own SEO
    let jsonLd = toJsonLd(schema);
    if (!jsonLd) {
      const seo = await generateSeo(schemaSlug || slug);
      const canonical = seo.alternates?.canonical ? String(seo.alternates.canonical) : undefined;
      jsonLd = toJsonLd({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: typeof seo.title === "string" ? seo.title : undefined,
        description: seo.description || undefined,
        url: canonical,
        publisher: { "@type": "Organization", name: "ENSIS", url: SITE_URL },
      });
    }

    return (
      <main>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        )}
        {sortedSections.map((section: PageSection, index: number) => {
          const componentKey = section.key || section.componentKey;
          // Sections switched off in the admin stay hidden
          if (!componentKey || section.isActive === false || section.enabled === false) return null;
          return (
            <RenderSection
              key={`${componentKey}-${index}`}
              componentKey={componentKey}
              data={section.data || {}}
            />
          );
        })}
      </main>
    );
  } catch (error: any) {
    console.warn(`[PageBuilder] Failed to load page content for "${slug}": ${error?.message || error}`);
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Unable to load page content for {slug}. Please try again later.</p>
      </main>
    );
  }
}