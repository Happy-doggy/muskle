import { blocksDB, type Block } from '../data/blocks'

const STORAGE_KEY = 'muskle_blocks'

function read(): Block[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Block[]) : []
  } catch {
    return []
  }
}

function write(blocks: Block[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks))
}

export function loadBlocks(): Block[] {
  const stored = read()
  if (stored.length === 0) {
    write(blocksDB)
    return [...blocksDB]
  }
  return stored
}

export function saveBlocks(blocks: Block[]): void {
  write(blocks)
}

export function upsertBlock(block: Block): void {
  const list = loadBlocks()
  const idx = list.findIndex((b) => b.id === block.id)
  if (idx === -1) {
    saveBlocks([...list, block])
  } else {
    const next = [...list]
    next[idx] = block
    saveBlocks(next)
  }
}

export function deleteBlockById(id: string): void {
  saveBlocks(loadBlocks().filter((b) => b.id !== id))
}
