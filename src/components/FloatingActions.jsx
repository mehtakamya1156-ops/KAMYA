'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useSuiteTakeover } from '@/lib/useSuiteTakeover';
import { brand, whatsappUrl } from '@/lib/content';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons';
import { DUR, EASE } from '@/lib/motion';

/**
 * Floating contact dock — WhatsApp and Instagram, pinned to the bottom-right and
 * visible on every scroll so the two ways enquiries actually arrive are always
 * one tap away.
 *
 * Appears after the visitor scrolls past the hero (it would compete with the
 * hero otherwise), sits above the safe-area inset on phones, and both targets
 * clear the 44px minimum. Entrance is skipped under reduced motion.
 */
export default function FloatingActions() {
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();
  const suiteActive = useSuiteTakeover();

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    {
      href: whatsappUrl,
      label: 'Message on WhatsApp',
      Icon: WhatsAppIcon,
      className: 'bg-[#25D366] text-white hover:brightness-105',
    },
    {
      href: brand.instagramUrl,
      label: 'Follow on Instagram',
      Icon: InstagramIcon,
      className: 'bg-ink text-cream hover:bg-gold',
    },
  ];

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col gap-3"
      style={{
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        right: 'max(1.25rem, env(safe-area-inset-right))',
      }}
    >
      <AnimatePresence>
        {shown &&
          !suiteActive &&
          items.map(({ href, label, Icon, className }, i) => (
            <motion.div
              key={label}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.8 }}
              transition={{ duration: DUR.base, ease: EASE, delay: reduced ? 0 : i * 0.06 }}
            >
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`flex h-13 w-13 items-center justify-center rounded-full shadow-[0_10px_28px_-8px_rgba(43,39,36,0.5)] transition-[background-color,filter,transform] duration-200 ease-[var(--ease-signature)] hover:-translate-y-0.5 active:scale-95 ${className}`}
                style={{ height: '3.25rem', width: '3.25rem' }}
              >
                <Icon className="h-6 w-6" />
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
