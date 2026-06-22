import ProjectsBanner from "@/components/projects-and-clients/Banner";
import WhyPartner from "@/components/projects-and-clients/WhyPartnerSection";
import OurClients from "@/components/projects-and-clients/OurClients";
import ContactBanner from "@/components/projects-and-clients/Contact";
import FeaturedProjects from "@/components/turnkey/FeaturedTrunkeyProjects";
import { ourProjects } from "@/data/ourProjects";
import { generateSeo } from "@/lib/api/seo";

export async function generateMetadata() {
  return generateSeo("projects-and-clients");
}
export default function ProjectsPage() {
  return(
    <>
  

  </>
  )
  
}