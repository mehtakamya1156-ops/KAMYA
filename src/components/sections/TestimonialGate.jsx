'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIsMobile } from '@/lib/useMediaQuery';
import { lenisRef } from '@/lib/lenis';
import { testimonialGate, testimonials } from '@/lib/content';
import { Container, Eyebrow, Heading, Prose, Section } from '@/components/ui';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { ArchPathway, GateIllustration } from '@/components/garden/Illustration';
import ReviewCard from '@/components/garden/ReviewCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

/**
 * The Garden Gate — an illustrated, scroll-locked testimonial journey.
 *
 * This is a deliberate departure from every other reveal built on this site
 * this session: instead of "automatic and fast, nothing hidden," the client
 * explicitly asked for the section to take over the screen, hold scroll
 * still, and walk the visitor through her five reviews one at a time before
 * releasing them — a considered reversal of the Letterbox's pacing, made
 * after I flagged the tension directly. Reduced motion never engages this
 * lock at all: it renders the gate open and every review visible as a plain
 * static list, which is both the safest and only sane accessible fallback
 * for a scroll-capturing experience.
 */

const SETTLE = [0.22, 0.61, 0.24, 1];
const HOLD_MS = 4200; // how long a review stays centred before advancing
const GATE_OPEN_MS = 900;
const CLOSE_MS = 700;
const INPUT_DEBOUNCE_MS = 700;

const PETALS_DESKTOP = 10;
const PETALS_MOBILE = 6;

function usePetals(count) {
  const petalsRef = useRef(null);
  if (!petalsRef.current) {
    petalsRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 6 + ((i * 9.3) % 88),
      dur: 11 + ((i * 2.7) % 9),
      delay: (i * 1.6) % 12,
      driftX: ((i % 2 === 0 ? 1 : -1) * (4 + (i % 4))).toFixed(0),
      rot: 25 + ((i * 13) % 50),
      size: 12 + (i % 3) * 4,
    }));
  }
  return petalsRef.current;
}

