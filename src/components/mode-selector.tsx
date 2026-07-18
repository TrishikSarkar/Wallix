"use client";

import { cn } from "@/lib/utils";
import { useWallpaper } from "@/lib/wallpaper-context";
import type { WallpaperMode } from "@/lib/wallpaper-engine";

export function ModeSelector() {
  const { mode, setMode } = useWallpaper();

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-[#6b7280]">
        MODE
      </label>
      <div className="flex overflow-hidden rounded-[14px] border border-[#eaeaea] bg-[#f5f5f5] p-1">
        {(["dark", "light"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setMode(option as WallpaperMode)}
            className={cn(
              "flex-1 rounded-[12px] px-4 py-2 text-sm font-medium transition-all duration-150",
              mode === option
                ? "bg-white text-[#111111] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                : "text-[#6b7280] hover:text-[#111111]"
            )}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
