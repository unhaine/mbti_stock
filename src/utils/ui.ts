/**
 * UI 관련 헬퍼 유틸리티
 */

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

// 클립보드에 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
