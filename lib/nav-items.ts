import {
  Home,
  BookOpen,
  HelpCircle,
  Wrench,
  Image,
  Trophy,
  Settings,
  Usb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/home", label: "Mission Control", icon: Home },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/workshop", label: "Workshop", icon: Wrench },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/setup", label: "Device Setup", icon: Usb },
  { href: "/help", label: "Help", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];
