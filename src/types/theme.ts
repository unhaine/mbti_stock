/**
 * 테마 타입 정의
 */

import type { MBTIType } from './mbti'

// 투자 테마 카테고리
export type ThemeCategory =
  | '장기 투자'
  | '가치 투자'
  | '성장주'
  | '배당 투자'
  | '모멘텀 투자'
  | 'ESG 투자'
  | '테마 투자'
  | '분산 투자'
  | '고위험 고수익'
  | '안정적 투자'

// 투자 테마
export interface Theme {
  id: string
  mbti: MBTIType
  emoji: string
  title: string
  description: string
  category: string
  stocks: string[] // ticker 배열
}

// 테마 필터 옵션
export interface ThemeFilter {
  mbti?: MBTIType
  category?: ThemeCategory
  limit?: number
}
