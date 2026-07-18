'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { WallpaperMode, Resolution } from '@/lib/wallpaper-engine'
import { RESOLUTIONS } from '@/lib/wallpaper-engine'
import { registry, type StyleParams } from '@/lib/styles'
import { loadCustomPalettes, type CustomPalette } from '@/lib/custom-palettes'

interface WallpaperContextValue {
  style: string
  palette: string
  seed: number
  inverted: boolean
  mode: WallpaperMode
  resolution: Resolution
  styleParams: StyleParams
  customPalettes: CustomPalette[]
  setStyle: (s: string) => void
  setPalette: (p: string) => void
  setSeed: (s: number) => void
  setInverted: (v: boolean) => void
  setMode: (m: WallpaperMode) => void
  setResolution: (r: Resolution) => void
  setStyleParams: (p: StyleParams) => void
  shuffle: () => void
  setCustomPalettes: (p: CustomPalette[]) => void
}

const WallpaperContext = createContext<WallpaperContextValue | null>(null)

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [style, setStyleState] = useState('mountains')
  const [palette, setPalette] = useState('mono')
  const [seed, setSeedState] = useState(() => Math.floor(Math.random() * 99999))
  const [inverted, setInverted] = useState(false)
  const [mode, setModeState] = useState<WallpaperMode>('light')
  const [resolution, setResolutionState] = useState<Resolution>(RESOLUTIONS[0])
  const [styleParams, setStyleParams] = useState<StyleParams>({})
  const [customPalettes, setCustomPalettes] = useState<CustomPalette[]>([])

  useEffect(() => {
    setCustomPalettes(loadCustomPalettes())
  }, [])

  const setStyle = useCallback((s: string) => {
    setStyleState(s)
    const def = registry.get(s)
    if (def) {
      setStyleParams(def.defaultParams())
    }
  }, [])

  const setSeed = useCallback((s: number) => {
    setSeedState(s | 0)
  }, [])

  const setMode = useCallback((m: WallpaperMode) => {
    setModeState(m)
  }, [])

  const setResolution = useCallback((r: Resolution) => {
    setResolutionState(r)
  }, [])

  const shuffle = useCallback(() => {
    const currentDef = registry.get(style)
    setSeedState(Math.floor(Math.random() * 99999))
    if (currentDef) {
      setStyleParams(currentDef.randomize())
    }
  }, [style])

  return (
    <WallpaperContext.Provider
      value={{
        style, palette, seed, inverted, mode, resolution, styleParams, customPalettes,
        setStyle, setPalette, setSeed, setInverted, setMode, setResolution, setStyleParams,
        shuffle, setCustomPalettes,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  )
}

export function useWallpaper() {
  const ctx = useContext(WallpaperContext)
  if (!ctx) throw new Error('useWallpaper must be used within a WallpaperProvider')
  return ctx
}
