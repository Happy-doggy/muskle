import { Dumbbell, Target, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
    <nav
      className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-white p-1 scrollbar-hide lg:hidden"
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
  )
}

export default function AccountPageNav() {
  return (
    <aside className="hidden lg:block">
      <nav
        className="sticky top-24 w-[13.5rem] rounded-xl border border-border bg-white p-3 shadow-sm"
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
    </aside>
  )
}
