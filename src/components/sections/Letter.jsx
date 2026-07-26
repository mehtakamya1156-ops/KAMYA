'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { letter } from '@/lib/content';
import { Container, Section, cx } from '@/components/ui';
import { Atelier, Slab } from '@/components/Atelier';
import { FloralCorner, FoilEdge, Monogram, WaxSeal } from '@/components/envelope/Artwork';

/* A single decelerating family. Paper settles; it never springs or overshoots. */
const SETTLE = [0.22, 0.61, 0.24, 1];
const HINGE = [0.34, 0.68, 0.18, 1];

const T = {
  press: 130, // wax compresses under the finger
  flap: 1500, // flap swings back on its fold
  grab: 1400, // letter rises just far enough to take hold of
};

/* The letter's travel, as a share of its own height. */
const TUCKED = 100; // fully inside
const GRAB = 74; // risen enough to grab
const OUT = 0; // fully extracted

/**
 * Stable pseudo-random in [0,1). Rounded deliberately: React serialises style
 * numbers differently on the server and the client, so full-precision floats
 * produce a hydration mismatch. Three decimals is far more variation than the
 * eye can read anyway.
 */
function rand(i, seed) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
}

/**
 * Handwriting, not a script font poured into a paragraph.
 *
 * Each line gets its own baseline drift, a fraction of a degree of rotation,
 * slightly different tracking and weight, and each takes a moment longer to be
 * written than the last — the rhythm of a hand moving, not text appearing.
 */
