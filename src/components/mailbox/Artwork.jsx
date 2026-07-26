'use client';

/**
 * The letterbox's static shell — vectors, not a photo, so it can sit behind
 * the animated door and cast/receive shadows like a real object. Same
 * approach as `envelope/Artwork.jsx` and `doors/Artwork.jsx`: everything
 * reads through a light edge and a dark edge (an emboss pair), never flat
 * colour.
 */

/** The housing + post. The door itself is a separate animated element in
 * `ReviewLetterbox.jsx` so it can hinge independently — this is everything
 * that stays still. */
export function MailboxBody({ className }) {
  return (
    <svg viewBox="0 0 140 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="mailbox-metal-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a3826" />
          <stop offset="24%" stopColor="#6b5138" />
          <stop offset="50%" stopColor="#382a1c" />
          <stop offset="76%" stopColor="#5a4430" />
          <stop offset="100%" stopColor="#2e2216" />
        </linearGradient>
        <linearGradient id="mailbox-post" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#33261a" />
          <stop offset="50%" stopColor="#5a4430" />
          <stop offset="100%" stopColor="#291f14" />
        </linearGradient>
        <filter id="mailbox-emb" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.8" dy="1.2" stdDeviation="0.6" floodColor="#20160c" floodOpacity="0.55" />
          <feDropShadow dx="-0.6" dy="-0.8" stdDeviation="0.5" floodColor="#c9a877" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* housing — rounded tunnel top over a rectangular body */}
      <path
        d="M8 54 C 8 22, 30 4, 70 4 C 110 4, 132 22, 132 54 L 132 128 L 8 128 Z"
        fill="url(#mailbox-metal-body)"
        filter="url(#mailbox-emb)"
      />
      {/* small ridge where the door sits, for depth */}
      <rect x="8" y="122" width="124" height="6" fill="#231a10" opacity="0.5" />

      {/* post */}
      <rect x="58" y="128" width="24" height="78" fill="url(#mailbox-post)" filter="url(#mailbox-emb)" />
      {/* post cap / cross brace */}
      <rect x="40" y="128" width="60" height="8" rx="2" fill="url(#mailbox-post)" filter="url(#mailbox-emb)" />
    </svg>
  );
}

/** Small brass monogram plate, mounted above the door. */
export function BrassPlate({ className }) {
  return (
    <svg viewBox="0 0 60 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="mailbox-brass-plate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9c98a" />
          <stop offset="30%" stopColor="#b8874c" />
          <stop offset="55%" stopColor="#f3dba8" />
          <stop offset="100%" stopColor="#a9793f" />
        </linearGradient>
        <filter id="mailbox-plate-emb" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.5" dy="0.8" stdDeviation="0.4" floodColor="#5c3f22" floodOpacity="0.5" />
          <feDropShadow dx="-0.4" dy="-0.5" stdDeviation="0.3" floodColor="#fdecc9" floodOpacity="0.7" />
        </filter>
      </defs>
      <rect x="1" y="1" width="58" height="30" rx="3" fill="url(#mailbox-brass-plate)" filter="url(#mailbox-plate-emb)" />
      <text
        x="30"
        y="22"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="15"
        fontWeight="500"
        letterSpacing="2"
        fill="#5c3f22"
      >
        KM
      </text>
    </svg>
  );
}

/** The little side flag — mostly decorative, static. */
export function BrassFlag({ className }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden>
      <defs>
        <linearGradient id="mailbox-flag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a2f3a" />
          <stop offset="50%" stopColor="#7a2e3b" />
          <stop offset="100%" stopColor="#5c1f28" />
        </linearGradient>
        <filter id="mailbox-flag-emb" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0.5" dy="0.7" stdDeviation="0.4" floodColor="#2e0f14" floodOpacity="0.5" />
          <feDropShadow dx="-0.4" dy="-0.5" stdDeviation="0.3" floodColor="#c99aa0" floodOpacity="0.5" />
        </filter>
      </defs>
      <rect x="16" y="0" width="5" height="60" fill="#3a2c1e" />
      <path d="M21 4 L 40 14 L 21 24 Z" fill="url(#mailbox-flag)" filter="url(#mailbox-flag-emb)" />
    </svg>
  );
}
