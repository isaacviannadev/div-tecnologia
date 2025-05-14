import { type Metadata } from 'next'
// import Image from 'next/image'

// import { Border } from '@div/components/Border'
import { ContactSection } from '@div/components/ContactSection'
import { Container } from '@div/components/Container'
// import { FadeIn, FadeInStagger } from '@div/components/FadeIn'
import { GridList, GridListItem } from '@div/components/GridList'
import { PageIntro } from '@div/components/PageIntro'
import { PageLinks } from '@div/components/PageLinks'
import { SectionIntro } from '@div/components/SectionIntro'
import { StatList, StatListItem } from '@div/components/StatList'
// import imageEricSilva from '@div/images/team/eric-silva.jpeg'
// import imageGuilhermeChagas from '@div/images/team/guilherme-chagas.jpeg'
// import imageIsaacVianna from '@div/images/team/isaac-vianna.jpeg'
// import imageLeoSgarbi from '@div/images/team/leo-sgarbi.jpeg'
// import imageMarcosRoberto from '@div/images/team/marcos.jpeg'
// import imageMatheusGomes from '@div/images/team/matheus-gomes.jpeg'
// import imageMyllenaFerreira from '@div/images/team/myllena-ferreira.jpeg'
// import imageRodrigoLuparelli from '@div/images/team/rodrigo-luparelli.jpeg'
import { loadArticles } from '@div/lib/mdx'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

function Culture() {
  const t = useTranslations('About.culture')

  return (
    <div className="mt-24 rounded-4xl bg-neutral-950 py-24 sm:mt-32 lg:mt-40 lg:py-32">
      <SectionIntro eyebrow={t('eyebrow')} title={t('title')} invert>
        <p>{t('subtitle')}</p>
      </SectionIntro>
      <Container className="mt-16">
        <GridList>
          <GridListItem title={t('values.innovation.title')} invert>
            {t('values.innovation.description')}
          </GridListItem>
          <GridListItem title={t('values.excellence.title')} invert>
            {t('values.excellence.description')}
          </GridListItem>
          <GridListItem title={t('values.collaboration.title')} invert>
            {t('values.collaboration.description')}
          </GridListItem>
        </GridList>
      </Container>
    </div>
  )
}

// function Team() {
//   const t = useTranslations('About.team')

//   const team = [
//     {
//       title: t('leadership'),
//       people: [
//         {
//           name: 'Isaac Vianna',
//           role: 'Co-Founder / CEO',
//           image: { src: imageIsaacVianna },
//         },
//         {
//           name: 'Guilherme Chagas',
//           role: 'Co-Founder / CPO',
//           image: { src: imageGuilhermeChagas },
//         },
//         {
//           name: 'Matheus Gomes',
//           role: 'Co-Founder / CTO',
//           image: { src: imageMatheusGomes },
//         },
//       ],
//     },
//     {
//       title: t('team'),
//       people: [
//         {
//           name: 'Myllena Ferreira',
//           role: 'Compliance Officer, QA',
//           image: { src: imageMyllenaFerreira },
//         },
//         {
//           name: 'Eric Silva',
//           role: 'UX Designer',
//           image: { src: imageEricSilva },
//         },
//         {
//           name: 'Rodrigo Luparelli',
//           role: 'Senior Developer',
//           image: { src: imageRodrigoLuparelli },
//         },
//         {
//           name: 'Marcos Roberto',
//           role: 'Data Analyst',
//           image: { src: imageMarcosRoberto },
//         },
//         {
//           name: 'Léo Sgarbi',
//           role: 'Junior Developer',
//           image: { src: imageLeoSgarbi },
//         },
//       ],
//     },
//   ]

//   return (
//     <Container className="mt-24 sm:mt-32 lg:mt-40">
//       <div className="space-y-24">
//         {team.map((group) => (
//           <FadeInStagger key={group.title}>
//             <Border as={FadeIn} />
//             <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
//               <FadeIn>
//                 <h2 className="font-display text-2xl font-semibold text-neutral-950">
//                   {group.title}
//                 </h2>
//               </FadeIn>
//               <div className="lg:col-span-3">
//                 <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
//                   {group.people.map((person) => (
//                     <li key={person.name}>
//                       <FadeIn>
//                         <div className="group relative overflow-hidden rounded-3xl bg-neutral-100">
//                           <Image
//                             alt=""
//                             {...person.image}
//                             className="h-96 w-full object-cover grayscale transition duration-500 motion-safe:group-hover:scale-105"
//                           />
//                           <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-black/0 to-40% p-6">
//                             <p className="font-display text-base/6 font-semibold tracking-wide text-white">
//                               {person.name}
//                             </p>
//                             <p className="mt-2 text-sm text-white">
//                               {person.role}
//                             </p>
//                           </div>
//                         </div>
//                       </FadeIn>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </FadeInStagger>
//         ))}
//       </div>
//     </Container>
//   )
// }

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'We believe that our strength lies in our collaborative approach, which puts our clients at the center of everything we do.',
}

export default async function About() {
  const blogArticles = (await loadArticles()).slice(0, 2)
  const t = await getTranslations('About')

  return (
    <>
      <PageIntro eyebrow={t('eyebrow')} title={t('hero_title')}>
        <p>{t('hero_subtitle')}</p>
        <div className="mt-10 max-w-2xl space-y-6 text-base">
          <p>{t('main_paragraph')}</p>
          <p>{t('secondary_paragraph')}</p>
        </div>
      </PageIntro>
      <Container className="mt-16">
        <StatList>
          <StatListItem
            value={t('stats.projects.value')}
            label={t('stats.projects.label')}
          />
          <StatListItem
            value={t('stats.clients.value')}
            label={t('stats.clients.label')}
          />
          <StatListItem
            value={t('stats.revenue.value')}
            label={t('stats.revenue.label')}
          />
        </StatList>
      </Container>

      <Culture />

      {/* <Team /> */}

      <PageLinks
        className="mt-24 sm:mt-32 lg:mt-40"
        title={t('pageLinks.title')}
        intro={t('pageLinks.intro')}
        pages={blogArticles}
      />

      <ContactSection />
    </>
  )
}
