import { useEffect, useMemo, useRef, useState } from 'react'
import { Layers, Search } from 'lucide-react'
import type { Block } from '../data/blocks'
import { getBlockModeLabel, blockModeUsesRounds } from '../lib/blockFormats'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

function filterBlocksBySearch(blocks: Block[], query: string): Block[] {
  const q = query.trim().toLowerCase()
  if (!q) return blocks
  return blocks.filter(
    (block) =>
      block.name.toLowerCase().includes(q) ||
      getBlockModeLabel(block.mode).toLowerCase().includes(q),
  )
}

type BlockPickerListProps = {
  blocks: Block[]
  selectedId?: string
  onSelect: (block: Block) => void
  className?: string
}

export default function BlockPickerList({
  blocks,
  selectedId,
  onSelect,
  className,
}: BlockPickerListProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => filterBlocksBySearch(blocks, query),
    [blocks, query],
  )

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const handleSelect = (block: Block) => {
    onSelect(block)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative overflow-hidden rounded-lg border border-border bg-white">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-ink/35"
        />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un bloc…"
          className="border-0 pl-9 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Rechercher un bloc"
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-20 overflow-hidden rounded-lg border border-border bg-white shadow-md">
          <div
            className="max-h-72 overflow-y-auto p-2 space-y-1"
            role="listbox"
            aria-label="Liste des blocs"
          >
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-ink/45">
                Aucun bloc ne correspond à votre recherche.
              </p>
            ) : (
              filtered.map((block) => (
                <button
                  key={block.id}
                  type="button"
                  role="option"
                  aria-selected={selectedId === block.id}
                  onClick={() => handleSelect(block)}
                  className={cn(
                    'flex w-full gap-3 rounded-lg border p-2 text-left transition-colors',
                    selectedId === block.id
                      ? 'border-mint bg-mint/5'
                      : 'border-transparent hover:border-mint/50 hover:bg-paper/60',
                  )}
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-paper-warm text-mint">
                    <Layers size={22} />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink leading-snug">
                        {block.name}
                      </p>
                      <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-white">
                        {getBlockModeLabel(block.mode)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink/50">
                      {block.exercises.length} exercice
                      {block.exercises.length !== 1 ? 's' : ''}
                      {blockModeUsesRounds(block.mode) && block.rounds != null && (
                        <span>
                          {' '}
                          · {block.rounds}{' '}
                          {block.mode === 'emom' ? 'min' : 'rounds'}
                        </span>
                      )}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
