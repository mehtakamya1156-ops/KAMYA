'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useIsMobile } from '@/lib/useMediaQuery';
import { useCoverCrop, remapPercent, remapSpan } from '@/lib/useCoverCrop';
import { bridalSuite } from '@/lib/content';
import { Container, Eyebrow, Heading, Prose, Section, cx } from '@/components/ui';
import Reveal from '@/components/Reveal';
import { CloseIcon } from '@/components/icons';
import { DUR, EASE } from '@/lib/motion';
import LetterObject from '@/components/suite/LetterObject';
import AlbumObject from '@/components/suite/AlbumObject';
import CandleObject from '@/components/suite/CandleObject';
import FlowersObject from '@/components/suite/FlowersObject';

/**
 * The Bridal Suite — one photographed still life, tapped objects reveal
 * themselves in place. Universal pattern for every object: tap → the scene
 * zooms toward it → it opens automatically → an overlay holds its content →
 * close reverses all of it and returns to the full room.
 *
 * The envelope, the candle and the bridal journal are interactive at every
 * breakpoint. Flowers (the vase in the still life) is mobile-only — see the
 * `id !== 'flowers'` filter below. Nothing is ever labelled "tap here":
 * each hotspot instead breathes and catches the light on its own (see
 * `.hotspot-invite`/`.hotspot-sheen` in globals.css), so the object itself
 * is the invitation.
 *
 * Desktop and mobile now share one photograph, since the room stage's
 * dynamic cover-crop compensation already keeps hotspots accurate at any
 * aspect ratio (see `useCoverCrop`/`remapPercent` below).
 */

const OBJECTS = {
  letter: LetterObject,
  album: AlbumObject,
  candle: CandleObject,
  flowers: FlowersObject,
};

