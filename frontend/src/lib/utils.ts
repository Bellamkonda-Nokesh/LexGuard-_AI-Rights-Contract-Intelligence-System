import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeverityColor(severity: string) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return {
        badge: "bg-rose-50 text-rose-700 border-rose-200/80 font-semibold",
        border: "border-rose-400",
        indicator: "bg-rose-500",
        text: "text-rose-700",
        glow: "rgba(244, 63, 94, 0.15)",
        progressBg: "bg-rose-500"
      };
    case "high":
      return {
        badge: "bg-orange-50 text-orange-700 border-orange-200/80 font-semibold",
        border: "border-orange-400",
        indicator: "bg-orange-500",
        text: "text-orange-700",
        glow: "rgba(249, 115, 22, 0.15)",
        progressBg: "bg-orange-500"
      };
    case "medium":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200/80 font-semibold",
        border: "border-amber-400",
        indicator: "bg-amber-500",
        text: "text-amber-700",
        glow: "rgba(245, 158, 11, 0.15)",
        progressBg: "bg-amber-500"
      };
    case "low":
    default:
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold",
        border: "border-emerald-200/80",
        indicator: "bg-emerald-500",
        text: "text-emerald-700",
        glow: "rgba(16, 185, 129, 0.15)",
        progressBg: "bg-emerald-500"
      };
  }
}
