import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, SkipForward, X, RotateCcw } from 'lucide-react'
import { useAppStore } from '../store'
import { getCatalogExercises } from '../lib/customExercises'
import { useSessionPlayer } from '../hooks/useSessionPlayer'
import { useTimer } from '../hooks/useTimer'
import TimerRing from '../components/ui/TimerRing'

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

  if (player.isFinished) {
    return <FinishedScreen onComplete={onComplete} onRestart={player.restart} />
  }

  if (!step) return null

  const phaseColor =
    step.phase === 'prepare' ? '#5B8EC4' :
    step.phase === 'work'    ? '#E8603C' :
    step.phase === 'rest'    ? '#6BAE8E' : '#9B7BB8'

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col select-none">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onExit}
          className="p-2 rounded-lg text-paper/60 hover:text-paper hover:bg-ink-soft transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <p className="text-xs text-paper/40 uppercase tracking-wider">{session.name}</p>
          <p className="text-sm text-paper/70 font-medium">{step.blockTitle}</p>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(player.steps.length, 12) }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{
                background:
                  i === player.currentIndex ? phaseColor :
                  i < player.currentIndex   ? '#4A4A4A' : '#2C2C2C',
              }}
            />
          ))}
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
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-ink transition-all active:scale-95"
              style={{ background: phaseColor }}
            >
              <SkipForward size={20} />
              Suivant
            </button>
          ) : (
            <button
              onClick={() => (timer.isRunning ? timer.pause() : timer.start())}
              className="p-5 rounded-full text-ink transition-all active:scale-95"
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
          className="flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-paper font-medium hover:bg-accent-light transition-colors"
        >
          Terminer
        </button>
      </div>
    </div>
  )
}
