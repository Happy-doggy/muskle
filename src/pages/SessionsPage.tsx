import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Button } from '../components/ui/button'
import { CalendarDays, Play, Plus } from 'lucide-react'

export default function SessionsPage() {
  const sessions = useAppStore((s) => s.sessions)
  const blocks = useAppStore((s) => s.blocks)
  const navigate = useNavigate()

  const blockName = (id: string) => blocks.find((b) => b.id === id)?.name ?? id

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Séances</h1>
          <p className="text-ink/50 text-sm mt-1">
            {sessions.length} séance{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/sessions/new">
            <Plus size={16} />
            Créer
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <CalendarDays size={32} className="text-ink/20" />
          <h3 className="font-medium text-ink">Aucune séance</h3>
          <p className="text-sm text-ink/50 max-w-xs">
            Compose ta première séance en assemblant des blocs d&apos;exercices. Tu
            pourras ensuite la lancer avec le minuteur.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="list-card list-card-clickable flex items-start justify-between gap-4"
            >
              <Link
                to={`/sessions/${session.id}/edit`}
                className="flex-1 min-w-0 block"
              >
                <h3 className="font-medium text-ink mb-1">{session.name}</h3>
                {session.description && (
                  <p className="text-sm text-ink/60 line-clamp-2 mb-2">
                    {session.description}
                  </p>
                )}
                <ol className="text-sm text-ink/50 list-decimal list-inside space-y-0.5">
                  {session.blockIds.map((blockId) => (
                    <li key={blockId}>{blockName(blockId)}</li>
                  ))}
                </ol>
              </Link>

              <button
                type="button"
                onClick={() => navigate(`/play/${session.id}`)}
                className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Play size={14} />
                Lancer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
