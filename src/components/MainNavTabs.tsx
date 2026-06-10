import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Dumbbell, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/sessions', icon: CalendarDays, label: 'Séances' },
  { to: '/blocks', icon: Layers, label: 'Blocs' },
  { to: '/exercises', icon: Dumbbell, label: 'Exercices' },
] as const

type IndicatorRect = {
  left: number
  top: number
  width: number
  height: number
}

function isNavActive(pathname: string, to: string): boolean {
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function MainNavTabs() {
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const tabRefs = useRef<Partial<Record<string, HTMLAnchorElement>>>({})
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)

  const updateIndicator = useCallback(() => {
    const nav = navRef.current
    if (!nav) return

    const active = navItems.find((item) => isNavActive(pathname, item.to))
    if (!active) {
      setIndicator(null)
      return
    }

    const tab = tabRefs.current[active.to]
    if (!tab) return

    const navRect = nav.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()

    setIndicator({
      left: tabRect.left - navRect.left,
      top: tabRect.top - navRect.top,
      width: tabRect.width,
      height: tabRect.height,
    })
  }, [pathname])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new ResizeObserver(() => updateIndicator())
    observer.observe(nav)
    return () => observer.disconnect()
  }, [updateIndicator])

  return (
    <nav ref={navRef} className="tabs relative">
      {indicator && (
        <motion.span
          className="absolute rounded-md bg-mint pointer-events-none z-0"
          initial={false}
          animate={indicator}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          aria-hidden
        />
      )}
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          ref={(el) => {
            if (el) tabRefs.current[to] = el
            else delete tabRefs.current[to]
          }}
          to={to}
          className={({ isActive }) => cn('tab', isActive && 'tab-active')}
        >
          <span className="relative z-10 flex items-center gap-2">
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
