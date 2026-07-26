'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { album } from '@/lib/content';
import { cx } from '@/components/ui';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

/**
 * Object 02 — Bridal Stories, adapted for the Bridal Suite.
 *
 * A vertical, one-photo-per-page album rather than a landscape two-up
 * spread — the source photographs are vertical, so a single full-height
 * page shows each one far larger. The cover opens itself once the Suite's
 * camera has zoomed in, and it can be told to reverse and close via the
 * `closing` prop. Pages turn on a real hinge at the left edge, like a bound
 * notebook, and autoplay through the whole album so it reads as alive
 * rather than as a static gallery.
 */

const SETTLE = [0.22, 0.61, 0.24, 1];
const TURN = [0.36, 0.66, 0.18, 1];

const T = {
  press: 90,
  cover: 1250,
  turn: 900,
  auto: 1500,
  resume: 9000,
  wake: 1000,
};

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
        sizes="(min-width: 1024px) 34rem, 88vw"
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

function Face({ page, active, reduced, priority }) {
  return (
    <span className="album-page absolute inset-0 p-[4%]">
      <span className="relative block h-full w-full overflow-hidden bg-[#e8dcc8]">
        <Cinemagraph page={page} active={active} reduced={reduced} priority={priority} />
      </span>
    </span>
  );
}

