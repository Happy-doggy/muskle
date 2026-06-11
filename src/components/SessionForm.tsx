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
import { ArrowLeft, GripVertical, Plus, Trash2 } from 'lucide-react'
import type { Block } from '../data/blocks'
import type { Session } from '../data/sessions'
import { getBlockModeLabel, blockModeUsesRounds } from '../lib/blockFormats'
import { useAppStore } from '../store'
import BlockPickerList from './BlockPickerList'
import FormStepHeader from './FormStepHeader'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { cn } from '@/lib/utils'
import { toast } from '@/lib/toast'

type BlockRow = { key: string; blockId: string }

type FormState = {
  name: string
  description: string
  blockRows: BlockRow[]
}

function sessionToForm(session: Session): FormState {
  return {
    name: session.name,
    description: session.description ?? '',
    blockRows: session.blockIds.map((blockId) => ({
      key: crypto.randomUUID(),
      blockId,
    })),
  }
}

const initialForm = (): FormState => ({
  name: '',
  description: '',
  blockRows: [],
})

function formatBlockSummary(block: Block): string {
  const parts = [
    `${block.exercises.length} exercice${block.exercises.length !== 1 ? 's' : ''}`,
    getBlockModeLabel(block.mode),
  ]
  if (blockModeUsesRounds(block.mode) && block.rounds != null) {
    parts.push(
      `${block.rounds} ${block.mode === 'emom' ? 'min' : 'rounds'}`,
    )
  }
  return parts.join(' · ')
}

type SortableBlockRowProps = {
  row: BlockRow
  index: number
  block: Block | undefined
  onRemove: () => void
}

