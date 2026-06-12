import { Dumbbell, Shield, Target, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ADMIN_UID } from '@/config/admin'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const SECTIONS = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'profil-sportif', label: 'Mon profil sportif', icon: Target },
  { id: 'materiel', label: 'Mon matériel', icon: Dumbbell },
] as const

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

type NavButtonProps = {
  id: string
  label: string
  icon: LucideIcon
  className?: string
}

function AdminBackOfficeLink({ className }: { className?: string }) {
  const { user } = useAuth()

  if (!user || user.uid !== ADMIN_UID) return null

  return (
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        cn(
          'flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium shadow-sm transition-colors',
          isActive
            ? 'border-mint text-foreground'
            : 'text-muted-foreground hover:border-mint hover:text-foreground',
          className,
        )
      }
    >
      <Shield size={16} className="shrink-0 text-mint" aria-hidden />
      Back-office
    </NavLink>
  )
}

function NavButton({ id, label, icon: Icon, className }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={() => scrollToSection(id)}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
        'hover:bg-secondary hover:text-foreground',
        className,
      )}
    >
      <Icon size={16} className="shrink-0 text-mint" aria-hidden />
      <span className="truncate">{label}</span>
    </button>
  )
}

export function AccountPageMobileNav() {
  return (
    <div className="space-y-2 lg:hidden">
      <nav
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1 scrollbar-hide"
        aria-label="Sections du compte"
      >
        {SECTIONS.map(({ id, label, icon }) => (
          <NavButton
            key={id}
            id={id}
            label={label}
            icon={icon}
            className="shrink-0 whitespace-nowrap"
          />
        ))}
      </nav>
      <AdminBackOfficeLink className="w-full" />
    </div>
  )
}

export default function AccountPageNav() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 w-[13.5rem] space-y-3">
        <nav
          className="rounded-xl border border-border bg-white p-3 shadow-sm"
          aria-label="Sections du compte"
        >
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <ul className="space-y-0.5">
            {SECTIONS.map(({ id, label, icon }) => (
              <li key={id}>
                <NavButton id={id} label={label} icon={icon} className="w-full text-left" />
              </li>
            ))}
          </ul>
        </nav>
        <AdminBackOfficeLink className="w-full" />
      </div>
    </aside>
  )
}
