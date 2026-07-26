'use client';

import { useId } from 'react';
import { cx } from '@/components/ui';

/**
 * Text input with a floating label.
 *
 * The label is a real <label for>, always present in the accessibility tree —
 * it moves visually but is never replaced by a placeholder, so the field still
 * has an accessible name once filled. The underline animates on focus.
 *
 * Errors render below the field, are tied to it via aria-describedby, and are
 * announced through role="alert".
 */
export default function Field({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required,
  autoComplete,
  inputMode,
  as = 'input',
  ...rest
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const Tag = as;

  // Date inputs always show their own placeholder text, so their label must
  // stay lifted rather than sitting inside the field.
  const alwaysLifted = type === 'date' || as === 'textarea';

  return (
    <div className="relative">
      <Tag
        id={id}
        type={as === 'input' ? type : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder=" "
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        rows={as === 'textarea' ? 3 : undefined}
        className={cx(
          'peer block w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-2.5 pt-6',
          'text-ink outline-none transition-colors duration-200 ease-[var(--ease-signature)]',
          // 16px minimum prevents iOS from zooming the viewport on focus.
          'text-base min-h-[52px]',
          error ? 'border-rose' : 'border-sand hover:border-muted focus:border-gold',
          alwaysLifted && 'pt-6'
        )}
        {...rest}
      />

      <label
        htmlFor={id}
        className={cx(
          'pointer-events-none absolute left-0 origin-left text-muted',
          'transition-all duration-200 ease-[var(--ease-signature)]',
          alwaysLifted
            ? 'top-0 text-eyebrow uppercase tracking-[0.16em]'
            : cx(
                'top-6 text-base',
                // Lifted when focused or when the field has content.
                'peer-focus:top-0 peer-focus:text-eyebrow peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-gold',
                'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-eyebrow peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em]'
              )
        )}
      >
        {label}
        {required && <span className="text-rose"> *</span>}
      </label>

      {/* Gold underline that draws in from the left on focus. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-signature)] peer-focus:scale-x-100"
      />

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-rose">
          {error}
        </p>
      )}
    </div>
  );
}
