import { useEffect, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { useFavoritesStore } from '../store/favorites'

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, completingLink } = useAuth()
  const loadAll = useAppStore((s) => s.loadAll)
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites)
  const resetFavorites = useFavoritesStore((s) => s.reset)
  const location = useLocation()
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    if (!user) {
      resetFavorites()
      setDataReady(false)
      return
    }
    setDataReady(false)
    void Promise.all([loadAll(), loadFavorites()])
      .then(() => setDataReady(true))
      .catch((err) => {
        console.error('[ProtectedRoute] Failed to load data', err)
        setDataReady(true)
      })
  }, [user, loadAll, loadFavorites, resetFavorites])

  if (loading || completingLink || (user && !dataReady)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
