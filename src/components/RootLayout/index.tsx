'use client'

import { motion, MotionConfig, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { createContext, useEffect, useId, useRef, useState } from 'react'

import { Container } from '@div/components/Container'
import { Footer } from '@div/components/Footer'
import { GridPattern } from '@div/components/GridPattern'
import { Header } from '@div/components/Header'
import { Navigation } from '@div/components/Header/Navigation'
import Icons from '@div/components/Icons'
import { Offices } from '@div/components/Offices'
import { SocialMedia } from '@div/components/SocialMedia'
import ToggleLanguages from '../ToggleLanguages'

export const RootLayoutContext = createContext({})

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  const openRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  const t = useTranslations('Header')

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        (event.target as HTMLElement).closest('a')?.href ===
        window.location.href
      ) {
        setExpanded(false)
      }
    }

    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <MotionConfig transition={shouldReduceMotion ? { duration: 0 } : undefined}>
      <header>
        <div
          className="absolute left-0 right-0 top-2 z-40 pt-14"
          aria-hidden={expanded ? 'true' : undefined}
        >
          <Header
            panelId={panelId}
            icon={Icons.MenuIcon}
            toggleRef={openRef as React.RefObject<HTMLButtonElement>}
            expanded={expanded}
            onToggle={() => {
              setExpanded((expanded) => !expanded)
              window.setTimeout(() =>
                closeRef.current?.focus({ preventScroll: true }),
              )
            }}
          />
        </div>

        <motion.div
          layout
          id={panelId}
          style={{ height: expanded ? 'auto' : '0.5rem' }}
          className="relative z-50 overflow-hidden bg-neutral-950 pt-2"
          aria-hidden={expanded ? undefined : 'true'}
        >
          <motion.div layout className="bg-neutral-800">
            <div ref={navRef} className="bg-neutral-950 pb-16 pt-14">
              <Header
                invert
                panelId={panelId}
                icon={Icons.XIcon}
                toggleRef={closeRef as React.RefObject<HTMLButtonElement>}
                expanded={expanded}
                onToggle={() => {
                  setExpanded((expanded) => !expanded)
                  window.setTimeout(() =>
                    openRef.current?.focus({ preventScroll: true }),
                  )
                }}
              />
            </div>
            <Navigation />
            <div className="relative bg-neutral-950 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
              <Container>
                <div className="grid grid-cols-1 gap-y-10 pb-16 pt-10 sm:grid-cols-3 sm:pt-16">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">
                      {t('ourOffices')}
                    </h2>
                    <Offices
                      invert
                      className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2"
                    />
                  </div>
                  <div className="sm:border-l sm:border-transparent sm:pl-16">
                    <h2 className="font-display text-base font-semibold text-white">
                      {t('FollowUs')}
                    </h2>
                    <SocialMedia className="mt-6" invert />
                  </div>
                  <div className="sm:border-l sm:border-transparent sm:pl-16">
                    <h2 className="font-display text-base font-semibold text-white">
                      {t('Language')}
                    </h2>
                    <ToggleLanguages className="mt-6" />
                  </div>
                </div>
              </Container>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <motion.div
        layout
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="relative flex flex-auto overflow-hidden bg-white pt-14"
      >
        <motion.div
          layout
          className="relative isolate flex w-full flex-col pt-9"
        >
          <GridPattern
            className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
            yOffset={-96}
            interactive
          />

          <main className="w-full flex-auto">{children}</main>

          <Footer />
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <RootLayoutContext.Provider value={{ pathname }}>
      <RootLayoutInner key={pathname}>{children}</RootLayoutInner>
    </RootLayoutContext.Provider>
  )
}
