import React from 'react'

/**
 * Muskle Badge — small pill label. `default` is mint, `secondary` warm,
 * `destructive` red, `outline` just an ink outline. Fully rounded.
 */
const BADGE_VARIANTS = {
  default: { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' },
  secondary: { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid transparent' },
  destructive: { background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '1px solid transparent' },
  outline: { background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
}

export function Badge({ variant = 'default', style, children, ...props }) {
  const v = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-pill)',
        padding: '2px 10px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        lineHeight: 1.4,
        ...v,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
