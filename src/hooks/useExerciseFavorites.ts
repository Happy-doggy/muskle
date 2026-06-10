import { useFavoritesStore } from '../store/favorites'

export function useExerciseFavorites() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds)
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const isFavorite = useFavoritesStore((s) => s.isFavorite)

  return { favoriteIds, toggleFavorite, isFavorite }
}
