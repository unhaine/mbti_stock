import useLocalStorage from './useLocalStorage'
import { KEYS } from '../utils/storage'

/**
 * 포트폴리오를 관리하는 훅
 * @returns {[Object, function]} 포트폴리오 객체와 설정 함수
 */
export default function usePortfolio() {
  const defaultPortfolio = {
    cash: 10000000,
    stocks: [],
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  return useLocalStorage(KEYS.PORTFOLIO, defaultPortfolio)
}
