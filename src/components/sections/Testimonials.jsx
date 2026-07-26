'use client';

import { testimonials } from '@/lib/content';
import { Container, Eyebrow, Section } from '@/components/ui';
import Reveal from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import Carousel from '@/components/Carousel';
import { QuoteIcon, StarIcon } from '@/components/icons';

/**
 * Testimonials — a light, card-based, swipeable row.
 *
 * Two to three cards are visible at once with the rest reachable by swipe or the
 * carousel arrows/dots. Each card fades and slides up as it enters view; the
 * `delay` staggers the first row left-to-right for a cascading reveal. The warm
 * cream/shell palette keeps the section airy rather than the old dark panel.
 */
function Card({ item, index }) {
  return (
    <Reveal
      variant="fadeUp"
      delay={Math.min(index, 2) * 0.12}
      viewport={{ once: true, amount: 0.2 }}
      className="flex h-full w-[80vw] max-w-[360px] flex-col rounded-2xl border border-sand bg-cream p-7 shadow-[0_18px_45px_-30px_rgba(43,39,36,0.4)] sm:w-[22rem]"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-gold" aria-label={`${item.rating} out of 5 stars`}>
          {Array.from({ length: item.rating }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4" />
          ))}
        </div>
        <QuoteIcon className="h-6 w-6 text-blush" />
      </div>

      <blockquote className="mt-5 flex-1 text-pretty text-[1.0625rem] leading-relaxed text-ink/85">
        {item.quote}
      </blockquote>

      <figcaption className="mt-6 border-t border-sand pt-5">
        <p className="font-serif text-xl font-light text-ink">{item.name}</p>
        <p className="mt-0.5 text-eyebrow uppercase text-muted">{item.event}</p>
      </figcaption>
    </Reveal>
  );
}

export default function Testimonials() {
  return (
    <Section id="testimonials" tone="shell" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-blush/40 blur-[120px]"
      />

      <Container size="wide" className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{testimonials.eyebrow}</Eyebrow>
          </Reveal>
          <HeadingReveal delay={0.08} className="mt-6">
            {testimonials.heading}
          </HeadingReveal>
        </div>
      </Container>

      <div className="relative mt-12 sm:mt-16">
        <Carousel
          ariaLabel="Testimonials from brides"
          trackClassName="items-stretch lg:px-[max(var(--gutter),6vw)]"
          autoPlay
          interval={4500}
        >
          {testimonials.items.map((item, i) => (
            <Card key={item.name} item={item} index={i} />
          ))}
        </Carousel>
      </div>
    </Section>
  );
}
