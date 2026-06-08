import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { Block, BlockExercise, BlockMode } from '../data/blocks'
import { muscleGroups, type Exercise } from '../data/exercices'
import { getCatalogExercises } from '../lib/customExercises'
import { useAppStore } from '../store'
import { Button } from './ui/button'
import SegmentedTabs from './ui/SegmentedTabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { cn } from '@/lib/utils'

type MeasureType = 'reps' | 'duration'

type ExerciseRow = BlockExercise & { key: string; measureType: MeasureType }

function inferMeasureType(row: BlockExercise, ex?: Exercise): MeasureType {
  if (row.duration !== undefined) return 'duration'
  if (row.reps !== undefined) return 'reps'
  return ex?.type === 'duration' ? 'duration' : 'reps'
}

type FormState = {
  name: string
  mode: BlockMode
  rounds: string
  restBetweenRounds: string
  exercises: ExerciseRow[]
}

function defaultsFromExercise(
  ex: Exercise,
  mode: BlockMode,
  measureType?: MeasureType,
): Omit<ExerciseRow, 'key'> {
  const mt = measureType ?? (ex.type === 'duration' ? 'duration' : 'reps')
  const base: Omit<ExerciseRow, 'key'> = {
    exerciseId: ex.id,
    measureType: mt,
    sets: mode === 'list' ? ex.defaultSets ?? 3 : undefined,
    restSeconds: mt === 'reps' ? 60 : 30,
  }
  if (mt === 'reps') {
    return { ...base, reps: ex.defaultReps ?? 12 }
  }
  return { ...base, duration: ex.defaultDuration ?? 30 }
}

function emptyRow(mode: BlockMode): ExerciseRow {
  const catalog = getCatalogExercises()
  const first = catalog[0]
  if (!first) {
    return { key: crypto.randomUUID(), exerciseId: '', restSeconds: 60, measureType: 'reps' }
  }
  return { key: crypto.randomUUID(), ...defaultsFromExercise(first, mode) }
}

function blockToForm(block: Block): FormState {
  return {
    name: block.name,
    mode: block.mode,
    rounds: String(block.rounds ?? 3),
    restBetweenRounds: String(block.restBetweenRounds ?? 60),
    exercises: block.exercises.map((row) => {
      const ex = getCatalogExercises().find((e) => e.id === row.exerciseId)
      return {
        ...row,
        key: crypto.randomUUID(),
        measureType: inferMeasureType(row, ex),
      }
    }),
  }
}

const initialForm = (mode: BlockMode = 'list'): FormState => ({
  name: '',
  mode,
  rounds: '3',
  restBetweenRounds: '60',
  exercises: [emptyRow(mode)],
})

type BlockFormProps = {
  blockId?: string
}

