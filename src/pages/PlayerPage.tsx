import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, SkipForward, RotateCcw } from 'lucide-react'
import { useAppStore } from '../store'
import { getCatalogExercises } from '../lib/customExercises'
import { useSessionPlayer } from '../hooks/useSessionPlayer'
import { useTimer } from '../hooks/useTimer'
import { useTimerSounds } from '../hooks/useTimerSounds'
import { unlockTimerSounds } from '../lib/timerSounds'
import TimerRing, { TIMER_RING_TRACK } from '../components/ui/TimerRing'

export default function PlayerPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const blocks = useAppStore((s) => s.blocks)
  const sessions = useAppStore((s) => s.sessions)
  const session = sessions.find((s) => s.id === sessionId)
  const exercises = useMemo(() => getCatalogExercises(), [])

  if (!session) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-center text-paper">
          <p className="text-lg mb-4">Séance introuvable</p>
          <button onClick={() => navigate('/sessions')} className="underline">
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <PlayerCore
      session={session}
      exercises={exercises}
      blocks={blocks}
      onExit={() => navigate('/sessions')}
      onComplete={() => navigate('/sessions')}
    />
  )
}

function PlayerCore({
  session,
  exercises,
  blocks,
  onExit,
  onComplete,
}: {
  session: NonNullable<ReturnType<typeof useAppStore.getState>['sessions'][number]>
  exercises: ReturnType<typeof getCatalogExercises>
  blocks: ReturnType<typeof useAppStore.getState>['blocks']
  onExit: () => void
  onComplete: () => void
}) {
  const player = useSessionPlayer({ session, blocks, exercises })
  const step = player.currentStep

  const hasReps = step?.reps !== undefined && (step?.duration === 0 || !step?.duration)

  const handlePhaseComplete = useCallback(() => {
    player.goNext()
  }, [player])

  const timer = useTimer({
    duration: hasReps ? 0 : (step?.duration ?? 0),
    onComplete: handlePhaseComplete,
    autoStart: !hasReps && (step?.duration ?? 0) > 0,
  })

  useEffect(() => {
    timer.reset()
    if (step && !hasReps && step.duration > 0) {
      timer.start()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentIndex])

  useTimerSounds({
    remaining: timer.remaining,
    isRunning: timer.isRunning,
    phase: step?.phase ?? 'done',
    duration: step?.duration ?? 0,
    stepIndex: player.currentIndex,
  })

  useEffect(() => {
    const unlock = () => {
      unlockTimerSounds()
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    return () => window.removeEventListener('pointerdown', unlock)
  }, [])

  if (player.isFinished) {
    return <FinishedScreen onComplete={onComplete} onRestart={player.restart} />
  }

  if (!step) return null

  const phaseColor =
    step.phase === 'prepare' ? '#5B8EC4' :
    step.phase === 'work'    ? '#E8603C' :
    step.phase === 'rest'    ? '#4BA278' : '#9B7BB8'

  const stepFraction =
    !hasReps && step.duration > 0 ? timer.progress : 0
  const sessionProgressPercent =
    player.steps.length > 0
      ? Math.min(100, ((player.currentIndex + stepFraction) / player.steps.length) * 100)
      : 0

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col select-none">
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onExit}
            className="w-[4.5rem] px-3 py-1.5 rounded-md border border-paper/20 bg-white text-mint text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
          >
            Arrêter
          </button>

          <div className="text-center min-w-0 flex-1">
            <p className="text-xs text-paper/40 uppercase tracking-wider truncate">{session.name}</p>
            <p className="text-sm text-paper/70 font-medium truncate">{step.blockTitle}</p>
          </div>

          <span className="w-[4.5rem] text-xs text-paper/60 font-medium tabular-nums shrink-0 text-right">
            {Math.round(sessionProgressPercent)}%
          </span>
        </div>

        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: TIMER_RING_TRACK }}
        >
          <div
            className="h-full bg-mint transition-all duration-300"
            style={{ width: `${sessionProgressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="text-center animate-fade-in" key={step.exerciseTitle + step.set}>
          <p className="text-paper/50 text-sm mb-1">
            Série {step.set}/{step.totalSets}
            {step.totalExercisesInBlock > 1 && (
              <span> · Exercice {step.exerciseIndexInBlock + 1}/{step.totalExercisesInBlock}</span>
            )}
          </p>
          <h1 className="font-display text-3xl text-paper mb-2">{step.exerciseTitle}</h1>
          {step.reps && step.phase === 'work' && (
            <div
              className="text-5xl font-display mt-2"
              style={{ color: phaseColor }}
            >
              {step.reps} <span className="text-2xl text-paper/50">reps</span>
            </div>
          )}
        </div>

        {step.exerciseImageUrl && step.phase === 'work' && (
          <img
            src={step.exerciseImageUrl}
            alt={step.exerciseTitle}
            className="max-h-48 object-contain rounded-lg opacity-90"
          />
        )}

        {!hasReps && step.duration > 0 && (
          <TimerRing
            progress={timer.progress}
            remaining={timer.remaining}
            phase={step.phase}
            size={220}
          />
        )}

        {step.exerciseDescription && step.phase !== 'rest' && (
          <p className="text-paper/50 text-sm text-center max-w-xs leading-relaxed">
            {step.exerciseDescription}
          </p>
        )}
      </div>

      <div className="px-6 pb-10 pt-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={player.goPrev}
            disabled={!player.canGoPrev}
            className="p-3 rounded-full text-paper/40 hover:text-paper disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>

          {hasReps ? (
            <button
              onClick={player.goNext}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-white transition-all active:scale-95"
              style={{ background: phaseColor }}
            >
              <SkipForward size={20} />
              Suivant
            </button>
          ) : (
            <button
              onClick={() => {
                unlockTimerSounds()
                if (timer.isRunning) timer.pause()
                else timer.start()
              }}
              className="p-5 rounded-full text-white transition-all active:scale-95"
              style={{ background: phaseColor }}
            >
              {timer.isRunning ? <Pause size={28} /> : <Play size={28} />}
            </button>
          )}

          <button
            onClick={player.goNext}
            className="p-3 rounded-full text-paper/40 hover:text-paper transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}

function FinishedScreen({ onComplete, onRestart }: { onComplete: () => void; onRestart: () => void }) {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center animate-slide-up">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display text-4xl mb-2">Séance terminée !</h1>
        <p className="text-paper/50">Bravo, tu l&apos;as fait.</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-3 rounded-lg border border-paper/20 text-paper/70 hover:text-paper hover:border-paper/40 transition-colors"
        >
          <RotateCcw size={16} />
          Recommencer
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Terminer
        </button>
      </div>
    </div>
  )
}
