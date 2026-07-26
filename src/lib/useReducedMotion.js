'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Hydration-safe reduced-motion hook.
 *
 * Framer's own `useReducedMotion` reads the media query synchronously, so it
 * returns `false` on the server but the user's real preference on the client.
 * Any component that branches its *rendered* output on that value (a different
 * `initial`, `variants`, or `style`) then produces server HTML that disagrees
 * with the first client render — a hydration mismatch React refuses to patch.
 *
 * This wrapper returns `false` during SSR and on the first client render — so
 * both sides agree — then settles to the true value after mount, which is a
 * normal post-hydration re-render and therefore allowed. Use this everywhere
 * instead of importing `useReducedMotion` directly from framer-motion.
 */
export function useReducedMotion() {
  const preference = useFramerReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? Boolean(preference) : false;
}
