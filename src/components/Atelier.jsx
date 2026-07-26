'use client';

import { cx } from '@/components/ui';

/**
 * The atelier — the single physical room the Letter and the Portfolio Album
 * both sit in. Sharing this component is what makes the two sections read as
 * two photographs taken in the same space rather than two web sections: the
 * same plaster, the same window, the same botanicals, the same dust.
 *
 * Nothing here is decorative gradient-for-its-own-sake; every layer stands in
 * for a real material. All ambient motion stops under prefers-reduced-motion.
 */

/** Baby's-breath sprigs — used both as the real stems and as their shadow. */
export function Sprigs({ className, opacity = 1 }) {
  const dots = [
    [18, 44], [30, 30], [42, 52], [26, 62], [52, 26], [64, 46], [38, 14],
    [72, 66], [14, 22], [58, 70], [46, 38], [82, 34], [24, 78], [66, 18],
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ opacity }} aria-hidden>
      <g stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.75">
        <path d="M8 96 C 22 74, 30 52, 34 16" />
        <path d="M8 96 C 30 80, 48 62, 62 34" />
        <path d="M8 96 C 18 68, 20 40, 16 18" />
        <path d="M8 96 C 34 84, 60 72, 84 56" />
      </g>
      <g fill="currentColor">
        {dots.map(([cx1, cy], i) => (
          <circle key={i} cx={cx1} cy={cy} r={i % 3 === 0 ? 2.1 : 1.4} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The room. `viewpoint` shifts the composition without changing the space —
 * 'wall' looks straight at it (the Letter), 'lower' is the same room seen a
 * little further down, where the consultation table sits (the Album).
 */
export function Atelier({ reduced, viewpoint = 'wall' }) {
  const lower = viewpoint === 'lower';

  const motes = [
    { l: '18%', t: '46%', d: '22s', delay: '0s', s: 3 },
    { l: '27%', t: '62%', d: '28s', delay: '4s', s: 2 },
    { l: '12%', t: '34%', d: '25s', delay: '9s', s: 2.5 },
    { l: '34%', t: '52%', d: '31s', delay: '2s', s: 2 },
    { l: '22%', t: '70%', d: '26s', delay: '13s', s: 3 },
    { l: '40%', t: '38%', d: '30s', delay: '7s', s: 1.8 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — plaster wall */}
      <div className="atelier-wall grain absolute inset-0" />

      {/* 2 — morning sun from upper-left */}
      <div className="atelier-sun absolute inset-0" />

      {/* 3 — sheer silk drapery, upper-right */}
      <div
        className={cx(
          'absolute -right-[6%] blur-[2px]',
          lower ? '-top-[26%] h-[70%] w-[40%]' : '-top-[10%] h-[78%] w-[46%]',
          !reduced && 'atelier-silk'
        )}
        style={{
          background:
            'linear-gradient(104deg, rgba(255,252,245,0) 0%, rgba(255,251,242,0.62) 14%, rgba(233,217,195,0.34) 26%, rgba(255,252,246,0.66) 38%, rgba(226,208,184,0.3) 52%, rgba(255,253,248,0.6) 64%, rgba(231,214,190,0.26) 78%, rgba(255,252,246,0.5) 100%)',
          maskImage: 'radial-gradient(120% 100% at 100% 0%, #000 40%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(120% 100% at 100% 0%, #000 40%, transparent 78%)',
        }}
      />

      {/* 5 — botanical shadow projected on the wall */}
      <div
        className={cx(
          'absolute -left-[8%] text-[#b39a7a] blur-[6px]',
          lower ? '-top-[18%] h-[52%] w-[44%]' : 'top-[2%] h-[62%] w-[52%]',
          !reduced && 'atelier-botanical'
        )}
      >
        <Sprigs className="h-full w-full" opacity={0.34} />
      </div>

      {/* 4 — the baby's breath itself, very soft focus */}
      <div
        className={cx(
          'absolute -left-[4%] text-[#e6d7c0] blur-[3px]',
          lower ? '-top-[14%] h-[38%] w-[26%]' : 'top-[6%] h-[46%] w-[30%]'
        )}
      >
        <Sprigs className="h-full w-full" opacity={0.85} />
      </div>

      {/* 6 — dust, only where the light falls */}
      {!reduced &&
        motes.map((m, i) => (
          <span
            key={i}
            className="atelier-dust absolute rounded-full bg-[#fffaf0]"
            style={{
              left: m.l,
              top: m.t,
              width: m.s,
              height: m.s,
              boxShadow: '0 0 4px rgba(255,250,240,0.9)',
              '--dust-dur': m.d,
              '--dust-delay': m.delay,
            }}
          />
        ))}
    </div>
  );
}

/**
 * Handmade limestone slab. `height` lets the Letter show a thin ledge and the
 * Album show a full consultation tabletop — the same stone, seen from lower.
 */
export function Slab({ height = '26%' }) {
  const edge =
    'polygon(0% 10%, 6% 4%, 19% 8%, 33% 2%, 48% 7%, 63% 1%, 78% 6%, 91% 2%, 100% 8%, 100% 100%, 0% 100%)';
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{ height }}
    >
      <div
        className="atelier-stone grain absolute inset-x-0 bottom-0 top-[14px]"
        style={{ clipPath: edge }}
      />
      <div
        className="absolute inset-x-0 top-[10px] h-[16px] bg-[linear-gradient(180deg,rgba(255,252,244,0.9),rgba(255,250,238,0))]"
        style={{ clipPath: edge }}
      />
    </div>
  );
}
