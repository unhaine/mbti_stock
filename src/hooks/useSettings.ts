import { useSettingsStore } from '../stores/settingsStore'

/**
 * 앱 설정을 관리하는 훅 (Zustand 기반)
 */
export default function useSettings() {
  const settings = useSettingsStore()

  // 기존 [val, setter] 인터페이스 유지가 필요하다면:
  // (하지만 Zustand는 개별 setter를 쓰는 게 더 효율적입니다)
  const setSettings = (updates: any) => {
    if (updates.notifications !== undefined) settings.setNotifications(updates.notifications)
    if (updates.darkMode !== undefined) settings.setDarkMode(updates.darkMode)
    if (updates.soundEffects !== undefined) settings.setSoundEffects(updates.soundEffects)
    if (updates.refreshInterval !== undefined) settings.setRefreshInterval(updates.refreshInterval)
    if (updates.aiEnabled !== undefined) settings.setAiEnabled(updates.aiEnabled)
  }

  return [settings, setSettings] as const
}
