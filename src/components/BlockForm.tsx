import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowLeft, GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Block, BlockExercise, BlockMode } from '../data/blocks'
import type { Exercise } from '../data/exercices'
import { getCatalogExercises } from '../lib/customExercises'
import {
  BLOCK_FORMAT_OPTIONS,
  blockModeUsesRounds,
  blockModeUsesSets,
  blockModeUsesTotalDuration,
} from '../lib/blockFormats'
import { useAppStore } from '../store'
import ExercisePickerList from './ExercisePickerList'
import FormStepHeader from './FormStepHeader'
import { Button } from './ui/button'
import SegmentedTabs from './ui/SegmentedTabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'
import { toast } from '@/lib/toast'

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
  totalDuration: string
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
    sets: blockModeUsesSets(mode) ? ex.defaultSets ?? 3 : undefined,
    restSeconds: mt === 'reps' ? 60 : 30,
  }
  if (mt === 'reps') {
    return { ...base, reps: ex.defaultReps ?? 12 }
  }
  return { ...base, duration: ex.defaultDuration ?? 30 }
}

function blockToForm(block: Block): FormState {
  return {
    name: block.name,
    mode: block.mode,
    rounds: String(block.rounds ?? (block.mode === 'tabata' ? 8 : 3)),
    restBetweenRounds: String(block.restBetweenRounds ?? 60),
    totalDuration: String(
      block.totalDuration != null ? Math.round(block.totalDuration / 60) : 10,
    ),
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

const initialForm = (): FormState => ({
  name: '',
  mode: 'list',
  rounds: '3',
  restBetweenRounds: '60',
  totalDuration: '10',
  exercises: [],
})

type BlockFormProps = {
  blockId?: string
}

function validateDraftRow(row: ExerciseRow, mode: BlockMode): string | null {
  if (!row.exerciseId) return 'Choisis un exercice.'
  const restSeconds = Number(row.restSeconds)
  if (!Number.isFinite(restSeconds) || restSeconds < 0) {
    return 'Le repos après exercice doit être un nombre positif ou zéro.'
  }
  if (row.measureType === 'reps') {
    const reps = Number(row.reps)
    if (!Number.isFinite(reps) || reps < 1) return 'Les répétitions doivent être au moins 1.'
    if (blockModeUsesSets(mode)) {
      const sets = Number(row.sets)
      if (!Number.isFinite(sets) || sets < 1) return 'Le nombre de séries doit être au moins 1.'
    }
  } else {
    const duration = Number(row.duration)
    if (!Number.isFinite(duration) || duration < 1) {
      return 'La durée doit être d’au moins 1 seconde.'
    }
    if (blockModeUsesSets(mode)) {
      const sets = Number(row.sets)
      if (!Number.isFinite(sets) || sets < 1) return 'Le nombre de séries doit être au moins 1.'
    }
  }
  return null
}

function rowToBlockExercise(row: ExerciseRow, mode: BlockMode): BlockExercise {
  const restSeconds = Number(row.restSeconds)
  if (row.measureType === 'reps') {
    const entry: BlockExercise = {
      exerciseId: row.exerciseId,
      reps: Number(row.reps),
      restSeconds,
    }
    if (blockModeUsesSets(mode)) entry.sets = Number(row.sets)
    return entry
  }
  const entry: BlockExercise = {
    exerciseId: row.exerciseId,
    duration: Number(row.duration),
    restSeconds,
  }
  if (blockModeUsesSets(mode)) entry.sets = Number(row.sets)
  return entry
}

function formatExerciseRowSummary(row: ExerciseRow): string {
  const effort =
    row.measureType === 'reps'
      ? `${row.sets != null ? `${row.sets} × ` : ''}${row.reps} reps`
      : `${row.sets != null ? `${row.sets} × ` : ''}${row.duration}s`
  return `${effort} · repos ${row.restSeconds}s`
}

type SortableExerciseRowProps = {
  row: ExerciseRow
  index: number
  name: string
  onEdit: () => void
  onRemove: () => void
  disabled?: boolean
}

function SortableExerciseRow({
  row,
  index,
  name,
  onEdit,
  onRemove,
  disabled,
}: SortableExerciseRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.key, disabled })

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border bg-white p-4',
        isDragging && 'z-10 opacity-60 shadow-md',
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md text-ink/35 transition-colors',
          disabled
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-grab touch-none hover:bg-paper hover:text-ink/60 active:cursor-grabbing',
        )}
        aria-label={`Réordonner ${name}`}
        disabled={disabled}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ink/45">Exercice {index + 1}</p>
        <p className="mt-1 text-sm font-medium text-ink">{name}</p>
        <p className="mt-1 text-xs text-ink/50">{formatExerciseRowSummary(row)}</p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-ink/55 hover:text-mint"
          onClick={onEdit}
          aria-label={`Modifier ${name}`}
        >
          <Pencil size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-destructive hover:text-destructive"
          onClick={onRemove}
          aria-label={`Supprimer ${name}`}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </li>
  )
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
  const [draft, setDraft] = useState<ExerciseRow | null>(null)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    if (existing) setForm(blockToForm(existing))
  }, [existing])

  const catalog = useMemo(() => getCatalogExercises(), [])
  const catalogMap = useMemo(
    () => new Map(catalog.map((e) => [e.id, e])),
    [catalog],
  )

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const setMode = (mode: BlockMode) => {
    setForm((prev) => ({
      ...prev,
      mode,
      rounds: mode === 'tabata' ? '8' : prev.rounds,
      exercises: prev.exercises.map((row) => {
        const ex = catalogMap.get(row.exerciseId)
        if (!ex) return row
        const base = defaultsFromExercise(ex, mode, row.measureType)
        return { ...row, ...base, key: row.key }
      }),
    }))
    if (draft) {
      const ex = catalogMap.get(draft.exerciseId)
      if (ex) {
        setDraft({
          ...defaultsFromExercise(ex, mode, draft.measureType),
          key: draft.key,
        })
      }
    }
    setError(null)
  }

  const selectExercise = (exercise: Exercise) => {
    if (draft) {
      setError('Valide ou annule l’exercice en cours de saisie.')
      return
    }
    setDraft({
      key: crypto.randomUUID(),
      ...defaultsFromExercise(exercise, form.mode),
    })
    setError(null)
  }

  const updateDraft = (patch: Partial<ExerciseRow>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
    setError(null)
  }

  const setDraftMeasureType = (measureType: MeasureType) => {
    if (!draft) return
    const ex = catalogMap.get(draft.exerciseId)
    if (!ex) return
    const defaults = defaultsFromExercise(ex, form.mode, measureType)
    if (measureType === 'reps') {
      updateDraft({
        measureType,
        reps: defaults.reps,
        duration: undefined,
      })
    } else {
      updateDraft({
        measureType,
        duration: defaults.duration,
        reps: undefined,
      })
    }
  }

  const confirmDraft = () => {
    if (!draft) return
    const draftError = validateDraftRow(draft, form.mode)
    if (draftError) {
      setError(draftError)
      return
    }
    const saved: ExerciseRow = {
      ...draft,
      key: editingKey ?? draft.key,
    }
    const wasEditing = Boolean(editingKey)
    setForm((prev) => ({
      ...prev,
      exercises: editingKey
        ? prev.exercises.map((row) => (row.key === editingKey ? saved : row))
        : [...prev.exercises, saved],
    }))
    setDraft(null)
    setEditingKey(null)
    setError(null)
    toast.success(wasEditing ? 'Exercice modifié' : 'Exercice ajouté au bloc')
  }

  const cancelDraft = () => {
    setDraft(null)
    setEditingKey(null)
    setError(null)
  }

  const editRow = (key: string) => {
    if (draft) {
      setError('Valide ou annule l’exercice en cours de saisie.')
      return
    }
    const row = form.exercises.find((r) => r.key === key)
    if (!row) return
    setDraft({ ...row })
    setEditingKey(key)
    setError(null)
  }

  const removeRow = (key: string) => {
    if (editingKey === key) cancelDraft()
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((r) => r.key !== key),
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || draft) return

    setForm((prev) => {
      const oldIndex = prev.exercises.findIndex((row) => row.key === active.id)
      const newIndex = prev.exercises.findIndex((row) => row.key === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return {
        ...prev,
        exercises: arrayMove(prev.exercises, oldIndex, newIndex),
      }
    })
  }

  const visibleExercises = editingKey
    ? form.exercises.filter((row) => row.key !== editingKey)
    : form.exercises

  const buildBlock = (): Block | { error: string } => {
    const name = form.name.trim()
    if (name.length < 2) {
      return { error: 'Le nom doit contenir au moins 2 caractères.' }
    }
    if (form.exercises.length === 0) {
      return { error: 'Ajoute au moins un exercice au bloc.' }
    }
    if (draft) {
      return { error: 'Valide ou abandonne l’exercice en cours de saisie.' }
    }

    const exercises = form.exercises.map((row) => {
      const rowError = validateDraftRow(row, form.mode)
      if (rowError) return { error: rowError }
      return rowToBlockExercise(row, form.mode)
    })

    for (const item of exercises) {
      if ('error' in item) return item
    }

    const block: Block = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      mode: form.mode,
      exercises: exercises as BlockExercise[],
    }

    if (blockModeUsesRounds(form.mode)) {
      const rounds = Number(form.rounds)
      if (!Number.isFinite(rounds) || rounds < 1) {
        return { error: 'Le nombre de rounds doit être au moins 1.' }
      }
      block.rounds = rounds
    }

    if (form.mode === 'circuit') {
      const restBetweenRounds = Number(form.restBetweenRounds)
      if (!Number.isFinite(restBetweenRounds) || restBetweenRounds < 0) {
        return { error: 'Le repos entre rounds doit être un nombre positif ou zéro.' }
      }
      block.restBetweenRounds = restBetweenRounds
    }

    if (blockModeUsesTotalDuration(form.mode)) {
      const minutes = Number(form.totalDuration)
      if (!Number.isFinite(minutes) || minutes < 1) {
        return { error: 'La durée totale doit être d’au moins 1 minute.' }
      }
      block.totalDuration = minutes * 60
    }

    return block
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = buildBlock()
    if ('error' in result) {
      setError(result.error)
      return
    }
    try {
      if (existing) {
        await updateBlock(result)
        toast.success('Bloc enregistré')
      } else {
        await addBlock(result)
        toast.success('Bloc créé')
      }
      navigate('/blocks')
    } catch {
      toast.error('Impossible d’enregistrer le bloc. Réessaie.')
    }
  }

  const isEdit = Boolean(existing)

  const handleDelete = async () => {
    if (!existing) return
    if (window.confirm(`Supprimer le bloc « ${existing.name} » ?`)) {
      try {
        await deleteBlock(existing.id)
        toast.success('Bloc supprimé')
        navigate('/blocks')
      } catch {
        toast.error('Impossible de supprimer le bloc. Réessaie.')
      }
    }
  }

  if (blockId && !existing) {
    return (
      <div className="form-narrow text-center py-12">
        <p className="text-ink/60 mb-4">Bloc introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/blocks">Retour aux blocs</Link>
        </Button>
      </div>
    )
  }

  const draftExercise = draft ? catalogMap.get(draft.exerciseId) : undefined

  return (
    <div className="form-narrow">
      <div className="mb-6">
        <Button variant="outline" size="sm" className="-ml-2 mb-4" asChild>
          <Link to="/blocks">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">
              {isEdit ? 'Modifier le bloc' : 'Créer un bloc'}
            </h1>
            <p className="text-ink/50 text-sm mt-1">
              Choisis un format, puis compose les exercices du bloc.
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
        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <FormStepHeader
            step={1}
            title="Format"
            description="Un seul format par bloc."
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nom du bloc</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Ex. Gainage de base"
              required
            />
          </div>

          <div className="grid gap-2">
            {BLOCK_FORMAT_OPTIONS.map((format) => {
              const selected = form.mode === format.mode
              return (
                <button
                  key={format.mode}
                  type="button"
                  onClick={() => setMode(format.mode)}
                  className={cn(
                    'rounded-lg border p-4 text-left transition-colors',
                    selected
                      ? 'border-mint bg-mint/5 ring-1 ring-mint/30'
                      : 'border-border bg-white hover:border-mint/40',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ color: format.color, background: format.bg }}
                    >
                      {format.label}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{format.title}</p>
                      <p className="mt-0.5 text-sm text-ink/55">{format.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {blockModeUsesRounds(form.mode) && (
            <div className={cn('grid gap-4', form.mode === 'circuit' ? 'grid-cols-2' : 'grid-cols-1')}>
              <div className="space-y-2">
                <Label htmlFor="rounds">
                  {form.mode === 'emom' ? 'Nombre de minutes' : 'Nombre de rounds'}
                </Label>
                <Input
                  id="rounds"
                  type="number"
                  min={1}
                  value={form.rounds}
                  onChange={(e) => update('rounds', e.target.value)}
                  required
                />
              </div>
              {form.mode === 'circuit' && (
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
              )}
            </div>
          )}

          {blockModeUsesTotalDuration(form.mode) && (
            <div className="space-y-2">
              <Label htmlFor="totalDuration">Durée totale (min)</Label>
              <Input
                id="totalDuration"
                type="number"
                min={1}
                value={form.totalDuration}
                onChange={(e) => update('totalDuration', e.target.value)}
                required
              />
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <FormStepHeader
            step={2}
            title="Exercices"
            description="Recherche un exercice, configure-le, puis ajoute-le au bloc."
          />

          <ExercisePickerList
            exercises={catalog}
            selectedId={draft?.exerciseId}
            onSelect={selectExercise}
          />

          {visibleExercises.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visibleExercises.map((row) => row.key)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-3">
                  {visibleExercises.map((row) => {
                    const ex = catalogMap.get(row.exerciseId)
                    const index = form.exercises.findIndex((item) => item.key === row.key)
                    return (
                      <SortableExerciseRow
                        key={row.key}
                        row={row}
                        index={index}
                        name={ex?.name ?? 'Exercice inconnu'}
                        onEdit={() => editRow(row.key)}
                        onRemove={() => removeRow(row.key)}
                        disabled={Boolean(draft)}
                      />
                    )
                  })}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          {draft && draftExercise && (
            <div className="space-y-4 rounded-lg border border-border bg-paper/40 p-4">
              <p className="text-sm font-medium text-ink">{draftExercise.name}</p>

              <div className="space-y-2">
                <Label>Type d&apos;effort</Label>
                <SegmentedTabs
                  layoutId="block-draft-exercise-type"
                  value={draft.measureType}
                  onChange={setDraftMeasureType}
                  fullWidth
                  segments={[
                    { value: 'reps', label: 'Répétitions' },
                    { value: 'duration', label: 'Durée' },
                  ]}
                />
              </div>

              <div
                className={cn(
                  'grid gap-3',
                  blockModeUsesSets(form.mode) ? 'grid-cols-3' : 'grid-cols-2',
                )}
              >
                {blockModeUsesSets(form.mode) && (
                  <div className="space-y-2">
                    <Label>Séries</Label>
                    <Input
                      type="number"
                      min={1}
                      value={draft.sets ?? ''}
                      onChange={(e) =>
                        updateDraft({ sets: Number(e.target.value) })
                      }
                    />
                  </div>
                )}
                {draft.measureType === 'reps' ? (
                  <div className="space-y-2">
                    <Label>Répétitions</Label>
                    <Input
                      type="number"
                      min={1}
                      value={draft.reps ?? ''}
                      onChange={(e) =>
                        updateDraft({ reps: Number(e.target.value) })
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Durée (s)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={draft.duration ?? ''}
                      onChange={(e) =>
                        updateDraft({ duration: Number(e.target.value) })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Repos après (s)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.restSeconds ?? ''}
                    onChange={(e) =>
                      updateDraft({ restSeconds: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={cancelDraft}>
                  Annuler
                </Button>
                <Button type="button" className="flex-1" onClick={confirmDraft}>
                  <Plus size={16} />
                  {editingKey ? 'Enregistrer l’exercice' : 'Créer l’exercice'}
                </Button>
              </div>
            </div>
          )}
        </section>

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
            {isEdit ? 'Enregistrer' : 'Créer le bloc'}
          </Button>
        </div>
      </form>
    </div>
  )
}
