import { getPageComponent } from "@/app/lib/api";
import RenderSection from "./RenderSections";

type PageBuilderProps = {
  slug: string;
};

type PageSection = {
  componentKey?: string;
  key?: string;
  data?: Record<string, any>;
  isActive?: boolean;
};

export default async function PageBuilder({ slug }: PageBuilderProps) {
  try {
    const pageData = await getPageComponent(slug);
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
          <p className="">No sections configured for the {slug} page.</p>
        </div>
      );
    }
console.log(pageData, "sortedSections")
    return (
      <main>
        {sortedSections.map((section: PageSection, index: number) => {
            console.log(section, "sectiondata")
          const componentKey = section.key || section.componentKey;
          if (!componentKey) return null;
        //   if(section.isActive){

              return (
                  <RenderSection
                  key={`${componentKey}-${index}`}
                  componentKey={componentKey}
                  data={section.data || {}}
                 
                  />
                );
            // }
        })}
      </main>
    );
  } catch (error) {
    console.error(`PageBuilder failed to load page content for "${slug}"`, error);
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="">Unable to load page content for {slug}. Please try again later.</p>
      </main>
    );
  }
}
