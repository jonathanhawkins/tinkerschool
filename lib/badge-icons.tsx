import {
  Zap,
  Bug,
  Palette,
  Music,
  Paintbrush,
  Repeat,
  Trophy,
  Star,
  Rocket,
  Heart,
  Vibrate,
  Dice1,
  Headphones,
  Move,
  Footprints,
  Play,
  CalendarCheck,
  Compass,
  MessageCircle,
  DoorOpen,
  BookCheck,
  Calculator,
  BookOpen,
  FlaskConical,
  Puzzle,
  Code,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps badge `icon` field (from the database) to a lucide-react icon component.
 * Falls back to Trophy if the icon name is not recognized.
 *
 * Icons are sourced from badge seed data in:
 *   - supabase/migrations/003_seed_1st_grade_curriculum.sql
 *   - supabase/migrations/007_seed_achievement_badges.sql
 */
const BADGE_ICONS: Record<string, LucideIcon> = {
  // Legacy CodeBuddy badges
  zap: Zap,
  bug: Bug,
  palette: Palette,
  music: Music,
  paintbrush: Paintbrush,
  brush: Paintbrush,
  repeat: Repeat,
  trophy: Trophy,
  star: Star,
  rocket: Rocket,
  heart: Heart,
  vibrate: Vibrate,
  dice: Dice1,
  headphones: Headphones,
  move: Move,

  // TinkerSchool seed badges (003 migration)
  "door-open": DoorOpen,
  "book-check": BookCheck,
  calculator: Calculator,
  "book-open": BookOpen,
  "flask-conical": FlaskConical,
  puzzle: Puzzle,
  code: Code,

  // Achievement badges (007 migration)
  footprints: Footprints,
  play: Play,
  "calendar-check": CalendarCheck,
  compass: Compass,
  "message-circle": MessageCircle,
};

/**
 * Renders the appropriate lucide-react icon for a badge `icon` field.
 * Declared as a stable component to avoid the "created during render" lint error.
 */
export function BadgeIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = BADGE_ICONS[name] ?? Trophy;
  return <Icon className={className} />;
}
