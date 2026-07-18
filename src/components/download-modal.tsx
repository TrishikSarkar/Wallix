"use client";

import { useState } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { motion } from "framer-motion";
import { useWallpaper } from "@/lib/wallpaper-context";
import { palettes } from "@/lib/utils";
import { exportWallpaper } from "@/lib/wallpaper-engine";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
}

export function DownloadModal({ open, onClose }: DownloadModalProps) {
  const { style, palette, seed, mode, styleParams, customPalettes } = useWallpaper();
  const [downloading, setDownloading] = useState(false);
  const p = palettes.find((p) => p.id === palette) ?? customPalettes.find((p) => p.id === palette);
  const inverted = mode === 'light';

  if (!open) return null;

  const doExport = async (device: 'desktop' | 'mobile') => {
    if (!p || downloading) return;
    setDownloading(true);
    try {
      const isDesktop = device === 'desktop';
      await exportWallpaper(
        style, p.colors, seed, inverted,
        isDesktop
          ? { label: '4K (3840 × 2160)', width: 3840, height: 2160 }
          : { label: 'iPhone (1290 × 2796)', width: 1290, height: 2796 },
        isDesktop ? 'wallix-desktop-4k.png' : 'wallix-mobile.png',
        styleParams,
      );
      onClose();
    } catch {
      // export failed silently
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[#6b7280] hover:text-[#111111] transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <h2 className="text-lg font-semibold text-[#111111]">Download Wallpaper</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Choose which version you want to download.</p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={() => doExport('desktop')}
              disabled={downloading}
              className="flex items-center gap-4 rounded-[14px] border border-[#eaeaea] p-4 text-left transition-all duration-150 hover:bg-[#f5f5f5] disabled:opacity-50"
            >
              <Monitor className="h-6 w-6 text-[#6b7280]" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-medium text-[#111111]">Desktop</div>
                <div className="text-xs text-[#6b7280]">3840 × 2160 (4K)</div>
              </div>
            </button>

            <button
              onClick={() => doExport('mobile')}
              disabled={downloading}
              className="flex items-center gap-4 rounded-[14px] border border-[#eaeaea] p-4 text-left transition-all duration-150 hover:bg-[#f5f5f5] disabled:opacity-50"
            >
              <Smartphone className="h-6 w-6 text-[#6b7280]" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-medium text-[#111111]">Mobile</div>
                <div className="text-xs text-[#6b7280]">1290 × 2796</div>
              </div>
            </button>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onClose}
              className="text-sm text-[#6b7280] hover:text-[#111111] transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>

    </>
  );
}
