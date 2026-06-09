import { Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutGroup } from 'framer-motion'
import { Dumbbell, Layers, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import SlidingTabIndicator from './SlidingTabIndicator'
import MuskleLogo from './MuskleLogo'

const navItems = [
  { to: '/sessions', icon: CalendarDays, label: 'Séances' },
  { to: '/blocks',   icon: Layers,       label: 'Blocs' },
  { to: '/exercises',icon: Dumbbell,     label: 'Exercices' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b header-blur backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-foreground hover:text-mint transition-colors shrink-0"
            aria-label="Muskle"
          >
            <MuskleLogo />
          </Link>
          <LayoutGroup id="main-nav">
          <nav className="tabs">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn('tab', isActive && 'tab-active')
                }
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
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
