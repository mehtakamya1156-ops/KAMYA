'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook.
 *
 * Returns false on the server and on the very first client render, then
 * settles to the real value. Components using it must therefore stay visually
 * correct in the `false` state — never gate content on it, only behaviour.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Below Tailwind's `md` breakpoint — where the portfolio is a single column. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
