import React from 'react'

/**
 * Muskle CategoryBadge — a discipline chip carrying its own earthy hue
 * as a 10–14% tint with matching text. One per exercise category.
 */
const CATEGORY_CONFIG = {
  musculation:  { label: 'Musculation',  color: 'var(--cat-musculation)' },
  renforcement: { label: 'Renforcement', color: 'var(--cat-renforcement)' },
  yoga:         { label: 'Yoga',         color: 'var(--cat-yoga)' },
  kine:         { label: 'Kiné',         color: 'var(--cat-kine)' },
  cardio:       { label: 'Cardio',       color: 'var(--cat-cardio)' },
  mobilite:     { label: 'Mobilité',     color: 'var(--cat-mobilite)' },
  autre:        { label: 'Autre',        color: 'var(--cat-autre)' },
}

export function CategoryBadge({ category, size = 'md', style, ...props }) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.autre
  const small = size === 'sm'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        borderRadius: 'var(--radius-pill)',
        padding: small ? '0 6px' : '3px 12px',
        fontFamily: 'var(--font-sans)',
        fontSize: small ? '10px' : 'var(--text-xs)',
        fontWeight: 600,
        lineHeight: small ? 1.6 : 1.5,
        color: cfg.color,
        background: `color-mix(in srgb, ${cfg.color} 12%, white)`,
        ...style,
      }}
      {...props}
    >
      {cfg.label}
    </span>
  )
}
