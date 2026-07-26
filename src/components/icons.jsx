/**
 * Inline SVG icon set. One visual language: 24px box, 1.5 stroke, round caps,
 * currentColor. No icon library ships to the browser and no emoji is ever used
 * as an interface element.
 *
 * Decorative by default (aria-hidden). Pass a `title` to make one meaningful.
 */

function Svg({ title, children, strokeWidth = 1.5, fill = 'none', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/* --- Interface ---------------------------------------------------- */

export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M3.5 7.5h17M3.5 12.5h17M3.5 17.5h11" />
  </Svg>
);

export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const ArrowDownIcon = (p) => (
  <Svg {...p}>
    <path d="M12 4.5v15M6 13.5l6 6 6-6" />
  </Svg>
);

export const ArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 12h15M13 5.5l6.5 6.5L13 18.5" />
  </Svg>
);

export const ChevronLeftIcon = (p) => (
  <Svg {...p}>
    <path d="M15 5.5L8.5 12l6.5 6.5" />
  </Svg>
);

export const ChevronRightIcon = (p) => (
  <Svg {...p}>
    <path d="M9 5.5L15.5 12 9 18.5" />
  </Svg>
);

export const StarIcon = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 2.6l2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 20.7l-5.6 3.4 1.3-6.3-4.8-4.3 6.4-.7L12 2.6z" />
  </Svg>
);

export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Svg>
);

export const QuoteIcon = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M9.6 6.2c-3 1.5-4.8 4-4.8 7.2 0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.4 0-1.9-1.4-3.3-3.2-3.3-.3 0-.6 0-.8.1.4-1.4 1.5-2.6 3-3.4l-1.5-1.6zm9 0c-3 1.5-4.8 4-4.8 7.2 0 2.6 1.6 4.4 3.8 4.4 2 0 3.5-1.5 3.5-3.4 0-1.9-1.4-3.3-3.2-3.3-.3 0-.6 0-.8.1.4-1.4 1.5-2.6 3-3.4l-1.5-1.6z" />
  </Svg>
);

/* --- Contact ------------------------------------------------------ */

export const WhatsAppIcon = (p) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.35-1.4a9.8 9.8 0 004.69 1.2h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2zm0 17.96h-.01a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.09.81.83-3.02-.2-.31a8.15 8.15 0 01-1.25-4.35c0-4.52 3.68-8.19 8.19-8.19a8.19 8.19 0 018.18 8.2c0 4.51-3.67 8.18-8.19 8.18zm4.49-6.13c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.57.21-1.06.15-1.17-.06-.1-.23-.16-.48-.29z" />
  </Svg>
);

export const InstagramIcon = (p) => (
  <Svg {...p}>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
  </Svg>
);

export const PhoneIcon = (p) => (
  <Svg {...p}>
    <path d="M6.3 3.5h3l1.5 3.8-2 1.4a11.5 11.5 0 005.5 5.5l1.4-2 3.8 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.3 5.7a2 2 0 012-2.2z" />
  </Svg>
);

export const PinIcon = (p) => (
  <Svg {...p}>
    <path d="M12 21.2s7-5.6 7-10.7a7 7 0 10-14 0c0 5.1 7 10.7 7 10.7z" />
    <circle cx="12" cy="10.4" r="2.6" />
  </Svg>
);

/* --- Inclusions --------------------------------------------------- */

export const SparkleIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l1.9 5.3L19.2 10l-5.3 1.9L12 17.2l-1.9-5.3L4.8 10l5.3-1.7L12 3z" />
    <path d="M18.4 16.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" />
  </Svg>
);

export const HairIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2.8a6.5 6.5 0 00-6.5 6.5c0 3.4-.9 6.6-2 8.9 2.4-.6 3.9-1.9 4.7-3.2" />
    <path d="M12 2.8a6.5 6.5 0 016.5 6.5c0 3.4.9 6.6 2 8.9-2.4-.6-3.9-1.9-4.7-3.2" />
    <path d="M9.4 18.4a3.4 3.4 0 005.2 0" />
  </Svg>
);

export const DrapeIcon = (p) => (
  <Svg {...p}>
    <path d="M3.5 4.5c3.6 0 3.6 2.6 7.2 2.6S14.3 4.5 17.9 4.5" />
    <path d="M3.5 4.5v10.9c0 2.6 3.8 4.6 8.5 4.6s8.5-2 8.5-4.6V4.5" />
    <path d="M6.6 8.6c2.6 1.5 8.2 1.5 10.8 0" />
  </Svg>
);

export const LashIcon = (p) => (
  <Svg {...p}>
    <path d="M2.8 13.6c2.4-4 5.6-6 9.2-6s6.8 2 9.2 6" />
    <path d="M5 10.8L3.4 8.2M9 8.9L8.2 6M12 8.4V5.3M15 8.9l.8-2.9M19 10.8l1.6-2.6" />
    <circle cx="12" cy="14.2" r="2.4" />
  </Svg>
);

export const LensIcon = (p) => (
  <Svg {...p}>
    <path d="M2.6 12S6.3 5.9 12 5.9 21.4 12 21.4 12 17.7 18.1 12 18.1 2.6 12 2.6 12z" />
    <circle cx="12" cy="12" r="3.1" />
  </Svg>
);

export const JewelIcon = (p) => (
  <Svg {...p}>
    <path d="M7.6 3.6h8.8l3.4 5-7.8 11.8L4.2 8.6l3.4-5z" />
    <path d="M4.2 8.6h15.6M9.4 8.6L12 20.4l2.6-11.8M7.6 3.6l1.8 5M16.4 3.6l-1.8 5" />
  </Svg>
);

export const KitIcon = (p) => (
  <Svg {...p}>
    <rect x="3.2" y="7.6" width="17.6" height="12.6" rx="2.2" />
    <path d="M9 7.6V5.4a1.8 1.8 0 011.8-1.8h2.4A1.8 1.8 0 0115 5.4v2.2" />
    <path d="M3.2 12.4h17.6M12 10.6v3.6" />
  </Svg>
);

/** Lookup used by the Inclusions data. */
export const INCLUSION_ICONS = {
  sparkle: SparkleIcon,
  hair: HairIcon,
  drape: DrapeIcon,
  lash: LashIcon,
  lens: LensIcon,
  jewel: JewelIcon,
  kit: KitIcon,
};