export default function BlockForm({ blockId }: BlockFormProps) {
  const navigate = useNavigate()
  const existing = useAppStore((s) =>
    blockId ? s.blocks.find((b) => b.id === blockId) : undefined,
  )
  const addBlock = useAppStore((s) => s.addBlock)
  const updateBlock = useAppStore((s) => s.updateBlock)
  const deleteBlock = useAppStore((s) => s.deleteBlock)

  const [form, setForm] = useState<FormState>(() =>
    existing ? blockToForm(existing) : initialForm(),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existing) setForm(blockToForm(existing))
  }, [existing])

  const catalog = useMemo(() => getCatalogExercises(), [])
  const catalogByCategory = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const group of muscleGroups) {
      map.set(group, catalog.filter((e) => e.category === group))
    }
    return map
  }, [catalog])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const setMode = (mode: BlockMode) => {
    setForm((prev) => ({
      ...prev,
      mode,
      exercises: prev.exercises.map((row) => {
        const ex = catalog.find((e) => e.id === row.exerciseId)
        if (!ex) return row
        const base = defaultsFromExercise(ex, mode, row.measureType)
        return { ...row, ...base, key: row.key }
      }),
    }))
    setError(null)
  }

  const updateRow = (key: string, patch: Partial<ExerciseRow>) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((row) =>
        row.key === key ? { ...row, ...patch } : row,
      ),
    }))
    setError(null)
  }

  const onExerciseChange = (key: string, exerciseId: string) => {
    const ex = catalog.find((e) => e.id === exerciseId)
    if (!ex) return
    const row = form.exercises.find((r) => r.key === key)
    updateRow(key, {
      ...defaultsFromExercise(ex, form.mode, row?.measureType),
      exerciseId,
    })
  }

  const setRowMeasureType = (key: string, measureType: MeasureType) => {
    const row = form.exercises.find((r) => r.key === key)
    const ex = catalog.find((e) => e.id === row?.exerciseId)
    if (!row || !ex) return
    const defaults = defaultsFromExercise(ex, form.mode, measureType)
    if (measureType === 'reps') {
      updateRow(key, {
        measureType,
        reps: defaults.reps,
        duration: undefined,
      })
    } else {
      updateRow(key, {
        measureType,
        duration: defaults.duration,
        reps: undefined,
      })
    }
  }

  const addRow = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, emptyRow(prev.mode)],
    }))
  }

  const removeRow = (key: string) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((r) => r.key !== key),
    }))
  }

  const buildBlock = (): Block | { error: string } => {
    const name = form.name.trim()
    if (name.length < 2) {
      return { error: 'Le nom doit contenir au moins 2 caractères.' }
    }
    if (form.exercises.length === 0) {
      return { error: 'Ajoute au moins un exercice au bloc.' }
    }

    const exercises: BlockExercise[] = []
    for (const row of form.exercises) {
      if (!row.exerciseId) {
        return { error: 'Chaque ligne doit avoir un exercice sélectionné.' }
      }
      const ex = catalog.find((e) => e.id === row.exerciseId)
      if (!ex) {
        return { error: 'Exercice introuvable.' }
      }

      const restSeconds = Number(row.restSeconds)
      if (!Number.isFinite(restSeconds) || restSeconds < 0) {
        return { error: 'Le repos après exercice doit être un nombre positif ou zéro.' }
      }

      if (row.measureType === 'reps') {
        const reps = Number(row.reps)
        if (!Number.isFinite(reps) || reps < 1) {
          return { error: 'Les répétitions doivent être au moins 1.' }
        }
        const entry: BlockExercise = { exerciseId: row.exerciseId, reps, restSeconds }
        if (form.mode === 'list') {
          const sets = Number(row.sets)
          if (!Number.isFinite(sets) || sets < 1) {
            return { error: 'Le nombre de séries doit être au moins 1.' }
          }
          entry.sets = sets
        }
        exercises.push(entry)
      } else {
        const duration = Number(row.duration)
        if (!Number.isFinite(duration) || duration < 1) {
          return { error: 'La durée doit être d’au moins 1 seconde.' }
        }
        const entry: BlockExercise = { exerciseId: row.exerciseId, duration, restSeconds }
        if (form.mode === 'list') {
          const sets = Number(row.sets)
          if (!Number.isFinite(sets) || sets < 1) {
            return { error: 'Le nombre de séries doit être au moins 1.' }
          }
          entry.sets = sets
        }
        exercises.push(entry)
      }
    }

    const block: Block = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      mode: form.mode,
      exercises,
    }

    if (form.mode === 'circuit') {
      const rounds = Number(form.rounds)
      if (!Number.isFinite(rounds) || rounds < 1) {
        return { error: 'Le nombre de rounds doit être au moins 1.' }
      }
      const restBetweenRounds = Number(form.restBetweenRounds)
      if (!Number.isFinite(restBetweenRounds) || restBetweenRounds < 0) {
        return { error: 'Le repos entre rounds doit être un nombre positif ou zéro.' }
      }
      block.rounds = rounds
      block.restBetweenRounds = restBetweenRounds
    }

    return block
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = buildBlock()
    if ('error' in result) {
      setError(result.error)
      return
    }
    if (existing) {
      updateBlock(result)
    } else {
      addBlock(result)
    }
    navigate('/blocks')
  }

  const isEdit = Boolean(existing)

  const handleDelete = () => {
    if (!existing) return
    if (window.confirm(`Supprimer le bloc « ${existing.name} » ?`)) {
      deleteBlock(existing.id)
      navigate('/blocks')
    }
  }

  if (blockId && !existing) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-ink/60 mb-4">Bloc introuvable.</p>
        <Button asChild>
          <Link to="/blocks">Retour aux blocs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link to="/blocks">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">
              {isEdit ? 'Modifier le bloc' : 'Nouveau bloc'}
            </h1>
            <p className="text-ink/50 text-sm mt-1">
              Compose une liste ou un circuit d’exercices.
            </p>
          </div>
          {isEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive shrink-0"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Bloc</CardTitle>
            <CardDescription>Nom et mode d’enchaînement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex. Gainage de base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Mode</Label>
              <Select value={form.mode} onValueChange={(v) => setMode(v as BlockMode)}>
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">Liste</SelectItem>
                  <SelectItem value="circuit">Circuit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.mode === 'circuit' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rounds">Nombre de rounds</Label>
                  <Input
                    id="rounds"
                    type="number"
                    min={1}
                    value={form.rounds}
                    onChange={(e) => update('rounds', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restBetweenRounds">Repos entre rounds (s)</Label>
                  <Input
                    id="restBetweenRounds"
                    type="number"
                    min={0}
                    value={form.restBetweenRounds}
                    onChange={(e) => update('restBetweenRounds', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Exercices</CardTitle>
            <CardDescription>
              Ordre d’exécution et paramètres pour chaque mouvement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.exercises.map((row, index) => (
                <div
                  key={row.key}
                  className="border border-border rounded-lg p-4 space-y-3 bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-ink/50">
                      Exercice {index + 1}
                    </span>
                    {form.exercises.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8 px-2"
                        onClick={() => removeRow(row.key)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Exercice</Label>
                    <Select
                      value={row.exerciseId}
                      onValueChange={(v) => onExerciseChange(row.key, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un exercice" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.map((group) => {
                          const items = catalogByCategory.get(group) ?? []
                          if (items.length === 0) return null
                          return (
                            <SelectGroup key={group}>
                              <SelectLabel>{group}</SelectLabel>
                              {items.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Type d&apos;effort</Label>
                    <SegmentedTabs
                      layoutId={`block-exercise-type-${row.key}`}
                      value={row.measureType}
                      onChange={(type) => setRowMeasureType(row.key, type)}
                      fullWidth
                      segments={[
                        { value: 'reps', label: 'Répétitions' },
                        { value: 'duration', label: 'Durée' },
                      ]}
                    />
                  </div>

                  <div className={cn('grid gap-3', form.mode === 'list' ? 'grid-cols-3' : 'grid-cols-2')}>
                    {form.mode === 'list' && (
                      <div className="space-y-2">
                        <Label>Séries</Label>
                        <Input
                          type="number"
                          min={1}
                          value={row.sets ?? ''}
                          onChange={(e) =>
                            updateRow(row.key, { sets: Number(e.target.value) })
                          }
                        />
                      </div>
                    )}
                    {row.measureType === 'reps' ? (
                      <div className="space-y-2">
                        <Label>Répétitions</Label>
                        <Input
                          type="number"
                          min={1}
                          value={row.reps ?? ''}
                          onChange={(e) =>
                            updateRow(row.key, { reps: Number(e.target.value) })
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Durée (s)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={row.duration ?? ''}
                          onChange={(e) =>
                            updateRow(row.key, { duration: Number(e.target.value) })
                          }
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Repos après (s)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={row.restSeconds ?? ''}
                        onChange={(e) =>
                          updateRow(row.key, { restSeconds: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addRow}>
              <Plus size={16} />
              Ajouter un exercice
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-8">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link to="/blocks">Annuler</Link>
          </Button>
          <Button type="submit" className="flex-1">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
