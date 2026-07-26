'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIsMobile } from '@/lib/useMediaQuery';
import { reviewDoors, testimonials } from '@/lib/content';
import { Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import Reveal from '@/components/Reveal';
import { BrassHandle, BrassHingePlate, CrestMotif, DoorMolding } from '@/components/doors/Artwork';
import ReviewFrame from '@/components/doors/ReviewFrame';

/**
 * The French Doors — the signature reviews experience.
 *
 * Fully automatic: the moment the doors scroll into view, they open on their
 * own and every review is visible within a few seconds. No click, no
 * scroll-scrubbing, no per-item reveal to wait through — by this point in the
 * page the visitor has already scrolled plenty, so nothing further is asked
 * of them. Plays exactly once per visit (a ref guard, not state, so scrolling
 * back up and down again never replays it).
 */

const SETTLE = [0.22, 0.61, 0.24, 1];

const T = {
  arrive: 550, // doors fade/scale into view
  pause: 200, // the briefest held breath before they part
  open: 1000, // both panels swing open together
  stagger: 110, // gap between each review frame appearing
};

// Hand-placed gallery positions (percentage of the stage) — never a grid.
const LAYOUT_DESKTOP = [
  { size: 'hero', x: 19, y: 32, rotate: -2 },
  { size: 'small', x: 39, y: 15, rotate: 2.2 },
  { size: 'hero', x: 63, y: 30, rotate: 1.6 },
  { size: 'small', x: 82, y: 18, rotate: -1.8 },
  { size: 'small', x: 51, y: 62, rotate: -2.4 },
];

const LAYOUT_MOBILE = [
  { size: 'hero', x: 50, y: 13, rotate: -1.6 },
  { size: 'small', x: 26, y: 33, rotate: 2 },
  { size: 'small', x: 74, y: 35, rotate: -2 },
  { size: 'hero', x: 50, y: 58, rotate: 1.2 },
  { size: 'small', x: 50, y: 82, rotate: -1.2 },
];

export default function ReviewDoors() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef(null);
  const timers = useRef([]);
  const hasPlayedRef = useRef(false);

  const [phase, setPhase] = useState('idle'); // idle | arriving | opening | revealed

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
          at(T.arrive + T.pause + T.open, () => setPhase('revealed'));
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const arrived = phase !== 'idle';
  const opened = phase === 'opening' || phase === 'revealed';
  const revealed = phase === 'revealed';

  const layout = isMobile ? LAYOUT_MOBILE : LAYOUT_DESKTOP;

  return (
    <Section id="testimonials" tone="shell" className="relative overflow-hidden">
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{reviewDoors.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6">{reviewDoors.heading}</Heading>
          </Reveal>
          <Reveal delay={0.14}>
            <Prose className="mx-auto mt-5 text-center">{reviewDoors.intro}</Prose>
          </Reveal>
        </div>
      </Container>

      <div
        ref={stageRef}
        className="relative mx-auto mt-14 w-full max-w-5xl overflow-hidden rounded-[2px]"
        style={{ aspectRatio: isMobile ? '3 / 5' : '16 / 11' }}
      >
        {/* the warm room glimpsed through the doors */}
        <div className="gallery-glow grain absolute inset-0" />

        {/* contact shadow beneath the doors */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-[1%] left-[10%] right-[10%] z-10 h-[8%] rounded-[50%] blur-[26px]"
          style={{ background: 'rgba(40,26,14,0.5)' }}
          animate={{ opacity: arrived ? 0.6 : 0 }}
          transition={{ duration: 0.6, ease: SETTLE }}
        />

        {/* ---------- The gallery, in front of the doors once open ---------- */}
        <div className="absolute inset-0 z-30">
          {layout.map((pos, i) => {
            const item = testimonials.items[i];
            if (!item) return null;
            return (
              // Outer element owns pure CSS positioning (left/top + centering
              // translate via Tailwind). Framer Motion consolidates every
              // animated property (rotate, y, scale, opacity) it's given into
              // one inline `transform`, which would silently replace a
              // class-based transform on the same node — so the entrance
              // animation lives on a separate inner motion.div instead.
              <div
                key={item.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: pos.size === 'hero' ? 20 : 10 }}
              >
                <motion.div
                  style={{ rotate: pos.rotate }}
                  initial={reduced ? false : { opacity: 0, y: 18, scale: 0.96 }}
                  animate={
                    revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.96 }
                  }
                  transition={{
                    duration: reduced ? 0 : 0.6,
                    ease: SETTLE,
                    delay: reduced ? 0 : i * (T.stagger / 1000),
                  }}
                >
                  <ReviewFrame item={item} size={pos.size} />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ---------- The doors ---------- */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ perspective: 2200 }}
          initial={reduced ? false : { opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: reduced ? 0 : T.arrive / 1000, ease: SETTLE }}
        >
          {/* light seam, glowing at the join before the doors part */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-10 -translate-x-1/2"
            style={{
              background: 'radial-gradient(closest-side, rgba(255,238,205,0.9), transparent 70%)',
            }}
            animate={{ opacity: opened ? 0 : arrived ? 0.85 : 0, scaleX: opened ? 2.6 : 1 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: SETTLE }}
          />

          {/* left door */}
          <motion.div
            className="absolute inset-y-0 left-0 z-20 w-1/2"
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            animate={{ rotateY: opened ? -72 : 0 }}
            transition={{ duration: reduced ? 0 : T.open / 1000, ease: SETTLE }}
          >
            <div
              className="door-panel grain absolute inset-0 shadow-[inset_-12px_0_26px_-14px_rgba(0,0,0,0.55)]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <DoorMolding className="absolute inset-[6%] h-[88%] w-[88%]" />
              <BrassHingePlate className="absolute left-[3%] top-[10%] h-[15%] w-auto" />
              <BrassHingePlate className="absolute bottom-[10%] left-[3%] h-[15%] w-auto" />
              <BrassHandle className="absolute right-[7%] top-1/2 h-[13%] w-auto" style={{ transform: 'translateY(-50%)' }} />
            </div>
          </motion.div>

          {/* right door */}
          <motion.div
            className="absolute inset-y-0 right-0 z-20 w-1/2"
            style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
            animate={{ rotateY: opened ? 72 : 0 }}
            transition={{ duration: reduced ? 0 : T.open / 1000, ease: SETTLE }}
          >
            <div
              className="door-panel grain absolute inset-0 shadow-[inset_12px_0_26px_-14px_rgba(0,0,0,0.55)]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <DoorMolding className="absolute inset-[6%] h-[88%] w-[88%]" />
              <BrassHingePlate flip className="absolute right-[3%] top-[10%] h-[15%] w-auto" />
              <BrassHingePlate flip className="absolute bottom-[10%] right-[3%] h-[15%] w-auto" />
              <BrassHandle
                className="absolute left-[7%] top-1/2 h-[13%] w-auto"
                style={{ transform: 'translateY(-50%) scaleX(-1)' }}
              />
            </div>
          </motion.div>

          {/* crest above the doors, fading with them once opened */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-[9%] z-40 flex justify-center"
            animate={{ opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <CrestMotif className="h-16 w-auto sm:h-20" />
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
