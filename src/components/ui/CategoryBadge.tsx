import type { ExerciseCategory } from '../../types'

const CONFIG: Record<ExerciseCategory, { label: string; color: string }> = {
  musculation: { label: 'Musculation', color: 'bg-musculation/10 text-musculation' },
  renforcement: { label: 'Renforcement', color: 'bg-renforcement/10 text-renforcement' },
  yoga:         { label: 'Yoga',         color: 'bg-yoga/10 text-yoga' },
  kine:         { label: 'Kiné',         color: 'bg-kine/10 text-kine' },
  cardio:       { label: 'Cardio',       color: 'bg-cardio/10 text-cardio' },
  mobilite:     { label: 'Mobilité',     color: 'bg-mobilite/10 text-mobilite' },
  autre:        { label: 'Autre',        color: 'bg-autre/10 text-autre' },
}

interface CategoryBadgeProps {
  category: ExerciseCategory
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const { label, color } = CONFIG[category]
  return (
    <span
      className={`category-badge ${color} ${
        size === 'sm' ? 'text-[10px] px-1.5 py-0' : ''
      }`}
    >
      {label}
    </span>
  )
}
