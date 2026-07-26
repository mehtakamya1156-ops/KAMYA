'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { VIEWPORT, maskUp, still } from '@/lib/motion';
import { cx } from '@/components/ui';

/**
 * A section heading that rises up from behind a clipped edge as it scrolls into
 * view — the evamuah editorial reveal. Drop-in replacement for the
 * `<Reveal><Heading/></Reveal>` pairing.
 *
 * Same typographic props as <Heading>. Layout margins (e.g. `mt-6`) belong on
 * `className`, which is applied to the clipping wrapper so spacing is unchanged.
 *
 * The wrapper carries a little bottom padding, cancelled by a matching negative
 * margin, so serif descenders (g, y, p) are never shaved by the clip. Reveals
 * once (named variant so it fires reliably); collapses to a plain heading under
 * prefers-reduced-motion.
 */
export default function HeadingReveal({
  children,
  level = 2,
  size = 'h2',
  className,
  delay = 0,
}) {
  const reduced = useReducedMotion();
  const Tag = `h${level}`;
  const sizes = { h1: 'text-h1', h2: 'text-h2', h3: 'text-h3' };
  const typeCls = cx('font-serif font-light tracking-[-0.01em] text-balance', sizes[size]);

  if (reduced) {
    return <Tag className={cx(typeCls, className)}>{children}</Tag>;
  }

  return (
    <div className={cx('overflow-hidden pb-[0.14em] -mb-[0.14em]', className)}>
      <motion.div
        variants={maskUp}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        transition={{ delay }}
      >
        <Tag className={typeCls}>{children}</Tag>
      </motion.div>
    </div>
  );
}
