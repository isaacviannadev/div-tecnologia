'use client'

import { useTranslations } from 'next-intl'
import { Button } from '../Button'
import { FadeIn } from '../FadeIn'
import { RadioInput } from '../RadioInput'
import { TextInput } from '../TextInput'

import { useMailer } from '@div/hooks/useMailer'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function ContactForm() {
  const t = useTranslations('Contact')

  const schema = z.object({
    name: z.string().nonempty(t('form.errors.name')),
    email: z.string().email(t('form.errors.email')),
    company: z.string().nonempty(t('form.errors.company')),
    phone: z.string().nonempty(t('form.errors.phone')),
    message: z.string().nonempty(t('form.errors.message')),
    budget: z.string().nonempty(t('form.errors.budget')),
  })

  type ContactFormValues = z.infer<typeof schema>

  const { register, reset, handleSubmit } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: '',
      budget: '',
    },
  })

  const { sendContactForm, isLoading } = useMailer()

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await sendContactForm(data)

      toast.success('Obrigado pelo contato! Em breve retornaremos.')
      reset()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao enviar email')
    }
  }

  return (
    <FadeIn className="lg:order-last">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="font-display text-base font-semibold text-neutral-950">
          {t('form.title')}
        </h2>
        <div className="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
          <TextInput
            label={t('form.name')}
            autoComplete="name"
            {...register('name')}
          />
          <TextInput
            label={t('form.email')}
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          <TextInput
            label={t('form.company')}
            autoComplete="organization"
            {...register('company')}
          />
          <TextInput
            label={t('form.phone')}
            type="tel"
            autoComplete="tel"
            {...register('phone')}
          />
          <TextInput label={t('form.message')} {...register('message')} />
          <div className="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
            <fieldset>
              <legend className="text-base/6 text-neutral-500">
                {t('form.budget')}
              </legend>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <RadioInput
                  label={t('form.budgetOptions.upTo10k')}
                  id="upTo10k"
                  value="10"
                  {...register('budget')}
                />
                <RadioInput
                  label={t('form.budgetOptions.10kTo50k')}
                  id="10kTo50k"
                  value="50"
                  {...register('budget')}
                />
                <RadioInput
                  label={t('form.budgetOptions.50kTo100k')}
                  id="50kTo100k"
                  value="100"
                  {...register('budget')}
                />
                <RadioInput
                  label={t('form.budgetOptions.moreThan100k')}
                  id="moreThan100k"
                  value="101"
                  {...register('budget')}
                />
              </div>
            </fieldset>
          </div>
        </div>
        <Button type="submit" className="mt-10" disabled={isLoading}>
          {isLoading ? 'Sending...' : t('form.send')}
        </Button>
      </form>
    </FadeIn>
  )
}