const DEFAULT_ZOOM = { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
const DEFAULT_VEIL = 'rgba(28,26,23,0.35)';

export default function BridalSuite() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const timers = useRef([]);
  const stageRef = useRef(null);

  const [activeId, setActiveId] = useState(null);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [roomSeen, setRoomSeen] = useState(false);
  const [invitePhase, setInvitePhase] = useState({});

  const room = isMobile ? bridalSuite.room.mobile : bridalSuite.room.desktop;

  // The stage is now full-bleed (100vw × 100dvh) instead of the photo's own
  // aspect ratio, so `object-cover` crops the source photo to fit — every
  // hotspot box, measured as a percentage of the ORIGINAL photo, has to be
  // remapped onto whatever's actually still visible after that crop.
  const crop = useCoverCrop(stageRef, room.w, room.h);
  // Flowers is mobile-only — everything else is interactive at every
  // breakpoint, as before.
  const hotspots = bridalSuite.hotspots
    .filter((h) => h.id !== 'flowers' || isMobile)
    .map((h) => {
      const box = isMobile ? h.mobile : h.desktop;
      return {
        ...h,
        box: {
          x: remapPercent(box.x, crop.x),
          y: remapPercent(box.y, crop.y),
          w: remapSpan(box.w, crop.x),
          h: remapSpan(box.h, crop.y),
        },
      };
    });
  const activeHotspot = hotspots.find((h) => h.id === activeId);
  const transformOrigin = activeHotspot
    ? `${activeHotspot.box.x + activeHotspot.box.w / 2}% ${activeHotspot.box.y + activeHotspot.box.h / 2}%`
    : '50% 50%';

  // Every object gets its own scale, pacing and light tint (per the brief's
  // "every object should have its own cinematic camera movement") rather
  // than one shared zoom — falls back to the original letter/album values
  // once activeId clears and there's no hotspot left to read from.
  const zoom = activeHotspot?.zoom ?? DEFAULT_ZOOM;
  const zoomScale = activeId ? (isMobile ? zoom.mobile : zoom.desktop) : 1;
  const veilColor = activeHotspot?.veil ?? DEFAULT_VEIL;

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The moment the room first scrolls into view, each object plays one
  // noticeably bigger "arrival" pulse (`.hotspot-arrive`) — a glow bloom
  // scaled well past the ambient breathing — then hands off to the quiet
  // permanent `.hotspot-invite` loop. This is what actually teaches a
  // first-time visitor these objects respond to touch: it fires on scroll,
  // not on hover, so it works identically on mobile (no cursor) and desktop.
  useEffect(() => {
    if (!roomSeen || reduced) return undefined;
    bridalSuite.hotspots
      .filter((h) => h.id !== 'flowers' || isMobile)
      .forEach((h, i) => {
        at(i * 220, () => {
          setInvitePhase((p) => ({ ...p, [h.id]: 'arriving' }));
          at(1100, () => setInvitePhase((p) => ({ ...p, [h.id]: 'ambient' })));
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomSeen, reduced, isMobile]);

  function openObject(id) {
    if (activeId) return;
    setActiveId(id);
    at(reduced ? 0 : 650, () => setOverlayMounted(true));
  }

  function requestClose() {
    if (!activeId || closing) return;
    setClosing(true);
  }

  function handleClosed() {
    setOverlayMounted(false);
    setClosing(false);
    setActiveId(null);
  }

  // Escape closes whichever object is open; body scroll is locked while the
  // overlay is up so the page behind can't drift underneath it.
  useEffect(() => {
    if (!activeId) return undefined;
    const onKey = (e) => e.key === 'Escape' && requestClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const ActiveObject = activeId ? OBJECTS[activeId] : null;

  return (
    <Section id="bridal-suite" tone="cream" className="relative overflow-hidden !pt-12 sm:!pt-16">
      <Container size="wide">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">{bridalSuite.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <Heading className="mt-6 md:hidden">{bridalSuite.headingMobile}</Heading>
            <Heading className="mt-6 hidden md:block">{bridalSuite.heading}</Heading>
          </Reveal>
          <Reveal delay={0.14}>
            <Prose className="mx-auto mt-5 text-center md:hidden">{bridalSuite.introMobile}</Prose>
            <Prose className="mx-auto mt-5 hidden text-center md:block">{bridalSuite.intro}</Prose>
          </Reveal>
        </div>
      </Container>

      {/* Full-bleed room — breaks out of Container's max-width to span the
          entire viewport with no border/card, per "only the Suite should
          cover the screen, rest goes away." Header/FloatingActions read
          useSuiteTakeover() (watching this exact element) to hide themselves
          while it fills the screen; scroll itself is never hijacked. */}
      <Reveal delay={0.1} variant="fadeScale" onViewportEnter={() => setRoomSeen(true)}>
        <div
          id="bridal-suite-stage"
          ref={stageRef}
          className="relative left-1/2 mt-14 w-screen -translate-x-1/2 overflow-hidden"
          style={{
            // The still life spreads all three objects across a wide
            // landscape frame, with the candle sitting close to the top edge
            // and the envelope close to the right edge. A full-bleed 100dvh
            // cover-crop would crop into one axis or the other on almost any
            // screen whose aspect ratio isn't an exact match for the photo's
            // — on some desktop widths that clipped the candle's top, and on
            // narrow phones it clipped the candle and envelope almost
            // entirely. Sizing the stage to the photo's own aspect ratio
            // (letterboxed rather than full-bleed) guarantees the whole
            // image — and therefore all three objects — is always fully
            // visible and tappable, on every device.
            aspectRatio: `${room.w} / ${room.h}`,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin }}
            animate={{ scale: zoomScale }}
            transition={{ duration: reduced ? 0 : zoom.duration, ease: zoom.ease }}
          >
            <Image
              src={room.src}
              alt={room.alt}
              fill
              sizes="100vw"
              quality={82}
              priority
              className="object-cover"
            />
          </motion.div>

          {/* Dims the room once an object has been chosen, so the overlay
              content reads as the point of focus. Tint comes from the
              object itself — warm gold for the jewellery box, amber for
              the candle, and so on — rather than one flat dim for all. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: veilColor }}
            animate={{ opacity: activeId ? 1 : 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
          />

          {!activeId &&
            hotspots.map((h, i) => (
              <button
                key={h.id}
                type="button"
                onClick={() => openObject(h.id)}
                aria-label={h.label}
                className={cx(
                  'group absolute rounded-[6px] transition-transform duration-500 ease-[var(--ease-signature)] hover:scale-[1.03] focus-visible:scale-[1.03]',
                  !reduced && invitePhase[h.id] === 'arriving' && 'hotspot-arrive',
                  !reduced && invitePhase[h.id] === 'ambient' && 'hotspot-invite'
                )}
                style={{
                  left: `${h.box.x}%`,
                  top: `${h.box.y}%`,
                  width: `${h.box.w}%`,
                  height: `${h.box.h}%`,
                  '--invite-delay': `${i * 1.4}s`,
                }}
              >
                {/* Once the arrival pulse has settled: a quiet, continuous
                    breathing scale and a soft light sweep — never a second
                    pulse, never a label — so the object itself keeps reading
                    as inviting rather than instructing. */}
                {!reduced && invitePhase[h.id] === 'ambient' && (
                  <span
                    aria-hidden
                    className="hotspot-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]"
                    style={{
                      background:
                        'linear-gradient(115deg, transparent 42%, rgba(255,250,235,0.6) 50%, transparent 58%)',
                      '--invite-delay': `${i * 1.4}s`,
                    }}
                  />
                )}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[6px] opacity-0 transition-opacity duration-300 ease-[var(--ease-signature)] group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(255,246,226,0.4), transparent 75%)',
                  }}
                />
              </button>
            ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {overlayMounted && ActiveObject && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
              onClick={requestClose}
              aria-hidden
            />

            <button
              type="button"
              onClick={requestClose}
              aria-label="Close"
              className="absolute z-10 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-ink shadow-[0_10px_28px_-8px_rgba(43,39,36,0.5)] transition-colors duration-200 ease-[var(--ease-signature)] hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              style={{
                top: 'max(1.25rem, env(safe-area-inset-top))',
                right: 'max(1.25rem, env(safe-area-inset-right))',
              }}
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <div className="relative z-[5] max-h-[92svh] w-full overflow-y-auto py-10">
              <ActiveObject closing={closing} onClosed={handleClosed} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
