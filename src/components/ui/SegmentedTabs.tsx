import { LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'
import SlidingTabIndicator from './SlidingTabIndicator'

type Segment<T extends string> = {
  value: T
  label: string
}

type SegmentedTabsProps<T extends string> = {
  layoutId: string
  value: T
  onChange: (value: T) => void
  segments: Segment<T>[]
  className?: string
  fullWidth?: boolean
}

export default function SegmentedTabs<T extends string>({
  layoutId,
  value,
  onChange,
  segments,
  className,
  fullWidth = false,
}: SegmentedTabsProps<T>) {
  return (
    <LayoutGroup id={layoutId}>
      <div className={cn('tabs', fullWidth && 'w-full', className)}>
        {segments.map((segment) => {
          const isActive = value === segment.value
          return (
            <button
              key={segment.value}
              type="button"
              onClick={() => onChange(segment.value)}
              className={cn('tab', fullWidth && 'flex-1', isActive && 'tab-active')}
            >
              {isActive && (
                <SlidingTabIndicator layoutId={`${layoutId}-pill`} />
              )}
              <span className="relative z-10">{segment.label}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
