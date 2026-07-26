# Makeup by Kamya Mehta

Bridal makeup artist website. Next.js 15 + Tailwind CSS v4 + Framer Motion.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing the site

**All copy, prices, FAQs, testimonials and photo captions live in one file:**
`src/lib/content.js`. You should almost never need to open a component to change
wording or a price.

**Photos** live in `public/images/`. To swap one, replace the file and update
the matching `w` / `h` values in `content.js` so the layout still reserves the
right space (this is what prevents the page from jumping while images load).

### Things worth changing soon

| What | Where |
|---|---|
| About Me photo — currently a client photo, not Kamya | `about.image` in `content.js` |
| Site URL for SEO tags and structured data | `SITE_URL` in `src/app/layout.jsx` |
| A real "brides styled" figure, if you want the stat | `about.stats` in `content.js` |

## How it's put together

```
src/
  app/
    layout.jsx      fonts, SEO metadata, JSON-LD structured data
    globals.css     design tokens — colours, type scale, spacing, easing
    page.jsx        section order
  components/
    ui.jsx          Section / Container / Heading / Button primitives
    Reveal.jsx      scroll-triggered entrances (animate once, never re-run)
    Field.jsx       form input with floating label
    icons.jsx       inline SVG icon set
    sections/       one file per section
  lib/
    content.js      ALL site copy and data
    motion.js       durations, easing, stagger — shared by every animation
```

### Design rules the code follows

- **One easing curve** site-wide (`--ease-signature`). Durations come from
  `lib/motion.js`, never hard-coded in components.
- **One spacing rhythm.** Sections use `--section-y`, gutters use `--gutter`.
  There are no ad-hoc section paddings.
- **Animations run once.** Every scroll reveal uses `viewport={{ once: true }}`,
  so nothing re-animates when you scroll back past it.
- **`prefers-reduced-motion` is respected** in two layers: components swap to
  static variants via `useReducedMotion`, and `globals.css` cancels the hero
  zoom and cue outright.
- **Colours were chosen by measuring contrast, not by eye.** The accent gold is
  deeper than a typical bridal gold because lighter values fail WCAG AA against
  the cream and shell backgrounds at the small label sizes used throughout.
- **Gold is for light surfaces only.** On the dark testimonials panel it drops
  below the contrast floor, so that section uses blush instead.

## Deploying

The site is fully static. The easiest route:

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, **Add New →
   Project**, pick the repo.
3. Set the **Root Directory** to `site` if you pushed the whole project folder.
4. Deploy. Vercel handles the image optimisation pipeline automatically.

Then point your domain at it and update `SITE_URL` in `src/app/layout.jsx`.
