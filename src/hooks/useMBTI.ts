import useLocalStorage from './useLocalStorage'
import { useAuth } from '../contexts/AuthContext.tsx'
import { KEYS } from '../utils/storage'

/**
 * MBTI 정보를 관리하는 훅 (DB + LocalStorage 동기화)
 * @returns [MBTI와 설정 함수]
 */
export default function useMBTI(): [string | null, (newValue: string | null) => Promise<void>] {
  const [localMBTI, setLocalMBTI] = useLocalStorage<string | null>(KEYS.MBTI, null)
  const { user, profile, updateProfile } = useAuth()

  // DB에 MBTI가 있으면 DB 값 사용, 없으면 로컬 값 사용
  // 단, DB 로딩이 완료된 시점(profile이 로드된 후)에서만 적용
  const mbti = user && profile?.mbti ? profile.mbti : localMBTI

  // MBTI 설정 함수 (DB와 로컬 모두 업데이트)
  const setMBTI = async (newValue: string | null) => {
    // 1. 로컬 스토리지 업데이트 (즉시 반영)
    setLocalMBTI(newValue)

    // 2. 로그인 상태라면 DB 업데이트 (비동기)
    if (user && updateProfile) {
      try {
        await updateProfile({ mbti: newValue })
      } catch (error) {
        console.error('Failed to sync MBTI to DB:', error)
      }
    }
  }

  return [mbti, setMBTI]
}
