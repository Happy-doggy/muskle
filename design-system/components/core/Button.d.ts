import React from 'react'

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

/**
 * The primary action element for Muskle. Mint `default` for the main
 * action on a view, `outline` for secondary "Ajouter"-style actions,
 * `ghost` for low-emphasis, `destructive` for delete.
 *
 * @startingPoint section="Core" subtitle="Mint / outline / ghost / destructive, four sizes" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. @default 'default' */
  variant?: ButtonVariant
  /** Size preset. @default 'default' */
  size?: ButtonSize
  /** Button label / content (icon + text). */
  children?: React.ReactNode
}

export function Button(props: ButtonProps): React.ReactElement
