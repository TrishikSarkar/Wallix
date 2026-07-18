"use client";

import { useRef, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useWallpaper } from "@/lib/wallpaper-context";
import { palettes } from "@/lib/utils";
import { drawPattern } from "@/lib/wallpaper-engine";
import { LockScreenOverlay } from "./lock-screen-overlay";

const DESKTOP_PREVIEW_W = 960;
const DESKTOP_PREVIEW_H = 540;
const MOBILE_PREVIEW_W = 290;
const MOBILE_PREVIEW_H = 628;

export function PreviewCard() {
  const { style, palette, mode, seed, styleParams, customPalettes } = useWallpaper();
  const desktopRef = useRef<HTMLCanvasElement>(null);
  const mobileRef = useRef<HTMLCanvasElement>(null);

  const p = palettes.find((p) => p.id === palette) ?? customPalettes.find((p) => p.id === palette);
  const colors = p?.colors ?? palettes[0].colors;
  const inverted = mode === 'light';

  useEffect(() => {
    const dCtx = desktopRef.current?.getContext('2d');
    if (dCtx) {
      drawPattern(dCtx, DESKTOP_PREVIEW_W, DESKTOP_PREVIEW_H, style, colors, seed, inverted, styleParams);
    }
  }, [style, colors, seed, inverted, styleParams]);

  useEffect(() => {
    const mCtx = mobileRef.current?.getContext('2d');
    if (mCtx) {
      drawPattern(mCtx, MOBILE_PREVIEW_W, MOBILE_PREVIEW_H, style, colors, seed, inverted, styleParams);
    }
  }, [style, colors, seed, inverted, styleParams]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col rounded-[24px] border border-[#eaeaea] bg-[#F6F6F6] p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-1 gap-10 max-xl:flex-col max-xl:items-center max-xl:gap-6">
        <div className="flex flex-1 flex-col max-xl:w-full">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Monitor className="h-3.5 w-3.5 text-[#8A8A8A]" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[#8A8A8A]">
              DESKTOP 4K
            </span>
          </div>
          <div
            className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-[#f5f5f5]"
            style={{ border: '2.5px solid #171717' }}
          >
            <canvas
              ref={desktopRef}
              width={DESKTOP_PREVIEW_W}
              height={DESKTOP_PREVIEW_H}
              className="absolute inset-0 h-full w-full"
            />
            <LockScreenOverlay theme={mode} deviceType="desktop" />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Smartphone className="h-3.5 w-3.5 text-[#8A8A8A]" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold tracking-[0.24em] text-[#8A8A8A]">
              MOBILE
            </span>
          </div>
          <div
            className="relative aspect-[9/19] h-full max-h-[255px] w-[110px] overflow-hidden rounded-[22px] bg-[#f5f5f5] max-xl:h-auto max-xl:w-[140px] max-xl:max-h-[320px] max-md:w-[160px] max-md:max-h-[360px]"
            style={{ border: '2.5px solid #171717' }}
          >
            <canvas
              ref={mobileRef}
              width={MOBILE_PREVIEW_W}
              height={MOBILE_PREVIEW_H}
              className="absolute inset-0 h-full w-full"
            />
            <LockScreenOverlay theme={mode} deviceType="mobile" />
            <div className="absolute top-2 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
