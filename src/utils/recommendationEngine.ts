/**
 * MBTI 기반 주식 추천 엔진
 * 가격 피쳐, 재무 피쳐, 섹터 선호도를 결합하여 추천 점수 계산
 */
import { Stock } from '../types'
import { calculateFinancialFeatures } from './financialFeatures'
import { MBTI_FEATURE_WEIGHTS } from './mbtiWeights'
import { FinancialRatios } from '../services/financial'

export interface RecommendationScore {
  ticker: string
  name: string
  totalScore: number
  breakdown: {
    priceScore: number
    financialScore: number
    sectorScore: number
  }
  matchReasons: string[]
}

/**
 * 섹터별 MBTI 선호도 보너스 점수
 */
const SECTOR_PREFERENCES: Record<string, Record<string, number>> = {
  // IT/플랫폼
  'IT/플랫폼': { INTJ: 0.3, INTP: 0.4, ENTJ: 0.2, ENTP: 0.5, ENFP: 0.4 },
  // 반도체
  반도체: { INTJ: 0.5, INTP: 0.4, ENTJ: 0.4, ISTJ: 0.3 },
  // 바이오
  바이오: { ENTP: 0.4, ENFP: 0.5, INFP: 0.3, INFJ: 0.3 },
  // 금융
  금융: { ISTJ: 0.5, ISFJ: 0.4, ESTJ: 0.4, ESFJ: 0.3 },
  // 2차전지
  '2차전지': { ENTJ: 0.3, ENTP: 0.4, ESTP: 0.5, ENFP: 0.3 },
  // 엔터테인먼트
  엔터테인먼트: { ESFP: 0.5, ENFP: 0.4, ENTP: 0.3, ISFP: 0.4 },
}

function getSectorBonus(sector: string, mbti: string): number {
  if (!SECTOR_PREFERENCES[sector]) return 0
  return SECTOR_PREFERENCES[sector][mbti] || 0
}

/**
 * 단일 종목에 대한 추천 점수 계산
 */
export function calculateRecommendationScore(
  stock: Stock,
  mbti: string,
  financialData?: FinancialRatios
): RecommendationScore {
  const weights = MBTI_FEATURE_WEIGHTS[mbti] || {}
  
  // 1. 가격 및 기본 피쳐 점수 계산
  let priceScore = 0
  const matchReasons: string[] = []

  // 변동성 (Stock 객체에 이미 정의된 값 우선 사용)
  const volatility = (stock.volatility as string) || 'medium'
  if (weights.volatilityLevel?.[volatility]) {
    const score = weights.volatilityLevel[volatility]
    priceScore += score
    if (score > 0) {
      const volText = volatility === 'high' || volatility === 'very-high' ? '높은 역동성' : '안정적인 흐름'
      matchReasons.push(`${volText} 성향 일치`)
    }
  }

  // 가격대
  const price = stock.livePrice ?? stock.price
  const priceRange = price < 50000 ? 'low' : price < 200000 ? 'mid' : 'high'
  if (weights.priceRange?.[priceRange]) {
    priceScore += weights.priceRange[priceRange]
  }

  // 2. 재무 피쳐 계산 및 점수 합산
  let financialScore = 0
  if (financialData) {
    const financialFeatures = calculateFinancialFeatures(financialData)
    
    if (weights.profitability?.[financialFeatures.profitability]) {
      const score = weights.profitability[financialFeatures.profitability]
      financialScore += score
      if (score > 0) matchReasons.push(`수익성 ${financialFeatures.profitability} 선호`)
    }

    if (weights.stability?.[financialFeatures.stability]) {
      const score = weights.stability[financialFeatures.stability]
      financialScore += score
      if (score > 0) matchReasons.push(`재무 안정성 ${financialFeatures.stability} 선호`)
    }
  }

  // 3. 섹터 보너스
  const sectorScore = getSectorBonus(stock.sector, mbti)
  if (sectorScore > 0) {
    matchReasons.push(`${stock.sector} 분야 선호`)
  }

  return {
    ticker: stock.ticker,
    name: stock.name,
    totalScore: Number((priceScore + financialScore + sectorScore).toFixed(2)),
    breakdown: {
      priceScore,
      financialScore,
      sectorScore,
    },
    matchReasons: matchReasons.slice(0, 3), // 최대 3개까지만 노출
  }
}

/**
 * 전체 종목 리스트 추천 순위 산출
 */
export function getRecommendedStocks(
  stocks: Stock[],
  mbti: string,
  financialsMap?: Map<string, FinancialRatios>
): RecommendationScore[] {
  return stocks
    .map((stock) => calculateRecommendationScore(stock, mbti, financialsMap?.get(stock.ticker)))
    .sort((a, b) => b.totalScore - a.totalScore)
}

export default {
  calculateRecommendationScore,
  getRecommendedStocks,
}
