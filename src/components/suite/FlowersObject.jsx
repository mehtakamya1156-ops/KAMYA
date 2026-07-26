'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { suiteContent } from '@/lib/content';
import { ObjectPortrait, Panel, PanelQuote, PanelTitle } from '@/components/suite/ObjectPanel';
import { DUR } from '@/lib/motion';

/**
 * Object — Flowers. The bouquet is already in full bloom in the photograph
 * (no bud-to-bloom photography exists to animate), so "each petal reveals a
 * promise" is built as a bloom-like STAGGER of the eight promises — each one
 * opening a beat after the last, like petals unfurling in sequence, rather
 * than an animated illustration standing in for the real flowers.
 */

const EASE = [0.22, 1, 0.36, 1];

/** A small single-stroke petal, matching the site's existing icon language. */
function Petal({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3c4 3 5 7 3 11-2 4-6 6-9 5-1-4 0-9 3-13 1-1 2-2 3-3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FlowersObject({ closing, onClosed }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const timers = useRef([]);
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return undefined;
    }
    at(200, () => setShown(true));
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
    at(600, () => onClosed?.());
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const c = suiteContent.flowers;

  return (
    <motion.div
      className="relative"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 16 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(closest-side, rgba(210,150,150,0.32), transparent 72%)' }}
        initial={reduced ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.7 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <ObjectPortrait hotspotId="flowers" />

      <Panel glow="rgba(210,150,150,0.26)">
        <PanelTitle>{c.title}</PanelTitle>

        <ul className="mt-7 flex flex-col gap-4">
          {c.promises.map((promise, i) => (
            <motion.li
              key={promise}
              initial={reduced ? false : { opacity: 0, scale: 0.85, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: DUR.entrance, ease: EASE, delay: reduced ? 0 : i * 0.09 }}
              className="flex items-start gap-3"
            >
              <Petal className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="text-[0.95rem] leading-relaxed text-ink">{promise}</span>
            </motion.li>
          ))}
        </ul>

        <PanelQuote>{c.quote}</PanelQuote>
      </Panel>
    </motion.div>
  );
}
