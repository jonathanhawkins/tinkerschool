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
  type LucideIcon,
} from "lucide-react";

/**
 * Maps badge `icon` field (from the database) to a lucide-react icon component.
 * Falls back to Trophy if the icon name is not recognized.
 */
const BADGE_ICONS: Record<string, LucideIcon> = {
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
