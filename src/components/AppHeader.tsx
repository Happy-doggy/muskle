import { Link, NavLink } from 'react-router-dom'
import { LayoutGroup } from 'framer-motion'
import { CalendarDays, Dumbbell, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import SlidingTabIndicator from './ui/SlidingTabIndicator'
import MuskleLogo from './ui/MuskleLogo'
import UserMenu from './UserMenu'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { to: '/sessions', icon: CalendarDays, label: 'Séances' },
  { to: '/blocks', icon: Layers, label: 'Blocs' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercices' },
]

type AppHeaderProps = {
  variant?: 'app' | 'landing'
}

export default function AppHeader({ variant = 'app' }: AppHeaderProps) {
  const { user } = useAuth()
  const isLanding = variant === 'landing'

  return (
    <header
      className={cn(
        'border-b header-blur backdrop-blur sticky top-0 z-40',
        isLanding && 'landing-header',
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-14 items-center gap-3 px-4',
          isLanding ? 'max-w-[1120px]' : 'max-w-4xl',
        )}
      >
        <Link
          to="/"
          className="text-foreground hover:text-mint transition-colors shrink-0"
          aria-label="Muskle"
        >
          <MuskleLogo className={isLanding ? 'h-[26px]' : undefined} />
        </Link>

        {user && (
          <div className="flex flex-1 justify-center min-w-0">
            <LayoutGroup id="main-nav">
              <nav className="tabs">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => cn('tab', isActive && 'tab-active')}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <SlidingTabIndicator layoutId="main-nav-pill" />}
                        <span className="relative z-10 flex items-center gap-2">
                          <Icon size={16} />
                          <span className="hidden sm:inline">{label}</span>
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </LayoutGroup>
          </div>
        )}

        {!user && <div className="flex-1" />}

        <div className="shrink-0">
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-lg bg-mint px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Commencer
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