function Handwritten({ lines }) {
  return (
    <div className="space-y-[0.55em]">
      {lines.map((line, i) => {
        const a = rand(i, 1);
        const b = rand(i, 2);
        const c = rand(i, 3);
        return (
          // Deliberately NOT scroll-triggered. The letter only exists after a
          // deliberate action, and tying these lines to an IntersectionObserver
          // meant a slow or paused observer could leave the whole letter blank.
          <p
            key={i}
            className="font-hand text-[1.24rem] leading-[1.5] text-[#3f3226] sm:text-[1.42rem]"
            style={{
              transform: `rotate(${(((a - 0.5) * 0.62)).toFixed(3)}deg) translateX(${(((b - 0.5) * 7)).toFixed(2)}px)`,
              letterSpacing: `${(((c - 0.5) * 0.024)).toFixed(4)}em`,
              fontWeight: c > 0.62 ? 500 : 400,
              // ink sits unevenly on cotton
              opacity: Number((0.9 + a * 0.1).toFixed(3)),
            }}
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

/**
 * A Letter to Every Bride.
 *
 * A cotton invitation resting on travertine in a sunlit atelier. Touching the
 * wax compresses it, the flap swings back on its fold, and the letter rises far
 * enough to take hold of. From there the visitor's own scroll draws it the rest
 * of the way out; once it is free, the envelope — having done its job — sinks
 * quietly out of frame and leaves only the letter.
 *
 * Under prefers-reduced-motion the whole sequence collapses to one calm fade.
 */
export default function Letter() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const timers = useRef([]);

  const [phase, setPhase] = useState('sealed'); // sealed | opening | drawing | free
  const [pressed, setPressed] = useState(false);
  const openedRef = useRef(false);

  // Letter travel, driven first by the open animation and then by scroll.
  const travel = useMotionValue(TUCKED);
  const letterY = useTransform(travel, (v) => `${v}%`);

  // Shadow deepens as the letter clears the envelope.
  const letterShadow = useTransform(
    travel,
    [GRAB, OUT],
    [
      '0 6px 14px -14px rgba(84,58,34,0.5)',
      '0 34px 56px -34px rgba(84,58,34,0.62)',
    ]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Once open, the visitor's scroll extracts the letter.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!openedRef.current || reduced) return;
    const e = Math.min(1, Math.max(0, (p - 0.12) / 0.36));
    if (e <= 0) return;
    travel.set(GRAB + (OUT - GRAB) * e);
    if (e >= 0.985) setPhase('free');
    else if (phase === 'free') setPhase('drawing');
  });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (phase !== 'sealed') return;
    if (reduced) {
      openedRef.current = true;
      travel.set(OUT);
      return setPhase('free');
    }
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    setPressed(true);
    at(T.press, () => {
      setPressed(false);
      setPhase('opening');
      // the flap has to be well clear before the letter starts to move
      at(T.flap * 0.42, () => {
        setPhase('drawing');
        openedRef.current = true;
        animate(travel, GRAB, { duration: T.grab / 1000, ease: SETTLE });
      });
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    openedRef.current = false;
    travel.set(TUCKED);
    setPhase('sealed');
  };

  useEffect(() => {
    if (phase === 'sealed') return;
    const onKey = (e) => e.key === 'Escape' && reset();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const opened = phase !== 'sealed';
  const gone = phase === 'free'; // envelope has delivered and withdraws

  return (
    <Section
      id="letter"
      ref={sectionRef}
      className="relative overflow-hidden !py-0"
      aria-labelledby="letter-heading"
    >
      <Atelier reduced={reduced} />
      <Slab height="24%" />

      <Container size="narrow" className="relative">
        <div className="flex min-h-[74svh] flex-col justify-end pb-[6svh] pt-[8svh]">
          {/* ---------- Heading ---------- */}
          <motion.div
            className="text-center"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: SETTLE }}
          >
            <p className="text-eyebrow uppercase tracking-[0.34em] text-[#6f5334]">
              A few words from me to you
            </p>
            <h2
              id="letter-heading"
              className="mt-3 font-script text-[1.65rem] leading-tight text-[#8a6335] sm:text-[2rem]"
            >
              {letter.eyebrow}
            </h2>
          </motion.div>

          {/* ---------- Stage ---------- */}
          <div className="relative mx-auto mt-9 w-[90%] max-w-[27rem]">
            {/* The letter lives above the envelope in the stack, and the space
                it needs is reserved so nothing on the page jumps as it rises. */}
            <div className="relative">
              {/* ---------- Letter ---------- */}
              {/* pointer-events-none is load-bearing: this box sits over the wax seal,
                  and the envelope's `perspective` scopes the seal button's z-index
                  inside it, so without this the letter swallows the click. */}
              <div className="pointer-events-none absolute inset-x-[3%] bottom-[46%] z-20 overflow-hidden">
                <motion.div
                  style={{ y: reduced ? '0%' : letterY }}
                  className={cx(!opened && 'invisible')}
                >
                  <motion.div
                    className="letter-paper grain rounded-[2px] px-6 pb-10 pt-8 sm:px-9"
                    style={{ boxShadow: reduced ? undefined : letterShadow }}
                  >
                    <p className="font-script text-[1.45rem] leading-none text-[#a9855c] sm:text-[1.75rem]">
                      {letter.salutation}
                    </p>
                    <div className="mt-5">
                      <Handwritten lines={letter.lines} />
                    </div>
                    <p className="mt-7 font-hand text-[1.24rem] text-[#5d4c3a] sm:text-[1.42rem]">
                      {letter.signOff}
                    </p>
                    <p className="mt-1 font-script text-[2rem] leading-none text-[#a9855c] sm:text-[2.4rem]">
                      Kamya
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* ---------- Envelope ---------- */}
              <motion.div
                className="relative aspect-[1.45/1] w-full"
                animate={gone ? { y: reduced ? '0%' : '46%', opacity: 0 } : { y: '0%', opacity: 1 }}
                transition={{ duration: reduced ? 0.3 : 1.5, ease: SETTLE }}
                style={{ perspective: 1400 }}
              >
                {/* contact shadow on the travertine */}
                <motion.div
                  aria-hidden
                  className="absolute -bottom-[4%] left-[5%] right-[5%] h-[13%] rounded-[50%] blur-[14px]"
                  style={{ background: 'rgba(92,64,38,0.5)' }}
                  animate={{ opacity: pressed ? 0.42 : 0.6, scaleX: pressed ? 0.98 : 1 }}
                  transition={{ duration: 0.22, ease: SETTLE }}
                />

                {/* back panel (letter sits against this) */}
                <div className="envelope-paper grain absolute inset-0 rounded-[3px]" />

                {/* front pocket — printed face, in front of the letter */}
                <div
                  className="envelope-paper grain absolute inset-0 z-30 rounded-[3px]"
                  style={{
                    clipPath: 'polygon(0 0, 50% 41%, 100% 0, 100% 100%, 0 100%)',
                    filter: 'drop-shadow(0 -1px 1.5px rgba(126,94,60,0.3))',
                  }}
                >
                  {/* lower fold seams */}
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top right, transparent calc(50% - 0.6px), rgba(184,146,102,0.32) 50%, transparent calc(50% + 0.6px))',
                      clipPath: 'polygon(0 100%, 50% 41%, 50% 100%)',
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top left, transparent calc(50% - 0.6px), rgba(184,146,102,0.32) 50%, transparent calc(50% + 0.6px))',
                      clipPath: 'polygon(100% 100%, 50% 41%, 50% 100%)',
                    }}
                  />

                  <FloralCorner className="absolute bottom-[4%] left-[2%] h-[46%] w-[36%] opacity-90" />
                  <FloralCorner
                    flip
                    className="absolute bottom-[4%] right-[2%] h-[46%] w-[36%] opacity-90"
                  />

                  <p className="absolute inset-x-0 bottom-[9%] text-center font-script text-[0.94rem] tracking-wide text-[#a07d55] sm:text-[1.05rem]">
                    A letter to every bride
                  </p>

                  {/* the slow travelling highlight across the cotton */}
                  <span aria-hidden className="absolute inset-0 overflow-hidden rounded-[3px]">
                    <span
                      className={cx('absolute inset-0', !reduced && 'paper-sheen')}
                      style={{
                        background:
                          'linear-gradient(108deg, transparent 42%, rgba(255,250,238,0.5) 50%, transparent 58%)',
                      }}
                    />
                  </span>
                </div>

                {/* ---------- Flap ---------- */}
                <motion.div
                  className="absolute inset-x-0 top-0 z-40 h-[41%] origin-top"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: opened ? -167 : 0 }}
                  transition={{ duration: reduced ? 0 : T.flap / 1000, ease: HINGE }}
                >
                  {/* outer face */}
                  <motion.div
                    className="envelope-paper grain absolute inset-0"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      backfaceVisibility: 'hidden',
                    }}
                    // paper memory: the fold flexes, then settles
                    animate={{ rotateX: opened ? [0, 7, -2.5, 0] : 0 }}
                    transition={{
                      duration: reduced ? 0 : T.flap / 1000,
                      ease: SETTLE,
                      times: [0, 0.4, 0.74, 1],
                    }}
                  >
                    <Monogram className="absolute inset-x-0 top-[4%] mx-auto h-[56%] w-[58%]" />
                    <FoilEdge className="absolute inset-0 h-full w-full" />
                    {/* the face turns away from the window as it opens */}
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 bg-[#6d4f33]"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                      animate={{ opacity: opened ? 0.2 : 0 }}
                      transition={{ duration: T.flap / 1000, ease: HINGE }}
                    />
                  </motion.div>
                  {/* inner face, seen once it has swung back */}
                  <motion.div
                    className="envelope-paper absolute inset-0"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      transform: 'rotateY(180deg)',
                      filter: 'brightness(0.93)',
                    }}
                    animate={{ opacity: opened ? 1 : 0 }}
                    transition={{ duration: 0.01, delay: opened ? 0.3 : 0 }}
                  />
                </motion.div>

                {/* ---------- Wax seal ---------- */}
                {/* Rides on the flap: it sits at the fold's point and swings
                    back with it, exactly as a broken seal would. */}
                <motion.div
                  className="absolute left-1/2 z-50 -translate-x-1/2"
                  style={{ top: '41%', translateY: '-50%', transformStyle: 'preserve-3d' }}
                  animate={{
                    y: pressed ? 1.5 : 0,
                    scale: pressed ? 0.975 : 1,
                    opacity: opened ? 0 : 1,
                  }}
                  transition={{
                    y: { duration: 0.16, ease: SETTLE },
                    scale: { duration: 0.16, ease: SETTLE },
                    opacity: { duration: 0.5, ease: SETTLE, delay: opened ? 0.25 : 0 },
                  }}
                >
                  <WaxSeal className="h-[3.6rem] w-[3.6rem] sm:h-[4rem] sm:w-[4rem]" />
                </motion.div>

                {/* the seal is the target */}
                {phase === 'sealed' && (
                  <button
                    type="button"
                    onClick={open}
                    onPointerDown={() => !reduced && setPressed(true)}
                    onPointerUp={() => setPressed(false)}
                    onPointerLeave={() => setPressed(false)}
                    aria-label="Break the seal and open the letter"
                    className="absolute left-1/2 top-[41%] z-[60] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b08d63]"
                  />
                )}
              </motion.div>
            </div>

            {/* ---------- Hint ---------- */}
            <div className="mt-7 h-6 text-center">
              {phase === 'sealed' ? (
                <motion.p
                  className="text-eyebrow uppercase tracking-[0.3em] text-[#9b7a52]"
                  initial={reduced ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.9, ease: SETTLE }}
                >
                  Touch to open
                </motion.p>
              ) : (
                <motion.p
                  className="text-eyebrow uppercase tracking-[0.26em] text-[#9b7a52]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'drawing' ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: SETTLE }}
                >
                  Keep scrolling
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
