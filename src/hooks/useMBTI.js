import useLocalStorage from './useLocalStorage'
import { KEYS } from '../utils/storage'

/**
 * MBTI 정보를 관리하는 훅
 * @returns {[string|null, function]} MBTI와 설정 함수
 */
export default function useMBTI() {
  return useLocalStorage(KEYS.MBTI, null)
}