export default function AlbumObject({ closing, onClosed }) {
  const reduced = useReducedMotion();
  const pages = album.pages;

  const [open, setOpen] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [index, setIndex] = useState(0);
  const [turning, setTurning] = useState(null);
  const [idle, setIdle] = useState(true);

  const turningRef = useRef(null);
  const timers = useRef([]);
  const idleTimer = useRef(null);
  const drag = useRef(null);

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(idleTimer.current);
    },
    []
  );

  const touch = useCallback(() => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), T.resume);
  }, []);

  const go = useCallback(
    (dir) => {
      setIndex((cur) => {
        const base = turningRef.current ? cur + (turningRef.current === 'next' ? 1 : -1) : cur;
        const next = base + (dir === 'next' ? 1 : -1);
        if (next < 0 || next >= pages.length) return base;

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
    [reduced, pages.length]
  );

  const openAlbum = useCallback(() => {
    if (open) return;
    if (reduced) return setOpen(true);
    setPressed(true);
    at(T.press, () => {
      setPressed(false);
      setOpen(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduced]);

  // Auto-open: the Suite's zoom has already drawn the eye here.
  useEffect(() => {
    openAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reverse on request: pages settle, cover swings shut.
  useEffect(() => {
    if (!closing) return undefined;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    turningRef.current = null;
    setTurning(null);

    if (reduced) {
      setOpen(false);
      onClosed?.();
      return undefined;
    }

    setOpen(false);
    at(T.cover, () => onClosed?.());
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  // Autoplay: turns to the next page every 1.5s and loops back to the
  // start once it reaches the end, so the album keeps reading as alive
  // rather than settling into a static image. Pauses on any interaction
  // (touch()) and resumes after T.resume of no input.
  useEffect(() => {
    if (!open || !idle || reduced || closing) return undefined;
    const id = setTimeout(() => {
      if (index < pages.length - 1) go('next');
      else setIndex(0);
    }, T.auto);
    return () => clearTimeout(id);
  }, [open, idle, reduced, closing, index, go, pages.length]);

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

  const cur = pages[index];
  const nxt = pages[Math.min(index + 1, pages.length - 1)];
  const prv = pages[Math.max(index - 1, 0)];

  // The page revealed once the turning leaf finishes rotating.
  const base = turning === 'prev' ? prv : turning === 'next' ? nxt : cur;

  return (
    <div className="relative mx-auto w-[90%] max-w-[26rem] sm:max-w-[30rem] lg:max-w-[34rem]">
      <motion.div
        className="relative"
        initial={reduced ? false : { opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: SETTLE }}
      >
        <motion.div
          aria-hidden
          className="absolute -bottom-[4%] left-[8%] right-[8%] h-[10%] rounded-[50%] blur-[22px]"
          style={{ background: 'rgba(86,60,34,0.6)' }}
          animate={{ opacity: open ? 0.85 : 0.7, scaleX: open ? 1.06 : 1 }}
          transition={{ duration: 1.2, ease: SETTLE }}
        />

        <div
          className="relative aspect-[4/5] w-full [perspective:2200px]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* ---------- Base page — whatever the turning leaf reveals ---------- */}
          {open && (
            <span className="absolute inset-0 overflow-hidden rounded-[3px] shadow-[inset_-10px_0_20px_-18px_rgba(90,64,38,0.6)]">
              <Face page={base} active={!turning} reduced={reduced} priority={index === 0} />
            </span>
          )}

          {/* ---------- Turning leaf — hinged at the left, like a bound page ---------- */}
          {turning && (
            <motion.div
              className="absolute inset-0 z-30"
              style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
              initial={{ rotateY: turning === 'next' ? 0 : -180 }}
              animate={{ rotateY: turning === 'next' ? -180 : 0 }}
              transition={{ duration: T.turn / 1000, ease: TURN }}
            >
              <span className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <Face page={turning === 'next' ? cur : prv} active={false} reduced={reduced} />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-[#5c422a]"
                  initial={{ opacity: turning === 'next' ? 0 : 0.3 }}
                  animate={{ opacity: turning === 'next' ? [0, 0.16, 0.3] : [0.3, 0.14, 0] }}
                  transition={{ duration: T.turn / 1000, ease: TURN }}
                />
              </span>
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <Face page={turning === 'next' ? nxt : cur} active={false} reduced={reduced} />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-[#5c422a]"
                  initial={{ opacity: turning === 'next' ? 0.3 : 0 }}
                  animate={{ opacity: turning === 'next' ? [0.3, 0.14, 0] : [0, 0.16, 0.3] }}
                  transition={{ duration: T.turn / 1000, ease: TURN }}
                />
              </span>
            </motion.div>
          )}

          {/* ---------- Cover — full frame, hinged at the left like a bound album ---------- */}
          <motion.div
            className="absolute inset-0 z-40"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
            animate={{ rotateY: open ? -172 : 0 }}
            transition={{ duration: reduced ? 0 : T.cover / 1000, ease: SETTLE }}
          >
            <motion.span
              className="album-linen grain absolute inset-0 rounded-[4px] ring-1 ring-[#a98b63]/35"
              style={{ backfaceVisibility: 'hidden' }}
              animate={{
                boxShadow: pressed
                  ? '0 6px 14px -8px rgba(70,48,26,0.6), 0 2px 4px -2px rgba(70,48,26,0.5), inset 0 0 40px rgba(126,98,62,0.18)'
                  : '0 26px 46px -26px rgba(70,48,26,0.7), 0 8px 16px -10px rgba(70,48,26,0.55), inset 0 0 40px rgba(126,98,62,0.14)',
                y: pressed ? 1.5 : 0,
              }}
              transition={{ duration: 0.18, ease: SETTLE }}
            >
              {/* The book's spine — a soft shadow along the bound left edge. */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[10%]"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(70,48,26,0.35), transparent), repeating-linear-gradient(180deg, rgba(150,120,84,0.3) 0 3px, transparent 3px 8px)',
                }}
              />

              {[
                'right-0 top-0 rounded-tr-[4px] border-r border-t',
                'bottom-0 right-0 rounded-br-[4px] border-b border-r',
              ].map((pos) => (
                <span key={pos} aria-hidden className={cx('absolute h-9 w-9 border-[#b99a6b]/45', pos)} />
              ))}

              <span className="absolute inset-0 grid place-items-center">
                <span className="relative">
                  <span className="album-deboss font-serif text-[2.6rem] font-light tracking-[0.14em]">KM</span>
                  <span aria-hidden className="absolute inset-0 overflow-hidden">
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

              <span
                aria-hidden
                className="album-edges-v absolute -right-[7px] bottom-[3%] top-[3%] w-[8px] rounded-r-[2px]"
              />
              <span
                aria-hidden
                className="album-edges absolute -bottom-[7px] left-[2%] right-[2%] h-[8px] rounded-b-[2px]"
              />
            </motion.span>

            <span
              className="album-page absolute inset-0 rounded-[3px]"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                boxShadow: 'inset -14px 0 22px -16px rgba(90,64,38,0.55)',
              }}
            />
          </motion.div>

          {!open && (
            <button
              type="button"
              onClick={openAlbum}
              onKeyDown={onKeyDown}
              onPointerDown={() => !reduced && setPressed(true)}
              onPointerUp={() => setPressed(false)}
              onPointerLeave={() => setPressed(false)}
              aria-label="Open the bridal journal"
              aria-expanded={false}
              className="absolute inset-0 z-50 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-[#b08d63]"
            />
          )}

          {open && (
            <div
              tabIndex={0}
              role="group"
              aria-label={`Bridal journal, page ${index + 1} of ${pages.length}`}
              onKeyDown={onKeyDown}
              className="absolute inset-0 z-[45] focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-[#b08d63]"
              style={{ pointerEvents: 'none' }}
            />
          )}

          {/* ---------- Permanent arrows — always in the same spot, no caption ---------- */}
          {open && (
            <>
              <button
                type="button"
                onClick={() => {
                  touch();
                  go('prev');
                }}
                disabled={index === 0}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 z-[46] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-8px_rgba(43,39,36,0.5)] transition-opacity duration-300 hover:text-gold disabled:opacity-0 disabled:pointer-events-none sm:left-3"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  touch();
                  go('next');
                }}
                disabled={index === pages.length - 1}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 z-[46] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-8px_rgba(43,39,36,0.5)] transition-opacity duration-300 hover:text-gold disabled:opacity-0 disabled:pointer-events-none sm:right-3"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
