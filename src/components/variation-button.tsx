"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { useWallpaper } from "@/lib/wallpaper-context";

export function VariationButton() {
  const { shuffle } = useWallpaper();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    if (loading) return;
    setLoading(true);
    shuffle();
    setTimeout(() => setLoading(false), 300);
  }, [loading, shuffle]);

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-[#6b7280]">
        VARIATION
      </label>
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#eaeaea] px-4 py-[10px] text-sm font-medium text-[#111111] transition-all duration-150 hover:bg-[#f5f5f5] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
        ) : (
          <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
        )}
        Generate Random
      </button>
    </div>
  );
}
