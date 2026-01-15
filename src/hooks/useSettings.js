import useLocalStorage from './useLocalStorage'
import { KEYS } from '../utils/storage'

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: true,
  soundEnabled: false,
  autoRefresh: true,
}

/**
 * 앱 설정을 관리하는 훅
 * @returns {[Object, function]} 설정 객체와 설정 함수
 */
export default function useSettings() {
  return useLocalStorage(KEYS.SETTINGS, DEFAULT_SETTINGS)
}
