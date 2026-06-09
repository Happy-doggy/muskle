import React from 'react'

export interface Segment {
  /** Stable value identifying this tab. */
  value: string
  /** Visible label. */
  label: string
  /** Optional leading icon (e.g. a Lucide SVG element). */
  icon?: React.ReactNode
}

/**
 * Muskle's signature segmented control — pill tabs on a white track with
 * a mint indicator that slides between the active tab. Used for the main
 * nav and for category / block-type filters.
 *
 * @startingPoint section="Forms" subtitle="Sliding-pill segmented tabs" viewport="700x120"
 */
export interface SegmentedTabsProps {
  /** Tab definitions, left to right. */
  segments: Segment[]
  /** Currently selected value. */
  value: string
  /** Called with the new value on tab click. */
  onChange?: (value: string) => void
  /** Stretch tabs to fill the row equally. @default false */
  fullWidth?: boolean
  style?: React.CSSProperties
}

export function SegmentedTabs(props: SegmentedTabsProps): React.ReactElement
