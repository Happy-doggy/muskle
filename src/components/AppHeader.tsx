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
          'grid grid-cols-[auto_1fr] sm:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 h-[var(--header-height)]',
          'app-container',
        )}
      >
        <Link
          to="/"
          className="col-start-1 row-start-1 text-foreground hover:text-mint transition-colors justify-self-start"
          aria-label="Muskle"
        >
          <MuskleLogo className={isLanding ? 'h-[26px]' : undefined} />
        </Link>

        {user ? (
          <>
            <div className="col-start-2 row-start-1 flex justify-end sm:hidden">
              <div className="flex h-12 items-stretch overflow-hidden rounded-lg border border-border bg-white">
                <MainNavTabs cluster />
                <UserMenu className="h-full rounded-none border-0 border-l border-border" />
              </div>
            </div>

            <div className="hidden sm:flex col-start-2 row-start-1 justify-self-center">
              <MainNavTabs />
            </div>

            <div className="hidden sm:block col-start-3 row-start-1 justify-self-end">
              <UserMenu />
            </div>
          </>
        ) : (
          <div className="col-start-2 row-start-1 flex items-center justify-end gap-3 sm:col-start-3">
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
    </header>
  )
}
