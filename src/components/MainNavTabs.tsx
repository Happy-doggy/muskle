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

type MainNavTabsProps = {
  className?: string
  cluster?: boolean
}

export default function MainNavTabs({ className, cluster }: MainNavTabsProps) {
  const { pathname } = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const labelMeasureRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Partial<Record<string, HTMLAnchorElement>>>({})
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
  const [showActiveLabel, setShowActiveLabel] = useState(false)

  const activeItem = navItems.find((item) => isNavActive(pathname, item.to))

  const recomputeActiveLabel = useCallback(() => {
    if (!cluster) {
      setShowActiveLabel(false)
      return
    }

    const nav = navRef.current
    const clusterEl = nav?.parentElement
    if (!nav || !clusterEl || !activeItem) {
      setShowActiveLabel(false)
      return
    }

    const profileBtn = clusterEl.lastElementChild
    const profileWidth =
      profileBtn instanceof HTMLElement ? profileBtn.offsetWidth : 44
    // The cluster is content-sized; use the full header column width as budget.
    const columnEl = clusterEl.parentElement
    const availableWidth = columnEl?.clientWidth ?? clusterEl.clientWidth
    const navBudget = availableWidth - profileWidth

    const inactiveItem = navItems.find((item) => !isNavActive(pathname, item.to))
    const iconTabWidth = inactiveItem
      ? tabRefs.current[inactiveItem.to]?.offsetWidth
      : tabRefs.current[navItems[0].to]?.offsetWidth
    if (!iconTabWidth) return

    const labelWidth = labelMeasureRef.current?.offsetWidth ?? 0
    const labelGap = 8
    const navPadding = 8
    const tabsGap = 4
    const widthNeeded =
      navItems.length * iconTabWidth +
      labelGap +
      labelWidth +
      navPadding +
      tabsGap

    const fits = widthNeeded <= navBudget
    setShowActiveLabel((prev) => (prev === fits ? prev : fits))
  }, [activeItem, cluster, pathname])

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
    recomputeActiveLabel()
  }, [recomputeActiveLabel])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator, showActiveLabel])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const observer = new ResizeObserver(() => {
      recomputeActiveLabel()
      updateIndicator()
    })
    observer.observe(nav)
    const clusterEl = cluster ? nav.parentElement : null
    if (clusterEl) {
      observer.observe(clusterEl)
      const columnEl = clusterEl.parentElement
      if (columnEl) observer.observe(columnEl)
    }
    return () => observer.disconnect()
  }, [cluster, recomputeActiveLabel, updateIndicator])

  return (
    <nav ref={navRef} className={cn('tabs relative', cluster && 'tabs-cluster', className)}>
      {cluster && activeItem && (
        <span
          ref={labelMeasureRef}
          className="pointer-events-none invisible absolute left-0 top-0 text-sm font-medium whitespace-nowrap"
          aria-hidden
        >
          {activeItem.label}
        </span>
      )}
      {indicator && (
        <motion.span
          className="absolute rounded-md bg-mint pointer-events-none z-0"
          initial={false}
          animate={indicator}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          aria-hidden
        />
      )}
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = isNavActive(pathname, to)
        const showLabel = cluster
          ? isActive && showActiveLabel
          : false

        return (
          <NavLink
            key={to}
            ref={(el) => {
              if (el) tabRefs.current[to] = el
              else delete tabRefs.current[to]
            }}
            to={to}
            className={cn('tab', isActive && 'tab-active')}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              <span
                data-nav-label
                className={cn(
                  'whitespace-nowrap',
                  cluster ? (showLabel ? 'inline' : 'hidden') : 'hidden sm:inline',
                )}
              >
                {label}
              </span>
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
