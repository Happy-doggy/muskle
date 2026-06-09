import React from 'react'

/**
 * White surface on the cream canvas — hairline border, 10px radius, no
 * shadow. The base container for séances, blocs, and exercices lists.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds pointer cursor + mint hover-border for list rows. @default false */
  clickable?: boolean
  children?: React.ReactNode
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export function Card(props: CardProps): React.ReactElement
export function CardTitle(props: CardTitleProps): React.ReactElement
export function CardDescription(props: CardDescriptionProps): React.ReactElement
