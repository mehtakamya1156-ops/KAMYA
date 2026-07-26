'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { lenisRef } from '@/lib/lenis';

/**
 * Site-wide smooth (inertia) scroll — the buttery glide that defines the
 * evamuah editorial feel.
 *
 * Behaviour:
 * - Disabled entirely under prefers-reduced-motion; the page then uses native
 *   scroll, which is exactly what those users have asked for.
 * - In-page anchor links (#about, #portfolio …) are intercepted and handed to
 *   Lenis so they glide to target and clear the fixed header, instead of the
 *   browser jumping instantly (which Lenis would otherwise fight).
 * - Renders nothing; it only wires up behaviour.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1, // gentle, unhurried — matches the site's tone
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic, no bounce
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Route same-page anchor clicks through Lenis so they glide and respect the
    // fixed header height.
    const HEADER = 72; // matches the 4.5rem header
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -HEADER, duration: 1.2 });
      history.pushState(null, '', id);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return null;
}
