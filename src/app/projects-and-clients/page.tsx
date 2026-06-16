import ProjectsBanner from "@/components/projects-and-clients/Banner";
import WhyPartner from "@/components/projects-and-clients/WhyPartnerSection";
import OurClients from "@/components/projects-and-clients/OurClients";
import ContactBanner from "@/components/projects-and-clients/Contact";
import FeaturedProjects from "@/components/turnkey/FeaturedTrunkeyProjects";
import { ourProjects } from "@/data/ourProjects";

export default function ProjectsPage() {
  return(
    <>
  <ProjectsBanner />
  <FeaturedProjects sectionContent={ourProjects} />
  <OurClients />
  <WhyPartner/>
  <ContactBanner />

  </>
  )
  
}