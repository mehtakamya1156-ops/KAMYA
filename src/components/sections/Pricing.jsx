'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import Link from 'next/link';
import { pricing } from '@/lib/content';
import { Container, Eyebrow, Prose, Section, cx } from '@/components/ui';
import Reveal from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import { ArrowDownIcon, ArrowRightIcon, SparkleIcon } from '@/components/icons';
import { FloralCorner } from '@/components/envelope/Artwork';
import { DUR, EASE, STAGGER } from '@/lib/motion';

/** ₹31,000 — locale-aware, with tabular figures so prices align in a column. */
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/**
 * Location switch — identical markup used by both the mobile accordion and
 * the desktop grid below, so the sliding-pill interaction stays in one
 * place rather than being copied twice.
 */
function LocationTabs({ active, onChange, reduced, size = 'default', variant }) {
  return (
    <div
      role="tablist"
      aria-label="Pricing by location"
      className="relative inline-flex rounded-full border border-sand bg-shell p-1"
    >
      {pricing.tabs.map((t) => {
        const selected = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}-${variant}`}
            aria-selected={selected}
            aria-controls={`panel-${t.id}-${variant}`}
            onClick={() => onChange(t.id)}
            className={cx(
              'relative rounded-full font-medium uppercase tracking-[0.1em] transition-colors duration-200 ease-[var(--ease-signature)]',
              size === 'compact' ? 'min-h-[38px] px-4 text-[0.7rem]' : 'min-h-[44px] px-5 text-xs sm:px-7 sm:text-sm',
              selected ? 'text-cream' : 'text-muted hover:text-ink'
            )}
          >
            {selected && (
              <motion.span
                layoutId={`pricing-pill-${variant}`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={reduced ? { duration: 0 } : { duration: DUR.base, ease: EASE }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Mobile — a compact accordion rather than a grid of cards, so the whole
 * section (heading through the CTA) reads as one screen instead of a long
 * scroll: each service collapses to just its name and price, and opens to
 * show exactly what that price includes, rather than pointing up at a
 * separate "Every booking includes" section.
 */
function MobilePricing({ active, setActive, tab, reduced }) {
  const [openService, setOpenService] = useState(tab.rows[0]?.service ?? null);

  return (
    <div className="md:hidden">
      <div className="mx-auto max-w-md text-center">
        <Reveal className="flex justify-center">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
        </Reveal>
        <HeadingReveal delay={0.06} size="h2" className="mt-3">
          {pricing.heading}
        </HeadingReveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-2 text-pretty text-sm leading-relaxed text-muted">
            {pricing.intro}
          </p>
        </Reveal>
        <Reveal delay={0.16} className="mt-3 flex justify-center">
          <SparkleIcon className="h-3 w-3 text-gold/70" />
        </Reveal>
      </div>

      <Reveal delay={0.18} className="mt-5 flex justify-center">
        <LocationTabs active={active} onChange={setActive} reduced={reduced} size="compact" variant="mobile" />
      </Reveal>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            id={`panel-${active}-mobile`}
            role="tabpanel"
            aria-labelledby={`tab-${active}-mobile`}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : STAGGER.tight } },
              exit: { transition: { staggerChildren: 0 } },
            }}
          >
            {tab.rows.map((row) => {
              const isOpen = openService === row.service;
              return (
                <motion.li
                  key={row.service}
                  variants={{
                    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: DUR.entrance, ease: EASE } },
                    exit: reduced ? { opacity: 1 } : { opacity: 0 },
                  }}
                  className={cx(
                    'overflow-hidden rounded-[3px] transition-colors duration-300',
                    isOpen ? 'my-2 border border-gold/40 bg-shell' : 'border-b border-sand/70 last:border-none'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenService(isOpen ? null : row.service)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-3 py-3.5 text-left"
                  >
                    <span className="font-serif text-[1.05rem] font-light text-ink">{row.service}</span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className="font-serif text-[1.05rem] font-light leading-none text-gold [font-variant-numeric:tabular-nums]">
                        {inr(row.price)}
                      </span>
                      <span
                        className={cx(
                          'grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-[transform,color,border-color] duration-300',
                          isOpen ? 'rotate-180 border-gold/50 text-gold' : 'border-sand text-muted'
                        )}
                      >
                        <ArrowDownIcon className="h-3 w-3" strokeWidth={2} />
                      </span>
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-3.5 text-xs leading-relaxed text-muted">
                      {row.inclusions.join(' • ')}
                    </p>
                  </motion.div>
                </motion.li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Reveal delay={0.1} className="mt-6 flex items-center gap-4">
        <FloralCorner className="h-10 w-10 shrink-0 opacity-60" />
        <p className="text-xs leading-relaxed text-muted">{pricing.footnote}</p>
      </Reveal>

      <Reveal delay={0.14} className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="#booking"
          className="group inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-sm font-medium uppercase tracking-[0.1em] text-cream transition-[background-color,box-shadow,transform] duration-200 ease-[var(--ease-signature)] active:scale-[0.98]"
        >
          Get in Touch
          <ArrowRightIcon className="h-[16px] w-[16px] transition-transform duration-200 ease-[var(--ease-signature)] group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}

/** Desktop — the existing grid of cards, unchanged. */
function DesktopPricing({ active, setActive, tab, reduced }) {
  return (
    <div className="hidden md:block">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal className="flex justify-center">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
        </Reveal>
        <HeadingReveal delay={0.08} className="mt-6">{pricing.heading}</HeadingReveal>
        <Reveal delay={0.16}>
          <Prose className="mx-auto mt-5">{pricing.intro}</Prose>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-12 flex justify-center">
        <LocationTabs active={active} onChange={setActive} reduced={reduced} variant="desktop" />
      </Reveal>

      <div className="mt-12">
        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            id={`panel-${active}-desktop`}
            role="tabpanel"
            aria-labelledby={`tab-${active}-desktop`}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : STAGGER.base } },
              exit: { transition: { staggerChildren: 0 } },
            }}
          >
            {tab.rows.map((row) => (
              <motion.li
                key={row.service}
                variants={{
                  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: DUR.entrance, ease: EASE },
                  },
                  exit: reduced
                    ? { opacity: 1 }
                    : { opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE } },
                }}
                className={cx(
                  'group relative flex flex-col justify-between rounded-[3px] border p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-signature)]',
                  'hover:-translate-y-1 hover:shadow-[0_20px_45px_-28px_rgba(43,39,36,0.45)]',
                  'bg-shell',
                  row.featured ? 'border-gold/50 hover:border-gold' : 'border-sand hover:border-gold/40'
                )}
              >
                <p className="font-serif text-h3 font-light text-ink">{row.service}</p>
                <p className="mt-6 font-serif text-[2rem] font-light leading-none text-gold [font-variant-numeric:tabular-nums]">
                  {inr(row.price)}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Reveal className="mt-10 flex flex-col items-center gap-7 text-center">
        <p className="max-w-xl text-sm leading-relaxed text-muted">{pricing.footnote}</p>
        {/* Accent CTA — gold fill so it stands out against the cards, with an
            arrow that advances on hover. Links to the enquiry form so clients
            fill in their details rather than starting a blank WhatsApp chat. */}
        <Link
          href="#booking"
          className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-gold px-9 text-sm font-medium uppercase tracking-[0.12em] text-cream shadow-[0_14px_34px_-16px_rgba(133,103,60,0.9)] transition-[background-color,box-shadow,transform] duration-200 ease-[var(--ease-signature)] hover:bg-ink hover:shadow-[0_18px_40px_-16px_rgba(43,39,36,0.7)] active:scale-[0.98]"
        >
          Get in Touch
          <ArrowRightIcon className="h-[18px] w-[18px] transition-transform duration-200 ease-[var(--ease-signature)] group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}

export default function Pricing() {
  const [active, setActive] = useState(pricing.tabs[0].id);
  const reduced = useReducedMotion();
  const tab = pricing.tabs.find((t) => t.id === active);

  return (
    <Section id="pricing" tone="cream" className="!py-9 md:!py-[var(--section-y)]">
      <Container size="default">
        {/* Mobile and desktop render two genuinely different layouts (an
            accordion vs a card grid) — both are always in the DOM and split
            with `md:hidden` / `hidden md:block` rather than a JS `isMobile`
            check, so there's no hydration flash between them. */}
        <MobilePricing active={active} setActive={setActive} tab={tab} reduced={reduced} />
        <DesktopPricing active={active} setActive={setActive} tab={tab} reduced={reduced} />
      </Container>
    </Section>
  );
}
