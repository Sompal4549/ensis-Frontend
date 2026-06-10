import { getPageComponent } from "@/app/lib/api";
import RenderSection from "@/components/RenderSections";

export default async function HomePage() {
  try {
    const homePageData = await getPageComponent("home");

    const sections = Array.isArray(homePageData)
      ? homePageData
      : Array.isArray(homePageData?.sections)
      ? homePageData.sections
      : Array.isArray(homePageData?.data?.sections)
      ? homePageData.data.sections
      : Array.isArray(homePageData?.page?.sections)
      ? homePageData.page.sections
      : [];

    const sortedSections = [...sections].sort((a: any, b: any) => {
      const ai = typeof a?.index === "number" ? a.index : Number.MAX_SAFE_INTEGER;
      const bi = typeof b?.index === "number" ? b.index : Number.MAX_SAFE_INTEGER;
      return ai - bi;
    });

    if (sortedSections.length === 0) {
      return (
        <div className="p-20 text-center">
          <p className="">No sections configured for the Home Page.</p>
        </div>
      );
    }

    return (
      <main>
        {sortedSections.map((section: any, index: number) => {
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
    console.error("Home Page Load Error:", error);
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Unable to load page content. Please try again later.</p>
      </main>
    );
  }
}