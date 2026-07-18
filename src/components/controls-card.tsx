"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StyleSelector } from "./style-selector";
import { PaletteSelector } from "./palette-selector";
import { ModeSelector } from "./mode-selector";
import { VariationButton } from "./variation-button";
import { ResolutionSelect } from "./resolution-select";
import { DownloadButton } from "./download-button";

import CustomPaletteDialog from "./custom-palette-dialog";

export function ControlsCard() {
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
      className="flex w-[320px] flex-col gap-2.5 rounded-[24px] border border-[#eaeaea] bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.06)] max-xl:w-full max-xl:max-w-[900px]"
    >
      <StyleSelector />
      <PaletteSelector onOpenCustom={() => setCustomOpen(true)} />
      <ModeSelector />
      <VariationButton />
      <ResolutionSelect />
      <DownloadButton />
      <CustomPaletteDialog
        open={customOpen}
        onClose={() => setCustomOpen(false)}
      />
    </motion.div>
  );
}
