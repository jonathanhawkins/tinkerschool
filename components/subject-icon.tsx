import {
  Calculator,
  BookOpen,
  FlaskConical,
  Music,
  Palette,
  Puzzle,
  Code2,
} from "lucide-react";

interface SubjectIconProps {
  icon: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Maps a database icon string (e.g. "calculator", "book-open") to the
 * corresponding Lucide icon component.  Falls back to BookOpen for unknown
 * values.
 *
 * This is a Server Component -- no "use client" directive.
 */
export function SubjectIcon({ icon, className, style }: SubjectIconProps) {
  const props = { className, style };
  switch (icon) {
    case "calculator":
      return <Calculator {...props} />;
    case "book-open":
      return <BookOpen {...props} />;
    case "flask-conical":
      return <FlaskConical {...props} />;
    case "music":
      return <Music {...props} />;
    case "palette":
      return <Palette {...props} />;
    case "puzzle":
      return <Puzzle {...props} />;
    case "code-2":
      return <Code2 {...props} />;
    default:
      return <BookOpen {...props} />;
  }
}
