import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import type { Session } from '../data/sessions'
import { useAppStore } from '../store'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
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

function initialForm(blocks: { id: string }[]): FormState {
  const firstId = blocks[0]?.id ?? ''
  return {
    name: '',
    description: '',
    blockRows: firstId ? [{ key: crypto.randomUUID(), blockId: firstId }] : [],
  }
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

  const [form, setForm] = useState<FormState>(() =>
    existing ? sessionToForm(existing) : initialForm(blocks),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (existing) setForm(sessionToForm(existing))
  }, [existing])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const updateRow = (key: string, blockId: string) => {
    setForm((prev) => ({
      ...prev,
      blockRows: prev.blockRows.map((row) =>
        row.key === key ? { ...row, blockId } : row,
      ),
    }))
    setError(null)
  }

  const addRow = () => {
    const firstId = blocks[0]?.id ?? ''
    if (!firstId) return
    setForm((prev) => ({
      ...prev,
      blockRows: [...prev.blockRows, { key: crypto.randomUUID(), blockId: firstId }],
    }))
  }

  const removeRow = (key: string) => {
    setForm((prev) => ({
      ...prev,
      blockRows: prev.blockRows.filter((r) => r.key !== key),
    }))
  }

  const buildSession = (): Session | { error: string } => {
    const name = form.name.trim()
    if (name.length < 2) {
      return { error: 'Le nom doit contenir au moins 2 caractères.' }
    }
    if (form.blockRows.length === 0) {
      return { error: 'Ajoute au moins un bloc à la séance.' }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = buildSession()
    if ('error' in result) {
      setError(result.error)
      return
    }
    if (existing) {
      updateSession(result)
    } else {
      addSession(result)
    }
    navigate('/sessions')
  }

  const isEdit = Boolean(existing)

  if (sessionId && !existing) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-ink/60 mb-4">Séance introuvable.</p>
        <Button asChild>
          <Link to="/sessions">Retour aux séances</Link>
        </Button>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-ink/60 mb-4">Crée d’abord au moins un bloc avant une séance.</p>
        <Button asChild>
          <Link to="/blocks/new">Créer un bloc</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
          <Link to="/sessions">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </Button>
        <h1 className="font-display text-3xl text-ink">
          {isEdit ? 'Modifier la séance' : 'Nouvelle séance'}
        </h1>
        <p className="text-ink/50 text-sm mt-1">
          Assemble des blocs dans l’ordre d’exécution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Séance</CardTitle>
            <CardDescription>Nom et description optionnelle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
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
                  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Blocs</CardTitle>
            <CardDescription>Ordre des blocs dans la séance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.blockRows.map((row, index) => (
              <div
                key={row.key}
                className="flex items-end gap-3 border border-border rounded-lg p-4 bg-white"
              >
                <div className="flex-1 space-y-2">
                  <Label>Bloc {index + 1}</Label>
                  <Select
                    value={row.blockId}
                    onValueChange={(v) => updateRow(row.key, v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un bloc" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map((block) => (
                        <SelectItem key={block.id} value={block.id}>
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.blockRows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive shrink-0"
                    onClick={() => removeRow(row.key)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addRow}>
              <Plus size={16} />
              Ajouter un bloc
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
            <Link to="/sessions">Annuler</Link>
          </Button>
          <Button type="submit" className="flex-1">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
