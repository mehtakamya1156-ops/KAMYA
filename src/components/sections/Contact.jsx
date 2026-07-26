'use client';

import Link from 'next/link';
import { brand } from '@/lib/content';
import { Container, Eyebrow, Section } from '@/components/ui';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import { InstagramIcon, PhoneIcon, PinIcon } from '@/components/icons';
import { STAGGER } from '@/lib/motion';

/**
 * Contact details.
 *
 * WhatsApp and Instagram are given their own full-size buttons rather than
 * being folded into one row of icons — they are the two ways enquiries actually
 * arrive, so each gets its own deliberate target.
 *
 * Motion here is intentionally minimal: this section is functional.
 */
const details = [
  {
    icon: PhoneIcon,
    label: 'Phone & WhatsApp',
    value: brand.phone,
    href: `tel:+${brand.phoneRaw}`,
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: brand.instagramHandle,
    href: brand.instagramUrl,
    external: true,
  },
  {
    icon: PinIcon,
    label: 'Service areas',
    value: brand.serviceAreas,
  },
];

export default function Contact() {
  return (
    <Section id="contact" tone="cream" className="relative overflow-hidden !py-9 sm:!py-16">
      {/* Soft colour behind the glass card — without something to catch the
          light, a backdrop-blur panel has nothing to blur and just reads as
          a plain tint. Two quiet warm blooms, not a busy background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 h-[22rem] w-[22rem] rounded-full bg-blush/50 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-10 h-[20rem] w-[20rem] rounded-full bg-gold/20 blur-[110px]"
      />

      <Container size="default" className="relative">
        {/* --- Glass card ------------------------------------------------ */}
        <div className="mx-auto max-w-3xl rounded-[6px] border border-white/60 bg-white/35 px-6 py-9 shadow-[0_30px_70px_-30px_rgba(43,39,36,0.3)] backdrop-blur-xl sm:px-14 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal className="flex justify-center">
              <Eyebrow>Get in touch</Eyebrow>
            </Reveal>
            <HeadingReveal delay={0.08} className="mt-3 sm:mt-4 md:hidden">
              I’d love to hear about <em className="italic text-gold">your big day</em>
            </HeadingReveal>
            <HeadingReveal delay={0.08} className="mt-3 hidden sm:mt-4 md:block">
              I’d love to hear about <em className="italic text-gold">your day</em>
            </HeadingReveal>
          </div>

          {/* WhatsApp and Instagram now live in the floating dock (bottom-right,
              visible on every scroll), so this section keeps just the details. */}

          {/* --- Details -------------------------------------------------
              A horizontal icon-beside-text row on mobile (icon no longer
              needs its own stacked line above the text), settling back into
              the original centred, stacked layout at sm+. */}
          <RevealGroup
            as="ul"
            each={STAGGER.tight}
            delay={0.1}
            className="mx-auto mt-5 grid max-w-3xl gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-3"
          >
            {details.map(({ icon: Icon, label, value, href, external }) => {
              const body = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/35 text-gold transition-[border-color,transform] duration-200 ease-[var(--ease-signature)] group-hover:border-gold group-hover:scale-105 sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </span>
                  <span className="flex flex-col sm:mt-3">
                    <span className="text-eyebrow uppercase text-muted">{label}</span>
                    <span className="mt-0.5 text-lead text-ink transition-colors duration-200 ease-[var(--ease-signature)] group-hover:text-gold sm:mt-1">
                      {value}
                    </span>
                  </span>
                </>
              );

              return (
                <RevealItem key={label} as="li" className="text-left">
                  {href ? (
                    <Link
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="group flex flex-row items-center gap-4 sm:flex-col sm:items-start sm:gap-0">
                      {body}
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  );
}
