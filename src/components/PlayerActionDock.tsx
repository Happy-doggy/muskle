import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ListOrdered, Pause, Play, SkipForward } from 'lucide-react'
import type { PlayerStep } from '../types'
import type { TimerPhase } from '../types'
import {
  formatPlayerStepPreview,
  getPlayerStepPhaseLabel,
  getUpcomingPlayerSteps,
} from '../lib/playerSteps'
import { cn } from '@/lib/utils'

const PHASE_LABELS: Record<TimerPhase, string> = {
  prepare: 'Prépa',
  work: 'Go !',
  rest: 'Repos',
  done: 'Terminé',
}

const METRIC_MIN_WIDTH = '6.5rem'

function DockRepsMetric({ reps, phaseColor }: { reps: number; phaseColor: string }) {
  return (
    <div className={cn('shrink-0 pl-1')} style={{ minWidth: METRIC_MIN_WIDTH }}>
      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-0.5">Objectif</p>
      <p className="text-3xl font-display leading-none" style={{ color: phaseColor }}>
        {reps} <span className="text-base text-white/55">reps</span>
      </p>
    </div>
  )
}

function DockTimerMetric({
  phase,
  phaseColor,
  progress,
  remaining,
}: {
  phase: TimerPhase
  phaseColor: string
  progress: number
  remaining: number
}) {
  const ringSize = 40
  const radius = (ringSize - 6) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const timeDisplay =
    minutes > 0
      ? `${minutes}:${String(seconds).padStart(2, '0')}`
      : String(remaining)

  return (
    <div className={cn('shrink-0 pl-1')} style={{ minWidth: METRIC_MIN_WIDTH }}>
      <p className="text-[10px] uppercase tracking-wider text-white/45 mb-0.5">
        {PHASE_LABELS[phase]}
      </p>
      <div className="flex items-center gap-2.5">
        <div
          className="relative shrink-0"
          style={{ width: ringSize, height: ringSize }}
          aria-hidden
        >
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={3}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke={phaseColor}
              strokeWidth={3}
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
        </div>
        <p className="text-3xl font-mono leading-none tabular-nums" style={{ color: phaseColor }}>
          {timeDisplay}
          {minutes === 0 && <span className="text-base font-sans text-white/55"> sec</span>}
        </p>
      </div>
    </div>
  )
}

function DockMetricSpacer() {
  return <div className="shrink-0" style={{ minWidth: METRIC_MIN_WIDTH }} />
}

type PlayerActionDockProps = {
  steps: PlayerStep[]
  currentIndex: number
  onSelectStep: (index: number) => void
  hasReps: boolean
  reps?: number
  phaseColor: string
  phase: TimerPhase
  timerProgress: number
  timerRemaining: number
  timerDuration: number
  isRunning: boolean
  canGoPrev: boolean
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
}

export default function PlayerActionDock({
  steps,
  currentIndex,
  onSelectStep,
  hasReps,
  reps,
  phaseColor,
  phase,
  timerProgress,
  timerRemaining,
  timerDuration,
  isRunning,
  canGoPrev,
  onPrev,
  onNext,
  onTogglePlay,
}: PlayerActionDockProps) {
  const [expanded, setExpanded] = useState(false)
  const upcoming = getUpcomingPlayerSteps(steps, currentIndex)
  const next = upcoming[0]

  return (
    <div className="absolute bottom-4 right-4 left-4 sm:left-auto z-20 pointer-events-auto sm:max-w-sm">
      <div className="rounded-2xl border border-white/15 bg-black/50 p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col gap-3">
        {next && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-white transition-colors hover:bg-white/5"
              aria-expanded={expanded}
            >
              <ListOrdered size={15} className="shrink-0 text-white/60" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-wider text-white/45">
                  {expanded ? 'À venir' : 'Suivant'}
                </p>
                <p className="truncate text-sm font-medium">
                  {formatPlayerStepPreview(next.step)}
                </p>
              </div>
              <ChevronDown
                size={15}
                className={cn('shrink-0 text-white/50 transition-transform', expanded && 'rotate-180')}
              />
            </button>

            {expanded && (
              <ul className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto space-y-1 rounded-xl border border-white/10 bg-black/70 p-2 shadow-lg backdrop-blur-md">
                {upcoming.map(({ index, step }) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStep(index)
                        setExpanded(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
                    >
                      <span className="w-14 shrink-0 text-[10px] font-medium uppercase tracking-wide text-white/45">
                        {getPlayerStepPhaseLabel(step.phase)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {formatPlayerStepPreview(step)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {hasReps && phase === 'work' ? (
            <DockRepsMetric reps={reps ?? 0} phaseColor={phaseColor} />
          ) : timerDuration > 0 ? (
            <DockTimerMetric
              phase={phase}
              phaseColor={phaseColor}
              progress={timerProgress}
              remaining={timerRemaining}
            />
          ) : (
            <DockMetricSpacer />
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className="p-2.5 rounded-full text-white/50 hover:text-white disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            {hasReps ? (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white transition-all active:scale-95 shadow-lg"
                style={{ background: phaseColor }}
              >
                <SkipForward size={18} />
                Suivant
              </button>
            ) : (
              <button
                onClick={onTogglePlay}
                className="p-4 rounded-full text-white transition-all active:scale-95 shadow-lg"
                style={{ background: phaseColor }}
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
              </button>
            )}

            <button
              onClick={onNext}
              className="p-2.5 rounded-full text-white/50 hover:text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
