import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useWallpaper } from '@/lib/wallpaper-context'
import { palettes, cn } from '@/lib/utils'

function PaletteCard({
  colors,
  selected,
  onClick,
  compact,
}: {
  colors: readonly string[]
  selected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative flex rounded-md overflow-hidden cursor-pointer shrink-0',
        selected
          ? 'ring-[3px] ring-black'
          : 'ring-1 ring-gray-300'
      )}
      style={{ height: compact ? 24 : 28, width: compact ? 34 : 36 }}
    >
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-[1px]">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </motion.button>
  )
}

export function PaletteSelector({
  onOpenCustom,
}: {
  onOpenCustom?: () => void
}) {
  const { palette: activePalette, setPalette, customPalettes } = useWallpaper()
  const activeCustom = customPalettes.find((p) => p.id === activePalette)

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold tracking-[0.25em] text-[#8A8A8A]">
        PALETTE
      </label>
      <div className="grid grid-cols-6 gap-1.5 w-fit mx-auto">
        {palettes.map((p) => (
          <PaletteCard
            key={p.id}
            colors={p.colors}
            selected={activePalette === p.id}
            onClick={() => setPalette(p.id)}
          />
        ))}
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={onOpenCustom}
          className="flex items-center gap-1 text-[11px] font-medium text-[#8A8A8A] hover:text-[#111111]"
        >
          <Palette className="w-3.5 h-3.5" />
          Custom
        </button>
        {activeCustom && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#8A8A8A]">Active</span>
            <PaletteCard
              colors={activeCustom.colors}
              selected={true}
              onClick={() => {}}
              compact
            />
          </div>
        )}
      </div>
    </div>
  )
}