function SortableBlockRow({ row, index, block, onRemove }: SortableBlockRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.key })

  const name = block?.name ?? 'Bloc introuvable'

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
        className="mt-0.5 flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-ink/35 transition-colors hover:bg-paper hover:text-ink/60 active:cursor-grabbing"
        aria-label={`Réordonner ${name}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-ink/45">Bloc {index + 1}</p>
        <p className="mt-1 text-sm font-medium text-ink">{name}</p>
        {block && (
          <p className="mt-1 text-xs text-ink/50">{formatBlockSummary(block)}</p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 shrink-0 px-2 text-destructive hover:text-destructive"
        onClick={onRemove}
        aria-label={`Retirer ${name}`}
      >
        <Trash2 size={14} />
      </Button>
    </li>
  )
}

type SessionFormProps = {
  sessionId?: string
}

export default function SessionForm({ sessionId }: SessionFormProps) {
  const navigate = useNavigate()
  const blocks = useAppStore((s) => s.blocks)
  const existing = useAppStore((s) =>
    sessionId ? s.sessions.find((x) => x.id === sessionId) : undefined,
  )
  const addSession = useAppStore((s) => s.addSession)
  const updateSession = useAppStore((s) => s.updateSession)
  const deleteSession = useAppStore((s) => s.deleteSession)

  const [form, setForm] = useState<FormState>(() =>
    existing ? sessionToForm(existing) : initialForm(),
  )
  const [pickedBlockId, setPickedBlockId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    if (existing) setForm(sessionToForm(existing))
  }, [existing])

  const blocksMap = useMemo(
    () => new Map(blocks.map((block) => [block.id, block])),
    [blocks],
  )

  const pickedBlock = pickedBlockId ? blocksMap.get(pickedBlockId) : undefined

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const selectBlock = (block: Block) => {
    setPickedBlockId(block.id)
    setError(null)
  }

  const includePickedBlock = () => {
    if (!pickedBlockId) {
      setError('Choisis un bloc.')
      return
    }
    setForm((prev) => ({
      ...prev,
      blockRows: [
        ...prev.blockRows,
        { key: crypto.randomUUID(), blockId: pickedBlockId },
      ],
    }))
    setPickedBlockId(null)
    setError(null)
    toast.success('Bloc ajouté à la séance')
  }

  const removeRow = (key: string) => {
    setForm((prev) => ({
      ...prev,
      blockRows: prev.blockRows.filter((r) => r.key !== key),
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setForm((prev) => {
      const oldIndex = prev.blockRows.findIndex((row) => row.key === active.id)
      const newIndex = prev.blockRows.findIndex((row) => row.key === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return {
        ...prev,
        blockRows: arrayMove(prev.blockRows, oldIndex, newIndex),
      }
    })
  }

  const buildSession = (): Session | { error: string } => {
    const name = form.name.trim()
    if (name.length < 2) {
      return { error: 'Le nom doit contenir au moins 2 caractères.' }
    }
    if (form.blockRows.length === 0) {
      return { error: 'Ajoute au moins un bloc à la séance.' }
    }
    if (pickedBlockId) {
      return { error: 'Valide ou abandonne le bloc sélectionné.' }
    }
    for (const row of form.blockRows) {
      if (!row.blockId) {
        return { error: 'Chaque ligne doit avoir un bloc sélectionné.' }
      }
      if (!blocks.some((b) => b.id === row.blockId)) {
        return { error: 'Un des blocs sélectionnés n’existe plus.' }
      }
    }

    const session: Session = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      blockIds: form.blockRows.map((r) => r.blockId),
    }
    const description = form.description.trim()
    if (description) session.description = description
    return session
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = buildSession()
    if ('error' in result) {
      setError(result.error)
      return
    }
    try {
      if (existing) {
        await updateSession(result)
        toast.success('Séance enregistrée')
      } else {
        await addSession(result)
        toast.success('Séance créée')
      }
      navigate('/sessions')
    } catch {
      toast.error('Impossible d’enregistrer la séance. Réessaie.')
    }
  }

  const isEdit = Boolean(existing)

  const handleDelete = async () => {
    if (!existing) return
    if (window.confirm(`Supprimer la séance « ${existing.name} » ?`)) {
      try {
        await deleteSession(existing.id)
        toast.success('Séance supprimée')
        navigate('/sessions')
      } catch {
        toast.error('Impossible de supprimer la séance. Réessaie.')
      }
    }
  }

  if (sessionId && !existing) {
    return (
      <div className="form-narrow text-center py-12">
        <p className="text-ink/60 mb-4">Séance introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/sessions">Retour aux séances</Link>
        </Button>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="form-narrow text-center py-12">
        <p className="text-ink/60 mb-4">Crée d’abord au moins un bloc avant une séance.</p>
        <Button asChild>
          <Link to="/blocks/new">Créer un bloc</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="form-narrow">
      <div className="mb-6">
        <Button variant="outline" size="sm" className="-ml-2 mb-4" asChild>
          <Link to="/sessions">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </Button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">
              {isEdit ? 'Modifier la séance' : 'Créer une séance'}
            </h1>
            <p className="text-ink/50 text-sm mt-1">
              Définis ta séance, puis assemble les blocs dans l’ordre d’exécution.
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
            title="Séance"
            description="Nom et description optionnelle."
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la séance</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Ex. Full body — débutant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Objectif, durée estimée…"
              rows={3}
              className={cn(
                'flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-border bg-white p-5">
          <FormStepHeader
            step={2}
            title="Blocs"
            description="Recherche un bloc, puis ajoute-le à la séance dans l’ordre souhaité."
          />

          <BlockPickerList
            blocks={blocks}
            selectedId={pickedBlockId ?? undefined}
            onSelect={selectBlock}
          />

          {pickedBlock && (
            <div className="rounded-lg border border-border bg-paper/40 p-4">
              <p className="text-sm font-medium text-ink">{pickedBlock.name}</p>
              <p className="mt-1 text-xs text-ink/50">
                {formatBlockSummary(pickedBlock)}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setPickedBlockId(null)}
                >
                  Annuler
                </Button>
                <Button type="button" className="flex-1" onClick={includePickedBlock}>
                  <Plus size={16} />
                  Inclure le bloc
                </Button>
              </div>
            </div>
          )}

          {form.blockRows.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={form.blockRows.map((row) => row.key)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-3">
                  {form.blockRows.map((row, index) => (
                    <SortableBlockRow
                      key={row.key}
                      row={row}
                      index={index}
                      block={blocksMap.get(row.blockId)}
                      onRemove={() => removeRow(row.key)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-8">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link to="/sessions">Annuler</Link>
          </Button>
          <Button type="submit" className="flex-1">
            {isEdit ? 'Enregistrer' : 'Créer la séance'}
          </Button>
        </div>
      </form>
    </div>
  )
}
