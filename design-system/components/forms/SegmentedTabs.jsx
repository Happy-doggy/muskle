import React from 'react'

/**
 * Muskle SegmentedTabs — the signature control. A row of pill tabs on a
 * white track; the active one is marked by a mint pill that *slides*
 * between positions (spring-like CSS transition). Used for top nav and
 * for the exercise category / block-type filters.
 *
 * segments: [{ value, label, icon? }]
 */
export function SegmentedTabs({ segments, value, onChange, fullWidth = false, style }) {
  const containerRef = React.useRef(null)
  const [pill, setPill] = React.useState(null)

  const measure = React.useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const active = container.querySelector('[data-active="true"]')
    if (!active) { setPill(null); return }
    const cRect = container.getBoundingClientRect()
    const aRect = active.getBoundingClientRect()
    setPill({ left: aRect.left - cRect.left, width: aRect.width })
  }, [])

  React.useLayoutEffect(() => { measure() }, [value, segments, fullWidth, measure])
  React.useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 4,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: 4,
        width: fullWidth ? '100%' : 'fit-content',
        ...style,
      }}
    >
      {pill && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: pill.left,
            width: pill.width,
            background: 'var(--mint)',
            borderRadius: 'var(--radius-md)',
            transition: 'left 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 0,
          }}
        />
      )}
      {segments.map((seg) => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            data-active={active}
            onClick={() => onChange && onChange(seg.value)}
            style={{
              position: 'relative',
              zIndex: 1,
              flex: fullWidth ? 1 : 'initial',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: active ? '#fff' : 'var(--muted-foreground)',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {seg.icon}
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
