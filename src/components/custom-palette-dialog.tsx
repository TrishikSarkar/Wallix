import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWallpaper } from '@/lib/wallpaper-context'
import { saveCustomPalettes, generateCustomId, type CustomPalette } from '@/lib/custom-palettes'

function isValidHex(s: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(s)
}

function clampHex(s: string): string {
  if (!s.startsWith('#')) return '#'
  const hex = s.slice(1).replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
  return '#' + hex.padEnd(6, '0')
}

export default function CustomPaletteDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { customPalettes, setCustomPalettes, setPalette } = useWallpaper()
  const [editColors, setEditColors] = useState<[string, string, string]>(['#000000', '#6B7280', '#FFFFFF'])

  const setColor = (i: number, v: string) => {
    const next = [...editColors] as [string, string, string]
    next[i] = v
    setEditColors(next)
  }

  const handleHex = (i: number, raw: string) => {
    if (isValidHex(raw)) {
      setColor(i, raw)
    }
  }

  const handleSave = () => {
    if (!editColors.every(isValidHex)) return
    const newPalette: CustomPalette = {
      id: generateCustomId(),
      colors: editColors,
    }
    const updated = [...customPalettes, newPalette]
    setCustomPalettes(updated)
    saveCustomPalettes(updated)
    setPalette(newPalette.id)
    onClose()
  }

  const handleRemove = (id: string) => {
    const updated = customPalettes.filter((p) => p.id !== id)
    setCustomPalettes(updated)
    saveCustomPalettes(updated)
  }

  const handleUpdate = (id: string, colors: [string, string, string]) => {
    const updated = customPalettes.map((p) =>
      p.id === id ? { ...p, colors } : p
    )
    setCustomPalettes(updated)
    saveCustomPalettes(updated)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-5 w-[340px] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                Custom Palettes
              </h2>
              <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {customPalettes.length > 0 && (
              <div className="space-y-2">
                {customPalettes.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 p-1.5"
                  >
                    <button
                      onClick={() => { setPalette(p.id); onClose() }}
                      className="flex rounded overflow-hidden h-8 shrink-0 flex-1 cursor-pointer"
                    >
                      {p.colors.map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </button>
                    {p.colors.map((c, i) => (
                      <input
                        key={i}
                        type="color"
                        value={c}
                        onChange={(e) => {
                          const next = [...p.colors] as [string, string, string]
                          next[i] = e.target.value
                          handleUpdate(p.id, next)
                        }}
                        className="w-7 h-7 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent p-0.5"
                      />
                    ))}
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="text-neutral-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <h3 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                Create New Palette
              </h3>
              <div className="flex gap-1.5 rounded-lg overflow-hidden h-10 mb-4">
                {editColors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>
              {editColors.map((c, i) => (
                <div key={i} className="flex items-center gap-3 mb-2">
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => setColor(i, e.target.value)}
                    className="w-9 h-9 rounded-md border border-neutral-300 dark:border-neutral-700 cursor-pointer bg-transparent p-0.5"
                  />
                  <input
                    type="text"
                    value={c}
                    onChange={(e) => setColor(i, clampHex(e.target.value))}
                    onBlur={(e) => handleHex(i, e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-2.5 py-1.5 text-xs font-mono rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-800 dark:text-neutral-200 outline-none focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              ))}
              <button
                disabled={!editColors.every(isValidHex)}
                onClick={handleSave}
                className={cn(
                  'w-full py-2 mt-2 text-xs font-medium rounded-lg text-white',
                  editColors.every(isValidHex)
                    ? 'bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                    : 'bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed'
                )}
              >
                Add Palette
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
