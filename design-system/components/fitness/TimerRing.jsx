import React from 'react'

/**
 * Muskle TimerRing — the player's circular countdown. A warm track with
 * a phase-colored progress arc, mono time in the center, and the phase
 * label beneath. Phase drives both the color and the label.
 */
const PHASE_COLORS = {
  prepare: 'var(--phase-prepare)',
  work: 'var(--phase-work)',
  rest: 'var(--phase-rest)',
  done: 'var(--phase-done)',
}

const PHASE_LABELS = {
  prepare: 'Préparez-vous',
  work: 'Go !',
  rest: 'Repos',
  done: 'Terminé',
}

export function TimerRing({ progress = 0, remaining = 0, phase = 'work', size = 200 }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)))
  const color = PHASE_COLORS[phase] || PHASE_COLORS.work
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ring-track)" strokeWidth={8} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease',
          }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-4xl)', fontWeight: 500, color: 'var(--paper)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {minutes > 0 ? `${minutes}:${String(seconds).padStart(2, '0')}` : String(remaining)}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, marginTop: 6, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color }}>
          {PHASE_LABELS[phase] || ''}
        </span>
      </div>
    </div>
  )
}
