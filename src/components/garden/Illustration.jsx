'use client';

/**
 * The Garden Gate's illustrated world — everything here is deliberately flat
 * and painterly rather than photographed or tactile-real (unlike the paper/
 * brass system used for the Letter, Doors and Mailbox elsewhere on the
 * site). The "watercolor" feel comes from layering soft, slightly irregular
 * blurred colour washes *underneath* crisp thin line art — ink over a stain,
 * not a texture photograph.
 */

const INK = '#9c8f74'; // muted sage-taupe line colour, never black
const GOLD = '#c9a66b'; // the site's existing champagne accent

/** A soft rose-and-leaf cluster — reused on the gate posts and archway. */
export function FloralCluster({ className, tone = 'blush' }) {
  const wash = tone === 'blush' ? '#e7b9b0' : '#a9b79a';
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden>
      <defs>
        <filter id={`fc-blur-${tone}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>
      {/* watercolor wash, underneath */}
      <g filter={`url(#fc-blur-${tone})`} opacity="0.55">
        <ellipse cx="34" cy="30" rx="20" ry="16" fill={wash} />
        <ellipse cx="52" cy="48" rx="16" ry="13" fill="#c9a66b" opacity="0.4" />
      </g>
      {/* thin ink line-work on top */}
      <g fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" opacity="0.8">
        <path d="M20 58 C 26 44, 30 30, 28 16" />
        <path d="M28 16 c 3 -6, 10 -6, 11 0 c 1 6, -6 9, -11 0 z" />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="40" cy="24" rx="6.5" ry="3.4" transform={`rotate(${a} 40 24)`} />
        ))}
        <circle cx="40" cy="24" r="2" fill={GOLD} stroke="none" />
        <path d="M24 40 c -5 2, -6 8, -1 9 c 5 1, 7 -6, 1 -9 z" />
        <path d="M22 50 c -5 1, -7 7, -2 8.5 c 5 1.5, 8 -6, 2 -8.5 z" />
      </g>
    </svg>
  );
}

/**
 * One gate panel — thin illustrated scrollwork, hinged at its outer edge by
 * the parent (same `rotateY` mechanic already used for the Doors/Mailbox,
 * just applied to line art instead of a solid painted surface).
 */
export function GateIllustration({ className, side = 'left', style }) {
  const flip = side === 'right';
  return (
    <svg
      viewBox="0 0 120 320"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
      style={{ ...(flip ? { transform: 'scaleX(-1)' } : null), ...style }}
    >
      <defs>
        <filter id={`gate-wash-${side}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* soft stain behind the ironwork */}
      <g filter={`url(#gate-wash-${side})`} opacity="0.4">
        <ellipse cx="60" cy="90" rx="46" ry="70" fill="#e7b9b0" />
        <ellipse cx="70" cy="230" rx="40" ry="66" fill="#a9b79a" opacity="0.7" />
      </g>

      {/* frame */}
      <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
        <line x1="10" y1="6" x2="10" y2="314" />
        <line x1="108" y1="6" x2="108" y2="314" />
        <path d="M10 6 C 30 -6, 88 -6, 108 6" />
        <line x1="10" y1="60" x2="108" y2="60" />
        <line x1="10" y1="260" x2="108" y2="260" />
      </g>

      {/* scrollwork — simple organic C/S curves, not a dense lattice */}
      <g fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path d="M20 80 C 40 90, 40 110, 20 120 C 40 130, 40 150, 20 160" />
        <path d="M98 80 C 78 90, 78 110, 98 120 C 78 130, 78 150, 98 160" />
        <path d="M20 180 C 40 190, 40 210, 20 220 C 40 230, 40 250, 20 250" />
        <path d="M98 180 C 78 190, 78 210, 98 220 C 78 230, 78 250, 98 250" />
        <path d="M40 60 C 55 100, 55 220, 40 260" />
        <path d="M78 60 C 63 100, 63 220, 78 260" />
      </g>

      {/* small rosette at the top join, echoing FloralCluster's rosette motif
          directly in-line (a true nested <svg> would need its own x/y/width
          viewport, more trouble than it's worth for one small motif) */}
      <g fill="none" stroke={INK} strokeWidth="1.1" opacity="0.8">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="59" cy="20" rx="5.5" ry="2.8" transform={`rotate(${a} 59 20)`} />
        ))}
        <circle cx="59" cy="20" r="1.8" fill={GOLD} stroke="none" />
      </g>
    </svg>
  );
}

/**
 * The receding illustrated pathway — layered soft arches and a lit path
 * suggesting depth, built entirely from gradient washes (no photograph).
 */
export function ArchPathway({ className }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <radialGradient id="path-glow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff6ea" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#f3e3d3" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#e9d9c8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="path-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f6ecdf" />
          <stop offset="100%" stopColor="#efe1cd" />
        </linearGradient>
        <filter id="arch-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="400" height="300" fill="url(#path-sky)" />
      <rect width="400" height="300" fill="url(#path-glow)" />

      {/* three receding arches, softest and smallest furthest away */}
      {[
        { y: 250, w: 210, h: 230, o: 0.9 },
        { y: 210, w: 150, h: 175, o: 0.65 },
        { y: 180, w: 96, h: 122, o: 0.42 },
      ].map((a, i) => (
        <path
          key={i}
          d={`M ${200 - a.w / 2} ${a.y} V ${a.y - a.h + a.w / 2} A ${a.w / 2} ${a.w / 2} 0 0 1 ${200 + a.w / 2} ${a.y - a.h + a.w / 2} V ${a.y}`}
          fill="none"
          stroke="#b7a488"
          strokeWidth={5 - i}
          opacity={a.o}
          filter="url(#arch-soft)"
        />
      ))}

      {/* the lit path itself, tapering with perspective */}
      <path d="M 130 300 L 178 150 L 222 150 L 270 300 Z" fill="#fffaf0" opacity="0.55" filter="url(#arch-soft)" />

      {/* vine silhouettes climbing both sides */}
      <g fill="none" stroke="#93a382" strokeWidth="1.4" strokeLinecap="round" opacity="0.55">
        <path d="M20 300 C 10 220, 40 180, 24 110" />
        <path d="M380 300 C 390 220, 360 180, 376 110" />
      </g>
    </svg>
  );
}

/** A single soft floating petal — the particle system's only shape. */
export function Petal({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <ellipse cx="12" cy="12" rx="7" ry="10" fill="#e9c3bb" opacity="0.75" />
    </svg>
  );
}
