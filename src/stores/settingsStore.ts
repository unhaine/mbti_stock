import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  notifications: boolean
  darkMode: boolean
  soundEffects: boolean
  refreshInterval: number
  setNotifications: (value: boolean) => void
  setDarkMode: (value: boolean) => void
  setSoundEffects: (value: boolean) => void
  setRefreshInterval: (value: number) => void
  resetSettings: () => void
}

const initialSettings = {
  notifications: true,
  darkMode: true,
  soundEffects: true,
  refreshInterval: 30,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialSettings,
      setNotifications: (value) => set({ notifications: value }),
      setDarkMode: (value) => set({ darkMode: value }),
      setSoundEffects: (value) => set({ soundEffects: value }),
      setRefreshInterval: (value) => set({ refreshInterval: value }),
      resetSettings: () => set(initialSettings),
    }),
    {
      name: 'mbti-stock-settings-storage',
    }
  )
)
