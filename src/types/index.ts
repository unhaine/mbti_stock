// Re-export MBTI types
export * from './mbti'
export * from './theme'

// 종목 메타포 타입
export interface StockMetaphor {
  text?: string
  emoji?: string
  description?: string
}

// 추천 점수 타입
export interface RecommendationInfo {
  totalScore: number
  matchReasons: string[]
  breakdown?: {
    priceScore: number
    financialScore: number
    sectorScore: number
  }
}

// 변동성 수준
export type VolatilityLevel = 'low' | 'medium' | 'high' | 'very-high'

// 주식 종목 타입
export interface Stock {
  // 기본 정보
  ticker: string
  name: string
  sector: string
  marketCap: number | string
  
  // 시세 정보 (항상 최신값 유지)
  price: number
  change: number
  changePercent: number
  volume?: number
  openPrice?: number
  highPrice?: number
  lowPrice?: number

  // 실시간/캐시된 시세 데이터 (옵션)
  livePrice?: number
  liveChange?: number
  liveChangePercent?: number
  liveVolume?: number
  liveOpen?: number
  liveHigh?: number
  liveLow?: number
  isLiveData?: boolean
  priceUpdatedAt?: string
  baseDate?: string
  
  // 추가 정보
  volatility: VolatilityLevel | string
  dividendYield: number
  lastSyncDate?: string
  
  // 메타데이터
  stockMBTI?: string
  metaphors?: Record<string, StockMetaphor | string>
  tags?: string[]
  emoji?: string
  description?: string
  aiMessage?: string
  
  // Theme context (for AI generation)
  themeTitle?: string
  themeDescription?: string
  themeCategory?: string

  // 추천 정보
  recommendation?: RecommendationInfo
  hasFinancials?: boolean
}

// 포트폴리오 보유 종목
export interface PortfolioHolding {
  ticker: string
  shares: number
  avgPrice: number
  name?: string
}

// 포트폴리오 스토어
export interface PortfolioStore {
  cash: number
  stocks: PortfolioHolding[]
}

// Supabase Portfolio Table Type
export interface Portfolio {
  id: string
  user_id: string
  cash_balance: number
  total_assets: number
  created_at?: string
}

// 거래 내역
export interface Transaction {
  id: string
  portfolio_id: string
  ticker: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  total_amount: number
  executed_at: string
}

// 커뮤니티 게시글
export interface Post {
  id: number | string
  title: string
  category: string
  mbti: string
  emoji: string
  author: string
  likes: number
  comments: number
  views: number
  timeAgo: string
  isHot: boolean
  preview: string
  sentiment?: 'bull' | 'bear' | 'neutral'
}

// API 응답 타입
export interface APIResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

// 캐시 정보
export interface CacheInfo {
  exists: boolean
  isValid: boolean
  count: number
  updatedAt: string | null
  expiresAt: string | null
}
