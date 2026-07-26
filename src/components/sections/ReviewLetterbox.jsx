'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIsMobile } from '@/lib/useMediaQuery';
import { reviewLetterbox, testimonials } from '@/lib/content';
import { Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import Reveal from '@/components/Reveal';
import { BrassFlag, BrassPlate, MailboxBody } from '@/components/mailbox/Artwork';
import ReviewLetter from '@/components/mailbox/ReviewLetter';

/**
 * The Letterbox — the signature reviews experience.
 *
 * Fully automatic: the moment it scrolls into view, the little door swings
 * open and every bride's letter tosses out at once, landing in a natural
 * scatter within a couple of seconds. No click, no waiting, no cycling
 * through one review at a time — by this point in the page the visitor has
 * already scrolled plenty. Plays exactly once per visit (a ref guard, not
 * state, so scrolling back up and down again never replays it).
 */

const SETTLE = [0.22, 0.61, 0.24, 1];

const T = {
  arrive: 500, // mailbox fades/scales into view
  pause: 180, // the briefest held breath before the door moves
  open: 380, // the door swings open
  stagger: 150, // gap between each letter's toss
  toss: 550, // duration of a single letter's toss-and-land
};

// Hand-placed scatter positions (percentage of the stage) — never a grid.
// The mailbox sits toward the left; letters land in a loose spread to its
// right, as if just tossed out.
const LAYOUT_DESKTOP = [
  { size: 'hero', x: 40, y: 64, rotate: -3, variant: 'seal' },
  { size: 'small', x: 57, y: 38, rotate: 2.5, variant: 'foil' },
  { size: 'hero', x: 68, y: 66, rotate: 2, variant: 'seal' },
  { size: 'small', x: 84, y: 44, rotate: -2, variant: 'foil' },
  { size: 'small', x: 54, y: 86, rotate: 3, variant: 'seal' },
];

const LAYOUT_MOBILE = [
  { size: 'hero', x: 50, y: 42, rotate: -2.5, variant: 'seal' },
  { size: 'small', x: 25, y: 60, rotate: 2, variant: 'foil' },
  { size: 'small', x: 75, y: 60, rotate: -2, variant: 'seal' },
  { size: 'hero', x: 50, y: 80, rotate: 1.5, variant: 'foil' },
  { size: 'small', x: 50, y: 97, rotate: -1.5, variant: 'seal' },
];

export default function ReviewLetterbox() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef(null);
  const timers = useRef([]);
  const hasPlayedRef = useRef(false);

  const [phase, setPhase] = useState('idle'); // idle | arriving | opening | scattering | revealed

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (reduced) {
      setPhase('revealed');
      return undefined;
    }

    const el = stageRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.5 && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          io.disconnect();
          setPhase('arriving');
          at(T.arrive + T.pause, () => setPhase('opening'));
          at(T.arrive + T.pause + T.open, () => setPhase('scattering'));
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const arrived = phase !== 'idle';
  const opened = phase === 'opening' || phase === 'scattering' || phase === 'revealed';
  const scattering = phase === 'scattering' || phase === 'revealed';

  const layout = isMobile ? LAYOUT_MOBILE : LAYOUT_DESKTOP;
  const mailboxLeft = isMobile ? '38%' : '13%';
  const mailboxBottom = isMobile ? '56%' : '8%';

  return (
    <Section id="testimonials" tone="shell" className="relative overflow-hidden">
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{reviewLetterbox.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6">{reviewLetterbox.heading}</Heading>
          </Reveal>
          <Reveal delay={0.14}>
            <Prose className="mx-auto mt-5 text-center">{reviewLetterbox.intro}</Prose>
          </Reveal>
        </div>
      </Container>

      <div
        ref={stageRef}
        className="relative mx-auto mt-14 w-full max-w-5xl"
        style={{ aspectRatio: isMobile ? '3 / 5' : '16 / 10' }}
      >
        {/* contact shadow beneath the mailbox */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute h-[5%] w-[12%] -translate-x-1/2 rounded-[50%] blur-[16px]"
          style={{ background: 'rgba(40,26,14,0.45)', left: mailboxLeft, bottom: mailboxBottom }}
          animate={{ opacity: arrived ? 0.7 : 0 }}
          transition={{ duration: 0.6, ease: SETTLE }}
        />

        {/* ---------- The letters, scattered in front of the mailbox ---------- */}
        <div className="absolute inset-0 z-30">
          {layout.map((pos, i) => {
            const item = testimonials.items[i];
            if (!item) return null;
            return (
              // Outer element owns pure CSS positioning (left/top + centering
              // translate via Tailwind); Framer Motion's animated rotate/x/y
              // lives on a separate inner motion.div — combining both on one
              // node let Framer's consolidated inline transform silently
              // replace the class-based centering translate (found and fixed
              // in the earlier French-doors build).
              <div
                key={item.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: pos.size === 'hero' ? 20 : 10 }}
              >
                <motion.div
                  style={{ rotate: pos.rotate }}
                  initial={
                    reduced
                      ? false
                      : { opacity: 0, x: -26, y: -46, scale: 0.7, rotate: pos.rotate - 26 }
                  }
                  animate={
                    scattering
                      ? { opacity: 1, x: 0, y: 0, scale: 1, rotate: pos.rotate }
                      : { opacity: 0, x: -26, y: -46, scale: 0.7, rotate: pos.rotate - 26 }
                  }
                  transition={{
                    duration: reduced ? 0 : T.toss / 1000,
                    ease: SETTLE,
                    delay: reduced ? 0 : i * (T.stagger / 1000),
                  }}
                >
                  <ReviewLetter item={item} size={pos.size} variant={pos.variant} />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ---------- The mailbox ---------- */}
        <motion.div
          className="absolute z-10 -translate-x-1/2"
          style={{ left: mailboxLeft, bottom: mailboxBottom, width: isMobile ? '5.5rem' : '7rem' }}
          initial={reduced ? false : { opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : T.arrive / 1000, ease: SETTLE }}
        >
          <div className="relative" style={{ perspective: 1000 }}>
            <MailboxBody className="h-auto w-full" />
            <BrassFlag className="absolute -right-[16%] top-[4%] h-[24%] w-auto" />
            <BrassPlate className="absolute left-1/2 top-[10%] h-[12%] w-auto -translate-x-1/2" />

            {/* the door — hinged at the left edge */}
            <motion.div
              className="absolute left-[10%] top-[28%] z-10 h-[40%] w-[80%]"
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              animate={{ rotateY: opened ? -85 : 0 }}
              transition={{ duration: reduced ? 0 : T.open / 1000, ease: SETTLE }}
            >
              <div
                className="mailbox-metal grain absolute inset-0 rounded-[2px] shadow-[inset_-6px_0_14px_-8px_rgba(0,0,0,0.6)]"
                style={{ backfaceVisibility: 'hidden' }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
