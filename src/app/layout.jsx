import { Caveat, Cormorant_Garamond, Jost, Petit_Formal_Script } from 'next/font/google';
import { brand } from '@/lib/content';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

const script = Petit_Formal_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
});

// Legible handwriting face for the body of the letter.
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-hand',
  display: 'swap',
});

const SITE_URL = 'https://makeupbykamyamehta.com'; // update once the domain is live

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    'Soft-glam bridal makeup artist in Delhi NCR, available for destination weddings. Celebrity HD makeup, hairstyling, draping, lashes and jewellery setting included in every booking.',
  keywords: [
    'bridal makeup artist Delhi NCR',
    'soft glam bridal makeup',
    'destination wedding makeup artist India',
    'Kamya Mehta makeup',
    'engagement makeup Delhi',
  ],
  authors: [{ name: brand.artist }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description:
      'Soft-glam bridal makeup for brides who want to feel confident, elevated and effortlessly beautiful. Delhi NCR & destination weddings.',
    images: [{ url: '/images/hero.jpg', width: 1206, height: 2142, alt: `${brand.artist} bridal makeup` }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brand.name} — ${brand.tagline}`,
    description: 'Soft-glam bridal makeup. Delhi NCR & destination weddings.',
    images: ['/images/hero.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#fbf8f4',
  width: 'device-width',
  initialScale: 1,
};

/** Structured data so Google can show the business properly in results. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: brand.name,
  description: 'Bridal makeup artist specialising in soft-glam, modern bridal looks.',
  url: SITE_URL,
  telephone: brand.phone,
  image: `${SITE_URL}/images/hero.jpg`,
  areaServed: ['Delhi NCR', 'India'],
  address: { '@type': 'PostalAddress', addressRegion: 'Delhi NCR', addressCountry: 'IN' },
  sameAs: [brand.instagramUrl],
  priceRange: '₹₹₹',
  founder: { '@type': 'Person', name: brand.artist },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${jost.variable} ${script.variable} ${caveat.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
