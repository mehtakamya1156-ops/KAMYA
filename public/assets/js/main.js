/* ══════════════════════════════════════════════════════════════
   Makeup by Kamya Mehta — interaction layer
   No dependencies. Everything degrades gracefully without JS.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var WA = '918708086305';

  /* ── Opening curtain ───────────────────────────────────────── */
  (function curtain() {
    var el = $('#curtain');
    if (!el) return;
    var seen = false;
    try { seen = sessionStorage.getItem('km_seen') === '1'; } catch (e) {}

    if (seen || reduce.matches) { el.remove(); return; }
    try { sessionStorage.setItem('km_seen', '1'); } catch (e) {}

    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () {
      el.classList.add('is-up');
      document.documentElement.style.overflow = '';
      setTimeout(function () { el.remove(); }, 950);
    }, 1500);
  })();

  /* ── Nav: stuck state ──────────────────────────────────────── */
  (function nav() {
    var el = $('#nav');
    if (!el) return;
    var sentinel = $('.hero');
    var mark = function () {
      var past = sentinel
        ? window.scrollY > sentinel.offsetHeight - 90
        : window.scrollY > 80;
      el.classList.toggle('is-stuck', past);
    };
    mark();
    window.addEventListener('scroll', mark, { passive: true });
    window.addEventListener('resize', mark, { passive: true });
  })();

  /* ── Mobile menu ───────────────────────────────────────────── */
  (function menu() {
    var btn = $('#navToggle'), panel = $('#navMenu'), closeBtn = $('#navClose');
    if (!btn || !panel) return;
    var open = false, lastFocus = null;

    function set(state) {
      open = state;
      btn.setAttribute('aria-expanded', String(state));
      btn.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
      if (state) {
        lastFocus = document.activeElement;
        panel.hidden = false;
        requestAnimationFrame(function () { panel.classList.add('is-open'); });
        document.body.style.overflow = 'hidden';
        var first = $('a', panel);
        if (first) first.focus();
      } else {
        panel.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(function () { if (!open) panel.hidden = true; }, 340);
        if (lastFocus) lastFocus.focus();
      }
    }

    btn.addEventListener('click', function () { set(!open); });
    if (closeBtn) closeBtn.addEventListener('click', function () { set(false); });
    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) set(false);
    });
    window.addEventListener('resize', function () {
      if (open && window.innerWidth >= 900) set(false);
    });
  })();

  /* Scroll reveals live in motion.js — see [data-anim]. */

  /* The original envelope (#env/#envStage/id="letter") was replaced by
     the concept version below (#envConcept/id="letterConcept") — see
     letterConcept() for the one that's actually in the page now. */

  /* ── Hero video: load after paint so the poster owns LCP ───── */
  (function letterConcept() {
    var stage = $('#envStageConcept'), env = $('#envConcept'),
        sheet = $('#letterSheetConcept'), fold = $('#sheetFoldConcept');
    if (!stage || !env || !sheet) return;

    var open = false;
    var slow = reduce.matches ? 0 : 900;

    sheet.inert = true;

    function openLetter() {
      if (open) return;
      open = true;
      env.setAttribute('aria-expanded', 'true');
      stage.classList.add('is-open');
      sheet.inert = false;

      setTimeout(function () {
        if (!open) return;
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        if (fold) fold.focus({ preventScroll: true });
      }, slow ? 260 : 0);
    }

    function closeLetter() {
      if (!open) return;
      open = false;
      env.setAttribute('aria-expanded', 'false');
      stage.classList.remove('is-open');
      sheet.inert = true;
      env.focus({ preventScroll: true });
      setTimeout(function () {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }, slow);
    }

    env.addEventListener('click', openLetter);
    if (fold) fold.addEventListener('click', closeLetter);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) closeLetter();
    });

    var section = document.getElementById('letterConcept');
    document.addEventListener('click', function (e) {
      if (!open || !section) return;
      if (!section.contains(e.target)) closeLetter();
    });
  })();

  (function heroVideo() {
    var v = $('#heroVideo');
    if (!v) return;
    var conn = navigator.connection;
    if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;

    var start = function () {
      v.src = 'media/hero.mp4';
      v.load();
      var p = v.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked — poster stays */ });
    };
    if (document.readyState === 'complete') setTimeout(start, 220);
    else window.addEventListener('load', function () { setTimeout(start, 220); });
  })();

  /* ── Portfolio / feature videos: attach + play in view ─────── */
  (function lazyVideos() {
    var vids = $$('.v-tile');
    if (!vids.length) return;

    var attach = function (v) {
      if (v.dataset.loaded) return;
      v.dataset.loaded = '1';
      v.src = v.dataset.src;
      v.load();
    };

    if (!('IntersectionObserver' in window)) { vids.forEach(attach); return; }

    // Attach a little before entry so playback starts smoothly
    var pre = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { attach(en.target); pre.unobserve(en.target); }
      });
    }, { rootMargin: '300px 0px' });

    var play = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          attach(v);
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.35 });

    vids.forEach(function (v) { pre.observe(v); play.observe(v); });
  })();

  /* ── Gallery rail (phones): progress thumb + counter ───────── */
  (function galleryRail() {
    var rail  = $('#gallery');
    var bar   = $('#galBar');
    var count = $('#galCount');
    if (!rail || !bar || !count) return;

    var tiles = $$('.tile', rail);
    var n = tiles.length;
    if (!n) return;

    var isRail = function () { return window.matchMedia('(max-width: 679px)').matches; };

    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var p = max > 0 ? Math.min(1, Math.max(0, rail.scrollLeft / max)) : 0;
      bar.style.width = (100 / n) + '%';
      bar.style.transform = 'translateX(' + (p * (n - 1) * 100) + '%)';
      var i = Math.round(p * (n - 1)) + 1;
      count.textContent = String(i).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
    }

    rail.addEventListener('scroll', function () {
      if (isRail()) requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();

    // In rail mode the off-screen tiles never intersect, so reveal the whole
    // set once the gallery itself comes into view rather than popping in on swipe.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        if (isRail()) tiles.forEach(function (t) { t.classList.add('is-in'); });
        obs.disconnect();
      }, { threshold: 0.05 }).observe(rail);
    }
  })();

  /* Testimonials' scroll-pinned crossfade lives in motion.js — it's a
     GSAP/ScrollTrigger production, not a DOM-scroll rail like the
     portfolio/gallery, and only ever runs when motion is enabled. */

  /* ── Lightbox ──────────────────────────────────────────────── */
  /* Testimonials: compact autoplay quote player — same on every screen
     size now, no separate desktop treatment. Always playing, no manual
     pause control, but a hover/touch-hold still parks the timer, and
     prev/next/dots always let a visitor override it. */
  (function testimonialPlayer() {
    var section = $('#words');
    var stage = $('#wordsStage');
    var controls = $('#wordsControls');
    if (!section || !stage || !controls) return;

    var slides = $$('.words__slide', stage);
    if (slides.length < 2) return;

    var dotsWrap = $('.words__dots', controls);
    var prev = $('[data-words-prev]', controls);
    var next = $('[data-words-next]', controls);
    if (!dotsWrap || !prev || !next) return;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'words__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dotsWrap.appendChild(dot);
      return dot;
    });

    var index = 0;
    var timer = 0;
    var inView = true;
    var active = false;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        var current = i === index;
        slide.classList.toggle('is-active', current);
        slide.setAttribute('aria-hidden', String(!current));
      });
      dots.forEach(function (dot, i) {
        var current = i === index;
        dot.classList.toggle('is-active', current);
        dot.setAttribute('aria-current', current ? 'true' : 'false');
      });
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      // reduce.matches is the only thing that stops autoplay outright —
      // an auto-advancing carousel is exactly what reduced-motion visitors
      // want switched off. Everyone else always gets autoplay.
      if (!active || reduce.matches || !inView) return;
      timer = setTimeout(function () { show(index + 1); }, 4400);
    }

    active = true;
    section.classList.add('words--carousel');
    show(index);

    prev.addEventListener('click', function () { show(index - 1); });
    next.addEventListener('click', function () { show(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); });
    });
    stage.addEventListener('pointerenter', function () { clearTimeout(timer); });
    stage.addEventListener('pointerleave', schedule);
    document.addEventListener('visibilitychange', schedule);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0] && entries[0].isIntersecting;
        schedule();
      }, { threshold: .35 }).observe(section);
    } else {
      inView = true;
    }
  })();

  (function lightbox() {
    var lb = $('#lb'), stage = $('#lbStage'), count = $('#lbCount');
    var tiles = $$('.tile');
    if (!lb || !tiles.length) return;

    var idx = 0, open = false, lastFocus = null;

    var items = tiles.map(function (t) {
      var img = $('img', t), vid = $('video', t);
      if (vid) return { type: 'video', src: vid.dataset.src, poster: vid.getAttribute('poster'), alt: vid.getAttribute('aria-label') || '' };
      return {
        type: 'img',
        src: (img.getAttribute('srcset') || '').split(',').pop().trim().split(' ')[0] || img.src,
        alt: img.alt
      };
    });

    function render() {
      var it = items[idx];
      stage.innerHTML = '';
      var node;
      if (it.type === 'video') {
        node = document.createElement('video');
        node.src = it.src;
        node.poster = it.poster;
        node.muted = true; node.loop = true; node.playsInline = true;
        node.setAttribute('playsinline', '');
        node.controls = true;
        node.setAttribute('aria-label', it.alt);
        stage.appendChild(node);
        var p = node.play(); if (p && p.catch) p.catch(function () {});
      } else {
        node = new Image();
        node.src = it.src;
        node.alt = it.alt;
        node.decoding = 'async';
        stage.appendChild(node);
      }
      count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
      lb.setAttribute('aria-label', 'Portfolio viewer — ' + (it.alt || 'image ' + (idx + 1)));
    }

    function show(i) {
      idx = (i + items.length) % items.length;
      render();
    }

    function openLb(i) {
      lastFocus = document.activeElement;
      open = true;
      lb.hidden = false;
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      show(i);
      $('#lbClose').focus();
    }

    function closeLb() {
      open = false;
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { if (!open) { lb.hidden = true; stage.innerHTML = ''; } }, 340);
      if (lastFocus) lastFocus.focus();
    }

    tiles.forEach(function (t, i) {
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      var label = ($('img', t) || {}).alt || ($('video', t) || {}).getAttribute('aria-label') || 'Portfolio item';
      t.setAttribute('aria-label', 'Open: ' + label);
      t.addEventListener('click', function () { openLb(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
      });
    });

    $('#lbClose').addEventListener('click', closeLb);
    $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
    $('#lbNext').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'Tab') {
        // simple focus trap
        var f = $$('button', lb);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  })();

  /* ── Pricing toggle (mobile) ───────────────────────────────── */
  (function pricing() {
    var wrap = $('.toggle');
    if (!wrap) return;
    var btns  = $$('.toggle__btn', wrap);
    var cards = [$('#panel-ncr'), $('#panel-out')];
    var mq = window.matchMedia('(max-width: 899px)');
    var idx = 0;

    function sync() {
      wrap.dataset.i = idx;
      btns.forEach(function (b, i) {
        b.classList.toggle('is-active', i === idx);
        b.setAttribute('aria-pressed', String(i === idx));
      });
      cards.forEach(function (c, i) {
        if (!c) return;
        var on = i === idx;
        c.classList.toggle('is-shown', on);
        if (mq.matches) c.setAttribute('aria-hidden', String(!on));
        else c.removeAttribute('aria-hidden');
      });
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { idx = i; sync(); });
    });
    if (mq.addEventListener) mq.addEventListener('change', sync);
    sync();
  })();

  /* ── Inclusions disclosure ─────────────────────────────────── */
  (function inclusions() {
    var toggles = $$('.inc__toggle');
    if (!toggles.length) return;
    var narrow = window.matchMedia('(max-width: 679px)');
    var touched = false;

    toggles.forEach(function (b) {
      b.addEventListener('click', function () {
        touched = true;
        b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });
    });

    // Collapsed on phones so the prices fit one screen; open on larger screens
    // where there's room. Stops adjusting once the visitor makes their own choice.
    function sync() {
      if (touched) return;
      toggles.forEach(function (b) {
        b.setAttribute('aria-expanded', narrow.matches ? 'false' : 'true');
      });
    }
    if (narrow.addEventListener) narrow.addEventListener('change', sync);
    sync();
  })();

  /* ── FAQ accordion ─────────────────────────────────────────── */
  (function accordion() {
    $$('.acc__item').forEach(function (item) {
      var btn = $('.acc__q', item);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        item.classList.toggle('is-open', !isOpen);
      });
    });
  })();

  /* ── Sticky mobile CTA ─────────────────────────────────────── */
  (function ctaBar() {
    var bar = $('#ctaBar'), hero = $('.hero'), form = $('#enquire'), foot = $('.foot');
    if (!bar) return;
    var pastHero = false, atEnd = false;
    var sync = function () { bar.classList.toggle('is-shown', pastHero && !atEnd); };

    if ('IntersectionObserver' in window) {
      if (hero) new IntersectionObserver(function (e) {
        pastHero = !e[0].isIntersecting; sync();
      }, { threshold: 0.15 }).observe(hero);

      // Stand down once the enquiry form or footer is on screen, so the bar
      // never sits on top of the content it's pointing at.
      var tail = { form: false, foot: false };
      var watch = function (el, key) {
        if (!el) return;
        new IntersectionObserver(function (e) {
          tail[key] = e[0].isIntersecting;
          atEnd = tail.form || tail.foot;
          sync();
        }, { threshold: 0.06 }).observe(el);
      };
      watch(form, 'form');
      watch(foot, 'foot');
    }
  })();

  /* ── Enquiry form → WhatsApp ───────────────────────────────── */
  (function form() {
    var f = $('#enquiryForm');
    if (!f) return;

    var name  = $('#f-name'),  ePhone = $('#e-phone');
    var phone = $('#f-phone'), eName  = $('#e-name');

    function setErr(input, box, msg) {
      if (msg) {
        input.setAttribute('aria-invalid', 'true');
        box.textContent = msg;
      } else {
        input.removeAttribute('aria-invalid');
        box.textContent = '';
      }
      return !msg;
    }

    function checkName() {
      var v = name.value.trim();
      return setErr(name, eName, v ? '' : 'Please tell me your name.');
    }
    function checkPhone() {
      var v = phone.value.trim();
      var digits = v.replace(/\D/g, '');
      if (!v) return setErr(phone, ePhone, 'Please add a number I can reach you on.');
      if (digits.length < 8) return setErr(phone, ePhone, 'That number looks incomplete.');
      return setErr(phone, ePhone, '');
    }

    // Validate on blur, clear as they correct it
    name.addEventListener('blur', checkName);
    phone.addEventListener('blur', checkPhone);
    name.addEventListener('input', function () { if (name.getAttribute('aria-invalid')) checkName(); });
    phone.addEventListener('input', function () { if (phone.getAttribute('aria-invalid')) checkPhone(); });

    function prettyDate(v) {
      if (!v) return '';
      var p = v.split('-');
      if (p.length !== 3) return v;
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      if (isNaN(d)) return v;
      try {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) { return v; }
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var okName = checkName(), okPhone = checkPhone();
      if (!okName)  { name.focus();  return; }
      if (!okPhone) { phone.focus(); return; }

      var events = $$('input[name="event"]:checked', f).map(function (i) { return i.value; });
      var lines = ["Hi Kamya! I'd like to enquire about makeup for my event.", ''];
      lines.push('Name: ' + name.value.trim());
      lines.push('Contact: ' + phone.value.trim());
      if ($('#f-date').value) lines.push('Date: ' + prettyDate($('#f-date').value));
      if ($('#f-loc').value.trim()) lines.push('Location: ' + $('#f-loc').value.trim());
      if (events.length) lines.push('Occasion: ' + events.join(', '));
      var msg = $('#f-msg').value.trim();
      if (msg) { lines.push(''); lines.push(msg); }

      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;

      var note = $('.form__note', f);
      if (note) {
        note.textContent = 'Opening WhatsApp — just press send. If nothing happened, message +91 87080 86305.';
        note.style.color = 'var(--gold)';
      }
    });
  })();

  /* ── Footer year ───────────────────────────────────────────── */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

})();
