import type { SeverityLevel } from "../types";

interface SeverityColorScheme {
  badge: string;
}

export function formatSeverityColor(level: SeverityLevel): SeverityColorScheme {
  switch (level) {
    case "Critical":
      return { badge: "bg-red-100 text-red-800 border-red-200" };
    case "High":
      return { badge: "bg-orange-100 text-orange-800 border-orange-200" };
    case "Medium":
      return { badge: "bg-amber-100 text-amber-800 border-amber-200" };
    case "Low":
    default:
      return { badge: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  }
}
