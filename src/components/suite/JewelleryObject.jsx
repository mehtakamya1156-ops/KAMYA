'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { suiteContent } from '@/lib/content';
import {
  Card,
  CardList,
  IncludedList,
  ObjectPortrait,
  Panel,
  PanelIntro,
  PanelQuote,
  PanelTitle,
} from '@/components/suite/ObjectPanel';

/**
 * Object — Jewellery Box. The lid is already open in the photograph itself
 * (there is no "closed" reference shot to animate from), so the opening
 * beat is a soft interior light blooming from the box rather than a fake
 * lid-hinge — the box is still what the eye follows in.
 */

const EASE = [0.16, 1, 0.3, 1];

export default function JewelleryObject({ closing, onClosed }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const timers = useRef([]);
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return undefined;
    }
    at(150, () => setShown(true));
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
    at(550, () => onClosed?.());
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const c = suiteContent.jewellery;

  return (
    <motion.div
      className="relative"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 16 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* Soft golden light, as if spilling out of the open box. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(closest-side, rgba(201,166,107,0.4), transparent 72%)',
        }}
        initial={reduced ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.6 }}
        transition={{ duration: 0.9, ease: EASE }}
      />

      <ObjectPortrait hotspotId="jewellery" />

      <Panel glow="rgba(201,166,107,0.3)">
        <PanelTitle>{c.title}</PanelTitle>
        <PanelIntro>{c.intro}</PanelIntro>
        <CardList>
          {c.cards.map((card, i) => (
            <Card key={card.title} title={card.title} body={card.body} index={i} reduced={reduced} />
          ))}
        </CardList>
        <IncludedList heading={c.included.heading} items={c.included.items} />
        <PanelQuote>{c.quote}</PanelQuote>
      </Panel>
    </motion.div>
  );
}
