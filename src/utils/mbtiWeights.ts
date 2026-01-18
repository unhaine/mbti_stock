/**
 * MBTI 유형별 주식 피쳐 선호도 가중치 정의
 */

export interface FeatureWeights {
  volatilityLevel?: Record<string, number>
  profitability?: Record<string, number>
  stability?: Record<string, number>
  growth?: Record<string, number>
  priceRange?: Record<string, number>
}

/**
 * MBTI 유형별 피쳐 가중치
 * 양수: 해당 피쳐를 선호 (추천 점수 증가)
 * 음수: 해당 피쳐를 회피 (추천 점수 감소)
 */
export const MBTI_FEATURE_WEIGHTS: Record<string, FeatureWeights> = {
  // === 분석가형 (NT) ===
  INTJ: {
    volatilityLevel: { high: 0.3, 'very-high': 0.5 }, // 효율과 미래 가치 중심
    profitability: { high: 0.4 },
    growth: { 'high-growth': 0.5 },
    priceRange: { high: 0.2 },
  },
  INTP: {
    volatilityLevel: { medium: 0.3, high: 0.2 },
    profitability: { high: 0.3, medium: 0.2 },
    growth: { 'high-growth': 0.3 },
  },
  ENTJ: {
    volatilityLevel: { high: 0.4, 'very-high': 0.3 },
    profitability: { high: 0.5 },
    priceRange: { high: 0.3 }, // 대형주/우량주 선호
  },
  ENTP: {
    volatilityLevel: { 'very-high': 0.5 }, // 파괴적 혁신 선호
    growth: { 'high-growth': 0.4 },
    stability: { risky: 0.2 }, // 위험 감수 성향
  },

  // === 수호자형 (SJ) ===
  ISTJ: {
    stability: { stable: 0.5 }, // 원칙과 실리 중심
    volatilityLevel: { low: 0.4, medium: 0.2 },
    profitability: { high: 0.3, medium: 0.3 },
  },
  ISFJ: {
    stability: { stable: 0.6 },
    volatilityLevel: { low: 0.5 },
    priceRange: { mid: 0.3, low: 0.2 },
  },
  ESTJ: {
    stability: { stable: 0.4 },
    profitability: { high: 0.4 },
    priceRange: { high: 0.3 },
  },
  ESFJ: {
    stability: { stable: 0.5 },
    volatilityLevel: { low: 0.4 },
    profitability: { medium: 0.3 },
  },

  // === 탐험가형 (SP) ===
  ISTP: {
    volatilityLevel: { high: 0.4, 'very-high': 0.2 },
    priceRange: { low: 0.3, mid: 0.2 },
    growth: { 'high-growth': 0.3 },
  },
  ISFP: {
    volatilityLevel: { medium: 0.4 },
    stability: { moderate: 0.3, stable: 0.2 },
  },
  ESTP: {
    volatilityLevel: { 'very-high': 0.6 }, // 스릴과 빠른 수익 선호
    growth: { 'high-growth': 0.4 },
    stability: { risky: 0.3 },
  },
  ESFP: {
    volatilityLevel: { high: 0.4, 'very-high': 0.3 },
    growth: { 'high-growth': 0.3 },
  },

  // === 외교관형 (NF) ===
  INFJ: {
    stability: { stable: 0.3, moderate: 0.3 },
    profitability: { medium: 0.4, high: 0.2 },
    growth: { stable: 0.3 },
  },
  INFP: {
    volatilityLevel: { low: 0.3, medium: 0.5 },
    stability: { stable: 0.4 },
    growth: { stable: 0.2 },
  },
  ENFJ: {
    stability: { stable: 0.4 },
    profitability: { high: 0.4 },
    growth: { stable: 0.3 },
  },
  ENFP: {
    volatilityLevel: { medium: 0.3, high: 0.4 },
    growth: { 'high-growth': 0.5 }, // 가능성과 비전 중심
  },
}

export default MBTI_FEATURE_WEIGHTS
