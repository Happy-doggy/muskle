import React from 'react'

export type ExerciseCategory =
  | 'musculation'
  | 'renforcement'
  | 'yoga'
  | 'kine'
  | 'cardio'
  | 'mobilite'
  | 'autre'

/**
 * Discipline chip carrying the per-category hue as a soft tint. Use on
 * exercise cards and block headers.
 */
export interface CategoryBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Which discipline — picks label + hue. */
  category: ExerciseCategory
  /** 'sm' for dense list rows. @default 'md' */
  size?: 'sm' | 'md'
}

export function CategoryBadge(props: CategoryBadgeProps): React.ReactElement
