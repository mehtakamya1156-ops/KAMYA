import Link from 'next/link';
import { brand, nav } from '@/lib/content';
import { Container } from '@/components/ui';

export default function Footer() {
  return (
    <footer className="border-t border-sand bg-cream py-7 sm:py-12">
      <Container size="default">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <p className="text-eyebrow uppercase text-muted">Makeup by</p>
            <p className="font-serif text-2xl font-light text-ink">{brand.artist}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{brand.tagline}</p>
          </div>

          {/* Repeats the header's own navigation, which is the convention for
              a desktop footer — but on mobile the hamburger menu already
              covers it, so this was just adding a second, wrapped nav list
              and more scroll for no new information. */}
          <nav aria-label="Footer" className="hidden flex-wrap gap-x-6 gap-y-2 sm:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] items-center text-sm text-muted transition-colors duration-200 ease-[var(--ease-signature)] hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Service areas are already stated in the Contact section directly
            above on mobile, so the copyright line there stays short. */}
        <p className="mt-4 border-t border-sand pt-4 text-sm text-muted sm:mt-10 sm:pt-6">
          © {new Date().getFullYear()} {brand.name}.{' '}
          <span className="hidden sm:inline">{brand.serviceAreas}.</span>
        </p>
      </Container>
    </footer>
  );
}
