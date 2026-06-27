import PremiumMap from '@/components/contact/ContactMap';
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
      <PremiumMap />
    </div>
  )
}

export default Page