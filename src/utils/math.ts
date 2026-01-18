/**
 * 수학 및 랜덤 관련 유틸리티
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
