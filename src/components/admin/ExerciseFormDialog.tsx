import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { muscleGroups, type MuscleGroup } from '@/data/exercices'
import type { OnboardingNiveau } from '@/types/onboarding'
import type { AdminExercise } from '@/types/adminExercise'
import { uploadExerciseImage, uploadExerciseVideo } from '@/storage/exerciseMedia'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/lib/toast'

const DIFFICULTY_LEVELS: { value: OnboardingNiveau; label: string }[] = [
  { value: 'debutant', label: 'Débutant' },
  { value: 'intermediaire', label: 'Intermédiaire' },
  { value: 'confirme', label: 'Confirmé' },
  { value: 'expert', label: 'Expert' },
]

type FormState = {
  name: string
  description: string
  category: MuscleGroup
  muscles: MuscleGroup[]
  difficulty: OnboardingNiveau | ''
  equipment: string
  type: 'reps' | 'duration'
  defaultReps: string
  defaultSets: string
  defaultDuration: string
  imageUrl: string
  videoUrl: string
}

const emptyForm = (): FormState => ({
  name: '',
  description: '',
  category: 'Gainage',
  muscles: [],
  difficulty: '',
  equipment: '',
  type: 'reps',
  defaultReps: '12',
  defaultSets: '3',
  defaultDuration: '30',
  imageUrl: '',
  videoUrl: '',
})

function exerciseToForm(exercise: AdminExercise): FormState {
  return {
    name: exercise.name,
    description: exercise.description,
    category: exercise.category,
    muscles: exercise.muscles,
    difficulty: exercise.difficulty ?? '',
    equipment: exercise.equipment ?? '',
    type: exercise.type,
    defaultReps: String(exercise.defaultReps ?? 12),
    defaultSets: String(exercise.defaultSets ?? 3),
    defaultDuration: String(exercise.defaultDuration ?? 30),
    imageUrl: exercise.imageUrl ?? '',
    videoUrl: exercise.videoUrl ?? '',
  }
}

type ExerciseFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercise: AdminExercise | null
  onSave: (exercise: AdminExercise) => Promise<void>
}

export default function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
  onSave,
}: ExerciseFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [draftId, setDraftId] = useState(() => nanoid(10))
  const [saving, setSaving] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const isEditing = exercise !== null

  useEffect(() => {
    if (!open) return
    if (exercise) {
      setForm(exerciseToForm(exercise))
      setImagePreview(exercise.imageUrl ?? null)
      setDraftId(exercise.id)
    } else {
      setForm(emptyForm())
      setImagePreview(null)
      setDraftId(nanoid(10))
    }
    setVideoProgress(0)
  }, [open, exercise])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleMuscle = (muscle: MuscleGroup) => {
    setForm((prev) => ({
      ...prev,
      muscles: prev.muscles.includes(muscle)
        ? prev.muscles.filter((m) => m !== muscle)
        : [...prev.muscles, muscle],
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
    try {
      const url = await uploadExerciseImage(draftId, file)
      update('imageUrl', url)
      toast.success('Image uploadée')
    } catch (err) {
      console.error('[ExerciseFormDialog] Image upload failed', err)
      toast.error("Échec de l'upload de l'image")
    }
  }

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoProgress(0)
    try {
      const url = await uploadExerciseVideo(draftId, file, setVideoProgress)
      update('videoUrl', url)
      toast.success('Vidéo uploadée')
    } catch (err) {
      console.error('[ExerciseFormDialog] Video upload failed', err)
      toast.error("Échec de l'upload de la vidéo")
    } finally {
      setVideoProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    const description = form.description.trim()
    if (name.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères.')
      return
    }
    if (!description) {
      toast.error('La description est requise.')
      return
    }

    const defaultSets = Number(form.defaultSets)
    if (!Number.isFinite(defaultSets) || defaultSets < 1) {
      toast.error('Le nombre de séries doit être au moins 1.')
      return
    }

    const now = new Date().toISOString()
    const base: AdminExercise = {
      id: draftId,
      name,
      description,
      category: form.category,
      muscles: form.muscles.length > 0 ? form.muscles : [form.category],
      difficulty: form.difficulty || undefined,
      equipment: form.equipment.trim() || undefined,
      type: form.type,
      defaultSets,
      imageUrl: form.imageUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      createdAt: exercise?.createdAt ?? now,
      updatedAt: now,
    }

    if (form.type === 'reps') {
      const defaultReps = Number(form.defaultReps)
      if (!Number.isFinite(defaultReps) || defaultReps < 1) {
        toast.error('Le nombre de répétitions doit être au moins 1.')
        return
      }
      base.defaultReps = defaultReps
    } else {
      const defaultDuration = Number(form.defaultDuration)
      if (!Number.isFinite(defaultDuration) || defaultDuration < 1) {
        toast.error('La durée doit être d’au moins 1 seconde.')
        return
      }
      base.defaultDuration = defaultDuration
    }

    setSaving(true)
    try {
      await onSave(base)
      onOpenChange(false)
      toast.success(isEditing ? 'Exercice modifié' : 'Exercice créé')
    } catch (err) {
      console.error('[ExerciseFormDialog] Save failed', err)
      toast.error('Impossible de sauvegarder l’exercice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier l’exercice' : 'Nouvel exercice'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select
                value={form.category}
                onValueChange={(v) => update('category', v as MuscleGroup)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select
                value={form.difficulty || 'none'}
                onValueChange={(v) =>
                  update('difficulty', v === 'none' ? '' : (v as OnboardingNiveau))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {DIFFICULTY_LEVELS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="equipment">Équipement</Label>
              <Input
                id="equipment"
                value={form.equipment}
                onChange={(e) => update('equipment', e.target.value)}
                placeholder="Poids du corps, haltères…"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Muscles ciblés</Label>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map((muscle) => (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => toggleMuscle(muscle)}
                  className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                    form.muscles.includes(muscle)
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => update('type', v as 'reps' | 'duration')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reps">Répétitions</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.type === 'reps' ? (
              <div className="space-y-2">
                <Label htmlFor="reps">Répétitions</Label>
                <Input
                  id="reps"
                  type="number"
                  min={1}
                  value={form.defaultReps}
                  onChange={(e) => update('defaultReps', e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (s)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={form.defaultDuration}
                  onChange={(e) => update('defaultDuration', e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="sets">Séries</Label>
              <Input
                id="sets"
                type="number"
                min={1}
                value={form.defaultSets}
                onChange={(e) => update('defaultSets', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="mt-2 h-24 w-24 rounded-md object-cover border"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Vidéo</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />
              {videoProgress > 0 && videoProgress < 100 && (
                <Progress value={videoProgress} className="mt-2" />
              )}
              {form.videoUrl && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Vidéo uploadée
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : isEditing ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
