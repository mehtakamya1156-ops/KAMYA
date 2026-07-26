'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { bookingForm, brand } from '@/lib/content';
import { Button, Container, Eyebrow, Heading, Prose, Section, cx } from '@/components/ui';
import Reveal from '@/components/Reveal';
import HeadingReveal from '@/components/HeadingReveal';
import Field from '@/components/Field';
import { WhatsAppIcon } from '@/components/icons';
import { DUR, EASE } from '@/lib/motion';

const EMPTY = { name: '', contact: '', date: '', location: '', events: [] };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please tell me your name.';
  if (!v.contact.trim()) e.contact = 'Please add a phone number I can reach you on.';
  else if (v.contact.replace(/\D/g, '').length < 10)
    e.contact = 'That number looks incomplete — please check it.';
  if (!v.date) e.date = 'Please choose your event date.';
  if (!v.location.trim()) e.location = 'Please add the city or venue.';
  if (v.events.length === 0) e.events = 'Please select at least one occasion.';
  return e;
}

/** "2026-11-14" → "14 November 2026", so the message reads naturally. */
function prettyDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Builds the message that lands in Kamya's WhatsApp. */
function composeMessage(v) {
  return [
    'Hi Kamya! I’d like to check your availability.',
    '',
    `Name: ${v.name}`,
    `Contact: ${v.contact}`,
    `Date: ${prettyDate(v.date)}`,
    `Location: ${v.location}`,
    `Occasion: ${v.events.join(', ')}`,
  ].join('\n');
}

/** Checkmark that draws itself once, on success. */
function SuccessMark() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16 text-gold" aria-hidden>
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
        style={{ rotate: -90, transformOrigin: '50% 50%' }}
      />
      <motion.path
        d="M15 27l8 8 15-16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 0.45, ease: EASE, delay: reduced ? 0 : 0.35 }}
      />
    </svg>
  );
}

export default function Booking() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(null);
  const formRef = useRef(null);
  const reduced = useReducedMotion();

  const set = (key) => (val) => {
    setValues((v) => ({ ...v, [key]: val }));
    // Clear an error as soon as the visitor starts fixing it.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Validate on blur, not on every keystroke.
  const blur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    const e = validate(values);
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };

  const toggleEvent = (name) => {
    setValues((v) => ({
      ...v,
      events: v.events.includes(name)
        ? v.events.filter((x) => x !== name)
        : [...v.events, name],
    }));
    if (errors.events) setErrors((e) => ({ ...e, events: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));

    if (Object.keys(found).length) {
      // Wait for React to commit the aria-invalid attributes before looking
      // for the first bad field, then move focus there.
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector('[aria-invalid="true"]');
        first?.focus({ preventScroll: false });
      });
      return;
    }

    const url = `https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(composeMessage(values))}`;
    setSent(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Section id="booking" tone="cream">
      <Container size="narrow">
        <div className="text-center">
          <Reveal className="flex justify-center">
            <Eyebrow>{bookingForm.eyebrow}</Eyebrow>
          </Reveal>
          <HeadingReveal delay={0.08} className="mt-6">{bookingForm.heading}</HeadingReveal>
          <Reveal delay={0.16}>
            <Prose className="mx-auto mt-5 text-center">{bookingForm.intro}</Prose>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14" viewport={{ once: true, amount: 0.1 }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : DUR.entrance, ease: EASE }}
                className="flex flex-col items-center rounded-[3px] border border-sand bg-shell px-7 py-14 text-center"
              >
                <SuccessMark />
                <h3 className="mt-6 font-serif text-h3 font-light">
                  Your enquiry is on its way
                </h3>
                <p className="mt-3 max-w-md text-lead text-muted">
                  WhatsApp should have opened with your details ready to send. If it
                  didn’t, use the button below — I’ll reply personally, usually within a
                  day.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={sent} external variant="primary">
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                    Open WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSent(null);
                      setValues(EMPTY);
                      setErrors({});
                      setTouched({});
                    }}
                  >
                    Send another enquiry
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: reduced ? 0 : DUR.base, ease: EASE }}
                className="flex flex-col gap-8"
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <Field
                    label="Your name"
                    value={values.name}
                    onChange={set('name')}
                    onBlur={blur('name')}
                    error={touched.name ? errors.name : undefined}
                    autoComplete="name"
                    required
                  />
                  <Field
                    label="Phone / WhatsApp"
                    type="tel"
                    inputMode="tel"
                    value={values.contact}
                    onChange={set('contact')}
                    onBlur={blur('contact')}
                    error={touched.contact ? errors.contact : undefined}
                    autoComplete="tel"
                    required
                  />
                  <Field
                    label="Event date"
                    type="date"
                    value={values.date}
                    onChange={set('date')}
                    onBlur={blur('date')}
                    error={touched.date ? errors.date : undefined}
                    required
                  />
                  <Field
                    label="City or venue"
                    value={values.location}
                    onChange={set('location')}
                    onBlur={blur('location')}
                    error={touched.location ? errors.location : undefined}
                    autoComplete="address-level2"
                    required
                  />
                </div>

                {/* --- Occasions (multi-select) ------------------------- */}
                <fieldset>
                  <legend className="text-eyebrow uppercase tracking-[0.16em] text-muted">
                    Occasion <span className="text-rose">*</span>
                    <span className="ml-2 normal-case tracking-normal">
                      (select all that apply)
                    </span>
                  </legend>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {bookingForm.eventTypes.map((name) => {
                      const on = values.events.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleEvent(name)}
                          aria-pressed={on}
                          className={cx(
                            'min-h-[44px] rounded-full border px-5 text-sm transition-[background-color,border-color,color] duration-200 ease-[var(--ease-signature)]',
                            on
                              ? 'border-ink bg-ink text-cream'
                              : 'border-sand text-muted hover:border-gold hover:text-gold'
                          )}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>

                  {touched.events && errors.events && (
                    <p role="alert" className="mt-3 text-sm text-rose">
                      {errors.events}
                    </p>
                  )}
                </fieldset>

                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button type="submit" variant="primary">
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                    Send enquiry
                  </Button>
                  <p className="text-sm text-muted">
                    This opens WhatsApp with your details filled in — nothing is sent
                    until you press send there.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </Container>
    </Section>
  );
}
