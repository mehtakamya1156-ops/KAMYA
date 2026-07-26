'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { testimonials } from '@/lib/content';
import { ObjectPortrait, Panel, PanelTitle } from '@/components/suite/ObjectPanel';
import { StarIcon } from '@/components/icons';
import { DUR, EASE as SIGNATURE_EASE } from '@/lib/motion';

/**
 * Object — Candle. The one object whose photograph already has real,
 * living light in it (an actual lit flame), so the opening beat leans on
 * that: the warm glow around the flame deepens and gently breathes, rather
 * than any invented mechanic.
 *
 * Holds the same reviews shown in the Testimonials section (single source
 * of truth via `testimonials` in content.js) rather than its own copy, so a
 * bride who taps the candle finds real words from other brides waiting
 * for her.
 */

const EASE = [0.16, 1, 0.3, 1];

export default function CandleObject({ closing, onClosed }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const timers = useRef([]);
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return undefined;
    }
    at(250, () => setShown(true));
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!closing) return undefined;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduced) {
      onClosed?.();
      return undefined;
    }
    setShown(false);
    at(650, () => onClosed?.());
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  return (
    <motion.div
      className="relative"
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.96 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {/* A warm glow that breathes gently, like the flame itself. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(closest-side, rgba(214,150,60,0.42), transparent 74%)',
        }}
        animate={
          reduced || !shown
            ? { opacity: shown ? 1 : 0 }
            : { opacity: [0.85, 1, 0.85], scale: [1, 1.04, 1] }
        }
        transition={
          reduced || !shown
            ? { duration: 0.9, ease: EASE }
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <ObjectPortrait hotspotId="candle" />

      <Panel glow="rgba(214,150,60,0.32)">
        <PanelTitle>{testimonials.heading}</PanelTitle>

        <div className="mt-7 flex flex-col gap-7">
          {testimonials.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: DUR.entrance, ease: SIGNATURE_EASE, delay: reduced ? 0 : i * 0.08 }}
              className={i > 0 ? 'border-t border-sand pt-7' : ''}
            >
              <div className="flex gap-1 text-gold" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: item.rating }).map((_, s) => (
                  <StarIcon key={s} className="h-3.5 w-3.5" />
                ))}
              </div>
              <p className="mt-3 text-pretty text-[0.98rem] leading-relaxed text-ink/85">
                {item.quote}
              </p>
              <p className="mt-3 font-serif text-lg font-light text-ink">{item.name}</p>
              <p className="text-eyebrow uppercase text-muted">{item.event}</p>
            </motion.div>
          ))}
        </div>
      </Panel>
    </motion.div>
  );
}
