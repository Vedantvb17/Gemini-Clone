import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeStore } from '@/types'

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark }))
    }),
    {
      name: 'gemini-theme-storage'
    }
  )
)
