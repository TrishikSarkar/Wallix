import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const palettes = [
  { id: "mono", colors: ["#000000", "#6B7280", "#FFFFFF"] },
  { id: "warm-mono", colors: ["#111111", "#3D3D3D", "#F5F0E8"] },
  { id: "navy", colors: ["#0A1628", "#1E56A0", "#D6E8F7"] },
  { id: "sunset", colors: ["#0B1D3A", "#FF6B6B", "#FFF5E6"] },
  { id: "amber", colors: ["#2C1810", "#E8590C", "#FFEAA7"] },
  { id: "lavender", colors: ["#4A0E4E", "#8B5CF6", "#E8D5F5"] },
  { id: "forest", colors: ["#0D2818", "#4A7C3F", "#C4E0A3"] },
  { id: "slate", colors: ["#2D3748", "#4A7C9B", "#FFFFFF"] },
  { id: "ocean", colors: ["#1A0A2E", "#2563EB", "#A5F3FC"] },
  { id: "rose", colors: ["#4A0E0E", "#DC2626", "#FEF3C7"] },
  { id: "mint", colors: ["#0D2B2B", "#5EEAD4", "#BBF7D0"] },
  { id: "plum", colors: ["#380A3E", "#D946EF", "#FDE8F0"] },
] as const;
