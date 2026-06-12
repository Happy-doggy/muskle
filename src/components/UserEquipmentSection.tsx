import { useMemo, useState } from 'react'
import { Dumbbell, Plus, Trash2 } from 'lucide-react'
import {
  EQUIPMENT_TYPES,
  type EquipmentTypeId,
  type ResistanceLevel,
  type UserEquipmentItem,
  formatEquipmentItem,
  getEquipmentType,
  isDuplicateEquipmentItem,
} from '../lib/equipment'
import { useUserEquipment } from '../hooks/useUserEquipment'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { toast } from '@/lib/toast'

const RESISTANCE_OPTIONS: { value: ResistanceLevel; label: string }[] = [
  { value: 'light', label: 'Léger' },
  { value: 'medium', label: 'Moyen' },
  { value: 'heavy', label: 'Fort' },
]

function newEquipmentId(): string {
  return crypto.randomUUID()
}

export default function UserEquipmentSection() {
  const { items, loading, saving, addItem, removeItem } = useUserEquipment()
  const [typeId, setTypeId] = useState<EquipmentTypeId>('dumbbell')
  const [weight, setWeight] = useState('')
  const [resistance, setResistance] = useState<ResistanceLevel>('medium')

  const selectedType = useMemo(() => getEquipmentType(typeId), [typeId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) return

    let weightKg: number | undefined
    if (selectedType.supportsWeight) {
      const parsed = Number.parseFloat(weight.replace(',', '.'))
      if (!Number.isFinite(parsed) || parsed <= 0) {
        toast.error('Indique un poids valide en kg.')
        return
      }
      weightKg = parsed
    }

    const candidate: UserEquipmentItem = {
      id: newEquipmentId(),
      typeId,
      ...(weightKg != null ? { weightKg } : {}),
      ...(selectedType.supportsResistance ? { resistance } : {}),
    }

    if (isDuplicateEquipmentItem(items, candidate)) {
      toast.error('Ce matériel est déjà dans ta liste.')
      return
    }

    try {
      await addItem(candidate)
      setWeight('')
      toast.success('Matériel ajouté')
    } catch (err) {
      console.error('[UserEquipmentSection] Failed to add item', err)
      toast.error('Impossible d’ajouter le matériel. Réessaie.')
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id)
      toast.success('Matériel retiré')
    } catch (err) {
      console.error('[UserEquipmentSection] Failed to remove item', err)
      toast.error('Impossible de retirer le matériel. Réessaie.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Dumbbell size={20} className="text-mint" />
          Mon matériel
        </CardTitle>
        <CardDescription>
          Liste le matériel dont tu disposes pour adapter tes séances.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun matériel pour l’instant. Ajoute tes haltères, élastiques, etc.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2.5"
              >
                <span className="text-sm text-foreground">{formatEquipmentItem(item)}</span>
                <button
                  type="button"
                  onClick={() => void handleRemove(item.id)}
                  disabled={saving}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                  aria-label={`Retirer ${formatEquipmentItem(item)}`}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={(e) => void handleAdd(e)} className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-2">
            <Label htmlFor="equipment-type">Type de matériel</Label>
            <Select
              value={typeId}
              onValueChange={(v) => setTypeId(v as EquipmentTypeId)}
            >
              <SelectTrigger id="equipment-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType?.supportsWeight && (
            <div className="space-y-2">
              <Label htmlFor="equipment-weight">Poids (kg)</Label>
              <Input
                id="equipment-weight"
                type="number"
                inputMode="decimal"
                min={0.5}
                max={200}
                step={0.5}
                placeholder="Ex. 8"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={saving}
              />
            </div>
          )}

          {selectedType?.supportsResistance && (
            <div className="space-y-2">
              <Label htmlFor="equipment-resistance">Résistance</Label>
              <Select
                value={resistance}
                onValueChange={(v) => setResistance(v as ResistanceLevel)}
              >
                <SelectTrigger id="equipment-resistance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESISTANCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" variant="outline" className="w-full" disabled={saving}>
            <Plus size={16} />
            {saving ? 'Enregistrement…' : 'Ajouter'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
