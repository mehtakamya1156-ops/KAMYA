'use client';

import { useEffect, useState } from 'react';

/**
 * True while the Bridal Suite's room stage is substantially filling the
 * viewport. Header and FloatingActions both read this to fade themselves
 * out — "everything else disappears" while the room takes over the screen,
 * and reappears once the visitor scrolls past it.
 *
 * Watches `#bridal-suite-stage` specifically (the full-bleed room element),
 * NOT the whole section — so the header stays visible while the Suite's own
 * heading/intro text is on screen, and only hides once the room itself is
 * genuinely covering most of the viewport.
 */
export function useSuiteTakeover() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = document.getElementById('bridal-suite-stage');
    if (!el) return undefined;

    const io = new IntersectionObserver(([entry]) => setActive(entry.intersectionRatio > 0.6), {
      threshold: [0, 0.6, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return active;
}
