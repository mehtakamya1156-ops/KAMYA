/**
 * All site copy and data lives here.
 * Edit text, prices and photos in this file — components read from it.
 */

export const brand = {
  name: 'Makeup by Kamya Mehta',
  artist: 'Kamya Mehta',
  tagline: 'Timeless Bridal Makeup for Your Most Unforgettable Day',
  experience: '6+ years',
  phone: '+91 87080 86305',
  phoneRaw: '918708086305', // digits only — used for wa.me and tel: links
  instagramHandle: '@makeupbykamyamehta',
  instagramUrl: 'https://instagram.com/makeupbykamyamehta',
  serviceAreas: 'Delhi NCR & Destination Weddings',
};

/** Pre-filled WhatsApp message used by every "Enquire" button. */
export const whatsappUrl = `https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(
  "Hi Kamya! I found your website and I'd love to check your availability for my wedding."
)}`;

/* ---------------------------------------------------------------- */

export const hero = {
  eyebrow: 'Bridal Makeup Artist · Delhi NCR',
  headline: ['Timeless bridal makeup', 'for your most', 'unforgettable day'],
  subtext:
    'Soft-glam artistry for the bride who wants to look like the most radiant version of herself — never overdone.',
  subtextShort: 'Soft-glam artistry for the bride who wants to look entirely like herself.',
  // Credibility markers shown where the CTA buttons used to sit.
  stats: [
    { value: '6+', label: 'Years of experience' },
    { value: 'Delhi NCR', label: 'Based in' },
    { value: 'Destination', label: 'Weddings worldwide' },
  ],
};

/* ---------------------------------------------------------------- */

/**
 * The Bridal Suite — the signature interactive experience. One photographed
 * room, tapped objects reveal their content in place. No required order, no
 * hotspot pulses or "start here" prompt — the room itself should invite
 * curiosity through its own atmosphere.
 *
 * `hotspots[].box` is each object's tap region as a PERCENTAGE of the room
 * image — { x, y, w, h } where x/y is the top-left corner. Desktop and mobile
 * use two DIFFERENT photographs of the room (not one image cropped two ways —
 * candle, bouquet and jewellery-box positions all shift slightly between
 * them), so each hotspot carries its own box per breakpoint. These were
 * measured directly off the two images — if either photo is ever replaced,
 * every box below must be re-measured against the new file.
 */
