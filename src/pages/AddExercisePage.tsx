import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { muscleGroups, type Exercise, type MuscleGroup } from '../data/exercices'
import {
  generateExerciseId,
  getCatalogExercises,
  saveCustomExercise,
} from '../lib/customExercises'
import { Button } from '../components/ui/button'
import SegmentedTabs from '../components/ui/SegmentedTabs'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from '@/lib/toast'

type ExerciseType = Exercise['type']

type FormState = {
  name: string
  category: MuscleGroup
  description: string
  type: ExerciseType
  defaultReps: string
  defaultSets: string
  defaultDuration: string
  image: string
  video: string
}

const initialForm: FormState = {
  name: '',
  category: 'Gainage',
  description: '',
  type: 'reps',
  defaultReps: '12',
  defaultSets: '3',
  defaultDuration: '30',
  image: '',
  video: '',
}

function buildExercise(form: FormState): Exercise | { error: string } {
  const name = form.name.trim()
  if (name.length < 2) {
    return { error: 'Le nom doit contenir au moins 2 caractères.' }
  }

  const description = form.description.trim()
  if (!description) {
    return { error: 'La description est requise.' }
  }

  const defaultSets = Number(form.defaultSets)
  if (!Number.isFinite(defaultSets) || defaultSets < 1) {
    return { error: 'Le nombre de séries doit être au moins 1.' }
  }

  const existingIds = new Set(getCatalogExercises().map((e) => e.id))
  const id = generateExerciseId(name, existingIds)

  const base = {
    id,
    name,
    category: form.category,
    description,
    type: form.type,
    defaultSets,
  }

  if (form.type === 'reps') {
    const defaultReps = Number(form.defaultReps)
    if (!Number.isFinite(defaultReps) || defaultReps < 1) {
      return { error: 'Le nombre de répétitions doit être au moins 1.' }
    }
    return {
      ...base,
      type: 'reps',
      defaultReps,
    }
  }

  const defaultDuration = Number(form.defaultDuration)
  if (!Number.isFinite(defaultDuration) || defaultDuration < 1) {
    return { error: 'La durée doit être d’au moins 1 seconde.' }
  }

  return {
    ...base,
    type: 'duration',
    defaultDuration,
  }
}

export default function AddExercisePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = buildExercise(form)
    if ('error' in result) {
      setError(result.error)
      return
    }

    const exercise: Exercise = {
      ...result,
      ...(form.image.trim() ? { image: form.image.trim() } : {}),
      ...(form.video.trim() ? { video: form.video.trim() } : {}),
    }

    try {
      await saveCustomExercise(exercise)
      toast.success('Exercice créé')
      navigate('/exercises')
    } catch {
      toast.error('Impossible d’enregistrer l’exercice. Réessaie.')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" className="-ml-2 mb-4" asChild>
          <Link to="/exercises">
            <ArrowLeft size={16} />
            Retour
          </Link>
        </Button>
        <h1 className="font-display text-3xl text-ink">Nouvel exercice</h1>
        <p className="text-ink/50 text-sm mt-1">
          Renseigne les caractéristiques de ton exercice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Informations</CardTitle>
            <CardDescription>Nom, groupe musculaire et description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ex. Squat bulgare"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Groupe musculaire</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update('category', v as MuscleGroup)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Comment exécuter le mouvement…"
                rows={4}
                required
                className={cn(
                  'flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Paramètres par défaut</CardTitle>
            <CardDescription>Type d’effort et valeurs suggérées pour les séances.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <SegmentedTabs
                layoutId="exercise-type"
                value={form.type}
                onChange={(type) => update('type', type)}
                fullWidth
                segments={[
                  { value: 'reps', label: 'Répétitions' },
                  { value: 'duration', label: 'Durée' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSets">Nombre de séries</Label>
              <Input
                id="defaultSets"
                type="number"
                min={1}
                value={form.defaultSets}
                onChange={(e) => update('defaultSets', e.target.value)}
                required
              />
            </div>

            {form.type === 'reps' ? (
              <div className="space-y-2">
                <Label htmlFor="defaultReps">Répétitions par série</Label>
                <Input
                  id="defaultReps"
                  type="number"
                  min={1}
                  value={form.defaultReps}
                  onChange={(e) => update('defaultReps', e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="defaultDuration">Durée par série (secondes)</Label>
                <Input
                  id="defaultDuration"
                  type="number"
                  min={1}
                  value={form.defaultDuration}
                  onChange={(e) => update('defaultDuration', e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Médias</CardTitle>
            <CardDescription>Optionnel — URL d’une image ou d’une vidéo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Image (URL)</Label>
              <Input
                id="image"
                type="url"
                value={form.image}
                onChange={(e) => update('image', e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Vidéo (URL)</Label>
              <Input
                id="video"
                type="url"
                value={form.video}
                onChange={(e) => update('video', e.target.value)}
                placeholder="https://…"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 pb-8">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link to="/exercises">Annuler</Link>
          </Button>
          <Button type="submit" className="flex-1">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
