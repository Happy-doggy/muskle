import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import MuskleLogo from './ui/MuskleLogo'
import UserMenu from './UserMenu'
import MainNavTabs from './MainNavTabs'
import { useAuth } from '../hooks/useAuth'

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
          'grid grid-cols-[1fr_auto_1fr] items-center gap-3 h-[var(--header-height)]',
          'app-container',
        )}
      >
        <Link
          to="/"
          className="text-foreground hover:text-mint transition-colors justify-self-start"
          aria-label="Muskle"
        >
          <MuskleLogo className={isLanding ? 'h-[26px]' : undefined} />
        </Link>

        {user ? (
          <MainNavTabs />
        ) : (
          <div />
        )}

        <div className="justify-self-end">
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
