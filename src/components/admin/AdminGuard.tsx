import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'
import { ADMIN_UID } from '@/config/admin'
import { useAuth } from '@/hooks/useAuth'

export default function AdminGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
      </div>
    )
  }

  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
