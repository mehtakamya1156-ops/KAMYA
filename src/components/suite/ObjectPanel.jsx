'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/lib/useMediaQuery';
import { bridalSuite } from '@/lib/content';
import { cx } from '@/components/ui';
import { SparkleIcon } from '@/components/icons';
import { DUR, EASE } from '@/lib/motion';

/**
 * Shared presentation pieces for the four card-based Suite objects
 * (Jewellery, Wardrobe, Candle, Flowers). Letter and Album are physical
 * paper/book objects with their own bespoke markup — these four are
 * content panels, and repeat the same shape often enough (intro + cards +
 * quote) to share one visual language instead of four near-duplicates.
 */

/**
 * A small round "portrait" cropped from the SAME room photograph, zoomed to
 * just that object's own hotspot region — so the panel's header is the real
 * photographed object, not a generic icon or a fresh illustration.
 */
export function ObjectPortrait({ hotspotId, size = 108 }) {
  const isMobile = useIsMobile();
  const room = isMobile ? bridalSuite.room.mobile : bridalSuite.room.desktop;
  const hotspot = bridalSuite.hotspots.find((h) => h.id === hotspotId);
  const box = isMobile ? hotspot.mobile : hotspot.desktop;
  const cx0 = box.x + box.w / 2;
  const cy0 = box.y + box.h / 2;
  const zoom = Math.max(100 / box.w, 100 / box.h) * 0.92;

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-full ring-1 ring-gold/50 shadow-[0_18px_36px_-16px_rgba(43,39,36,0.55)]"
      style={{ width: size, height: size }}
    >
      <Image
        src={room.src}
        alt=""
        fill
        sizes={`${size}px`}
        quality={78}
        style={{ objectFit: 'cover', objectPosition: `${cx0}% ${cy0}%`, transform: `scale(${zoom})` }}
      />
    </div>
  );
}

/** The panel shell every card-based object sits inside. */
export function Panel({ children, className, glow }) {
  return (
    <div
      className={cx(
        'relative mx-auto w-[92%] max-w-lg rounded-[6px] bg-cream/97 px-7 pb-9 pt-8 shadow-[0_40px_90px_-30px_rgba(43,39,36,0.6)] sm:px-10 sm:pt-10',
        className
      )}
      style={{
        boxShadow: glow
          ? `0 40px 90px -30px rgba(43,39,36,0.6), 0 0 60px -10px ${glow}`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function PanelTitle({ children }) {
  return (
    <h3 className="mt-5 text-center font-serif text-h3 font-light text-ink sm:text-h2">
      {children}
    </h3>
  );
}

export function PanelIntro({ children }) {
  return (
    <p className="mx-auto mt-4 max-w-[38ch] text-center text-lead text-muted">{children}</p>
  );
}

/** A staggering list wrapper — pass `as="ul"`. */
export function CardList({ children, className }) {
  return <ul className={cx('mt-7 flex flex-col gap-5', className)}>{children}</ul>;
}

export function Card({ title, body, emoji, index = 0, reduced }) {
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DUR.entrance, ease: EASE, delay: reduced ? 0 : index * 0.07 }}
      className="flex items-start gap-3.5"
    >
      <span className="mt-0.5 shrink-0 text-gold" aria-hidden>
        {emoji ?? <SparkleIcon className="h-[18px] w-[18px]" />}
      </span>
      <span>
        <span className="block font-serif text-lg font-light text-ink">{title}</span>
        {body && <span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span>}
      </span>
    </motion.li>
  );
}

export function IncludedList({ heading, items }) {
  return (
    <div className="mt-8 border-t border-sand pt-6 text-center">
      <p className="text-eyebrow uppercase tracking-[0.16em] text-gold">{heading}</p>
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted">
            ✓ {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PanelQuote({ children }) {
  return (
    <p className="mt-8 border-t border-sand pt-6 text-center font-script text-xl leading-snug text-gold sm:text-2xl">
      {children}
    </p>
  );
}
