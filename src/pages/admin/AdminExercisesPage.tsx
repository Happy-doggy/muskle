import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { muscleGroups, type MuscleGroup } from '@/types/exercise'
import type { AdminExercise } from '@/types/adminExercise'
import { useAdminExercises } from '@/hooks/useAdminExercises'
import ExerciseFormDialog from '@/components/admin/ExerciseFormDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/lib/toast'

export default function AdminExercisesPage() {
  const {
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useAdminExercises()

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<MuscleGroup | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<AdminExercise | null>(null)
  const [deletingExercise, setDeletingExercise] = useState<AdminExercise | null>(null)

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase()
    return exercises
      .filter((e) => categoryFilter === 'all' || e.category === categoryFilter)
      .filter((e) => !query || e.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [exercises, search, categoryFilter])

  const openCreate = () => {
    setEditingExercise(null)
    setDialogOpen(true)
  }

  const openEdit = (exercise: AdminExercise) => {
    setEditingExercise(exercise)
    setDialogOpen(true)
  }

  const handleSave = async (exercise: AdminExercise) => {
    if (editingExercise) {
      await updateExercise(exercise)
    } else {
      await createExercise(exercise)
    }
  }

  const handleDelete = async () => {
    if (!deletingExercise) return
    try {
      await deleteExercise(deletingExercise.id)
      toast.success('Exercice supprimé')
    } catch (err) {
      console.error('[AdminExercisesPage] Delete failed', err)
      toast.error('Impossible de supprimer l’exercice')
    } finally {
      setDeletingExercise(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold">Exercices</h1>
          <p className="text-muted-foreground mt-1">
            Gestion du catalogue d&apos;exercices
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nouvel exercice
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as MuscleGroup | 'all')}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {muscleGroups.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredExercises.length} exercice{filteredExercises.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Équipement</TableHead>
              <TableHead>Difficulté</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Chargement…
                </TableCell>
              </TableRow>
            ) : filteredExercises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucun exercice trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredExercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell>{exercise.category}</TableCell>
                  <TableCell>{exercise.equipment || '—'}</TableCell>
                  <TableCell>{exercise.difficulty || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(exercise)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingExercise(exercise)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExerciseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={editingExercise}
        onSave={handleSave}
      />

      <AlertDialog
        open={deletingExercise !== null}
        onOpenChange={(open) => !open && setDeletingExercise(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet exercice ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;exercice &quot;
              {deletingExercise?.name}&quot; sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
