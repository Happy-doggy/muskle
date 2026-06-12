import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  Bike,
  Cable,
  Check,
  ChevronLeft,
  CircleDot,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Leaf,
  Link,
  Mountain,
  Move,
  PartyPopper,
  Pencil,
  Play,
  RectangleHorizontal,
  Rocket,
  RotateCcw,
  Shield,
  Sparkles,
  Sprout,
  Square,
  Stethoscope,
  TrendingUp,
  User,
  Users,
  Waves,
  Weight,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  'trending-up': TrendingUp,
  'heart-pulse': HeartPulse,
  move: Move,
  shield: Shield,
  sparkles: Sparkles,
  activity: Activity,
  leaf: Leaf,
  stethoscope: Stethoscope,
  footprints: Footprints,
  bike: Bike,
  waves: Waves,
  mountain: Mountain,
  'circle-dot': CircleDot,
  users: Users,
  sprout: Sprout,
  flame: Flame,
  award: Award,
  user: User,
  square: Square,
  cable: Cable,
  bell: Bell,
  weight: Weight,
  'rectangle-horizontal': RectangleHorizontal,
  link: Link,
  'chevron-left': ChevronLeft,
  'arrow-right': ArrowRight,
  check: Check,
  pencil: Pencil,
  play: Play,
  rocket: Rocket,
  'party-popper': PartyPopper,
  clock: Clock,
  'rotate-ccw': RotateCcw,
}

type OnboardingIconProps = {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}

export function OnboardingIcon({
  name,
  size = 16,
  className,
  strokeWidth = 2,
}: OnboardingIconProps) {
  const Icon = ICON_MAP[name] ?? Dumbbell
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden />
}

export { ICON_MAP }
