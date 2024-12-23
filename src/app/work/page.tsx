import CaseStudies from '@div/components/CaseStudies';
import Clients from '@div/components/CaseStudies/clients';
import { ContactSection } from '@div/components/ContactSection';
import { PageIntro } from '@div/components/PageIntro';
import { Testimonial } from '@div/components/Testimonial';
import logoMailSmirk from '@div/images/clients/mail-smirk/logo-dark.svg';
import { loadMDXMetadata } from '@div/lib/loadMDXMetadata';

export const metadata = {
  title: 'Our Work',
  description:
    'We believe in efficiency and maximizing our resources to provide the best value to our clients.',
};

export default async function Work() {
  const caseStudies = await loadMDXMetadata('work');

  return (
    <>
      <PageIntro
        eyebrow='Our work'
        title='Proven solutions for real-world problems.'
      >
        <p>
          We believe in efficiency and maximizing our resources to provide the
          best value to our clients. The primary way we do that is by re-using
          the same five projects we’ve been developing for the past decade.
        </p>
      </PageIntro>

      <CaseStudies caseStudies={caseStudies} />

      <Testimonial
        className='mt-24 sm:mt-32 lg:mt-40'
        client={{ name: 'Mail Smirk', logo: logoMailSmirk }}
      >
        We approached <em>Studio</em> because we loved their past work. They
        delivered something remarkably similar in record time.
      </Testimonial>

      <Clients />

      <ContactSection />
    </>
  );
}
