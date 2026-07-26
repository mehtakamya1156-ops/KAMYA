'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { faqs } from '@/lib/content';
import { Container, Eyebrow, Heading, Section } from '@/components/ui';
import Reveal from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import { PlusIcon } from '@/components/icons';
import { DUR, EASE } from '@/lib/motion';

/**
 * FAQ accordion.
 *
 * One panel open at a time. Height animates rather than snapping, the answer
 * fades in slightly behind the height change, and the "+" rotates 45° into an
 * "×". Built on a real <button> with aria-expanded/aria-controls so it is fully
 * keyboard operable and announced correctly.
 */
function Item({ item, isOpen, onToggle, id }) {
  const reduced = useReducedMotion();

  return (
    <li className="border-b border-sand">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${id}`}
          id={`faq-trigger-${id}`}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-200 ease-[var(--ease-signature)] hover:text-gold"
        >
          <span className="font-serif text-h3 font-light text-balance">{item.q}</span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sand transition-colors duration-200 ease-[var(--ease-signature)] group-hover:border-gold">
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={reduced ? { duration: 0 } : { duration: DUR.micro, ease: EASE }}
              className="block"
            >
              <PlusIcon className="h-4 w-4" />
            </motion.span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={`faq-panel-${id}`}
            role="region"
            aria-labelledby={`faq-trigger-${id}`}
            initial={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    height: { duration: DUR.base, ease: EASE },
                    // Exit is faster than enter so closing feels responsive.
                    opacity: { duration: 0.2, ease: EASE },
                  }
            }
            className="overflow-hidden"
          >
            <p className="max-w-[var(--measure)] pb-7 pr-12 text-lead text-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Faqs() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faqs" tone="cream">
      <Container size="narrow">
        <Reveal>
          <Eyebrow>{faqs.eyebrow}</Eyebrow>
        </Reveal>
        <HeadingReveal delay={0.08} className="mt-6">{faqs.heading}</HeadingReveal>

        <Reveal delay={0.14} viewport={{ once: true, amount: 0.1 }}>
          <ul className="mt-12 border-t border-sand">
            {faqs.items.map((item, i) => (
              <Item
                key={item.q}
                id={i}
                item={item}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
