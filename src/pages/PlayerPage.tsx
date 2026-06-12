import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useMemo, useRef } from 'react'
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center text-ink">
          <p className="text-lg mb-4">Séance introuvable</p>
          <button onClick={() => navigate('/sessions')} className="underline text-ink/70 hover:text-ink">
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
    <div className="min-h-screen bg-cream text-ink flex flex-col select-none">
      <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onExit}
            className="w-[4.5rem] px-3 py-1.5 rounded-md border border-stroke bg-white text-mint text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
          >
            Arrêter
          </button>

          <div className="text-center min-w-0 flex-1">
            <p className="text-xs text-ink/45 uppercase tracking-wider truncate">{session.name}</p>
            <p className="text-sm text-ink/70 font-medium truncate">{step.blockTitle}</p>
          </div>

          <span className="w-[4.5rem] text-xs text-ink/55 font-medium tabular-nums shrink-0 text-right">
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
          <p className="text-ink/50 text-sm mb-1">
            Série {step.set}/{step.totalSets}
            {step.totalExercisesInBlock > 1 && (
              <span> · Exercice {step.exerciseIndexInBlock + 1}/{step.totalExercisesInBlock}</span>
            )}
          </p>
          <h1 className="font-display text-3xl text-ink mb-2">{step.exerciseTitle}</h1>
          {step.reps && step.phase === 'work' && (
            <div
              className="text-5xl font-display mt-2"
              style={{ color: phaseColor }}
            >
              {step.reps} <span className="text-2xl text-ink/45">reps</span>
            </div>
          )}
        </div>

        {step.phase === 'work' && (step.exerciseVideoUrl || step.exerciseImageUrl) && (
          <ExercisePlayerMedia
            key={`${player.currentIndex}-${step.exerciseTitle}`}
            videoUrl={step.exerciseVideoUrl}
            imageUrl={step.exerciseImageUrl}
            title={step.exerciseTitle}
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
          <p className="text-ink/55 text-sm text-center max-w-xs leading-relaxed">
            {step.exerciseDescription}
          </p>
        )}
      </div>

      <div className="px-6 pb-10 pt-4">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={player.goPrev}
            disabled={!player.canGoPrev}
            className="p-3 rounded-full text-ink/35 hover:text-ink disabled:opacity-20 transition-colors"
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
            className="p-3 rounded-full text-ink/35 hover:text-ink transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ExercisePlayerMedia({
  videoUrl,
  imageUrl,
  title,
}: {
  videoUrl?: string
  imageUrl?: string
  title: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }, [videoUrl, title])

  if (videoUrl) {
    return (
      <video
        ref={videoRef}
        src={videoUrl}
        poster={imageUrl}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
        className="max-h-52 w-full max-w-xs object-contain rounded-xl bg-paper-warm shadow-sm"
      />
    )
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className="max-h-52 w-full max-w-xs object-contain rounded-xl"
      />
    )
  }

  return null
}

function FinishedScreen({ onComplete, onRestart }: { onComplete: () => void; onRestart: () => void }) {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-center animate-slide-up">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display text-4xl mb-2">Séance terminée !</h1>
        <p className="text-ink/55">Bravo, tu l&apos;as fait.</p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-3 rounded-lg border border-stroke text-ink/70 hover:text-ink hover:border-ink/20 transition-colors"
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
