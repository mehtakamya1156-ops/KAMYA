'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ENTRANCES, VIEWPORT, still, stagger as staggerVariant } from '@/lib/motion';

/**
 * Scroll-triggered entrance. Animates once and never again.
 *
 * <Reveal>                          fade + rise
 * <Reveal variant="slideLeft">      slide in from the left
 * <Reveal delay={0.1}>              offset within a group
 * <Reveal as="li">                  render a different element
 *
 * Honours prefers-reduced-motion by rendering the content already-visible.
 */
export default function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  as = 'div',
  className,
  viewport = VIEWPORT,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  const variants = reduced ? still : ENTRANCES[variant] ?? ENTRANCES.fadeUp;

  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={reduced ? { duration: 0 } : { delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggering parent. Children should be <RevealItem> (or any motion element
 * using the `hidden`/`show` variant names) — they inherit the timing.
 */
export function RevealGroup({
  children,
  each = 0.1,
  delay = 0,
  as = 'div',
  className,
  viewport = VIEWPORT,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;

  return (
    <Tag
      className={className}
      variants={reduced ? still : staggerVariant(each, delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** A child of <RevealGroup>. Timing comes from the parent. */
export function RevealItem({ children, variant = 'fadeUp', as = 'div', className, ...rest }) {
  const reduced = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  const variants = reduced ? still : ENTRANCES[variant] ?? ENTRANCES.fadeUp;

  return (
    <Tag className={className} variants={variants} {...rest}>
      {children}
    </Tag>
  );
}
