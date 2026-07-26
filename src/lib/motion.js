/**
 * Shared motion language.
 *
 * Every animation on the site draws its duration and easing from here, so the
 * whole page moves with one rhythm. Do not hard-code durations in components.
 */

/** The single easing curve used site-wide (matches --ease-signature in CSS). */
export const EASE = [0.22, 1, 0.36, 1];

/** Duration tokens, in seconds. */
export const DUR = {
  micro: 0.2, // hovers, icon rotations
  base: 0.3, // standard UI transitions
  entrance: 0.4, // scroll-reveal entrances
  emotional: 0.6, // hero + letter only
};

/** Stagger tokens, in seconds. */
export const STAGGER = {
  tight: 0.06, // icon lists
  base: 0.1, // portfolio images, pricing cards
  slow: 0.16, // hero lines, letter lines
};

/**
 * Viewport config for scroll reveals.
 * `once: true` is what guarantees nothing re-animates on a second scroll pass.
 */
export const VIEWPORT = { once: true, amount: 0.25 };
export const VIEWPORT_EARLY = { once: true, amount: 0.1 };

/* ---------------------------------------------------------------- */
/* Variants                                                          */
/* ---------------------------------------------------------------- */

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.entrance, ease: EASE } },
};

export const fadeUpSlow = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.emotional, ease: EASE } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.entrance, ease: EASE } },
};

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.entrance, ease: EASE } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: DUR.entrance, ease: EASE } },
};

export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: DUR.entrance, ease: EASE } },
};

/**
 * Wider travel for full-bleed phone layouts, where an image spans the screen
 * and a 40px offset is barely legible as movement. Safe against horizontal
 * scrollbars because `body` is set to `overflow-x: clip`.
 */
export const slideLeftFar = {
  hidden: { opacity: 0, x: '-22%' },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

export const slideRightFar = {
  hidden: { opacity: 0, x: '22%' },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

export const drift = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.emotional, ease: EASE } },
};

/**
 * Editorial evamuah-style reveals. These are named variants (not inline
 * targets) so they trigger reliably both standalone and when propagated from a
 * variant-driven parent — a motion child's own `whileInView` is overridden by
 * its parent, but a matching variant label is not.
 */
export const maskUp = {
  hidden: { y: '116%' },
  show: { y: 0, transition: { duration: 0.75, ease: EASE } },
};

export const wipeUp = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.9, ease: EASE } },
};

/** Named lookup so data files can declare an entrance by string. */
export const ENTRANCES = {
  fadeScale,
  slideLeft,
  slideRight,
  slideLeftFar,
  slideRightFar,
  drift,
  fadeUp,
  fade,
  maskUp,
  wipeUp,
};

/** Parent container that staggers its children. */
export const stagger = (each = STAGGER.base, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren: delay } },
});

/**
 * Reduced-motion fallback: same variant names, but content simply appears.
 * Used by <Reveal> so markup never has to branch.
 */
export const still = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  show: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0 } },
};
