'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { suiteContent } from '@/lib/content';
import { Card, CardList, ObjectPortrait, Panel, PanelIntro, PanelQuote, PanelTitle } from '@/components/suite/ObjectPanel';

/**
 * Object — Wardrobe. The rack is already lit and the outfits already
 * visible in the photograph (it's an open alcove, not a cabinet with doors
 * to animate), so the opening beat is the light along the fabrics warming
 * and brightening — a lamp being turned up, not a fake door swing.
 */

const EASE = [0.22, 0.61, 0.24, 1];

export default function WardrobeObject({ closing, onClosed }) {
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

  const c = suiteContent.wardrobe;

  return (
    <motion.div
      className="relative"
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 18 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* A warm light sweeping in from the side, as if a lamp brightened. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(115deg, rgba(201,166,107,0.32) 0%, transparent 55%)',
        }}
        initial={reduced ? false : { opacity: 0, x: -40 }}
        animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -40 }}
        transition={{ duration: 1, ease: EASE }}
      />

      <ObjectPortrait hotspotId="wardrobe" />

      <Panel glow="rgba(201,166,107,0.24)">
        <PanelTitle>{c.title}</PanelTitle>
        <PanelIntro>{c.intro}</PanelIntro>
        <CardList>
          {c.cards.map((card, i) => (
            <Card key={card.title} title={card.title} body={card.body} index={i} reduced={reduced} />
          ))}
        </CardList>
        <PanelQuote>{c.quote}</PanelQuote>
      </Panel>
    </motion.div>
  );
}
