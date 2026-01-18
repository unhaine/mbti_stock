/**
 * 재무 지표 기반 피쳐 계산 유틸리티
 */
import { FinancialRatios } from '../services/financial'

export interface FinancialFeatures {
  // 수익성
  operatingMargin: number // 영업이익률
  netProfitMargin: number // 순이익률
  roe?: number // 자기자본이익률 (계산 가능 시)

  // 안정성
  debtRatio: number // 부채비율

  // 성장성
  revenueGrowth?: number // 매출 성장률 (전년 대비)

  // 범주형 피쳐
  profitability: 'high' | 'medium' | 'low' | 'loss'
  stability: 'stable' | 'moderate' | 'risky'
  growth: 'high-growth' | 'stable' | 'declining'
}

/**
 * OpenDART 재무비율 데이터로 재무 피쳐 계산
 */
export function calculateFinancialFeatures(data: FinancialRatios): FinancialFeatures {
  return {
    operatingMargin: data.operatingMargin,
    netProfitMargin: data.netProfitMargin,
    debtRatio: data.debtRatio,

    profitability: getProfitabilityLevel(data.operatingMargin),
    stability: getStabilityLevel(data.debtRatio),
    growth: 'stable', // 전년 데이터 없이는 성장성 계산 불가하여 기본값 설정
  }
}

/**
 * 수익성 수준 분류
 */
function getProfitabilityLevel(margin: number): 'high' | 'medium' | 'low' | 'loss' {
  if (margin <= 0) return 'loss'
  if (margin >= 15) return 'high'
  if (margin >= 5) return 'medium'
  return 'low'
}

/**
 * 재무 안정성 분류
 */
function getStabilityLevel(debtRatio: number): 'stable' | 'moderate' | 'risky' {
  if (debtRatio <= 50) return 'stable'
  if (debtRatio <= 150) return 'moderate'
  return 'risky'
}

export default {
  calculateFinancialFeatures,
}
