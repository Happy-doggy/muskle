import { motion } from 'framer-motion'

type SlidingTabIndicatorProps = {
  layoutId: string
}

export default function SlidingTabIndicator({ layoutId }: SlidingTabIndicatorProps) {
  return (
    <motion.span
      layoutId={layoutId}
      layout={false}
      className="absolute inset-0 rounded-md bg-mint"
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      aria-hidden
    />
  )
}
