'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { hero } from '@/lib/content';
import { cx } from '@/components/ui';
import { DUR, EASE, STAGGER } from '@/lib/motion';

/**
 * Hero.
 *
 * The source photograph is a full-length vertical portrait. Overlaying the
 * headline on it would bury the bride's face behind type on a phone — fatal for
 * a makeup artist's homepage. So the layout gives the photograph its own clean
 * frame at every breakpoint:
 *   mobile  — photograph above, type below on cream, both uninterrupted
 *   desktop — editorial split: type at left, photograph full-height at right
 *
 * Motion: a 20s barely-perceptible zoom on the photograph ("living
 * photograph"), then headline lines → subtext → CTAs fade up in sequence.
 * Runs once on load, never re-triggers.
 */
export default function Hero() {
  const reduced = useReducedMotion();

  const line = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: DUR.emotional, ease: EASE } },
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-svh flex-col pt-[4.5rem] lg:grid lg:grid-cols-2 lg:items-stretch lg:pt-0 xl:grid-cols-[1fr_1.1fr]"
    >
      {/* --- Photograph ------------------------------------------------ */}
      {/*
        Below lg the frame is defined by aspect ratio, not viewport height, so
        the crop is identical at every screen width — a viewport-height box
        changes its crop fraction with the window and can cut the subject's
        head off on tablets.
      */}
      {/* `hero-reveal` wipes the photograph open on load (clip-path curtain);
          `hero-zoom` is the slow living-photograph scale within it. Both are
          CSS-driven so both are cancelled together under reduced motion. */}
      <div className="hero-reveal relative aspect-[6/5] w-full shrink-0 overflow-hidden bg-sand sm:aspect-[4/3] lg:order-2 lg:aspect-auto lg:h-svh">
        <div className="hero-zoom relative h-full w-full">
          <Image
            src="/images/hero.jpg"
            alt="Bride in a red and gold lehenga with soft-glam bridal makeup by Kamya Mehta, photographed on the steps of a heritage venue"
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 52vw, 100vw"
            quality={82}
            className="object-cover object-[50%_82%] lg:object-[50%_44%]"
          />
        </div>
        {/* Soft seam so the photograph dissolves into the page rather than
            ending on a hard edge. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent lg:hidden"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-cream to-transparent lg:block"
        />
      </div>

      {/* --- Copy ------------------------------------------------------ */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col justify-center px-[var(--gutter)] pb-12 pt-7 lg:order-1 lg:py-24 lg:pl-[max(var(--gutter),6vw)] lg:pr-14"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduced ? 0 : STAGGER.slow, delayChildren: 0.15 } },
        }}
      >
        <motion.p
          variants={line}
          className="mb-5 flex items-center gap-3 text-eyebrow font-medium uppercase text-gold"
        >
          <span aria-hidden className="h-px w-8 bg-gold/50" />
          {hero.eyebrow}
        </motion.p>

        {/* The global h1 scale is tuned for full-width headings; inside the
            split column it needs its own, narrower curve. */}
        <h1 className="max-w-[14ch] font-serif text-h1 font-light leading-[1.02] tracking-[-0.015em] text-ink lg:text-[clamp(2.9rem,1.2rem+3.5vw,4.75rem)]">
          {hero.headline.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                {i === hero.headline.length - 1 ? (
                  <em className="font-normal italic text-gold">{l}</em>
                ) : (
                  l
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p variants={line} className="mt-5 max-w-[46ch] text-lead text-muted sm:mt-7">
          <span className="sm:hidden">{hero.subtextShort}</span>
          <span className="hidden sm:inline">{hero.subtext}</span>
        </motion.p>

        {/* Credibility stats — replaces the CTA buttons. Three equal segments
            split by hairline dividers, sized up to read as proof. */}
        <motion.dl
          variants={line}
          className="mt-9 grid grid-cols-3 border-t border-sand pt-8 sm:mt-11"
        >
          {hero.stats.map((s, i) => (
            <div
              key={s.label}
              className={cx(
                'px-4 first:pl-0 last:pr-0',
                i > 0 && 'border-l border-sand'
              )}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-serif text-[1.4rem] font-light leading-tight text-gold sm:text-[1.9rem]">
                {s.value}
              </dd>
              <p className="mt-2 text-[0.625rem] uppercase leading-snug tracking-[0.16em] text-muted sm:text-eyebrow">
                {s.label}
              </p>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
