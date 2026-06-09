import React from 'react'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

/**
 * Small rounded pill label. Use `default` (mint) for status like the
 * "Circuit" / "Liste" block tag; `secondary` for neutral metadata.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style. @default 'default' */
  variant?: BadgeVariant
  children?: React.ReactNode
}

export function Badge(props: BadgeProps): React.ReactElement
