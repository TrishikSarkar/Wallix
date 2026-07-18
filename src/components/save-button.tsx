"use client";

import { Bookmark } from "lucide-react";

export function SaveButton() {
  return (
    <button className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#eaeaea] px-4 py-[10px] text-sm font-medium text-[#111111] transition-all duration-150 hover:bg-[#f5f5f5]">
      <Bookmark className="h-4 w-4" strokeWidth={1.5} />
      Save
    </button>
  );
}
