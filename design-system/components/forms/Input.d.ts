import React from 'react'

/**
 * White text field with a mint focus ring. Used across the exercise,
 * block, and session editor forms.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/** Small medium-weight label sitting above an Input. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode
}

export function Input(props: InputProps): React.ReactElement
export function Label(props: LabelProps): React.ReactElement
