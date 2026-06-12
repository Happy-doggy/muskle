import { NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, Dumbbell, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import MuskleLogo from '@/components/ui/MuskleLogo'

const navItems = [
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/exercises', label: 'Exercices', icon: Dumbbell },
] as const

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <MuskleLogo className="h-7" />
          <p className="text-xs text-muted-foreground mt-2">Back-office admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <NavLink
            to="/account"
            className="flex items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-mint hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-mint" aria-hidden />
            Retour au front
          </NavLink>
        </div>
      </aside>
      <main className="ml-64 min-h-screen overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
