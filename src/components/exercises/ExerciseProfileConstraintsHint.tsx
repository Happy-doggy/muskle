import { Link } from 'react-router-dom'
import { Settings2 } from 'lucide-react'
import type { ExerciseProfileConstraints } from '@/lib/exerciseFilters'
import { buildProfileConstraintsSummary } from '@/lib/exerciseFilters'

type ExerciseProfileConstraintsHintProps = {
  constraints: ExerciseProfileConstraints
}

export default function ExerciseProfileConstraintsHint({
  constraints,
}: ExerciseProfileConstraintsHintProps) {
  const summary = buildProfileConstraintsSummary(constraints)

  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5 space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/40">
        Votre profil
      </p>
      <p className="text-xs text-ink/65 leading-snug">{summary}</p>
      <p className="text-[11px] text-ink/45">
        Matériel et niveau filtrent automatiquement la bibliothèque.
      </p>
      <Link
        to="/account"
        className="inline-flex items-center gap-1 text-xs font-medium text-mint hover:underline"
      >
        <Settings2 size={12} />
        Modifier dans Mon compte
      </Link>
    </div>
  )
}
