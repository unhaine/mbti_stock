/**
 * 주식 시세 캐싱 서비스
 * localStorage 기반으로 API 호출 결과를 캐싱하여 하루 1회 업데이트
 */

const CACHE_KEY = 'mbti_stock_price_cache'
const CACHE_VERSION = 1
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24시간

export interface CachedStockPrice {
  closePrice: number
  change: number
  changePercent: number
  volume?: number
  highPrice?: number
  lowPrice?: number
  openPrice?: number
  marketCap?: number
  baseDate: string // YYYYMMDD
}

export interface StockPriceCache {
  version: number
  updatedAt: string // ISO timestamp
  expiresAt: string // ISO timestamp
  data: Record<string, CachedStockPrice>
}

/**
 * 캐시 로드
 */
export function loadPriceCache(): StockPriceCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cache: StockPriceCache = JSON.parse(raw)

    // 버전 체크
    if (cache.version !== CACHE_VERSION) {
      console.log('Cache version mismatch, clearing cache')
      clearPriceCache()
      return null
    }

    return cache
  } catch (error) {
    console.error('Failed to load price cache:', error)
    return null
  }
}

/**
 * 캐시 저장
 */
export function savePriceCache(data: Record<string, CachedStockPrice>): void {
  try {
    const now = new Date()
    const cache: StockPriceCache = {
      version: CACHE_VERSION,
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + CACHE_DURATION_MS).toISOString(),
      data,
    }

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
    console.log(`Saved ${Object.keys(data).length} stock prices to cache`)
  } catch (error) {
    console.error('Failed to save price cache:', error)
  }
}

/**
 * 캐시 업데이트 (기존 캐시에 새 데이터 병합)
 */
export function updatePriceCache(newData: Record<string, CachedStockPrice>): void {
  const existingCache = loadPriceCache()
  const mergedData = {
    ...(existingCache?.data || {}),
    ...newData,
  }
  savePriceCache(mergedData)
}

/**
 * 캐시 삭제
 */
export function clearPriceCache(): void {
  localStorage.removeItem(CACHE_KEY)
  console.log('Price cache cleared')
}

/**
 * 거래일 여부 확인 (주말 제외)
 */
function isTradingDay(date: Date = new Date()): boolean {
  const day = date.getDay()
  // 0: 일요일, 6: 토요일 제외
  return day !== 0 && day !== 6
}

/**
 * 같은 날인지 확인
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * 캐시 만료 여부 확인 (거래일 기준)
 * - 같은 날이면 유효
 * - 주말이면 금요일 캐시 유효
 * - 평일이면 전일 캐시 만료
 */
export function isCacheExpired(cache: StockPriceCache): boolean {
  const now = new Date()
  const updatedAt = new Date(cache.updatedAt)
  
  // 1. 같은 날이면 항상 유효
  if (isSameDay(now, updatedAt)) {
    return false
  }
  
  // 2. 주말이면 금요일 캐시도 유효
  if (!isTradingDay(now)) {
    // 최근 거래일(금요일) 캐시면 유효
    const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (24 * 60 * 60 * 1000))
    return daysSinceUpdate > 3 // 금요일 → 월요일까지 3일
  }
  
  // 3. 평일이면 전일 캐시 만료
  return true
}

/**
 * 캐시 유효성 확인 (만료되지 않았으면 유효)
 */
export function isCacheValid(): boolean {
  const cache = loadPriceCache()
  if (!cache) return false
  return !isCacheExpired(cache)
}

/**
 * 특정 종목의 캐시 데이터 조회
 */
export function getCachedPrice(ticker: string): CachedStockPrice | null {
  const cache = loadPriceCache()
  if (!cache || isCacheExpired(cache)) return null
  return cache.data[ticker] || null
}

/**
 * 캐시에 없는 종목 목록 반환
 */
export function getMissingTickers(tickers: string[]): string[] {
  const cache = loadPriceCache()
  if (!cache || isCacheExpired(cache)) return tickers

  return tickers.filter((ticker) => !cache.data[ticker])
}

/**
 * 캐시 정보 조회
 */
export function getCacheInfo(): {
  exists: boolean
  isValid: boolean
  count: number
  updatedAt: string | null
  expiresAt: string | null
} {
  const cache = loadPriceCache()

  if (!cache) {
    return {
      exists: false,
      isValid: false,
      count: 0,
      updatedAt: null,
      expiresAt: null,
    }
  }

  return {
    exists: true,
    isValid: !isCacheExpired(cache),
    count: Object.keys(cache.data).length,
    updatedAt: cache.updatedAt,
    expiresAt: cache.expiresAt,
  }
}

export default {
  loadPriceCache,
  savePriceCache,
  updatePriceCache,
  clearPriceCache,
  isCacheExpired,
  isCacheValid,
  getCachedPrice,
  getMissingTickers,
  getCacheInfo,
}
