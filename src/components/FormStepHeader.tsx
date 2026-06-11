type FormStepHeaderProps = {
  step: 1 | 2
  title: string
  description: string
}

export default function FormStepHeader({
  step,
  title,
  description,
}: FormStepHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-sm font-semibold text-white"
        aria-hidden
      >
        {step}
      </span>
      <div>
        <h2 className="font-display text-lg text-ink">{title}</h2>
        <p className="mt-0.5 text-sm text-ink/50">{description}</p>
      </div>
    </div>
  )
}
