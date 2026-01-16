/**
 * 헬퍼 유틸리티 함수
 */

// 배열에서 랜덤 선택
export function randomChoice<T>(array: T[]): T | null {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

// 랜덤 정수 생성 (min ~ max 포함)
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export type MarketCondition = 'bear' | 'neutral' | 'bull'

// 시장 상태 결정 (상승/보합/하락)
export function getMarketCondition(): MarketCondition {
  const rand = Math.random()
  if (rand < 0.33) return 'bear'
  if (rand < 0.66) return 'neutral'
  return 'bull'
}

interface MBTIComments {
  [mbti: string]: {
    bear: string[]
    neutral: string[]
    bull: string[]
  }
}

// MBTI 코멘트 선택
export function getMBTIComment(
  comments: MBTIComments,
  mbti: string,
  condition: MarketCondition | null = null
): string | null {
  if (!comments || !mbti) return null

  const mbtiComments = comments[mbti.toUpperCase()]
  if (!mbtiComments) return null

  const marketCondition = condition || getMarketCondition()
  const conditionComments = mbtiComments[marketCondition]

  if (!conditionComments || conditionComments.length === 0) return null

  return randomChoice(conditionComments)
}

// 변동 색상 반환
export function getChangeColor(value: number): string {
  if (value > 0) return 'text-emerald-400' // 상승
  if (value < 0) return 'text-red-400' // 하락
  return 'text-gray-400' // 보합
}

// 변동 배경색 반환
export function getChangeBgColor(value: number): string {
  if (value > 0) return 'bg-emerald-500/20'
  if (value < 0) return 'bg-red-500/20'
  return 'bg-gray-500/20'
}

// 변동 아이콘 반환
export function getChangeArrow(value: number): string {
  if (value > 0) return '▲'
  if (value < 0) return '▼'
  return '−'
}

// 스와이프 파워 계산 (Framer Motion용)
export function swipePower(offset: number, velocity: number): number {
  return Math.abs(offset) * velocity
}

// 스와이프 임계값
export const SWIPE_THRESHOLD = 10000

// 디바운스
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// 쓰로틀
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// 클래스명 조합
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// 딜레이 (Promise)
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 클립보드에 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

const helpers = {
  randomChoice,
  randomInt,
  getMarketCondition,
  getMBTIComment,
  getChangeColor,
  getChangeBgColor,
  getChangeArrow,
  swipePower,
  SWIPE_THRESHOLD,
  debounce,
  throttle,
  cn,
  delay,
  copyToClipboard,
}

export default helpers
