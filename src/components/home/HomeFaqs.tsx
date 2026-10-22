import { Container } from '../ui/Container';
import SubHeading from './SubHeading';
import FaqAccordion, { type HomeFaq } from './FaqAccordion';
import { API_URL } from '@/lib/api/api';
import { toJsonLd } from '@/lib/seo-text';
import Image from 'next/image';
import faqbg from "@/assets/home/faq_bg.png"

const defaultContent = {
  subtitle: 'HELP & INFORMATION',
  heading: 'Frequently Asked Questions',
  description:
    'Quick answers to common questions about Ensis equipment, turnkey wellness projects and how we work with you.',
};

type HomeFaqsProps = {
  subtitle?: string;
  heading?: string;
  description?: string;
};

// Published, public FAQs managed in the admin (FAQs Management)
const getHomeFaqs = async (): Promise<HomeFaq[]> => {
  try {
    const response = await fetch(`${API_URL}/faqs?limit=10`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch (error: any) {
    console.warn(`[HomeFaqs] Unable to fetch FAQs: ${error?.message || 'connection error'}`);
    return [];
  }
};

const Ornament = () => (
  <span className="flex items-center gap-2 text-[#c9a86a]" aria-hidden>
    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a86a] md:w-16" />
    <span className="size-1.5 rotate-45 bg-[#c9a86a]" />
  </span>
);

export const HomeFaqs = async ({ subtitle, heading, description }: HomeFaqsProps) => {
  const faqs = await getHomeFaqs();
  // Nothing published yet: hide the section instead of showing an empty block
  if (faqs.length === 0) return null;

  const jsonLd = toJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  });

  return (
    <section className="bg-[#fbf8f2] py-6 md:py-10 relative">
      <Image src={faqbg} alt="FAQs" fill className="absolute inset-0 object-cover z-0" />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <Container className="relative z-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <Ornament />
              <SubHeading className="text-[#8d6a3a]" text={subtitle || defaultContent.subtitle} />
              <span className="rotate-180">
                <Ornament />
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#1f261b] md:text-3xl">
              {heading || defaultContent.heading}
            </h2>
            <span className="mt-3 flex items-center gap-2" aria-hidden>
              <span className="h-px w-20 bg-[#d7cbbd] md:w-32" />
              <span className="size-2 rounded-full border border-[#c9a86a]" />
              <span className="h-px w-20 bg-[#d7cbbd] md:w-32" />
            </span>
            <p className="mt-3 max-w-2xl text-base text-[#5c5547]">
              {description || defaultContent.description}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <FaqAccordion faqs={faqs.slice(0, 5)} />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomeFaqs;
