import React from 'react'

export type TimerPhase = 'prepare' | 'work' | 'rest' | 'done'

/**
 * The full-screen player's circular countdown. The arc and the center
 * label take their color from `phase`; the time is shown in mono.
 */
export interface TimerRingProps {
  /** Fill fraction of the arc, 0 → 1. */
  progress?: number
  /** Seconds remaining, shown in the center (m:ss past a minute). */
  remaining?: number
  /** Drives color + label (prepare/work/rest/done). @default 'work' */
  phase?: TimerPhase
  /** Diameter in px. @default 200 */
  size?: number
}

export function TimerRing(props: TimerRingProps): React.ReactElement
