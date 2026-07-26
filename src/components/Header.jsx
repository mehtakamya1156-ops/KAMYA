'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useSuiteTakeover } from '@/lib/useSuiteTakeover';
import { brand, nav, whatsappUrl } from '@/lib/content';
import { CloseIcon, MenuIcon, WhatsAppIcon } from '@/components/icons';
import { cx } from '@/components/ui';
import { DUR, EASE, STAGGER } from '@/lib/motion';

function Wordmark({ className }) {
  return (
    <Link
      href="#top"
      className={cx('group flex min-h-[44px] flex-col justify-center leading-none', className)}
      aria-label={`${brand.name} — back to top`}
    >
      <span className="text-eyebrow font-medium uppercase text-muted transition-colors duration-200 ease-[var(--ease-signature)] group-hover:text-gold">
        Makeup by
      </span>
      <span className="font-serif text-[1.35rem] font-light tracking-[0.02em] text-ink sm:text-[1.5rem]">
        {brand.artist}
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const suiteActive = useSuiteTakeover();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page behind the mobile menu, and allow Escape to close it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 h-[4.5rem] transition-[background-color,box-shadow,border-color,opacity] duration-300 ease-[var(--ease-signature)]',
          scrolled
            ? 'border-b border-sand bg-cream/88 backdrop-blur-md'
            : 'border-b border-transparent bg-cream/88 backdrop-blur-md md:bg-cream/70',
          // Everything else disappears while the Bridal Suite room is
          // filling the screen — it reappears once the visitor scrolls on.
          suiteActive && 'pointer-events-none opacity-0'
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-[var(--gutter)]">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative py-2 text-sm tracking-[0.06em] text-muted transition-colors duration-200 ease-[var(--ease-signature)] hover:text-ink"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-200 ease-[var(--ease-signature)] group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              /* Visible at every size — most enquiries come from phones, so the
                 primary action must never be hidden behind the menu. */
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-cream transition-[background-color,box-shadow] duration-200 ease-[var(--ease-signature)] hover:bg-gold hover:shadow-[0_10px_28px_-14px_rgba(156,126,81,0.8)] sm:px-5"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="-mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-ink transition-colors duration-200 ease-[var(--ease-signature)] hover:bg-sand/60 lg:hidden"
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-cream pt-[4.5rem] lg:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          >
            <motion.nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center gap-1 px-[var(--gutter)] pb-24"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduced ? 0 : STAGGER.tight, delayChildren: 0.05 } },
              }}
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-sand py-4 font-serif text-3xl font-light text-ink transition-colors duration-200 ease-[var(--ease-signature)] hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="mt-8 flex flex-col gap-3"
                variants={{
                  hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
                }}
              >
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-ink px-7 text-sm font-medium uppercase tracking-[0.1em] text-cream transition-colors duration-200 ease-[var(--ease-signature)] hover:bg-gold"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" />
                  WhatsApp me
                </Link>
                <p className="text-center text-sm text-muted">{brand.serviceAreas}</p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
