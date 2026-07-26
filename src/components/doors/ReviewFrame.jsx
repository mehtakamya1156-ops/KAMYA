'use client';

import Image from 'next/image';
import { cx } from '@/components/ui';
import { StarIcon } from '@/components/icons';

/**
 * A single review, framed like a small photograph hung just inside the
 * doors. All five frames use this same component — only size/position/
 * rotation differ per instance (set by the parent), which is what keeps a
 * five-item gallery from reading as five different bespoke builds.
 *
 * `item.image` is `null` until the client supplies real photos — the empty
 * state is a deliberate, finished-looking placeholder (soft warm gradient,
 * grain, an initial in thin serif) rather than a broken image or empty box,
 * so nothing needs to change here when she drops real photos in beyond
 * setting `image` in content.js.
 */
export default function ReviewFrame({ item, size = 'small', className, style }) {
  const hero = size === 'hero';

  return (
    <figure
      className={cx(
        'pointer-events-auto flex flex-col overflow-hidden rounded-[2px] bg-[#fffaf1] shadow-[0_22px_44px_-24px_rgba(43,30,18,0.5)]',
        'ring-1 ring-[#d8c19a]/50',
        hero ? 'w-[13.5rem] sm:w-[15.5rem]' : 'w-[10.5rem] sm:w-[12rem]',
        className
      )}
      style={style}
    >
      {/* ---------- Photo slot ---------- */}
      <div className={cx('relative w-full overflow-hidden bg-[#f1e3cb]', hero ? 'aspect-[4/5]' : 'aspect-square')}>
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name}, ${item.event.toLowerCase()}`}
            fill
            sizes={hero ? '16rem' : '12rem'}
            quality={82}
            className="object-cover"
          />
        ) : (
          <div className="grain absolute inset-0 flex items-center justify-center bg-[radial-gradient(80%_70%_at_30%_20%,rgba(255,251,242,0.9),transparent_60%),linear-gradient(160deg,#f6ecda_0%,#e9d6b4_100%)]">
            <span
              aria-hidden
              className="font-serif text-[3rem] font-light text-[#c7a877] opacity-70 sm:text-[3.6rem]"
            >
              {item.name.charAt(0)}
            </span>
          </div>
        )}
        {/* thin inner frame line, like a photo mounted under glass */}
        <span aria-hidden className="pointer-events-none absolute inset-1 rounded-[1px] ring-1 ring-white/40" />
      </div>

      {/* ---------- Caption ---------- */}
      <figcaption className="flex flex-1 flex-col gap-1.5 px-3.5 pb-4 pt-3">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[1.05rem] font-light leading-none text-[#3c2c18] sm:text-[1.15rem]">
            {item.name}
          </p>
          <div className="flex gap-[1px] text-[#b8874c]" aria-label={`${item.rating} out of 5 stars`}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <StarIcon key={i} className="h-3 w-3" />
            ))}
          </div>
        </div>
        <p
          className={cx(
            'overflow-hidden text-pretty text-[0.8rem] leading-snug text-[#5c4a34]',
            hero ? 'line-clamp-4' : 'line-clamp-3'
          )}
        >
          {item.quote}
        </p>
      </figcaption>
    </figure>
  );
}