export const bridalSuite = {
  eyebrow: 'Step Inside',
  heading: 'Before We Meet',
  // Mobile-only variant (see BridalSuite.jsx) — desktop keeps "Before We Meet".
  headingMobile: 'Take your time',
  intro:
    'The morning of the wedding, quietly. Tap whatever catches your eye — there is no right place to start.',
  // Mobile-only variant (see BridalSuite.jsx) — desktop keeps the copy above.
  introMobile: 'Every object reveals a different story. Which will you open first?',
  room: {
    // A single still life now supplies both breakpoints — the room stage's
    // dynamic cover-crop compensation (see `useCoverCrop`/`remapPercent` in
    // `BridalSuite.jsx`) already keeps hotspots accurate at any aspect
    // ratio, so desktop and mobile can safely share one photo and one set
    // of measured coordinates rather than needing two separate compositions.
    desktop: {
      src: '/images/bridal-suite/room-desktop.webp',
      w: 1536,
      h: 1024,
      alt: 'A sunlit wooden table with an embroidered bridal journal, a candle, and a wax-sealed envelope for the bride, softly lit beside dried flowers',
    },
    mobile: {
      src: '/images/bridal-suite/room-mobile.webp',
      w: 1122,
      h: 1402,
      alt: 'A sunlit wooden table with an embroidered bridal journal, a candle, and a wax-sealed envelope for the bride, softly lit beside dried flowers',
    },
  },
  /**
   * `zoom` and `veil` are per-object camera character — different scale,
   * pacing and light tint per §"CAMERA" (every object should feel like its
   * own cinematic move, not a copy-pasted zoom). The jewellery box and
   * wardrobe hotspots were removed along with the old room photo, which no
   * longer depicts them. Flowers is back (the vase in the new still life)
   * but mobile-only — see the `id !== 'flowers'` filter in BridalSuite.jsx.
   */
  hotspots: [
    {
      id: 'album',
      label: 'The bridal journal',
      desktop: { x: 14.0, y: 18.5, w: 47.0, h: 65.0 },
      // Measured against the new mobile-only portrait still life.
      mobile: { x: 9.0, y: 25.0, w: 47.0, h: 42.0 },
      zoom: { desktop: 2.2, mobile: 1.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      veil: 'rgba(28,26,23,0.35)',
    },
    {
      id: 'letter',
      label: 'A sealed letter',
      desktop: { x: 63.5, y: 34.0, w: 30.0, h: 34.0 },
      mobile: { x: 60.0, y: 32.0, w: 40.0, h: 24.0 },
      zoom: { desktop: 2.2, mobile: 1.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      veil: 'rgba(28,26,23,0.35)',
    },
    {
      id: 'candle',
      label: 'The candle',
      desktop: { x: 61.0, y: 5.5, w: 19.0, h: 27.0 },
      mobile: { x: 52.0, y: 5.0, w: 27.0, h: 26.0 },
      zoom: { desktop: 3.0, mobile: 2.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] },
      veil: 'rgba(90,55,20,0.45)',
    },
    {
      id: 'flowers',
      label: 'The flowers',
      desktop: { x: 0.0, y: 8.8, w: 21.5, h: 55.7 },
      mobile: { x: 0.0, y: 4.0, w: 26.0, h: 50.0 },
      zoom: { desktop: 2.0, mobile: 1.8, duration: 1.0, ease: [0.22, 1, 0.36, 1] },
      veil: 'rgba(120,80,80,0.3)',
    },
  ],
};

/* ---------------------------------------------------------------- */

/**
 * Card content for the four newer Bridal Suite objects. Copy is reproduced
 * exactly as specified — do not paraphrase the cards or the closing quotes.
 */
export const suiteContent = {
  jewellery: {
    title: 'Jewellery Styling',
    intro:
      "Luxury bridal makeup isn't just about makeup. It's about ensuring every detail comes together beautifully. Your jewellery plays an equally important role, which is why I personally help style and position everything before you walk out.",
    cards: [
      {
        title: 'Necklace Positioning',
        body: 'Making sure your necklace sits beautifully and complements your neckline.',
      },
      {
        title: 'Earrings Placement',
        body: 'Balanced comfortably for photographs.',
      },
      {
        title: 'Maang Tikka / Passa',
        body: 'Carefully aligned for perfect symmetry.',
      },
      {
        title: 'Jewellery Balance',
        body: 'Ensuring every jewellery piece complements your complete bridal look.',
      },
      {
        title: 'Neckline Coordination',
        body: "Helping style your jewellery according to your outfit's neckline.",
      },
    ],
    included: {
      heading: 'Included With Every Bridal Booking',
      items: ['Jewellery Styling', 'Jewellery Placement', 'Neckline Coordination'],
    },
    quote: 'Luxury is in the details—and every detail deserves attention.',
  },

  wardrobe: {
    title: 'Dressing The Bride',
    intro:
      "Once your makeup is complete, I don't simply pack my kit and leave. I stay with you to help bring your entire bridal look together, ensuring every detail feels polished, balanced and picture-perfect before you walk towards one of the most important moments of your life.",
    cards: [
      {
        title: 'Outfit Perfection',
        body: 'Every pleat, fold, sleeve and silhouette is carefully adjusted for an elegant finish.',
      },
      {
        title: 'Dupatta Balance',
        body: 'Your dupatta is beautifully arranged to frame your face while complementing your hairstyle and jewellery.',
      },
      {
        title: 'Veil Placement',
        body: "If you're wearing a veil, it's positioned gracefully for comfort and beautiful photographs.",
      },
      {
        title: 'Final Touch-Ups',
        body: 'A last check of your makeup before you step out, ensuring everything still looks fresh and flawless.',
      },
      {
        title: 'Complete Bridal Look',
        body: 'I take a final walk around you from every angle to ensure your makeup, outfit, jewellery and hairstyle come together beautifully as one complete look.',
      },
    ],
    quote:
      "A beautiful bridal look isn't created with makeup alone—it's created when every detail comes together in perfect harmony.",
  },

  candle: {
    title: 'A Moment For Yourself',
    cards: [
      { emoji: '💧', title: 'Stay Hydrated' },
      { emoji: '😴', title: 'Get Enough Sleep' },
      { emoji: '🥗', title: 'Eat A Light Breakfast' },
      { emoji: '🧴', title: 'Follow Your Skincare Routine' },
      { emoji: '🧘', title: 'Stay Calm' },
      { emoji: '❤️', title: 'Enjoy Every Moment' },
    ],
    quote:
      "The most beautiful brides aren't the ones wearing the most makeup. They're the ones who genuinely enjoy their wedding morning.",
  },

  flowers: {
    title: 'My Promise',
    promises: [
      'I will be available to answer your questions before your wedding day.',
      'I will listen before I create.',
      'I will use only clean, sanitized tools and professional products.',
      'I will respect your timeline and arrive fully prepared.',
      'I will never rush your bridal makeup.',
      'I will stay until every detail feels just right.',
      'I will make sure you feel confident before I leave.',
      'I will be a calm presence, not another source of stress.',
      'I will treat your wedding day with the same care and importance as you do.',
    ],
    quote:
      'Every bride deserves to feel confident, comfortable and truly herself. These are the promises I carry with me to every booking.',
  },
};

/* ---------------------------------------------------------------- */

export const letter = {
  eyebrow: 'A Letter to Every Bride',
  salutation: 'Dear Bride,',
  lines: [
    'A wedding is more than a celebration.',
    "It's a collection of moments you'll carry with you for a lifetime.",
    'The quiet excitement while getting ready.',
    'The laughter shared with the people you love.',
    'The moment you see yourself in the mirror.',
    'The deep breath before you walk towards a new beginning.',
    'On a day that means so much, you deserve to be completely present — not wondering whether everything is still in place.',
    'That’s why my role goes far beyond makeup.',
    'It’s about creating a sense of calm, confidence, and ease, so you can simply enjoy every moment as it unfolds.',
    'Years from now, when you look back at your photographs, I hope they remind you not only of how beautiful you looked, but of how confident, radiant, and completely yourself you felt.',
    'Thank you for considering me to be a small part of your story.',
  ],
  signOff: 'With love,',
  signatureName: 'Kamya Mehta',
};

/* ---------------------------------------------------------------- */

export const about = {
  eyebrow: 'About Me',
  heading: 'I believe your wedding day deserves more than just great makeup.',
  body: [
    'It deserves calm expertise, flawless artistry, and a look that feels completely you.',
    'Specialising in soft-glam, modern bridal makeup, I work with brides who want to feel confident, elevated, and effortlessly beautiful — without feeling overdone. From intimate ceremonies to luxury celebrations, every detail is thoughtfully tailored to you.',
  ],
  image: '/images/about.jpg',
  imageAlt: 'Portrait of Kamya Mehta, bridal makeup artist',
};

/* ---------------------------------------------------------------- */

/**
 * Portfolio. All source photos are vertical, so the layout is an editorial
 * two-column arrangement with deliberate vertical offsets rather than a grid.
 * `span` controls prominence; `entrance` picks the scroll-in animation.
 */
export const portfolio = {
  eyebrow: 'Portfolio',
  heading: 'Every bride, entirely herself',
  intro:
    'A selection of recent looks — bridal, engagement, reception and sangeet, across Delhi NCR and destination weddings.',
  // Ordered so the two columns alternate between full-length looks and
  // close-ups. Alt text describes what is actually in each photograph.
  items: [
    {
      src: '/images/portfolio/06.jpg',
      alt: 'Bride in a deep pink and gold embroidered lehenga standing beside an ornate iron gate at a heritage venue, wearing a kundan choker and a rose in her hair',
      caption: 'Bridal — Delhi NCR',
      w: 1206,
      h: 2135,
      entrance: 'drift',
    },
    {
      src: '/images/portfolio/03.jpg',
      alt: 'Close-up of a bride in daylight with soft rose eye makeup, glowing skin, an emerald and ruby kundan choker, maang tikka and pink roses pinned into her hair',
      caption: 'Bridal',
      w: 1800,
      h: 3200,
      entrance: 'slideRight',
    },
    {
      src: '/images/portfolio/05.jpg',
      alt: 'Bride seated in a red and gold lehenga with a sheer gold dupatta draped over one shoulder, wearing a ruby and pearl choker and stacked bangles',
      caption: 'Bridal',
      w: 1206,
      h: 2119,
      entrance: 'slideLeft',
    },
    {
      src: '/images/portfolio/02.jpg',
      alt: 'Bride smiling under an ivory and gold veil at night, wearing a diamond and emerald choker with luminous soft-glam makeup and a warm nude lip',
      caption: 'Reception',
      w: 1800,
      h: 2700,
      entrance: 'fadeScale',
    },
    {
      src: '/images/portfolio/08.jpg',
      alt: 'Client in a peach and copper crystal-embellished lehenga with a sheer embroidered dupatta, wearing soft bronze eye makeup and a glossy nude lip',
      caption: 'Sangeet',
      w: 1329,
      h: 2221,
      entrance: 'slideRight',
    },
    {
      src: '/images/portfolio/04.jpg',
      alt: 'Client in a dusty rose embroidered saree outdoors, wearing a diamond and emerald necklace, nath and maang tikka with rose-toned eye makeup',
      caption: 'Engagement',
      w: 1800,
      h: 2400,
      entrance: 'slideLeft',
    },
    {
      src: '/images/portfolio/07.jpg',
      alt: 'Close-up of a finished bridal look — kundan and pearl jewellery, defined lashes, softly sculpted skin and a rose-nude lip',
      caption: 'Bridal — Detail',
      w: 1206,
      h: 1308,
      entrance: 'fadeScale',
    },
  ],
};

/* ---------------------------------------------------------------- */

/**
 * The bridal album. Each spread is ONE bride's story — a full-length look on
 * the left, a detail on the right. Never more than one bride per spread.
 *
 * CINEMAGRAPHS: give any page a `video` (a short, silent, seamlessly looping
 * mp4/webm in /public/videos/). It plays muted about a second after the spread
 * settles, so the page reads as a photograph first and only then comes alive.
 * With no `video` the page simply stays a still — nothing else to change.
 *
 * NOTE: pairings below are my best reading of which photographs belong to the
 * same bride. Reorder freely — the album follows this array exactly.
 */
export const album = {
  eyebrow: 'The Album',
  heading: 'Bridal stories',
  hint: 'Open the portfolio',
  turnHint: 'Swipe or tap the arrows to turn the page',
  // One photograph per page rather than a two-up spread — the source photos
  // are vertical, so a single full-height page shows each one far larger.
  pages: [
    {
      id: 'p1',
      src: '/images/portfolio/06.jpg',
      alt: 'Bride in a deep pink and gold embroidered lehenga beside an ornate iron gate, kundan choker and a rose pinned in her hair',
      video: null,
    },
    {
      id: 'p2',
      src: '/images/portfolio/03.jpg',
      alt: 'Close-up of a bride in daylight with soft rose eye makeup, emerald and ruby kundan choker, maang tikka and pink roses in her hair',
      video: null,
    },
    {
      id: 'p3',
      src: '/images/portfolio/05.jpg',
      alt: 'Bride seated in a red and gold lehenga with a sheer gold dupatta, ruby and pearl choker and stacked bangles',
      video: null,
    },
    {
      id: 'p4',
      src: '/images/portfolio/07.jpg',
      alt: 'Detail of a finished bridal look — kundan and pearl jewellery, defined lashes, softly sculpted skin and a rose-nude lip',
      video: null,
    },
    {
      id: 'p5',
      src: '/images/portfolio/02.jpg',
      alt: 'Bride smiling under an ivory and gold veil at night, diamond and emerald choker, luminous soft-glam makeup and a warm nude lip',
      video: null,
    },
    {
      id: 'p6',
      src: '/images/portfolio/04.jpg',
      alt: 'Client in a dusty rose embroidered saree outdoors, diamond and emerald necklace, nath and maang tikka with rose-toned eye makeup',
      video: null,
    },
    {
      id: 'p7',
      src: '/images/portfolio/08.jpg',
      alt: 'Client in a peach and copper crystal-embellished lehenga with a sheer embroidered dupatta, soft bronze eyes and a glossy nude lip',
      video: null,
    },
    {
      id: 'p8',
      src: '/images/portfolio/01.jpg',
      alt: 'Bride in a red and gold lehenga with soft-glam bridal makeup, photographed on the steps of a heritage venue',
      video: null,
    },
  ],
};

/* ---------------------------------------------------------------- */

export const inclusions = {
  eyebrow: 'Inclusions',
  heading: 'Every booking includes',
  items: [
    { icon: 'sparkle', title: 'Celebrity HD makeup', note: 'Camera-ready finish that holds all day and night.' },
    { icon: 'hair', title: 'Professional hairstyling', note: 'Styled to complement your look, not compete with it.' },
    { icon: 'drape', title: 'Draping', note: 'Dupatta and saree draping set exactly as you imagined.' },
    { icon: 'lash', title: 'Premium lashes', note: 'Weightless, natural-looking definition.' },
    { icon: 'lens', title: 'Lenses', note: 'Subtle enhancement, matched to your skin tone.' },
    { icon: 'jewel', title: 'Jewellery setting', note: 'Every piece placed and secured with care.' },
    { icon: 'kit', title: 'Touch-up kit', note: 'So you stay flawless from the first look to the last dance.' },
  ],
  philosophy: {
    heading: 'Every detail belongs together',
    body: [
      'To me, makeup isn’t separate from your outfit, jewellery, hairstyle, or draping. They’re all part of one complete look, and every detail should complement the other.',
      'That’s why I love planning everything with you before the wedding — not just the makeup. So when your day arrives, nothing feels last-minute. Every choice is intentional, and everything comes together beautifully.',
      'After six years of doing this, that’s the one thing I’ve learned matters most.',
    ],
  },
  brands: {
    list: [
      { name: 'YSL', logo: '/images/brands/ysl.svg' },
      { name: 'Dior', logo: '/images/brands/dior.svg' },
      { name: 'Chanel', logo: '/images/brands/chanel.svg' },
      { name: 'Gucci', logo: '/images/brands/gucci.png' },
      { name: 'Armani', logo: '/images/brands/armani.svg' },
      { name: 'Charlotte Tilbury', logo: '/images/brands/charlotte-tilbury.svg' },
      { name: 'Huda Beauty', logo: '/images/brands/huda-beauty.png' },
      { name: 'Fenty Beauty', logo: '/images/brands/fenty-beauty.png' },
      { name: 'Hourglass', logo: '/images/brands/hourglass.svg' },
      { name: 'Bobbi Brown', logo: '/images/brands/bobbi-brown.gif' },
      { name: 'Too Faced', logo: '/images/brands/too-faced.png' },
    ],
  },
};

/* ---------------------------------------------------------------- */

// Per-service inclusion lists, shown on the mobile pricing accordion when a
// row is expanded. Bridal and Engagement/Reception carry the full package;
// Haldi drops the touch-up kit; Party Makeup is a smaller, focused set.
const INCLUSIONS_FULL = ['HD Makeup', 'Hairstyling', 'Draping', 'Lashes', 'Lenses', 'Jewellery Setting', 'Touch-up Kit'];
const INCLUSIONS_HALDI = ['HD Makeup', 'Hairstyling', 'Draping', 'Lashes', 'Lenses', 'Jewellery Setting'];
const INCLUSIONS_PARTY = ['HD Makeup', 'Hairstyling', 'Draping', 'Lashes'];

export const pricing = {
  eyebrow: 'Pricing',
  heading: 'Transparent, all-inclusive pricing',
  intro: 'Transparent all-inclusive pricing',
  tabs: [
    {
      id: 'delhi',
      label: 'Delhi NCR',
      rows: [
        { service: 'Bridal', price: 31000, featured: true, inclusions: INCLUSIONS_FULL },
        { service: 'Engagement / Reception', price: 28000, inclusions: INCLUSIONS_FULL },
        { service: 'Mehandi / Haldi', price: 20000, inclusions: INCLUSIONS_HALDI },
        { service: 'Party Makeup', price: 9000, inclusions: INCLUSIONS_PARTY },
      ],
    },
    {
      id: 'outstation',
      label: 'Outstation / Destination',
      rows: [
        { service: 'Bridal', price: 45000, featured: true, inclusions: INCLUSIONS_FULL },
        { service: 'Engagement / Reception', price: 38000, inclusions: INCLUSIONS_FULL },
        { service: 'Mehandi / Haldi', price: 30000, inclusions: INCLUSIONS_HALDI },
        { service: 'Party Makeup', price: 11000, inclusions: INCLUSIONS_PARTY },
      ],
    },
  ],
  footnote:
    'Travel charges extra. For outstation bookings, accommodation is to be provided by the client.',
};

/* ---------------------------------------------------------------- */

export const faqs = {
  eyebrow: 'FAQs',
  heading: 'Everything you might be wondering',
  items: [
    {
      q: 'Are hair extensions or hair accessories included?',
      a: 'No — hair extensions and hair accessories are not included in the package. If you’d like them, I’m happy to guide you on what to arrange so it works seamlessly with your look.',
    },
    { q: 'What is the trial charge?', a: 'Trials are available for ₹9,000.' },
    { q: 'What is your refund policy?', a: 'No refunds are provided once a booking is confirmed.' },
    {
      q: 'Are travel charges included?',
      a: 'No — travel charges are extra for both Delhi NCR and outstation bookings.',
    },
    {
      q: 'Who arranges accommodation for outstation bookings?',
      a: 'Accommodation for outstation bookings is to be provided by the client.',
    },
  ],
};

/* ---------------------------------------------------------------- */

export const testimonials = {
  eyebrow: 'Kind Words',
  heading: 'From my brides',
  items: [
    {
      rating: 5,
      quote:
        'I can’t even express how comfortable I was on my wedding day just because of your makeup. It really felt so light and everyone complimented my look. Thank you for the magic you do. Waiting to get dolled up again by you.',
      name: 'Komal',
      event: 'Bride',
      image: null,
    },
    {
      rating: 5,
      quote:
        'Thank you so much for such a lovely makeup on the wedding day! Got so many compliments that it looked so nice, natural and glowy. Thank you so much!',
      name: 'Nikita',
      event: 'Bride',
      image: null,
    },
    {
      rating: 5,
      quote:
        'I felt absolutely confident and like the best version of myself throughout the day. You truly understood exactly what I wanted and brought it to life so perfectly. I received so many compliments, and it’s all thanks to your amazing work.',
      name: 'Shivani',
      event: 'Bride',
      image: null,
    },
  ],
};

/* ---------------------------------------------------------------- */

/**
 * The French Doors — the signature reviews experience. Doors open on their
 * own the moment the section scrolls into view (no click, no waiting — by
 * this point in the page a visitor has already scrolled plenty), revealing
 * all five reviews at once, each with a spot for her photo.
 */
export const reviewDoors = {
  eyebrow: 'Kind Words',
  heading: 'From my brides',
  intro: 'Real words, from real mornings like yours.',
};

/* ---------------------------------------------------------------- */

/**
 * The Letterbox — the signature reviews experience. The moment it scrolls
 * into view, the little door swings open and every bride's letter is tossed
 * out at once, landing in a natural scatter — no click, no waiting.
 */
export const reviewLetterbox = {
  eyebrow: 'Kind Words',
  heading: 'From my brides',
  intro: 'A little post, from every bride who has trusted me with her morning.',
};

/* ---------------------------------------------------------------- */

/**
 * The Garden Gate — an illustrated, one-at-a-time reviews journey. The
 * section takes over the screen, a gate opens, and each bride's words
 * arrive like a page in a storybook.
 */
export const testimonialGate = {
  eyebrow: 'Kind Words',
  heading: 'Beyond the gate',
  intro: 'Step through, and meet the brides who trusted me with their morning.',
};

/* ---------------------------------------------------------------- */

export const bookingForm = {
  eyebrow: 'Enquire',
  heading: 'Ready to feel confident and beautiful?',
  intro:
    'Tell me about your celebration, and I’ll personally be in touch as soon as I can, usually within 24 hours.',
  eventTypes: [
    'Bridal',
    'Engagement',
    'Reception',
    'Mehandi',
    'Haldi',
    'Party Makeup',
    'Other',
  ],
};

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Inclusions', href: '#inclusions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#booking' },
];
