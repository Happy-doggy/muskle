import React from 'react'

/**
 * Muskle Card — white surface on the cream canvas. Hairline border,
 * 10px radius, no shadow. Set `clickable` for the mint hover-border
 * used on list items (séances, blocs, exercices).
 */
export function Card({ clickable = false, style, children, ...props }) {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      onMouseEnter={() => clickable && setHover(true)}
      onMouseLeave={() => clickable && setHover(false)}
      style={{
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        border: `1px solid ${hover ? 'var(--mint)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: 'var(--space-4)',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ style, children, ...props }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-lg)',
        fontWeight: 500,
        letterSpacing: 'var(--tracking-tight)',
        margin: 0,
        color: 'var(--card-foreground)',
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ style, children, ...props }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
        margin: '4px 0 0',
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  )
}
