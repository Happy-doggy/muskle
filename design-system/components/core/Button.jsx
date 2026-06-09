import React from 'react'

/**
 * Muskle Button — the one action element.
 * Variants mirror the production ShadCN button: a confident mint
 * `default`, a warm `secondary`, bordered `outline`, quiet `ghost`,
 * `destructive`, and `link`. Hover drops opacity; focus shows a mint ring.
 */
const VARIANTS = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    border: '1px solid transparent',
  },
  outline: {
    background: '#fff',
    color: 'var(--foreground)',
    border: '1px solid var(--input)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--foreground)',
    border: '1px solid transparent',
  },
  destructive: {
    background: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
    border: '1px solid transparent',
  },
  link: {
    background: 'transparent',
    color: 'var(--primary)',
    border: '1px solid transparent',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },
}

const SIZES = {
  default: { height: 40, padding: '0 16px', fontSize: 14 },
  sm: { height: 36, padding: '0 12px', fontSize: 14 },
  lg: { height: 44, padding: '0 32px', fontSize: 15 },
  icon: { height: 40, width: 40, padding: 0, fontSize: 14 },
}

const HOVER_OPACITY = {
  default: 0.9,
  secondary: 0.8,
  destructive: 0.9,
  outline: 1,
  ghost: 1,
  link: 1,
}

export function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  children,
  ...props
}) {
  const [hover, setHover] = React.useState(false)
  const v = VARIANTS[variant] || VARIANTS.default
  const s = SIZES[size] || SIZES.default
  const fillHover = (variant === 'outline' || variant === 'ghost') && hover

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease',
        opacity: disabled ? 0.5 : hover ? HOVER_OPACITY[variant] : 1,
        background: fillHover ? 'var(--accent)' : v.background,
        color: fillHover ? 'var(--accent-foreground)' : v.color,
        border: v.border,
        textDecoration: variant === 'link' && hover ? 'underline' : v.textDecoration || 'none',
        textUnderlineOffset: v.textUnderlineOffset,
        ...s,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
