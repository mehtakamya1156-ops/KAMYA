import Link from 'next/link';

/** Joins class names, dropping falsy values. */
export const cx = (...c) => c.filter(Boolean).join(' ');

/**
 * Every section on the page uses this. Vertical rhythm and horizontal gutters
 * come from CSS variables, so spacing is identical everywhere by construction.
 */
export function Section({ id, tone = 'cream', className, children, ...rest }) {
  const tones = {
    cream: 'bg-cream',
    shell: 'bg-shell',
    ink: 'bg-ink text-cream',
  };
  return (
    <section
      id={id}
      className={cx('py-[var(--section-y)]', tones[tone], className)}
      style={{ scrollMarginTop: '5rem' }}
      {...rest}
    >
      {children}
    </section>
  );
}

/** Standard max-width container with responsive gutters. */
export function Container({ size = 'default', className, children }) {
  const sizes = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
  };
  return (
    <div className={cx('mx-auto w-full px-[var(--gutter)]', sizes[size], className)}>{children}</div>
  );
}

/** Small uppercase label that opens most sections. */
export function Eyebrow({ children, className, as: Tag = 'p' }) {
  return (
    <Tag
      className={cx(
        'flex items-center gap-3 text-eyebrow font-medium uppercase text-gold',
        className
      )}
    >
      <span aria-hidden className="h-px w-8 bg-gold/50" />
      {children}
    </Tag>
  );
}

/** Section heading. Serif, light weight, tight leading. */
export function Heading({ level = 2, size = 'h2', className, children, ...rest }) {
  const Tag = `h${level}`;
  const sizes = { h1: 'text-h1', h2: 'text-h2', h3: 'text-h3' };
  return (
    <Tag
      className={cx('font-serif font-light tracking-[-0.01em] text-balance', sizes[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Body copy held to a readable measure. */
export function Prose({ className, children }) {
  return (
    <div className={cx('max-w-[var(--measure)] text-lead text-muted text-pretty', className)}>
      {children}
    </div>
  );
}

/**
 * The site's only button component — three variants, one interaction language.
 * Renders an <a> when given href, otherwise a <button>.
 */
export function Button({
  variant = 'primary',
  href,
  external,
  className,
  children,
  ...rest
}) {
  const base =
    'group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 ' +
    'text-sm font-medium tracking-[0.08em] uppercase min-h-[48px] shrink-0 whitespace-nowrap ' +
    'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ' +
    'ease-[var(--ease-signature)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    primary:
      'bg-ink text-cream hover:bg-gold hover:shadow-[0_10px_30px_-12px_rgba(156,126,81,0.65)]',
    outline:
      'border border-ink/25 text-ink hover:border-gold hover:text-gold hover:bg-gold/[0.06]',
    light:
      'border border-cream/45 text-cream backdrop-blur-[2px] hover:bg-cream hover:text-ink hover:border-cream',
  };

  const cls = cx(base, variants[variant], className);

  if (href) {
    const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <Link href={href} className={cls} {...props} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Hairline divider used between sections that share a background tone. */
export function Rule({ className }) {
  return <hr className={cx('border-0 h-px bg-sand', className)} aria-hidden />;
}
