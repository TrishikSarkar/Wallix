const STORAGE_KEY = 'wallix-custom-palettes'

export interface CustomPalette {
  id: string
  colors: [string, string, string]
}

export function loadCustomPalettes(): CustomPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomPalettes(palettes: CustomPalette[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes))
}

export function generateCustomId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}
