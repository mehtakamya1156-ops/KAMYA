'use client';

import Image from 'next/image';
import { cx } from '@/components/ui';
import { StarIcon } from '@/components/icons';
import { FoilEdge, WaxSeal } from '@/components/envelope/Artwork';

/**
 * A single review, as a letter just pulled from the envelope — reusing the
 * site's existing envelope/wax-seal/paper visual language (`envelope-paper`,
 * `letter-paper`, `.grain`, `WaxSeal`, `FoilEdge`) rather than inventing a
 * new material system for this section.
 *
 * `item.image` is `null` until the client supplies real photos — the empty
 * state is a finished-looking placeholder (an initial in thin serif over a
 * warm paper tone), not a broken image, so nothing here needs to change
 * beyond setting `image` in content.js once real photos exist.
 *
 * Alternates between a wax seal (still resting beside the letter, as if just
 * broken open) and a foil-edged corner, purely for variety across the five
 * letters — both are the same existing assets, no new ones invented.
 */
export default function ReviewLetter({ item, size = 'small', variant = 'seal', className, style }) {
  const hero = size === 'hero';

  return (
    <div className={cx('relative', hero ? 'w-[13rem] sm:w-[15rem]' : 'w-[10rem] sm:w-[11.5rem]', className)} style={style}>
      {/* envelope, tucked behind the note */}
      <div
        className="envelope-paper grain absolute inset-x-[6%] bottom-0 top-[18%] rounded-b-[2px] rounded-t-[1px] shadow-[0_16px_34px_-20px_rgba(43,30,18,0.55)]"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 top-0 h-[38%]"
          style={{
            clipPath: 'polygon(0 0, 50% 62%, 100% 0)',
            background: 'linear-gradient(160deg, #f1e4d1 0%, #e2d0b6 100%)',
          }}
        />
        {variant === 'foil' && (
          <FoilEdge className="absolute inset-x-0 top-0 h-[38%] w-full opacity-90" />
        )}
      </div>

      {/* the wax seal, resting just beside the envelope as if freshly broken */}
      {variant === 'seal' && (
        <WaxSeal className="absolute -right-[8%] top-[10%] h-[2.4rem] w-[2.4rem] rotate-[8deg] drop-shadow-[0_6px_10px_rgba(43,30,18,0.35)]" />
      )}

      {/* the note itself */}
      <div className="letter-paper grain relative rounded-[2px] px-3.5 pb-4 pt-4 shadow-[0_20px_40px_-22px_rgba(43,30,18,0.5)] ring-1 ring-[#d8c19a]/40">
        <div className="flex items-start gap-2.5">
          {/* photo slot */}
          <div className={cx('relative shrink-0 overflow-hidden rounded-full bg-[#f1e3cb]', hero ? 'h-12 w-12' : 'h-10 w-10')}>
            {item.image ? (
              <Image
                src={item.image}
                alt={`${item.name}, ${item.event.toLowerCase()}`}
                fill
                sizes="3rem"
                quality={82}
                className="object-cover"
              />
            ) : (
              <div className="grain absolute inset-0 flex items-center justify-center bg-[radial-gradient(80%_70%_at_30%_20%,rgba(255,251,242,0.9),transparent_60%),linear-gradient(160deg,#f6ecda_0%,#e9d6b4_100%)]">
                <span aria-hidden className="font-serif text-lg font-light text-[#c7a877]">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-serif text-[0.98rem] font-light leading-none text-[#3c2c18]">{item.name}</p>
            <div className="mt-1 flex gap-[1px] text-[#b8874c]" aria-label={`${item.rating} out of 5 stars`}>
              {Array.from({ length: item.rating }).map((_, i) => (
                <StarIcon key={i} className="h-2.5 w-2.5" />
              ))}
            </div>
          </div>
        </div>

        <p
          className={cx(
            'mt-2.5 overflow-hidden text-pretty text-[0.76rem] leading-snug text-[#5c4a34]',
            hero ? 'line-clamp-5' : 'line-clamp-3'
          )}
        >
          {item.quote}
        </p>
      </div>
    </div>
  );
}
