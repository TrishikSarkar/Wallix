"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { DownloadModal } from "./download-modal";

export function DownloadButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#111111] px-4 py-[10px] text-sm font-medium text-white transition-all duration-150 hover:bg-[#2a2a2a]"
      >
        <Download className="h-4 w-4" strokeWidth={1.5} />
        Download
      </button>
      <DownloadModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
