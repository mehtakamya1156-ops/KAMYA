'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { album } from '@/lib/content';
import { Container, Section, cx } from '@/components/ui';
import { Atelier, Slab } from '@/components/Atelier';

/* One decelerating family of curves. Paper settles; it never springs. */
const SETTLE = [0.22, 0.61, 0.24, 1];
const TURN = [0.36, 0.66, 0.18, 1];

const T = {
  press: 90,
  cover: 1250, // hardcover lifts off the spine
  turn: 900, // one leaf turns
  auto: 2000, // dwell on each spread
  resume: 9000, // idle before auto-turning resumes
  wake: 1000, // still photograph → cinemagraph
};

/* -------------------------------------------------------------------------- */

/**
 * A page that reads as a photograph, then quietly comes alive.
 *
 * The still is always rendered. When the page carries a `video` and its spread
 * is settled, the clip mounts a beat later and fades over the top — muted,
 * looping, no controls. With no `video` the still simply stays, so the album
 * works exactly as-is until footage exists.
 */
function Cinemagraph({ page, active, reduced, priority }) {
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    if (!page?.video || !active || reduced) return setAwake(false);
    const id = setTimeout(() => setAwake(true), T.wake);
    return () => clearTimeout(id);
  }, [page?.video, active, reduced]);

  if (!page?.src) return null;

  return (
    <span className="absolute inset-0 overflow-hidden">
      <Image
        src={page.src}
        alt={page.alt}
        fill
        sizes="(min-width: 768px) 24rem, 46vw"
        quality={82}
        priority={priority}
        className="object-cover"
      />
      {page.video && awake && (
        <motion.video
          src={page.video}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: SETTLE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}

/** The quiet closing leaf that ends the album. */
function ClosingLeaf() {
  return (
    <span className="album-page absolute inset-0 grid place-items-center px-7 text-center">
      <span>
        <span className="block font-script text-[1.7rem] leading-tight text-[#a2825e]">
          {album.closing.line}
        </span>
        <Link
          href="#booking"
          className="mt-5 inline-flex min-h-[44px] items-center border-b border-[#c9ab84] pb-1 text-eyebrow uppercase tracking-[0.2em] text-[#8a6b47] transition-colors duration-300 hover:text-[#6d5233]"
        >
          {album.closing.cta}
        </Link>
      </span>
    </span>
  );
}

/** One printed leaf face — photograph with a hairline mount, or the closing card. */
function Face({ page, active, reduced, priority }) {
  if (page?.closing) return <ClosingLeaf />;
  return (
    <span className="album-page absolute inset-0 p-[5%]">
      <span className="relative block h-full w-full overflow-hidden bg-[#e8dcc8]">
        <Cinemagraph page={page} active={active} reduced={reduced} priority={priority} />
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */

export default function Portfolio() {
  const reduced = useReducedMotion();
  const spreads = album.spreads;

  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState(null); // null | 'next' | 'prev'
  const [idle, setIdle] = useState(true); // auto-turning allowed

  const turningRef = useRef(null);
  const timers = useRef([]);
  const idleTimer = useRef(null);
  const drag = useRef(null);

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(idleTimer.current);
  }, []);

  /** Any deliberate interaction stops auto-turning for a while. */
  const touch = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), T.resume);
  }, []);

  /**
   * Turn a leaf. A turn already in flight is committed immediately rather than
   * ignored, so a visitor can keep flipping without waiting for each page to
   * land — the album keeps up with them instead of feeling locked.
   */
  const go = useCallback(
    (dir) => {
      setIndex((cur) => {
        // Commit any in-flight turn first.
        const base = turningRef.current
          ? cur + (turningRef.current === 'next' ? 1 : -1)
          : cur;
        const next = base + (dir === 'next' ? 1 : -1);
        if (next < 0 || next >= spreads.length) return base;

        timers.current.forEach(clearTimeout);
        timers.current = [];

        if (reduced) {
          turningRef.current = null;
          setTurning(null);
          return next;
        }

        turningRef.current = dir;
        setTurning(dir);
        at(T.turn, () => {
          turningRef.current = null;
          setTurning(null);
          setIndex(next);
        });
        return base;
      });
    },
    [reduced, spreads.length]
  );

  const openAlbum = () => {
    if (open) return;
    // Deliberately does NOT call touch(): opening is the invitation to watch,
    // not an interruption, so the album should begin turning straight away.
    if (reduced) return setOpen(true);
    setPressed(true);
    at(T.press, () => {
      setPressed(false);
      setOpen(true);
    });
  };

  // Auto-turn once open and idle.
  useEffect(() => {
    if (!open || !idle || reduced) return;
    const id = setTimeout(() => {
      if (index < spreads.length - 1) go('next');
      else setIndex(0);
    }, T.auto);
    return () => clearTimeout(id);
  }, [open, idle, reduced, index, go, spreads.length]);

  // Keyboard
  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAlbum();
      }
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      touch();
      go('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      touch();
      go('prev');
    }
  };

  // Swipe / drag
  const onPointerDown = (e) => {
    if (!open) return;
    drag.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (!open || drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) < 45) return;
    touch();
    go(dx < 0 ? 'next' : 'prev');
  };

  const cur = spreads[index];
  const nxt = spreads[Math.min(index + 1, spreads.length - 1)];
  const prv = spreads[Math.max(index - 1, 0)];

  // While a leaf is turning, the layer underneath already shows the destination.
  const baseLeft = turning === 'prev' ? prv.left : cur.left;
  const baseRight = turning === 'next' ? nxt.right : cur.right;

  return (
    <Section id="portfolio" className="relative overflow-hidden !py-0">
      <Atelier reduced={reduced} viewpoint="lower" />
      <Slab height="34%" />

      <Container size="default" className="relative">
        <div className="flex min-h-[86svh] flex-col justify-end pb-[9svh] pt-[8svh]">
          {/* ---------- Heading ---------- */}
          <motion.div
            className="text-center"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: SETTLE }}
          >
            <p className="text-eyebrow uppercase tracking-[0.3em] text-[#7a5c3c]">
              {album.eyebrow}
            </p>
            <h2 className="mt-3 font-script text-[1.9rem] leading-tight text-[#5f4527] sm:text-[2.3rem]">
              {album.heading}
            </h2>
          </motion.div>

          {/* ---------- Album ---------- */}
          <motion.div
            className="relative mx-auto mt-8 w-[92%] max-w-[46rem]"
            initial={reduced ? false : { opacity: 0, y: 50, scale: 0.98, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: SETTLE }}
          >
            {/* contact shadow — arrives a beat before the album settles */}
            <motion.div
              aria-hidden
              className="absolute -bottom-[5%] left-[6%] right-[6%] h-[16%] rounded-[50%] blur-[22px]"
              style={{ background: 'rgba(86,60,34,0.62)' }}
              initial={reduced ? false : { opacity: 0, scaleX: 0.8 }}
              whileInView={{ opacity: open ? 0.85 : 0.7, scaleX: open ? 1.06 : 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.2, ease: SETTLE }}
            />

            {/* The stage keeps a constant footprint; the book re-centres as it
                opens, so the composition never lurches. */}
            <div
              className="relative aspect-[3/2] w-full [perspective:2200px]"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              {/* The closed book occupies the right half, so the whole stage
                  slides left to keep it centred; opening returns it to 0. A
                  plain CSS transform keeps this deterministic. */}
              <div
                className="absolute inset-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: open ? 'translateX(0%)' : 'translateX(-25%)',
                  transition: reduced
                    ? 'none'
                    : `transform ${T.cover}ms cubic-bezier(0.22,0.61,0.24,1)`,
                }}
              >
                {/* ---------- Left half ---------- */}
                <div className="absolute inset-y-0 left-0 w-1/2">
                  {open && (
                    <span className="absolute inset-0 overflow-hidden rounded-l-[3px] shadow-[inset_-14px_0_22px_-16px_rgba(90,64,38,0.6)]">
                      <Face page={baseLeft} active={!turning} reduced={reduced} />
                    </span>
                  )}
                </div>

                {/* ---------- Right half ---------- */}
                <div className="absolute inset-y-0 right-0 w-1/2">
                  {open && (
                    <span className="absolute inset-0 overflow-hidden rounded-r-[3px] shadow-[inset_14px_0_22px_-16px_rgba(90,64,38,0.6)]">
                      <Face page={baseRight} active={!turning} reduced={reduced} priority={index === 0} />
                    </span>
                  )}

                  {/* page block: the album is thick, and you can see it */}
                  <span
                    aria-hidden
                    className="album-edges-v absolute -right-[6px] bottom-[2%] top-[2%] w-[7px] rounded-r-[2px] shadow-[2px_0_6px_-3px_rgba(90,64,38,0.5)]"
                  />
                </div>

                {/* ---------- Turning leaf ---------- */}
                {turning && (
                  <motion.div
                    className="absolute inset-y-0 z-30"
                    style={{
                      left: '50%',
                      width: '50%',
                      transformStyle: 'preserve-3d',
                      transformOrigin: turning === 'next' ? 'left center' : 'right center',
                      ...(turning === 'prev' ? { left: '0%' } : null),
                    }}
                    initial={{ rotateY: turning === 'next' ? 0 : 0 }}
                    animate={{ rotateY: turning === 'next' ? -180 : 180 }}
                    transition={{ duration: T.turn / 1000, ease: TURN }}
                  >
                    {/* front face */}
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <Face
                        page={turning === 'next' ? cur.right : cur.left}
                        active={false}
                        reduced={reduced}
                      />
                      {/* light falling off the leaf as it lifts */}
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-[#5c422a]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.16, 0.3] }}
                        transition={{ duration: T.turn / 1000, ease: TURN }}
                      />
                    </span>
                    {/* back face — the page revealed behind it */}
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <Face
                        page={turning === 'next' ? nxt.left : prv.right}
                        active={false}
                        reduced={reduced}
                      />
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 bg-[#5c422a]"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: [0.3, 0.14, 0] }}
                        transition={{ duration: T.turn / 1000, ease: TURN }}
                      />
                    </span>
                  </motion.div>
                )}

                {/* ---------- Hardcover ---------- */}
                <motion.div
                  className="absolute inset-y-0 right-0 z-40 w-1/2"
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'left center',
                  }}
                  animate={{ rotateY: open ? -172 : 0 }}
                  transition={{ duration: reduced ? 0 : T.cover / 1000, ease: SETTLE }}
                >
                  {/* outside of the cover */}
                  <motion.span
                    className="album-linen grain absolute inset-0 rounded-r-[4px] rounded-l-[2px] ring-1 ring-[#a98b63]/35"
                    style={{ backfaceVisibility: 'hidden' }}
                    animate={{
                      boxShadow: pressed
                        ? '0 6px 14px -8px rgba(70,48,26,0.6), 0 2px 4px -2px rgba(70,48,26,0.5), inset 0 0 40px rgba(126,98,62,0.18)'
                        : '0 26px 46px -26px rgba(70,48,26,0.7), 0 8px 16px -10px rgba(70,48,26,0.55), inset 0 0 40px rgba(126,98,62,0.14)',
                      y: pressed ? 1.5 : 0,
                    }}
                    transition={{ duration: 0.18, ease: SETTLE }}
                  >
                    {/* brass corners, very restrained */}
                    {[
                      'right-0 top-0 rounded-tr-[4px] border-r border-t',
                      'bottom-0 right-0 rounded-br-[4px] border-b border-r',
                    ].map((pos) => (
                      <span
                        key={pos}
                        aria-hidden
                        className={cx(
                          'absolute h-9 w-9 border-[#b99a6b]/45',
                          pos
                        )}
                      />
                    ))}

                    {/* gold deboss */}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="relative">
                        <span className="album-deboss font-serif text-[2.4rem] font-light tracking-[0.14em]">
                          KM
                        </span>
                        <span
                          aria-hidden
                          className="absolute inset-0 overflow-hidden"
                        >
                          <span
                            className={cx('absolute inset-0', !reduced && 'album-gleam')}
                            style={{
                              background:
                                'linear-gradient(108deg, transparent 40%, rgba(255,246,226,0.9) 50%, transparent 60%)',
                            }}
                          />
                        </span>
                      </span>
                    </span>

                    {/* page block peeking along the fore-edge */}
                    <span
                      aria-hidden
                      className="album-edges-v absolute -right-[7px] bottom-[3%] top-[3%] w-[8px] rounded-r-[2px]"
                    />
                    {/* and along the bottom, so it reads as ~35mm of paper */}
                    <span
                      aria-hidden
                      className="album-edges absolute -bottom-[7px] left-[2%] right-[2%] h-[8px] rounded-b-[2px]"
                    />
                  </motion.span>

                  {/* inside of the cover, seen once it swings open */}
                  <span
                    className="album-page absolute inset-0 rounded-l-[3px]"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      boxShadow: 'inset -14px 0 22px -16px rgba(90,64,38,0.55)',
                    }}
                  />
                </motion.div>

                {/* rounded linen spine — fixed, the cover hinges from it */}
                <span
                  aria-hidden
                  className="album-linen absolute inset-y-[1%] left-1/2 z-20 w-[13px] -translate-x-1/2 rounded-[3px]"
                  style={{
                    boxShadow:
                      'inset 3px 0 5px -3px rgba(86,62,38,0.6), inset -3px 0 5px -3px rgba(86,62,38,0.6)',
                  }}
                >
                  {/* stitching */}
                  <span
                    className="absolute inset-y-[6%] left-1/2 w-px -translate-x-1/2"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(180deg, rgba(150,120,84,0.65) 0 5px, transparent 5px 11px)',
                    }}
                  />
                </span>

                {/* the closed cover is the target */}
                {!open && (
                  <button
                    type="button"
                    onClick={openAlbum}
                    onKeyDown={onKeyDown}
                    onPointerDown={() => !reduced && setPressed(true)}
                    onPointerUp={() => setPressed(false)}
                    onPointerLeave={() => setPressed(false)}
                    aria-label="Open the portfolio album"
                    aria-expanded={false}
                    className="absolute inset-y-0 right-0 z-50 w-1/2 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[#b08d63]"
                  />
                )}
              </div>
            </div>

            {/* keyboard surface once open */}
            {open && (
              <div
                tabIndex={0}
                role="group"
                aria-label={`Bridal album, spread ${index + 1} of ${spreads.length}`}
                onKeyDown={onKeyDown}
                className="absolute inset-0 z-[45] focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-[#b08d63]"
                style={{ pointerEvents: 'none' }}
              />
            )}
          </motion.div>

          {/* ---------- Caption + controls ---------- */}
          {open && (
            <motion.p
              className="mt-6 text-center text-eyebrow uppercase tracking-[0.24em] text-[#9b7d59]"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: SETTLE }}
            >
              {album.turnHint}
            </motion.p>
          )}

          <div className="mt-4 flex min-h-[2.5rem] items-center justify-center gap-6">
            {!open ? (
              <motion.p
                className="text-eyebrow uppercase tracking-[0.28em] text-[#9b7d59]"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.9, ease: SETTLE }}
              >
                {album.hint}
              </motion.p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    touch();
                    go('prev');
                  }}
                  disabled={index === 0}
                  aria-label="Previous spread"
                  className="min-h-[44px] px-2 text-eyebrow uppercase tracking-[0.2em] text-[#9b7d59] transition-opacity duration-300 hover:text-[#7a5c3c] disabled:opacity-25"
                >
                  ←
                </button>
                <p className="text-eyebrow uppercase tracking-[0.24em] text-[#8a6b47]">
                  {cur.title} · {cur.place}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    touch();
                    go('next');
                  }}
                  disabled={index === spreads.length - 1}
                  aria-label="Next spread"
                  className="min-h-[44px] px-2 text-eyebrow uppercase tracking-[0.2em] text-[#9b7d59] transition-opacity duration-300 hover:text-[#7a5c3c] disabled:opacity-25"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
