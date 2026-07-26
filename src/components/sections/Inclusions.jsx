'use client';

import { inclusions } from '@/lib/content';
import { Container, Heading, Section } from '@/components/ui';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import { QuoteIcon } from '@/components/icons';
import { STAGGER, VIEWPORT } from '@/lib/motion';

export default function Inclusions() {
  return (
    <Section id="inclusions" tone="cream">
      <Container size="default">
        {/* --- Philosophy ---------------------------------------------- */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
          <Reveal>
            <QuoteIcon className="h-6 w-6 text-blush" />
            <Heading level={3} className="mt-4 text-h2">
              {inclusions.philosophy.heading}
            </Heading>
          </Reveal>
          <RevealGroup each={STAGGER.base} className="flex flex-col gap-5">
            {inclusions.philosophy.body.map((p) => (
              <RevealItem key={p} as="p" className="text-lead text-muted">
                {p}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Divider only — the scrolling names speak for themselves. */}
        <div className="mt-16 border-t border-sand" />
      </Container>

      {/* --- Brands --------------------------------------------------- */}
      {/* Full-bleed continuous scroll of the actual brand logos, at every
          breakpoint. No label and no trailing text — just the marks,
          desaturated to sit quietly at the same visual weight the names did. */}
      <Reveal className="mt-10" viewport={VIEWPORT}>
        <Marquee count={inclusions.brands.list.length}>
          <ul className="flex items-center gap-x-10 sm:gap-x-14">
            {inclusions.brands.list.map((b) => (
              <li key={b.name} className="flex h-7 items-center sm:h-9">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="w-auto max-w-none object-contain opacity-70 grayscale"
                  style={{ height: '100%' }}
                />
              </li>
            ))}
          </ul>
        </Marquee>
      </Reveal>
    </Section>
  );
}
