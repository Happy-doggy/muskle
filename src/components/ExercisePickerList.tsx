import { useEffect, useMemo, useRef, useState } from 'react'
import { Dumbbell, Search } from 'lucide-react'
import { filterExercisesBySearch, type Exercise } from '../data/exercices'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

type ExercisePickerListProps = {
  exercises: Exercise[]
  selectedId?: string
  onSelect: (exercise: Exercise) => void
  className?: string
}

export default function ExercisePickerList({
  exercises,
  selectedId,
  onSelect,
  className,
}: ExercisePickerListProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return exercises
    return filterExercisesBySearch(exercises, query)
  }, [exercises, query])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-white">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-ink/35"
        />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un exercice…"
          className="border-0 pl-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Rechercher un exercice"
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-md">
          <div
            className="max-h-72 overflow-y-auto p-2 space-y-1"
            role="listbox"
            aria-label="Liste des exercices"
          >
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-ink/45">
                Aucun exercice ne correspond à votre recherche.
              </p>
            ) : (
              filtered.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  role="option"
                  aria-selected={selectedId === exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className={cn(
                    'flex w-full gap-3 rounded-lg border p-2 text-left transition-colors',
                    selectedId === exercise.id
                      ? 'border-mint bg-mint/5'
                      : 'border-transparent hover:border-mint/50 hover:bg-paper/60',
                  )}
                >
                  <div className="size-14 shrink-0 overflow-hidden rounded-md bg-paper-warm">
                    {exercise.image ? (
                      <img
                        src={exercise.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Dumbbell size={20} className="text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <p className="text-sm font-medium text-ink leading-snug">
                      {exercise.name}
                    </p>
                    {exercise.description && (
                      <p className="mt-0.5 text-xs text-ink/50 line-clamp-2 leading-relaxed">
                        {exercise.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
