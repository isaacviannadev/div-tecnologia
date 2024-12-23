import logoBrightPath from '@div/images/clients/bright-path/logo-dark.svg';
import logoFamilyFund from '@div/images/clients/family-fund/logo-dark.svg';
import logoGreenLife from '@div/images/clients/green-life/logo-dark.svg';
import logoHomeWork from '@div/images/clients/home-work/logo-dark.svg';
import logoMailSmirk from '@div/images/clients/mail-smirk/logo-dark.svg';
import logoNorthAdventures from '@div/images/clients/north-adventures/logo-dark.svg';
import logoPhobia from '@div/images/clients/phobia/logo-dark.svg';
import logoUnseal from '@div/images/clients/unseal/logo-dark.svg';
import Image from 'next/image';
import { Border } from '../Border';
import { Container } from '../Container';
import { FadeIn, FadeInStagger } from '../FadeIn';

const clients = [
  ['Phobia', logoPhobia],
  ['Family Fund', logoFamilyFund],
  ['Unseal', logoUnseal],
  ['Mail Smirk', logoMailSmirk],
  ['Home Work', logoHomeWork],
  ['Green Life', logoGreenLife],
  ['Bright Path', logoBrightPath],
  ['North Adventures', logoNorthAdventures],
];

export default function Clients() {
  return (
    <Container className='mt-24 sm:mt-32 lg:mt-40'>
      <FadeIn>
        <h2 className='font-display text-2xl font-semibold text-neutral-950'>
          You’re in good company
        </h2>
      </FadeIn>
      <FadeInStagger className='mt-10' faster>
        <Border as={FadeIn} />
        <ul className='grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4'>
          {clients.map(([client, logo]) => (
            <li key={client} className='group'>
              <FadeIn className='overflow-hidden'>
                <Border className='pt-12 group-[&:nth-child(-n+2)]:-mt-px sm:group-[&:nth-child(3)]:-mt-px lg:group-[&:nth-child(4)]:-mt-px'>
                  <Image src={logo} alt={client} unoptimized />
                </Border>
              </FadeIn>
            </li>
          ))}
        </ul>
      </FadeInStagger>
    </Container>
  );
}
