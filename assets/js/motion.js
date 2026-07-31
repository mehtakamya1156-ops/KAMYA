/* ══════════════════════════════════════════════════════════════
   Motion system — every scroll-driven reveal on the site.

   Principles this file enforces:
   · Weight matters. Photography is heavy and settles late; text is
     lighter; UI is immediate. Durations come from tokens.css.
   · Reveal, don't slide. Short travel, long settle, no overshoot.
   · Not everything moves. Only [data-anim] opts in.
   · Nothing bounces, spins or zooms.
   ══════════════════════════════════════════════════════════════ */
window.KM = window.KM || {};

(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(pointer: coarse)').matches;

  /* QA override, localhost only — lets us preview the motion path on a
     machine that has reduced-motion switched on at OS level. Never
     active on a real domain, so a visitor's preference always wins. */
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
    var forced = /[?&]motion=(on|off)/.exec(location.search);
    if (forced) {
      reduce = forced[1] === 'off';
      // tokens.css zeroes the durations under reduced-motion; restore them
      // so the forced preview actually shows the real timings.
      if (!reduce) {
        var st = document.documentElement.style;
        st.setProperty('--t-tap', '120ms');
        st.setProperty('--t-ui', '220ms');
        st.setProperty('--t-state', '380ms');
        st.setProperty('--t-reveal', '900ms');
        st.setProperty('--t-image', '1250ms');
      }
    }
  }

  /* Read the shared rhythm out of CSS so there's one source of truth. */
  function tok(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fallback;
    return v.endsWith('ms') ? parseFloat(v) / 1000
         : v.endsWith('s')  ? parseFloat(v)
         : parseFloat(v) || fallback;
  }

  var D = {
    tap:    tok('--t-tap', 120),
    ui:     tok('--t-ui', 220),
    state:  tok('--t-state', 380),
    reveal: tok('--t-reveal', 900),
    image:  tok('--t-image', 1250)
  };

  // Matches --e-out in tokens.css
  var EASE = 'cubic-bezier(.22,1,.36,1)';

  KM.D = D;
  KM.EASE = EASE;
  KM.reduce = reduce;

  /* ── Split a heading into word/char spans for staggered reveal ──
     Keeps the original text as an aria-label so screen readers hear
     one clean string instead of fragments.                        */
  function split(el, mode) {
    if (el.dataset.split) return;
    el.dataset.split = '1';

    var label = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);

    function wrap(node) {
      var out = document.createDocumentFragment();
      node.childNodes.forEach ? null : null;
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(mode === 'chars' ? '' : /(\s+)/);
          parts.forEach(function (p) {
            if (p === '') return;
            if (/^\s+$/.test(p)) { out.appendChild(document.createTextNode(p)); return; }
            var outer = document.createElement('span');
            outer.className = 'sp';
            var inner = document.createElement('span');
            inner.className = 'sp__i';
            inner.textContent = p;
            outer.appendChild(inner);
            out.appendChild(outer);
          });
        } else if (child.nodeType === 1) {
          if (child.tagName === 'BR') { out.appendChild(child.cloneNode()); return; }
          var clone = child.cloneNode(false);
          clone.appendChild(wrap(child));
          out.appendChild(clone);
        }
      });
      return out;
    }

    var frag = wrap(el);
    el.innerHTML = '';
    el.appendChild(frag);
    el.setAttribute('aria-hidden', 'false');
  }

  /* ── Fallback: no GSAP (CDN blocked / offline) ─────────────────
     Everything still becomes visible — the site never depends on
     the animation library to be readable.                        */
  function fallback() {
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      el.classList.add('is-in');
    });
    document.documentElement.classList.add('motion-off');
    document.documentElement.classList.remove('pre');
  }

  function boot() {
    if (reduce || !window.gsap || !window.ScrollTrigger) { fallback(); return; }

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add('motion-on');
    // .pre only exists to stop a flash-of-visible-content before GSAP takes
    // over; once motion-on is set, the reveal tweens own opacity directly,
    // so drop it rather than leave the page relying on an inline-style-vs-
    // stylesheet cascade tie-break to keep things visible.
    document.documentElement.classList.remove('pre');

    /* ── Lenis: desktop only ──────────────────────────────────────
       Phones keep native momentum scrolling — it's what thumbs
       expect, and it avoids the laggy feel Lenis gives on
       mid-range Android. 90%+ of this site's traffic is mobile.  */
    if (!coarse && window.Lenis) {
      var lenis = new window.Lenis({
        duration: 1.05, smoothWheel: true, smoothTouch: false,
        // Without this, Lenis swallows wheel input over the horizontal
        // rails (portfolio, testimonials) entirely — scrollLeft never
        // moves because Lenis intercepts the event before the rail's
        // own native overflow-x scrolling ever sees it.
        prevent: function (node) { return node && node.closest && !!node.closest('[data-lenis-prevent]'); }
      });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      KM.lenis = lenis;
    }

    var common = { ease: EASE, overwrite: 'auto' };
    function trig(el, start) {
      return { trigger: el, start: start || 'top 88%', once: true };
    }

    /* ── line: paragraphs, eyebrows, small blocks ─────────────── */
    gsap.utils.toArray('[data-anim="line"]').forEach(function (el) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 18 },
        Object.assign({ autoAlpha: 1, y: 0, duration: D.reveal, scrollTrigger: trig(el) }, common));
    });

    /* ── words / chars: display headings, staggered ───────────── */
    ['words', 'chars'].forEach(function (mode) {
      gsap.utils.toArray('[data-anim="' + mode + '"]').forEach(function (el) {
        split(el, mode);
        var bits = el.querySelectorAll('.sp__i');
        if (!bits.length) {
          gsap.fromTo(el, { autoAlpha: 0, y: 18 },
            Object.assign({ autoAlpha: 1, y: 0, duration: D.reveal, scrollTrigger: trig(el) }, common));
          return;
        }
        gsap.fromTo(bits,
          { yPercent: 108, autoAlpha: 0 },
          Object.assign({
            yPercent: 0, autoAlpha: 1,
            duration: D.reveal,
            stagger: mode === 'chars' ? 0.028 : 0.055,
            scrollTrigger: trig(el)
          }, common));
      });
    });

    /* Testimonials use the same autoplay quote player on every screen
       size now (see testimonialPlayer in main.js) — no pinned/scrubbed
       cinematic version, and no fade-handoff from Booking into it. */

    /* ── media: heavy. Longer, shorter travel, slight scale-down
         so it feels like it's settling rather than growing.      */
    gsap.utils.toArray('[data-anim="media"]').forEach(function (el) {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 34, scale: 1.03 },
        Object.assign({ autoAlpha: 1, y: 0, scale: 1, duration: D.image, scrollTrigger: trig(el, 'top 90%') }, common));
    });

    /* ── Approach photo: one slow cinematic push-in ───────────────
       Runs once on arrival and holds — not a looping Ken Burns drift.
       Lives on the <img> itself, independent of the settle animation
       on its parent figure, so the two compose rather than fight.  */
    var approachImg = document.querySelector('.approach__img');
    if (approachImg) {
      gsap.fromTo(approachImg,
        { scale: 1 },
        { scale: 1.09, duration: 7, ease: 'sine.out', scrollTrigger: trig(approachImg, 'top 85%') });
    }

    /* ── Gallery tiles: reveal in reading order, gently staggered ─ */
    var tiles = gsap.utils.toArray('#gallery .tile');
    if (tiles.length && !matchMedia('(max-width: 679px)').matches) {
      tiles.forEach(function (el, i) {
        gsap.fromTo(el,
          { autoAlpha: 0, y: 40 },
          Object.assign({
            autoAlpha: 1, y: 0, duration: D.image,
            delay: (i % 3) * 0.06,
            scrollTrigger: trig(el, 'top 92%')
          }, common));
      });
    } else {
      tiles.forEach(function (el) { el.classList.add('is-in'); gsap.set(el, { clearProps: 'all' }); });
    }

    /* Layout settles late (fonts, lazy images) — recalc once done. */
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* If the CDN never arrives, don't leave content invisible. */
  setTimeout(function () {
    if (!document.documentElement.classList.contains('motion-on') &&
        !document.documentElement.classList.contains('motion-off')) fallback();
  }, 2500);
})();
