'use client';

/**
 * The envelope's printed artwork, rebuilt as vectors so it stays crisp and can
 * be lit, folded and animated as a real object rather than shown as a picture.
 *
 * Everything here is tone-on-tone: the florals and monogram are *embossed*, so
 * they are read through a light edge and a shadow edge, never through colour.
 */

/** Delicate botanical spray embossed into the lower corners. */
export function FloralCorner({ className, flip }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <defs>
        {/* Emboss = a light offset copy under a dark offset copy. */}
        <filter id={`emb${flip ? 'b' : 'a'}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.6" dy="0.7" stdDeviation="0.3" floodColor="#b99a72" floodOpacity="0.5" />
          <feDropShadow dx="-0.5" dy="-0.6" stdDeviation="0.25" floodColor="#fffaf2" floodOpacity="0.95" />
        </filter>
      </defs>
      <g
        filter={`url(#emb${flip ? 'b' : 'a'})`}
        fill="none"
        stroke="#e5d5bd"
        strokeWidth="0.9"
        strokeLinecap="round"
      >
        {/* main stems */}
        <path d="M6 118 C 20 92, 26 66, 30 30" />
        <path d="M6 118 C 26 100, 48 84, 74 66" />
        <path d="M6 118 C 14 88, 12 58, 6 34" />
        <path d="M6 118 C 30 104, 56 96, 88 90" />
        {/* leaves along the stems */}
        {[
          [28, 44], [31, 62], [26, 78], [14, 62], [10, 80], [46, 92],
          [62, 84], [40, 100], [70, 96], [22, 96],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i * 37) % 360})`}>
            <path d="M0 0 c 4 -5, 9 -2, 5 4 c -2 3, -6 2, -5 -4 z" />
          </g>
        ))}
        {/* small blooms */}
        {[
          [30, 26], [8, 30], [78, 62], [92, 86], [52, 88], [66, 76],
        ].map(([x, y], i) => (
          <g key={`f${i}`} transform={`translate(${x} ${y})`}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} rx="1.6" ry="3.4" transform={`rotate(${a}) translate(0 -3.2)`} />
            ))}
            <circle r="1" fill="#e5d5bd" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** The KM monogram — overlapping serif capitals, pressed into the cotton. */
export function Monogram({ className }) {
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <defs>
        <filter id="mono-emb" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="1.1" dy="1.4" stdDeviation="0.8" floodColor="#b1916a" floodOpacity="0.55" />
          <feDropShadow dx="-0.9" dy="-1.1" stdDeviation="0.6" floodColor="#fffcf6" floodOpacity="0.95" />
        </filter>
      </defs>
      <g filter="url(#mono-emb)" fill="#efe2cd">
        <text
          x="62"
          y="84"
          textAnchor="middle"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize="96"
          fontWeight="300"
        >
          K
        </text>
        <text
          x="126"
          y="96"
          textAnchor="middle"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontSize="104"
          fontWeight="300"
          opacity="0.92"
        >
          M
        </text>
      </g>
    </svg>
  );
}

/**
 * Rose-gold wax seal: irregular poured edge, domed body, and an embossed
 * makeup-brush trio inside a laurel. Light only catches the upper-left, the
 * same window the whole room is lit by.
 */
export function WaxSeal({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax-body" cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#f4d3b4" />
          <stop offset="42%" stopColor="#dfae86" />
          <stop offset="76%" stopColor="#c1875f" />
          <stop offset="100%" stopColor="#a06846" />
        </radialGradient>
        <radialGradient id="wax-well" cx="50%" cy="52%" r="52%">
          <stop offset="0%" stopColor="#b87b53" />
          <stop offset="100%" stopColor="#d7a37b" />
        </radialGradient>
        <filter id="wax-emb" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.5" dy="0.7" stdDeviation="0.4" floodColor="#7d4c2f" floodOpacity="0.55" />
          <feDropShadow dx="-0.4" dy="-0.5" stdDeviation="0.3" floodColor="#ffe3c9" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* poured wax edge — deliberately irregular */}
      <path
        fill="url(#wax-body)"
        d="M50 3 c 11 0, 14 5, 22 8 c 8 3, 14 2, 17 11 c 3 9, -2 13, -1 22 c 1 9, 6 13, 1 21 c -5 8, -12 6, -19 11 c -7 5, -9 11, -19 11 c -10 0, -13 -6, -21 -10 c -8 -4, -15 -3, -19 -11 c -4 -8, 1 -13, 0 -22 c -1 -9, -5 -13, -1 -21 c 4 -8, 11 -8, 18 -12 c 7 -4, 11 -8, 22 -8 z"
      />
      {/* pressed well */}
      <ellipse cx="50" cy="51" rx="33" ry="32" fill="url(#wax-well)" opacity="0.85" />
      {/* specular from the window */}
      <ellipse cx="36" cy="30" rx="18" ry="13" fill="#ffe7cf" opacity="0.34" transform="rotate(-24 36 30)" />

      <g filter="url(#wax-emb)" stroke="#f6ddc4" strokeWidth="1.5" fill="none" strokeLinecap="round">
        {/* laurel */}
        <path d="M27 62 c -3 -12, 1 -22, 7 -28" />
        <path d="M73 62 c 3 -12, -1 -22, -7 -28" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <ellipse cx={28 + i * 1.6} cy={58 - i * 7} rx="3.1" ry="1.7" transform={`rotate(${-52 + i * 8} ${28 + i * 1.6} ${58 - i * 7})`} />
            <ellipse cx={72 - i * 1.6} cy={58 - i * 7} rx="3.1" ry="1.7" transform={`rotate(${52 - i * 8} ${72 - i * 1.6} ${58 - i * 7})`} />
          </g>
        ))}
        {/* three brushes */}
        <g strokeWidth="1.7">
          <path d="M42 66 L 39 40" />
          <path d="M50 68 L 50 38" />
          <path d="M58 66 L 61 40" />
        </g>
        <g strokeWidth="1.2" fill="#f6ddc4">
          <path d="M39 40 c -2.6 -5, -1 -9, 1.4 -9 c 2.4 0, 3.6 4, 1.6 9 z" />
          <path d="M50 38 c -2.8 -5.5, -1 -10, 1.5 -10 c 2.4 0, 3.4 4.5, 1.3 10 z" transform="translate(-1.4 0)" />
          <path d="M61 40 c 2.6 -5, 1 -9, -1.4 -9 c -2.4 0, -3.6 4, -1.6 9 z" />
        </g>
      </g>
    </svg>
  );
}

/**
 * The gold-foil hairline that traces the flap's two diagonals. Rendered as a
 * stroked path with a metallic gradient so it reads as foil, not as a border.
 */
export function FoilEdge({ className }) {
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#c69663" />
          <stop offset="22%" stopColor="#f0cfa4" />
          <stop offset="38%" stopColor="#b8834f" />
          <stop offset="55%" stopColor="#f7dcb5" />
          <stop offset="72%" stopColor="#bd8a56" />
          <stop offset="100%" stopColor="#e2bb8a" />
        </linearGradient>
      </defs>
      {/* soft shadow under the foil so it sits in the paper */}
      <path
        d="M2 2 L150 122 L298 2"
        fill="none"
        stroke="#a9825a"
        strokeWidth="2.6"
        strokeOpacity="0.28"
        transform="translate(0 1.6)"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M2 2 L150 122 L298 2"
        fill="none"
        stroke="url(#foil)"
        strokeWidth="1.9"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
