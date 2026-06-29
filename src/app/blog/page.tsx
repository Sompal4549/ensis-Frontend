
import { generateSeo } from "@/lib/api/seo";
import PageBuilder from '@/components/PageBuilder';

export async function generateMetadata() {
  return generateSeo("blog");
}
const Blog = () => {
  return (
    <div>
   <PageBuilder slug="blog" />
    </div>
  )
}

export default Blog