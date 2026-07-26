import { cx } from '@/components/ui';

/**
 * Continuous horizontal marquee.
 *
 * The track is built from `perHalf * 2` identical copies of the children and
 * translates by exactly -50%, so the second half lands precisely where the
 * first began — the loop is seamless with no jump.
 *
 * Why more than two copies: at -50% the track has scrolled by one half's width,
 * so each half must be at least as wide as the viewport or a gap opens at the
 * trailing edge on wide screens. Three copies per half covers up to ultrawide
 * without measuring anything at runtime.
 *
 * There is deliberately no JavaScript branch for reduced motion. CSS in
 * globals.css stops the animation, hides every duplicate copy and turns the row
 * into a normal horizontally scrollable list. One code path, and it is correct
 * before hydration.
 *
 * Accessibility: the visual track is entirely aria-hidden and the real content
 * is exposed once, visually hidden, so assistive tech reads the list a single
 * time. Motion pauses on hover and on keyboard focus.
 */
export default function Marquee({ children, count = 8, speed = 3.2, perHalf = 3, className }) {
  // Seconds per item — a higher `speed` value means a slower, calmer drift.
  const duration = Math.max(12, count * speed);
  const group = 'flex shrink-0 items-center gap-x-10 pr-10 sm:gap-x-14 sm:pr-14';

  // Copy 0 is the one left visible under reduced motion; the rest are dupes.
  const copies = Array.from({ length: perHalf * 2 }, (_, i) => (
    <div key={i} className={cx(group, i > 0 && 'marquee-dup')}>
      {children}
    </div>
  ));

  return (
    <div className={cx('marquee group relative', className)} style={{ '--marquee-dur': `${duration}s` }}>
      <span className="sr-only">{children}</span>
      <div aria-hidden className="marquee-track flex w-max items-center">
        {copies}
      </div>
    </div>
  );
}
