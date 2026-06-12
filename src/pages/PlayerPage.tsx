import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useCallback, useMemo, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { useAppStore } from '../store'
import { getCatalogExercises } from '../lib/customExercises'
import { useSessionPlayer } from '../hooks/useSessionPlayer'
import { useTimer } from '../hooks/useTimer'
import { useTimerSounds } from '../hooks/useTimerSounds'
import { unlockTimerSounds } from '../lib/timerSounds'
import { formatPlayerStepMeta } from '../lib/playerSteps'
import PlayerActionDock from '../components/PlayerActionDock'
import { cn } from '@/lib/utils'
import { useAuth } from '../hooks/useAuth'
import { trackWorkoutCompleted } from '../firebase/userTracking'

const OVERLAY_TRACK = 'rgba(255, 255, 255, 0.22)'

export default function PlayerPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const blocks = useAppStore((s) => s.blocks)
  const sessions = useAppStore((s) => s.sessions)
  const session = sessions.find((s) => s.id === sessionId)
  const exercises = useMemo(() => getCatalogExercises(), [])

  const handleComplete = () => {
    if (user) {
      void trackWorkoutCompleted(user.uid).catch((err) => {
        console.error('[PlayerPage] Failed to track workout completion', err)
      })
    }
    navigate('/sessions')
  }

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
      onComplete={handleComplete}
    />
  )
}

type PlayerCoreProps = {
  session: NonNullable<ReturnType<typeof useAppStore.getState>['sessions'][number]>
  exercises: ReturnType<typeof getCatalogExercises>
  blocks: ReturnType<typeof useAppStore.getState>['blocks']
  onExit: () => void
  onComplete: () => void
}

function PlayerCore({ session, exercises, blocks, onExit, onComplete }: PlayerCoreProps) {
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

  const showMedia =
    step.phase === 'work' && Boolean(step.exerciseVideoUrl || step.exerciseImageUrl)

  const handleTogglePlay = () => {
    unlockTimerSounds()
    if (timer.isRunning) timer.pause()
    else timer.start()
  }

  const handleSelectStep = (index: number) => {
    unlockTimerSounds()
    player.goToStep(index)
  }

  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-ink">
      {/* Fond plein écran */}
      <div className="absolute inset-0">
        {showMedia ? (
          <ExercisePlayerMedia
            key={`${player.currentIndex}-${step.exerciseTitle}`}
            videoUrl={step.exerciseVideoUrl}
            imageUrl={step.exerciseImageUrl}
            title={step.exerciseTitle}
            cover
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink via-[#1a1a1a] to-black" />
        )}
      </div>

      {/* Dégradés de lisibilité */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 18%, transparent 42%), linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 28%, transparent 50%)',
        }}
      />

      {/* Header par-dessus la vidéo */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-5 flex flex-col gap-3 pointer-events-auto">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onExit}
            className="w-[4.5rem] px-3 py-1.5 rounded-md border border-white/20 bg-white/95 text-mint text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
          >
            Arrêter
          </button>

          <div className="text-center min-w-0 flex-1">
            <p className="text-xs text-white/55 uppercase tracking-wider truncate drop-shadow-sm">
              {session.name}
            </p>
            <p className="text-sm text-white/85 font-medium truncate drop-shadow-sm">
              {step.blockTitle}
            </p>
          </div>

          <span className="w-[4.5rem] text-xs text-white/70 font-medium tabular-nums shrink-0 text-right drop-shadow-sm">
            {Math.round(sessionProgressPercent)}%
          </span>
        </div>

        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: OVERLAY_TRACK }}>
          <div
            className="h-full bg-mint transition-all duration-300"
            style={{ width: `${sessionProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Infos exercice */}
      <div className="absolute inset-0 z-20 pointer-events-none p-4 pt-28 sm:p-6 sm:pt-32">
        <PlayerStepDetails step={step} />
      </div>

      {/* Timer, contrôles et exercice suivant */}
      <PlayerActionDock
        steps={player.steps}
        currentIndex={player.currentIndex}
        onSelectStep={handleSelectStep}
        hasReps={hasReps}
        reps={step.reps}
        phaseColor={phaseColor}
        phase={step.phase}
        timerProgress={timer.progress}
        timerRemaining={timer.remaining}
        timerDuration={step.duration}
        isRunning={timer.isRunning}
        canGoPrev={player.canGoPrev}
        onPrev={player.goPrev}
        onNext={player.goNext}
        onTogglePlay={handleTogglePlay}
      />
    </div>
  )
}

function PlayerStepDetails({
  step,
}: {
  step: NonNullable<ReturnType<typeof useSessionPlayer>['currentStep']>
}) {
  return (
    <div
      className="animate-fade-in pointer-events-auto max-w-xl text-white"
      key={step.exerciseTitle + step.set}
    >
      <p className="text-sm mb-1 text-white/65 drop-shadow-sm">
        {formatPlayerStepMeta(step)}
      </p>
      <h1 className="font-display text-2xl sm:text-4xl text-white mb-2 drop-shadow-sm">
        {step.exerciseTitle}
      </h1>
      {step.exerciseDescription && step.phase !== 'rest' && (
        <p className="text-sm leading-relaxed text-white/75 max-w-md mt-1 sm:mt-2 drop-shadow-sm line-clamp-3 sm:line-clamp-none">
          {step.exerciseDescription}
        </p>
      )}
    </div>
  )
}

function ExercisePlayerMedia({
  videoUrl,
  imageUrl,
  title,
  cover = false,
}: {
  videoUrl?: string
  imageUrl?: string
  title: string
  cover?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoUrl) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }, [videoUrl, title])

  const mediaClass = cover
    ? 'h-full w-full object-cover'
    : 'max-h-52 w-full max-w-xs object-contain rounded-xl bg-paper-warm shadow-sm'

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
        className={mediaClass}
      />
    )
  }

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={title}
        className={cn(mediaClass, !cover && 'rounded-xl')}
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
