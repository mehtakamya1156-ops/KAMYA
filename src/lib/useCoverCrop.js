'use client';

import { useEffect, useState } from 'react';

/**
 * Live crop percentage for an `object-fit: cover` image at its CURRENT
 * rendered size, recalculated on resize.
 *
 * When a fixed-aspect photo fills an arbitrary container via `cover`
 * (object-position 50% 50%), the browser scales it up until it fully covers
 * the box, then centres and crops the overflow off both sides of whichever
 * axis overflows. Any hotspot position measured as a percentage of the
 * ORIGINAL photo drifts off the real object once that crop happens — this
 * hook returns how much is being cropped off each axis (as a percentage of
 * the original image) so callers can remap their coordinates back onto the
 * visible region instead of guessing or accepting drift.
 */
export function useCoverCrop(ref, imgW, imgH) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !imgW || !imgH) return undefined;

    const compute = () => {
      const { width: cw, height: ch } = el.getBoundingClientRect();
      if (!cw || !ch) return;
      const scale = Math.max(cw / imgW, ch / imgH);
      const dispW = imgW * scale;
      const dispH = imgH * scale;
      const cropXpx = Math.max(0, (dispW - cw) / 2 / scale);
      const cropYpx = Math.max(0, (dispH - ch) / 2 / scale);
      setCrop({ x: (cropXpx / imgW) * 100, y: (cropYpx / imgH) * 100 });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [ref, imgW, imgH]);

  return crop;
}

/** Remaps a percentage measured on the ORIGINAL photo onto the visible,
 * cropped region — e.g. `remapPercent(36.5, crop.x)`. */
export function remapPercent(originalPercent, cropPercent) {
  const visibleSpan = 100 - 2 * cropPercent;
  if (visibleSpan <= 0) return originalPercent;
  return ((originalPercent - cropPercent) / visibleSpan) * 100;
}

/** Remaps a WIDTH/HEIGHT span (not a position) measured on the ORIGINAL
 * photo onto the visible, cropped region — spans scale but don't shift. */
export function remapSpan(originalSpan, cropPercent) {
  const visibleSpan = 100 - 2 * cropPercent;
  if (visibleSpan <= 0) return originalSpan;
  return (originalSpan / visibleSpan) * 100;
}
