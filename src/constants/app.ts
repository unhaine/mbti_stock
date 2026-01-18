/**
 * 앱 전역 상수
 * 매직 넘버를 상수화하여 유지보수성 향상
 */

// ====================================
// 포트폴리오 관련
// ====================================
export const PORTFOLIO = {
  INITIAL_CASH: 10_000_000, // 초기 자본금 (1천만원)
  MIN_TRADE_QUANTITY: 1,
  MAX_TRADE_QUANTITY: 1000,
} as const

// ====================================
// 캐싱 관련
// ====================================
export const CACHE = {
  DURATION_MS: 24 * 60 * 60 * 1000, // 24시간
  WEEKEND_DAYS: 3, // 주말 캐시 유지 일수
  PRICE_CACHE_KEY: 'mbti_stock_price_cache',
  VERSION: 1,
} as const

// ====================================
// API 관련
// ====================================
export const API = {
  BATCH_SIZE: 5, // 동시 API 호출 수
  DELAY_MS: 100, // 배치 간 딜레이
  TIMEOUT_MS: 10_000, // API 타임아웃
  MAX_RETRIES: 3, // 최대 재시도 횟수
} as const

// ====================================
// UI 관련
// ====================================
export const UI = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_MS: 300,
  SKELETON_COUNT: 5,
  LIST_PAGE_SIZE: 20,
} as const

// ====================================
// 거래 관련
// ====================================
export const TRADING = {
  FEE_RATE: 0.00015, // 거래 수수료율 (0.015%)
  TAX_RATE: 0.0023, // 거래세율 (0.23%)
  MIN_ORDER_AMOUNT: 1000, // 최소 주문 금액
} as const

// ====================================
// 추천 시스템 관련
// ====================================
export const RECOMMENDATION = {
  MAX_REASONS: 3, // 최대 추천 이유 수
  MIN_SCORE_THRESHOLD: 0.1, // 최소 추천 점수
  TOP_N: 10, // 상위 N개 추천
} as const

// ====================================
// 변동성 분류 기준
// ====================================
export const VOLATILITY_THRESHOLDS = {
  LOW: 1, // 1% 미만
  MEDIUM: 3, // 1% ~ 3%
  HIGH: 5, // 3% ~ 5%
  // 5% 이상: very-high
} as const

// ====================================
// 가격대 분류 기준
// ====================================
export const PRICE_RANGE_THRESHOLDS = {
  LOW: 50_000, // 5만원 미만: 저가
  MID: 200_000, // 5만원 ~ 20만원: 중가
  // 20만원 이상: 고가
} as const

// ====================================
// 재무 분류 기준
// ====================================
export const FINANCIAL_THRESHOLDS = {
  PROFITABILITY: {
    HIGH: 15, // 영업이익률 15% 이상
    MEDIUM: 5, // 5% ~ 15%
    // 5% 미만: low, 0 이하: loss
  },
  DEBT_RATIO: {
    STABLE: 50, // 부채비율 50% 이하
    MODERATE: 150, // 50% ~ 150%
    // 150% 초과: risky
  },
} as const

// ====================================
// 로컬 스토리지 키
// ====================================
export const STORAGE_KEYS = {
  MBTI: 'mbti-stock-mbti',
  PORTFOLIO: 'mbti-stock-portfolio',
  TRANSACTIONS: 'mbti-stock-transactions',
  SETTINGS: 'mbti-stock-settings',
  ONBOARDING: 'mbti-stock-onboarding',
  PRICE_CACHE: 'mbti_stock_price_cache',
} as const

// 편의를 위한 통합 export
export const APP_CONSTANTS = {
  PORTFOLIO,
  CACHE,
  API,
  UI,
  TRADING,
  RECOMMENDATION,
  VOLATILITY_THRESHOLDS,
  PRICE_RANGE_THRESHOLDS,
  FINANCIAL_THRESHOLDS,
  STORAGE_KEYS,
} as const
