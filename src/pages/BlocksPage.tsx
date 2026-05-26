import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react'

export default function BlocksPage() {
  const blocks = useAppStore((s) => s.blocks)
  const deleteBlock = useAppStore((s) => s.deleteBlock)

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Supprimer le bloc « ${name} » ?`)) {
      deleteBlock(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Blocs</h1>
          <p className="text-ink/50 text-sm mt-1">
            {blocks.length} bloc{blocks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/blocks/new">
            <Plus size={16} />
            Nouveau bloc
          </Link>
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Layers size={32} className="text-ink/20" />
          <h3 className="font-medium text-ink">Aucun bloc</h3>
          <p className="text-sm text-ink/50 max-w-xs">
            Un bloc est un groupe d&apos;exercices — liste ou circuit. Crée-en un et
            ajoute tes exercices.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="bg-paper-warm border border-paper-muted rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-medium text-ink">{block.name}</h3>
                    <Badge variant="secondary">
                      {block.mode === 'circuit' ? 'Circuit' : 'Liste'}
                    </Badge>
                  </div>
                  <p className="text-sm text-ink/50">
                    {block.exercises.length} exercice
                    {block.exercises.length !== 1 ? 's' : ''}
                    {block.mode === 'circuit' && block.rounds != null && (
                      <span> · {block.rounds} rounds</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/blocks/${block.id}/edit`}>
                      <Pencil size={14} />
                      Éditer
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(block.id, block.name)}
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
