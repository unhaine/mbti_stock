/**
 * 시장 및 도메인 로직 관련 유틸리티
 */

import { randomChoice } from './math'

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
