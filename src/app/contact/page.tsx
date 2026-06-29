import ContactCtaBanner from '@/components/contact/ContactBanner';
import PremiumMap from '@/components/contact/ContactMap';
import ContactSection from '@/components/contact/ContactSection';
import PageBuilder from '@/components/PageBuilder';
import { generateSeo } from '@/lib/api/seo';
import dynamic from 'next/dynamic'
export async function generateMetadata() {
  return generateSeo("contact");
}
const Page = () => {
  return (
    <div>
      <PageBuilder slug="contact"/>
      {/* <ContactSection/> */}
    </div>
  )
}

export default Page