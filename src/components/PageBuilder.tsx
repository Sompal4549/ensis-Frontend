import { getPageComponent } from "@/lib/api/api";
import RenderSection from "./RenderSections";
import { generateSchema } from "@/lib/api/seo";

type PageBuilderProps = {
  slug: string;
  schemaSlug?: string;
};

type PageSection = {
  componentKey?: string;
  key?: string;
  data?: Record<string, any>;
  isActive?: boolean;
};

export default async function PageBuilder({ slug, schemaSlug }: PageBuilderProps) {
  try {
    const [pageData, schema] = await Promise.all([
      getPageComponent(slug),
      generateSchema(schemaSlug || slug),
    ]);
    const sections = Array.isArray(pageData)
      ? pageData
      : Array.isArray(pageData?.sections)
      ? pageData.sections
      : Array.isArray(pageData?.data?.sections)
      ? pageData.data.sections
      : Array.isArray(pageData?.page?.sections)
      ? pageData.page.sections
      : [];

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

    return (
      <main>
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schema }}
          />
        )}
        {sortedSections.map((section: PageSection, index: number) => {
          const componentKey = section.key || section.componentKey;
          if (!componentKey) return null;
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
  } catch (error) {
    console.error(`PageBuilder failed to load page content for "${slug}"`, error);
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Unable to load page content for {slug}. Please try again later.</p>
      </main>
    );
  }
}