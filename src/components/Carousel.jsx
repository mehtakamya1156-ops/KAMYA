'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { cx } from '@/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

/**
 * Horizontal scroll-snap carousel.
 *
 * Native horizontal scrolling gives real swipe/trackpad support for free; on
 * top of that it adds prev/next arrows and pagination dots. When `autoPlay` is
 * set it advances a slide every `interval` ms and loops, pausing the moment the
 * visitor interacts (hover, touch, focus, drag, manual scroll) and resuming a
 * few seconds after they stop.
 *
 * Dots are PAGE-based, not slide-based. When several slides are visible at once
 * the leftmost slide index caps out well before the last slide, so per-slide
 * dots can never highlight the final slides and appear stuck. One dot per
 * reachable scroll position always tracks the real position — and when
 * everything already fits (nothing to scroll) there are no dots or arrows at
 * all, which is exactly what a desktop layout showing every card wants.
 *
 * `data-lenis-prevent` stops the site's smooth-scroll from swallowing wheel
 * gestures over the track. Under reduced motion, scrolling is instant and
 * autoplay is disabled.
 */
export default function Carousel({
  children,
  autoPlay = false,
  interval = 2000,
  ariaLabel = 'Carousel',
  className,
  trackClassName,
}) {
  const trackRef = useRef(null);
  const resumeTimer = useRef(null);
  const reduced = useReducedMotion();
  const slides = Children.toArray(children);
  const count = slides.length;

  const [paused, setPaused] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /**
   * Recompute page count, current page and arrow availability from scroll.
   *
   * Pages are spread evenly across the *actual* scrollable range (0 → max)
   * rather than in fixed viewport-sized jumps. Fixed jumps leave the final page
   * unreachable — the scroll clamps at `max` before reaching it — which is what
   * makes the last dot never light up.
   */
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const per = el.clientWidth || 1;
    const total = max <= 2 ? 1 : Math.ceil(max / per) + 1;
    const step = total > 1 ? max / (total - 1) : 1;
    setPages(total);
    setPage(Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / step))));
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  /** Scroll so slide `i` sits at the left edge (used by arrows + autoplay). */
  const goToSlide = useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el) return;
      const idx = ((i % count) + count) % count;
      const child = el.children[idx];
      if (!child) return;
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      el.scrollTo({
        left: child.offsetLeft - pad,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [count, reduced]
  );

  /** Index of the slide currently nearest the left edge. */
  const leftmostSlide = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    let best = 0;
    let bestDist = Infinity;
    [...el.children].forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.scrollLeft - el.clientLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }, []);

  /** Uses the same even step as `sync`, so dot N always lands on page N. */
  const goToPage = useCallback(
    (i) => {
      const el = trackRef.current;
      if (!el) return;
      const per = el.clientWidth || 1;
      const max = el.scrollWidth - el.clientWidth;
      const total = max <= 2 ? 1 : Math.ceil(max / per) + 1;
      const step = total > 1 ? max / (total - 1) : 1;
      el.scrollTo({ left: Math.min(i * step, max), behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  // Autoplay — advance one slide and loop; skipped while paused or reduced.
  useEffect(() => {
    if (!autoPlay || paused || reduced || count < 2) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      goToSlide(atEnd ? 0 : leftmostSlide() + 1);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, reduced, count, interval, goToSlide, leftmostSlide]);

  const pause = () => {
    clearTimeout(resumeTimer.current);
    setPaused(true);
  };
  const resumeSoon = () => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 3000);
  };

  // Nothing to scroll → the controls would be meaningless, so drop them.
  const scrollable = pages > 1;

  const arrowCls =
    'pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-sand bg-cream/90 text-ink shadow-[0_8px_24px_-12px_rgba(43,39,36,0.5)] backdrop-blur-sm transition-[color,border-color,opacity] duration-200 ease-[var(--ease-signature)] hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-0';

  return (
    <div className={cx('relative', className)}>
      <ul
        ref={trackRef}
        data-lenis-prevent
        aria-label={ariaLabel}
        className={cx(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1',
          'px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          trackClassName
        )}
        onMouseEnter={pause}
        onMouseLeave={resumeSoon}
        onFocusCapture={pause}
        onBlurCapture={resumeSoon}
        onPointerDown={pause}
        onPointerUp={resumeSoon}
        onTouchStart={pause}
        onTouchEnd={resumeSoon}
      >
        {slides.map((slide, i) => (
          <li key={i} className="shrink-0 snap-start">
            {slide}
          </li>
        ))}
      </ul>

      {/* Exactly one arrow per side, inset within the gutters. Hidden on
          touch-first small screens, where swiping is the natural gesture. */}
      {scrollable && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-3 sm:flex lg:px-6">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => {
              pause();
              goToSlide(leftmostSlide() - 1);
              resumeSoon();
            }}
            className={arrowCls}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => {
              pause();
              goToSlide(leftmostSlide() + 1);
              resumeSoon();
            }}
            className={arrowCls}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Page dots — omitted entirely when everything already fits. */}
      {scrollable && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page}
              onClick={() => {
                pause();
                goToPage(i);
                resumeSoon();
              }}
              className="group grid h-9 w-9 place-items-center"
            >
              <span
                className={cx(
                  'block h-1.5 rounded-full transition-all duration-300 ease-[var(--ease-signature)]',
                  i === page ? 'w-7 bg-gold' : 'w-1.5 bg-sand group-hover:bg-muted'
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
