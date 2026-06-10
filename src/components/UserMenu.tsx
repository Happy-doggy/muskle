import { NavLink } from 'react-router-dom'
import { User } from 'lucide-react'
import { useUserProfile } from '../hooks/useUserProfile'
import { cn } from '@/lib/utils'

type UserMenuProps = {
  className?: string
}

export default function UserMenu({ className }: UserMenuProps) {
  const { display } = useUserProfile()

  if (!display) return null

  const { firstName, photoUrl } = display

  return (
    <NavLink
      to="/account"
      className={({ isActive }) =>
        cn(
          'flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium transition-colors shrink-0',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-white text-foreground hover:border-mint',
          className,
        )
      }
      aria-label="Mon compte"
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=""
          className="h-7 w-7 rounded-full object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <User size={14} />
        </span>
      )}
      <span className="hidden sm:inline max-w-[120px] truncate">{firstName}</span>
    </NavLink>
  )
}
