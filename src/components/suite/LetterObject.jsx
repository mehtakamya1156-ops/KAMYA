'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { letter } from '@/lib/content';
import { FloralCorner } from '@/components/envelope/Artwork';

/**
 * Object 01 — A Letter to Every Bride, adapted for the Bridal Suite.
 *
 * No envelope theatre — tapping straight to the letter reads as more
 * intimate than a seal-and-flap sequence. It opens as one centred, upright
 * page — the same "vertical card" shape as the album and candle objects —
 * rather than taking over the whole screen.
 */

const EASE = [0.16, 1, 0.3, 1];

const T = {
  closeSettle: 500,
};

function rand(i, seed) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
}

function Handwritten({ lines }) {
  return (
    <div className="space-y-[0.4em]">
      {lines.map((line, i) => {
        const a = rand(i, 1);
        const b = rand(i, 2);
        const c = rand(i, 3);
        return (
          <p
            key={i}
            className="font-hand text-[0.86rem] leading-[1.35] text-[#3f3226] sm:text-[0.94rem]"
            style={{
              transform: `rotate(${((a - 0.5) * 0.4).toFixed(3)}deg) translateX(${((b - 0.5) * 4).toFixed(2)}px)`,
              letterSpacing: `${((c - 0.5) * 0.02).toFixed(4)}em`,
              fontWeight: c > 0.62 ? 500 : 400,
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

export default function LetterObject({ closing, onClosed }) {
  const reduced = useReducedMotion();
  const timers = useRef([]);
  const [shown, setShown] = useState(false);

  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return undefined;
    }
    at(40, () => setShown(true));
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!closing) return undefined;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (reduced) {
      onClosed?.();
      return undefined;
    }

    setShown(false);
    at(T.closeSettle, () => onClosed?.());
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  return (
    <div className="relative mx-auto w-[88%] max-w-[22rem] sm:max-w-[24rem]">
      <motion.div
        className="relative aspect-[9/16] w-full overflow-hidden rounded-[3px] shadow-[0_40px_70px_-30px_rgba(43,30,18,0.55)]"
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.96 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="notebook-rule grain absolute inset-0 flex flex-col overflow-y-auto px-5 py-6">
          <FloralCorner className="pointer-events-none absolute bottom-3 left-3 h-10 w-10 opacity-40" />
          <FloralCorner flip className="pointer-events-none absolute bottom-3 right-3 h-10 w-10 opacity-40" />

          <div className="relative m-auto w-full py-2">
            <p className="text-center text-[0.5rem] uppercase tracking-[0.22em] text-[#a9855c]">
              {letter.eyebrow}
            </p>
            <p className="mt-3 font-script text-[1.15rem] leading-none text-[#a9855c]">
              {letter.salutation}
            </p>
            <div className="mt-3">
              <Handwritten lines={letter.lines} />
            </div>
            <div className="mt-4">
              <p className="font-hand text-[0.8rem] text-[#5d4c3a]">{letter.signOff}</p>
              <p className="mt-1 font-script text-[1.35rem] leading-none text-[#a9855c]">
                {letter.signatureName}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
