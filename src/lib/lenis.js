/**
 * A handle onto the site's single Lenis smooth-scroll instance, created by
 * `SmoothScroll.jsx`. Nothing else needs to touch Lenis directly except a
 * section that must genuinely hold the page still (the Garden Gate's
 * scroll-lock) — this is the one shared seam for that, rather than lifting
 * Lenis into React context for a single consumer.
 *
 * `current` is `null` whenever Lenis isn't running at all (prefers-reduced-
 * motion disables it entirely), so callers should always use `?.`.
 */
export const lenisRef = { current: null };
