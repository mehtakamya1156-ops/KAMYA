'use client';

import { cx } from '@/components/ui';
import { StarIcon } from '@/components/icons';

/**
 * The illustrated review card — a handmade cotton-paper page, not a UI
 * component. Thin single-stroke gold border (not the thick ornate brass
 * molding used for the Doors — this wants to feel delicate, hand-drawn),
 * a small gold quote mark, and nothing else: no photo, no avatar. Per the
 * brief, the words are the hero.
 */
export default function ReviewCard({ item, className }) {
  return (
    <div
      className={cx(
        'paper-card relative mx-auto flex w-[min(26rem,86vw)] flex-col items-center gap-5 rounded-[6px] px-8 py-10 text-center sm:px-10 sm:py-12',
        'shadow-[0_30px_60px_-30px_rgba(120,95,70,0.35)]',
        className
      )}
      style={{ border: '1px solid #c9a66b' }}
    >
      <span aria-hidden className="font-serif text-[2.75rem] leading-none text-[#c9a66b]">
        &ldquo;
      </span>

      <blockquote className="text-pretty font-serif text-[1.2rem] font-light leading-relaxed text-[#453b2e] sm:text-[1.35rem]">
        {item.quote}
      </blockquote>

      <div className="flex gap-1 text-[#c9a66b]" aria-label={`${item.rating} out of 5 stars`}>
        {Array.from({ length: item.rating }).map((_, i) => (
          <StarIcon key={i} className="h-3.5 w-3.5" />
        ))}
      </div>

      <div>
        <p className="font-serif text-[1.05rem] font-light text-[#453b2e]">{item.name}</p>
        <p className="mt-0.5 text-eyebrow uppercase tracking-[0.2em] text-[#9c8f74]">
          {item.event}
        </p>
      </div>
    </div>
  );
}
