import type { TimerPhase } from '../../types'

interface TimerRingProps {
  progress: number      // 0 → 1
  remaining: number     // secondes restantes
  phase: TimerPhase
  size?: number
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  prepare: '#5B8EC4',
  work:    '#E8603C',
  rest:    '#6BAE8E',
  done:    '#9B7BB8',
}

const PHASE_LABELS: Record<TimerPhase, string> = {
  prepare: 'Préparez-vous',
  work:    'Go !',
  rest:    'Repos',
  done:    'Terminé',
}

export default function TimerRing({ progress, remaining, phase, size = 200 }: TimerRingProps) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const color = PHASE_COLORS[phase]

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#D9D4C8"
          strokeWidth={8}
        />
        {/* Progress */}
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

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-medium text-ink tabular-nums">
          {minutes > 0
            ? `${minutes}:${String(seconds).padStart(2, '0')}`
            : String(remaining)}
        </span>
        <span
          className="text-xs font-medium mt-1 uppercase tracking-wider transition-colors duration-300"
          style={{ color }}
        >
          {PHASE_LABELS[phase]}
        </span>
      </div>
    </div>
  )
}