export default function TestimonialGate() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const stageRef = useRef(null);
  const timers = useRef([]);
  const completedRef = useRef(false);
  const busyRef = useRef(false);
  const touchStartY = useRef(null);
  const resumeTimer = useRef(null);
  const prevOverflow = useRef('');

  const [locked, setLocked] = useState(false);
  const [phase, setPhase] = useState('closed'); // closed | opening | reviewing | closing
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const petals = usePetals(isMobile ? PETALS_MOBILE : PETALS_DESKTOP);
  const items = testimonials.items;

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const releaseLock = useCallback(() => {
    setPhase('closing');
    at(CLOSE_MS, () => {
      document.body.style.overflow = prevOverflow.current;
      lenisRef.current?.start();
      setLocked(false);
      setPhase('closed');
      completedRef.current = true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advance = useCallback(
    (delta) => {
      setIndex((cur) => {
        const next = cur + delta;
        if (next >= items.length) {
          releaseLock();
          return cur;
        }
        return Math.max(0, Math.min(items.length - 1, next));
      });
    },
    [items.length, releaseLock]
  );

  const onInteract = useCallback(() => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 6000);
  }, []);

  const engageLock = useCallback(() => {
    if (completedRef.current || locked) return;
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenisRef.current?.stop();
    setLocked(true);
    setPhase('opening');
    setIndex(0);
    at(GATE_OPEN_MS, () => setPhase('reviewing'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  // Trigger: watch the in-flow placeholder, lock once when it fills the
  // viewport (unless the visitor has already completed the sequence once).
  useEffect(() => {
    if (reduced) return undefined;
    const el = stageRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0.7) engageLock();
      },
      { threshold: [0, 0.7, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, engageLock]);

  // Autoplay — advances the held review after HOLD_MS unless paused/closing.
  useEffect(() => {
    if (!locked || phase !== 'reviewing' || paused) return undefined;
    const id = setTimeout(() => advance(1), HOLD_MS);
    return () => clearTimeout(id);
  }, [locked, phase, paused, index, advance]);

  // Captured input while locked: wheel / touch swipe / keyboard all map to
  // one debounced "advance one step" so a single gesture never skips several
  // reviews. Anything else is left alone rather than becoming an accidental
  // page action while the visitor's attention is meant to stay here.
  useEffect(() => {
    if (!locked || phase !== 'reviewing') return undefined;

    const step = (dir) => {
      if (busyRef.current) return;
      busyRef.current = true;
      onInteract();
      advance(dir);
      setTimeout(() => {
        busyRef.current = false;
      }, INPUT_DEBOUNCE_MS);
    };

    const onWheel = (e) => {
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      if (touchStartY.current == null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dy) > 30) step(dy > 0 ? 1 : -1);
    };
    const onKeyDown = (e) => {
      if (['ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        step(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [locked, phase, advance, onInteract]);

  // Safety net: never leave the page permanently scroll-locked, whatever
  // happens (unmount mid-sequence, fast refresh in dev, route change).
  useEffect(
    () => () => {
      clearTimers();
      clearTimeout(resumeTimer.current);
      document.body.style.overflow = prevOverflow.current;
      lenisRef.current?.start();
    },
    []
  );

  const goTo = (i) => {
    onInteract();
    setIndex(i);
  };

  const opened = phase === 'opening' || phase === 'reviewing' || phase === 'closing';
  const current = items[index];

  return (
    <Section id="testimonials" tone="cream" className="relative overflow-hidden">
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{testimonialGate.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6">{testimonialGate.heading}</Heading>
          </Reveal>
          <Reveal delay={0.14}>
            <Prose className="mx-auto mt-5 text-center">{testimonialGate.intro}</Prose>
          </Reveal>
        </div>
      </Container>

      {reduced ? (
        // Reduced motion: no lock, ever — the gate stands open and every
        // review is simply here, in normal page flow.
        <Container size="narrow">
          <RevealGroup as="div" className="mt-14 flex flex-col gap-8">
            {items.map((item) => (
              <RevealItem key={item.name}>
                <ReviewCard item={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      ) : (
        <>
          {/* In-flow placeholder — holds real scroll height and is what the
              IntersectionObserver watches. The interactive experience itself
              renders as a fixed full-viewport takeover once locked, whose
              opaque background covers the fixed header without needing to
              coordinate with it directly. */}
          <div
            ref={stageRef}
            className="relative mx-auto mt-14 h-[68vh] max-w-5xl overflow-hidden rounded-[4px] sm:h-[82vh]"
          >
            <ArchPathway className="absolute inset-0 h-full w-full" />
            <div className="watercolor-wash absolute inset-0" />
            <div className="absolute inset-y-0 left-0 w-[18%]">
              <GateIllustration side="left" className="h-full w-full" />
            </div>
            <div className="absolute inset-y-0 right-0 w-[18%]">
              <GateIllustration side="right" className="h-full w-full" />
            </div>
          </div>

          {locked && (
            <div className="fixed inset-0 z-[60]">
              <ArchPathway className="absolute inset-0 h-full w-full" />
              <div className="watercolor-wash absolute inset-0" />

              {/* petals */}
              {petals.map((p) => (
                <span
                  key={p.id}
                  className="petal-drift pointer-events-none absolute top-0 rounded-full bg-[#e9c3bb]"
                  style={{
                    left: `${p.left}%`,
                    width: p.size,
                    height: p.size * 1.3,
                    '--petal-dur': `${p.dur}s`,
                    '--petal-delay': `${p.delay}s`,
                    '--petal-drift-x': `${p.driftX}%`,
                    '--petal-drift-r': `${p.rot}deg`,
                  }}
                />
              ))}

              {/* gate panels */}
              <motion.div
                className="absolute inset-y-0 left-0 z-20 w-[26%]"
                style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', perspective: 1200 }}
                animate={{ rotateY: opened ? -62 : 0 }}
                transition={{ duration: GATE_OPEN_MS / 1000, ease: SETTLE }}
              >
                <GateIllustration side="left" className="h-full w-full" style={{ backfaceVisibility: 'hidden' }} />
              </motion.div>
              <motion.div
                className="absolute inset-y-0 right-0 z-20 w-[26%]"
                style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d', perspective: 1200 }}
                animate={{ rotateY: opened ? 62 : 0 }}
                transition={{ duration: GATE_OPEN_MS / 1000, ease: SETTLE }}
              >
                <GateIllustration side="right" className="h-full w-full" style={{ backfaceVisibility: 'hidden' }} />
              </motion.div>

              {/* the review, travelling forward from the distance */}
              <div className="absolute inset-0 z-30 flex items-center justify-center px-6">
                <AnimatePresence mode="wait">
                  {phase === 'reviewing' && current && (
                    <motion.div
                      key={current.name}
                      initial={{ opacity: 0, scale: 0.42, y: 46 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: -32 }}
                      transition={{ duration: 0.75, ease: SETTLE }}
                    >
                      <ReviewCard item={current} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* minimal controls */}
              {phase === 'reviewing' && (
                <>
                  <div className="pointer-events-none absolute inset-x-0 bottom-10 z-40 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      aria-label="Previous review"
                      onClick={() => {
                        onInteract();
                        advance(-1);
                      }}
                      className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-[#c9a66b]/50 text-[#9c8f74] transition-colors duration-200 hover:text-[#c9a66b]"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-auto flex items-center gap-2">
                      {items.map((item, i) => (
                        <button
                          key={item.name}
                          type="button"
                          aria-label={`Go to ${item.name}'s review`}
                          aria-current={i === index}
                          onClick={() => goTo(i)}
                          className="grid h-6 w-6 place-items-center"
                        >
                          <span
                            className={
                              i === index
                                ? 'block h-1.5 w-5 rounded-full bg-[#c9a66b]'
                                : 'block h-1.5 w-1.5 rounded-full bg-[#c9a66b]/35'
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label="Next review"
                      onClick={() => {
                        onInteract();
                        advance(1);
                      }}
                      className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-[#c9a66b]/50 text-[#9c8f74] transition-colors duration-200 hover:text-[#c9a66b]"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </Section>
  );
}
