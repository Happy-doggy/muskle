import React from 'react'

/**
 * Muskle Input — white field, hairline border, 10px radius. Shows a
 * mint focus ring. Matches the production ShadCN input metrics.
 */
export function Input({ style, ...props }) {
  const [focus, setFocus] = React.useState(false)
  return (
    <input
      onFocus={(e) => { setFocus(true); props.onFocus && props.onFocus(e) }}
      onBlur={(e) => { setFocus(false); props.onBlur && props.onBlur(e) }}
      style={{
        height: 40,
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--input)',
        background: '#fff',
        padding: '0 12px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--foreground)',
        outline: 'none',
        boxShadow: focus ? '0 0 0 2px var(--background), 0 0 0 4px var(--ring)' : 'none',
        transition: 'box-shadow 0.15s ease',
        ...style,
      }}
      {...props}
    />
  )
}

/** Field label — small, medium weight, sits above an Input. */
export function Label({ style, children, ...props }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        color: 'var(--foreground)',
        marginBottom: 6,
        ...style,
      }}
      {...props}
    >
      {children}
    </label>
  )
}
