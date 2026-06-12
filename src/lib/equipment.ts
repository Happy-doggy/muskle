export type EquipmentTypeId =
  | 'dumbbell'
  | 'kettlebell'
  | 'resistance-band'
  | 'barbell'
  | 'pull-up-bar'
  | 'bench'
  | 'mat'
  | 'jump-rope'
  | 'medicine-ball'

export type ResistanceLevel = 'light' | 'medium' | 'heavy'

export interface EquipmentType {
  id: EquipmentTypeId
  label: string
  supportsWeight: boolean
  supportsResistance: boolean
}

export interface UserEquipmentItem {
  id: string
  typeId: EquipmentTypeId
  weightKg?: number
  resistance?: ResistanceLevel
}

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { id: 'dumbbell', label: 'Haltères', supportsWeight: true, supportsResistance: false },
  { id: 'kettlebell', label: 'Kettlebell', supportsWeight: true, supportsResistance: false },
  { id: 'resistance-band', label: 'Élastique', supportsWeight: false, supportsResistance: true },
  { id: 'barbell', label: 'Barre', supportsWeight: true, supportsResistance: false },
  { id: 'medicine-ball', label: 'Ballon médical', supportsWeight: true, supportsResistance: false },
  { id: 'pull-up-bar', label: 'Barre de traction', supportsWeight: false, supportsResistance: false },
  { id: 'bench', label: 'Banc', supportsWeight: false, supportsResistance: false },
  { id: 'mat', label: 'Tapis', supportsWeight: false, supportsResistance: false },
  { id: 'jump-rope', label: 'Corde à sauter', supportsWeight: false, supportsResistance: false },
]

const RESISTANCE_LABELS: Record<ResistanceLevel, string> = {
  light: 'léger',
  medium: 'moyen',
  heavy: 'fort',
}

export function getEquipmentType(id: EquipmentTypeId): EquipmentType | undefined {
  return EQUIPMENT_TYPES.find((t) => t.id === id)
}

export function formatEquipmentItem(item: UserEquipmentItem): string {
  const type = getEquipmentType(item.typeId)
  const label = type?.label ?? item.typeId
  if (item.weightKg != null) return `${label} — ${formatWeight(item.weightKg)}`
  if (item.resistance) return `${label} — ${RESISTANCE_LABELS[item.resistance]}`
  return label
}

export function formatWeight(kg: number): string {
  return Number.isInteger(kg) ? `${kg} kg` : `${kg.toFixed(1)} kg`
}

export function isDuplicateEquipmentItem(
  items: UserEquipmentItem[],
  candidate: Pick<UserEquipmentItem, 'typeId' | 'weightKg' | 'resistance'>,
): boolean {
  return items.some(
    (item) =>
      item.typeId === candidate.typeId &&
      item.weightKg === candidate.weightKg &&
      item.resistance === candidate.resistance,
  )
}
