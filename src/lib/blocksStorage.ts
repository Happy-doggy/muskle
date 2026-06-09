import { blocksDB, type Block } from '../data/blocks'
import { storage } from '../storage'
import type { Block as FirestoreBlock } from '../types'

function toFirestore(block: Block): FirestoreBlock {
  return block as unknown as FirestoreBlock
}

function fromFirestore(block: FirestoreBlock): Block {
  return block as unknown as Block
}

export async function loadBlocks(): Promise<Block[]> {
  const stored = (await storage.getBlocks()).map(fromFirestore)
  if (stored.length === 0) {
    await Promise.all(blocksDB.map((block) => storage.saveBlock(toFirestore(block))))
    return [...blocksDB]
  }
  return stored
}

export async function saveBlocks(blocks: Block[]): Promise<void> {
  await Promise.all(blocks.map((block) => storage.saveBlock(toFirestore(block))))
}

export async function upsertBlock(block: Block): Promise<void> {
  await storage.saveBlock(toFirestore(block))
}

export async function deleteBlockById(id: string): Promise<void> {
  await storage.deleteBlock(id)
}
