'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { brand } from '@/lib/content';
import { cx } from '@/components/ui';
import { EASE, VIEWPORT } from '@/lib/motion';

/**
 * The artist's signature, revealed left-to-right as though it were being
 * written. Uses a clip-path wipe over a script typeface rather than an SVG
 * stroke-dash path — it reads identically, stays perfectly crisp at any size,
 * and remains real, selectable, screen-reader-friendly text.
 *
 * Reveals once on scroll and never re-runs.
 */
export default function Signature({ className, size = 'text-[2.4rem] sm:text-[3rem]' }) {
  const reduced = useReducedMotion();

  return (
    <motion.p
      className={cx('font-script leading-[1.35] text-gold', size, className)}
      initial={reduced ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : { clipPath: 'inset(0 100% 0 0)', opacity: 0.001 }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
      viewport={VIEWPORT}
      transition={reduced ? { duration: 0 } : { duration: 1.6, ease: EASE, opacity: { duration: 0.01 } }}
    >
      {brand.artist}
    </motion.p>
  );
}
