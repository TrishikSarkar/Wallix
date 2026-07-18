"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallpaper } from "@/lib/wallpaper-context";
import { palettes, cn } from "@/lib/utils";
import { registry } from "@/lib/styles";

const THUMB_SIZE = 68;
const THUMB_RADIUS = 12;

const visibleStyleIds = ['mountains', 'gradient', 'waves', 'paper', 'rings', 'aurora', 'contours'];
const hiddenStyleIds = ['dunes', 'chaos', 'horizon', 'fog', 'hills', 'orbit'];

const visibleStyles = visibleStyleIds.map((id) => registry.get(id)!).filter(Boolean);
const hiddenStyles = hiddenStyleIds.map((id) => registry.get(id)!).filter(Boolean);

function useStyleThumbnail(styleId: string) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { palette: paletteId, seed, inverted, customPalettes } = useWallpaper();
  const drawnRef = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = palettes.find((p) => p.id === paletteId) ?? customPalettes.find((p) => p.id === paletteId);
    if (!p) return;
    const seedVal = seed + styleId.charCodeAt(0) * 1000 + styleId.charCodeAt(styleId.length - 1) * 100;
    const def = registry.get(styleId);
    if (def) {
      ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);
      def.draw(ctx, THUMB_SIZE, THUMB_SIZE, p.colors, seedVal, inverted);
      drawnRef.current = true;
    }
  }, [styleId, paletteId, seed, inverted, customPalettes]);

  return ref;
}

function Tooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.12 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded-md bg-[#111] text-[11px] font-medium text-white whitespace-nowrap pointer-events-none z-50"
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StyleThumbnail({ styleId, name, selected, onClick }: {
  styleId: string;
  name: string;
  selected: boolean;
  onClick: () => void;
}) {
  const canvasRef = useStyleThumbnail(styleId);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative inline-flex">
      <Tooltip label={name} visible={hovered} />
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden cursor-pointer outline-none",
          selected
            ? "ring-2 ring-[#111]"
            : "ring-[0.5px] ring-[#d0d0d0] hover:ring-[#a0a0a0]"
        )}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_RADIUS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
        aria-label={name}
        role="option"
        aria-selected={selected}
      >
        <canvas
          ref={canvasRef}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="block"
          style={{ borderRadius: THUMB_RADIUS }}
        />
      </motion.button>
    </div>
  );
}

function MoreDropdown({ onClose }: { onClose: () => void }) {
  const { style: activeStyle, palette: paletteId, seed, inverted, customPalettes, setStyle } = useWallpaper();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, hiddenStyles.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        setStyle(hiddenStyles[focusedIdx].id);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, focusedIdx, setStyle]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => window.addEventListener('click', handler), 0);
    return () => window.removeEventListener('click', handler);
  }, [onClose]);

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="absolute top-full right-0 mt-1 z-50 p-2 rounded-xl bg-white shadow-lg border border-[#eaeaea]"
      style={{ minWidth: 180 }}
      role="listbox"
      aria-label="More styles"
    >
      <div className="grid grid-cols-3 gap-1">
        {hiddenStyles.map((s, idx) => (
          <MoreItem
            key={s.id}
            styleId={s.id}
            name={s.name}
            selected={activeStyle === s.id}
            focused={focusedIdx === idx}
            paletteId={paletteId}
            seed={seed}
            inverted={inverted}
            customPalettes={customPalettes}
            onSelect={() => { setStyle(s.id); onClose(); }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MoreItem({ styleId, name, selected, focused, paletteId, seed, inverted, customPalettes, onSelect }: {
  styleId: string;
  name: string;
  selected: boolean;
  focused: boolean;
  paletteId: string;
  seed: number;
  inverted: boolean;
  customPalettes: { id: string; colors: string[] }[];
  onSelect: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const p = palettes.find((p) => p.id === paletteId) ?? customPalettes.find((p) => p.id === paletteId);
    if (!p) return;
    const seedVal = seed + styleId.charCodeAt(0) * 1000 + styleId.charCodeAt(styleId.length - 1) * 100;
    const def = registry.get(styleId);
    if (def) {
      ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);
      def.draw(ctx, THUMB_SIZE, THUMB_SIZE, p.colors, seedVal, inverted);
    }
  }, [styleId, paletteId, seed, inverted, customPalettes]);

  return (
    <div className="relative inline-flex">
      <Tooltip label={name} visible={hovered} />
      <motion.button
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className={cn(
          "relative overflow-hidden cursor-pointer outline-none",
          selected ? "ring-2 ring-[#111]" : "ring-[0.5px] ring-[#d0d0d0]",
          focused && !selected ? "ring-2 ring-[#666]" : ""
        )}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_RADIUS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
        aria-label={name}
        role="option"
        aria-selected={selected}
      >
        <canvas
          ref={ref}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          className="block"
          style={{ borderRadius: THUMB_RADIUS }}
        />
      </motion.button>
    </div>
  );
}

function MoreButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative inline-flex">
      <Tooltip label="More Styles" visible={hovered} />
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="relative overflow-hidden cursor-pointer outline-none ring-[0.5px] ring-[#d0d0d0] hover:ring-[#a0a0a0] flex items-center justify-center bg-[#f8f8f8]"
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_RADIUS,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
        aria-label="More styles"
        aria-haspopup="listbox"
      >
        <span className="text-[20px] font-bold text-[#8a8a8a] leading-none select-none">⋯</span>
      </motion.button>
    </div>
  );
}

export function StyleSelector() {
  const { style: activeStyle, setStyle } = useWallpaper();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = useCallback((id: string) => {
    setStyle(id);
  }, [setStyle]);

  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-medium tracking-wider text-[#6b7280]">
        STYLE
      </label>
      <div className="relative">
        <div className="flex flex-wrap gap-1">
          {visibleStyles.map((s) => (
            <StyleThumbnail
              key={s.id}
              styleId={s.id}
              name={s.name}
              selected={activeStyle === s.id}
              onClick={() => handleSelect(s.id)}
            />
          ))}
          <MoreButton onClick={() => setDropdownOpen((o) => !o)} />
        </div>
        <AnimatePresence>
          {dropdownOpen && <MoreDropdown onClose={() => setDropdownOpen(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
