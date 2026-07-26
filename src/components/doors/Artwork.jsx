'use client';

/**
 * The French doors' printed/carved detail, built as vectors so it can be lit
 * and hinged as a real object rather than shown as a picture — same approach
 * as `envelope/Artwork.jsx`. Everything reads through a light edge and a
 * shadow edge (an emboss pair), never through flat colour.
 */

/** Raised panel molding — the classic French-door inset rectangle, carved
 * into the wood rather than drawn on top of it. */
export function DoorMolding({ className }) {
  return (
    <svg viewBox="0 0 200 320" className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <filter id="molding-emb" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.4" stdDeviation="0.6" floodColor="#3a2716" floodOpacity="0.55" />
          <feDropShadow dx="-0.8" dy="-1" stdDeviation="0.5" floodColor="#f2d9ae" floodOpacity="0.5" />
        </filter>
      </defs>
      <rect
        x="16"
        y="16"
        width="168"
        height="288"
        rx="4"
        filter="url(#molding-emb)"
        fill="none"
        stroke="#6b4a2c"
        strokeWidth="2.4"
      />
      <rect
        x="28"
        y="28"
        width="144"
        height="264"
        rx="3"
        filter="url(#molding-emb)"
        fill="none"
        stroke="#6b4a2c"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** Brass lever handle with a small escutcheon plate behind it. */
export function BrassHandle({ className }) {
  return (
    <svg viewBox="0 0 40 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="brass-handle-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9c98a" />
          <stop offset="28%" stopColor="#b8874c" />
          <stop offset="52%" stopColor="#f3dba8" />
          <stop offset="76%" stopColor="#a9793f" />
          <stop offset="100%" stopColor="#dab077" />
        </linearGradient>
        <filter id="brass-emb" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0.6" dy="0.9" stdDeviation="0.7" floodColor="#5c3f22" floodOpacity="0.5" />
          <feDropShadow dx="-0.5" dy="-0.6" stdDeviation="0.5" floodColor="#fdecc9" floodOpacity="0.7" />
        </filter>
      </defs>
      {/* escutcheon plate */}
      <rect x="10" y="4" width="20" height="92" rx="6" fill="url(#brass-handle-2)" opacity="0.9" filter="url(#brass-emb)" />
      {/* lever */}
      <rect x="6" y="38" width="28" height="11" rx="5.5" fill="url(#brass-handle-2)" filter="url(#brass-emb)" />
      <circle cx="20" cy="43.5" r="4.2" fill="url(#brass-handle-2)" filter="url(#brass-emb)" />
    </svg>
  );
}

/** Small decorative hinge plate — two screw heads and a knuckle barrel. */
export function BrassHingePlate({ className, flip }) {
  return (
    <svg
      viewBox="0 0 26 84"
      className={className}
      aria-hidden
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <defs>
        <linearGradient id={`hinge-g${flip ? 'b' : 'a'}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a613a" />
          <stop offset="30%" stopColor="#e9c98a" />
          <stop offset="55%" stopColor="#b8874c" />
          <stop offset="100%" stopColor="#efd6a4" />
        </linearGradient>
        <filter id={`hinge-emb${flip ? 'b' : 'a'}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.5" floodColor="#4d341c" floodOpacity="0.55" />
          <feDropShadow dx="-0.4" dy="-0.5" stdDeviation="0.4" floodColor="#fdecc9" floodOpacity="0.7" />
        </filter>
      </defs>
      <rect
        x="4"
        y="2"
        width="18"
        height="80"
        rx="3"
        fill={`url(#hinge-g${flip ? 'b' : 'a'})`}
        filter={`url(#hinge-emb${flip ? 'b' : 'a'})`}
      />
      <rect x="0" y="6" width="6" height="72" rx="3" fill={`url(#hinge-g${flip ? 'b' : 'a'})`} filter={`url(#hinge-emb${flip ? 'b' : 'a'})`} />
      <circle cx="13" cy="16" r="1.8" fill="#6b4a2c" opacity="0.7" />
      <circle cx="13" cy="68" r="1.8" fill="#6b4a2c" opacity="0.7" />
    </svg>
  );
}

/** A delicate laurel crest wrapping a small monogram, centred above the
 * doors — the same emboss language as the Letter's `Monogram`/`FloralCorner`. */
export function CrestMotif({ className }) {
  return (
    <svg viewBox="0 0 160 90" className={className} aria-hidden>
      <defs>
        <filter id="crest-emb" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.6" dy="0.8" stdDeviation="0.4" floodColor="#7d5a34" floodOpacity="0.5" />
          <feDropShadow dx="-0.5" dy="-0.6" stdDeviation="0.3" floodColor="#fff6e6" floodOpacity="0.85" />
        </filter>
      </defs>
      <g filter="url(#crest-emb)" fill="none" stroke="#d8c19a" strokeWidth="1" strokeLinecap="round">
        <path d="M40 78 C 30 60, 32 40, 46 22" />
        <path d="M120 78 C 130 60, 128 40, 114 22" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`l${i}`}>
            <ellipse
              cx={41 - i * 1.4}
              cy={70 - i * 11}
              rx="3.4"
              ry="1.8"
              transform={`rotate(${-58 + i * 9} ${41 - i * 1.4} ${70 - i * 11})`}
            />
            <ellipse
              cx={119 + i * 1.4}
              cy={70 - i * 11}
              rx="3.4"
              ry="1.8"
              transform={`rotate(${58 - i * 9} ${119 + i * 1.4} ${70 - i * 11})`}
            />
          </g>
        ))}
      </g>
      <text
        x="80"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="34"
        fontWeight="300"
        fill="#e6d3ae"
        filter="url(#crest-emb)"
      >
        K
      </text>
    </svg>
  );
}
