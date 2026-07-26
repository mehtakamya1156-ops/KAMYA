'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { about, brand } from '@/lib/content';
import { Container, Eyebrow, Heading, Section } from '@/components/ui';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import Signature from '@/components/Signature';
import { STAGGER, wipeUp } from '@/lib/motion';

/**
 * About Me — split layout with a parallax photograph.
 *
 * The image drifts more slowly than the page as the section passes through the
 * viewport, which reads as depth. The movement is deliberately small (±32px);
 * anything larger becomes noticeable as an effect rather than felt as depth.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function About() {
  const reduced = useReducedMotion();
  const frameRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <Section id="about" tone="cream" className="!pb-12 sm:!pb-16">
      <Container size="default">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          {/* --- Photograph -------------------------------------------- */}
          <Reveal variant="fade" className="relative mx-auto w-full max-w-sm lg:max-w-none">
            {/* The frame wipes open (clip-path curtain) as it enters view; the
                photograph inside keeps its slow parallax drift. Driven by the
                `wipeUp` variant it inherits from the parent Reveal, since a
                motion child's own whileInView is overridden by its parent. */}
            <motion.div
              ref={frameRef}
              className="wipe-frame relative aspect-[4/5] overflow-hidden rounded-[2px] bg-sand"
              variants={reduced ? undefined : wipeUp}
            >
              {/* Oversized so the parallax drift never exposes an edge. */}
              <motion.div className="absolute inset-x-0 -top-[8%] h-[116%]" style={reduced ? undefined : { y }}>
                <Image
                  src={about.image}
                  alt={about.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 90vw"
                  quality={78}
                  className="object-cover object-[50%_12%] sm:object-[50%_30%]"
                />
              </motion.div>
            </motion.div>

            {/* Quiet gold frame, offset behind the photograph. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[2px] border border-gold/30"
            />
          </Reveal>

          {/* --- Copy --------------------------------------------------- */}
          <div>
            <Reveal>
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </Reveal>

            <HeadingReveal delay={0.08} className="mt-6">{about.heading}</HeadingReveal>

            <RevealGroup each={STAGGER.base} delay={0.1} className="mt-6 flex flex-col gap-5">
              {about.body.map((p) => (
                <RevealItem key={p} as="p" className="max-w-[var(--measure)] text-lead text-muted">
                  {p}
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.1} className="mt-8 border-t border-sand pt-6">
              <Signature size="text-[2rem] sm:text-[2.4rem]" />
              <p className="mt-1 text-eyebrow uppercase text-muted">{brand.artist}</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
