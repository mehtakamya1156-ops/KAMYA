'use client';

import Image from 'next/image';
import { about, brand } from '@/lib/content';
import { Container, Eyebrow, Heading, Section } from '@/components/ui';
import Signature from '@/components/Signature';

/**
 * About Me — split layout, static (no scroll-triggered animation).
 */
export default function About() {
  return (
    <Section id="about" tone="cream" className="!pb-12 sm:!pb-16">
      <Container size="default">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
          {/* --- Photograph -------------------------------------------- */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-sand">
              <Image
                src={about.image}
                alt={about.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 90vw"
                quality={78}
                className="object-cover object-[50%_12%] sm:object-[50%_30%]"
              />
            </div>

            {/* Quiet gold frame, offset behind the photograph. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[2px] border border-gold/30"
            />
          </div>

          {/* --- Copy --------------------------------------------------- */}
          <div>
            <Eyebrow>{about.eyebrow}</Eyebrow>

            <Heading className="mt-6">{about.heading}</Heading>

            <div className="mt-6 flex flex-col gap-5">
              {about.body.map((p) => (
                <p key={p} className="max-w-[var(--measure)] text-lead text-muted">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-8 border-t border-sand pt-6">
              <Signature size="text-[2rem] sm:text-[2.4rem]" />
              <p className="mt-1 text-eyebrow uppercase text-muted">{brand.artist}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
