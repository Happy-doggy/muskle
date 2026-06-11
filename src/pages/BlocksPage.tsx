import { Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { getBlockModeLabel, blockModeUsesRounds } from '../lib/blockFormats'
import { Button } from '../components/ui/button'
import { Layers, Plus } from 'lucide-react'

export default function BlocksPage() {
  const blocks = useAppStore((s) => s.blocks)

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
            Créer
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
            <Link
              key={block.id}
              to={`/blocks/${block.id}/edit`}
              className="list-card list-card-clickable block"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-medium text-ink">{block.name}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-mint text-white font-medium">
                  {getBlockModeLabel(block.mode)}
                </span>
              </div>
              <p className="text-sm text-ink/50">
                {block.exercises.length} exercice
                {block.exercises.length !== 1 ? 's' : ''}
                {blockModeUsesRounds(block.mode) && block.rounds != null && (
                  <span> · {block.rounds} {block.mode === 'emom' ? 'min' : 'rounds'}</span>
                )}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
