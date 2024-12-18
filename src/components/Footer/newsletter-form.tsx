import Icons from '@div/components/Icons';
import { useTranslations } from 'next-intl';

function NewsletterForm() {
  const t = useTranslations('NewsletterForm');

  return (
    <form className='max-w-sm'>
      <h2 className='font-display text-sm font-semibold tracking-wider text-neutral-950'>
        {t('subscribe')}
      </h2>
      <p className='mt-4 text-sm text-neutral-700'>
        {t('subscribeDescription')}
      </p>
      <div className='relative mt-6'>
        <input
          type='email'
          placeholder={t('placeholder')}
          autoComplete='email'
          aria-label={t('placeholder')}
          className='block w-full rounded-2xl border border-neutral-300 bg-transparent py-4 pl-6 pr-20 text-base/6 text-neutral-950 ring-4 ring-transparent transition placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5'
        />
        <div className='absolute inset-y-1 right-1 flex justify-end'>
          <button
            type='submit'
            aria-label='Submit'
            className='flex aspect-square h-full items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800'
          >
            <Icons.ArrowIcon className='w-4' />
          </button>
        </div>
      </div>
    </form>
  );
}

export { NewsletterForm };
