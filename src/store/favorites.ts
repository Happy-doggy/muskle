import { create } from 'zustand'
import { storage } from '../storage'

interface FavoritesStore {
  favoriteIds: Set<string>
  loadFavorites: () => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  isFavorite: (id: string) => boolean
  reset: () => void
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteIds: new Set(),

  loadFavorites: async () => {
    const ids = await storage.getFavoriteExerciseIds()
    set({ favoriteIds: new Set(ids) })
  },

  toggleFavorite: async (id) => {
    const previous = get().favoriteIds
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)

    set({ favoriteIds: next })

    try {
      await storage.saveFavoriteExerciseIds([...next])
    } catch (err) {
      console.error('[favorites] Failed to save favorites', err)
      set({ favoriteIds: previous })
      throw err
    }
  },

  isFavorite: (id) => get().favoriteIds.has(id),

  reset: () => set({ favoriteIds: new Set() }),
}))
