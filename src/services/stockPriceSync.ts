/**
 * 주식 시세 동기화 서비스
 * API 호출과 캐싱을 통합하여 효율적인 시세 업데이트 제공
 */

import { getMultipleStockPrices, type ParsedStockPrice } from './stockPrice'
import {
  loadPriceCache,
  savePriceCache,
  isCacheExpired,
  getMissingTickers,
  type CachedStockPrice,
} from './stockPriceCache'
import type { Stock } from '../types'

/**
 * API 응답을 캐시 형식으로 변환
 */
function parsedPriceToCached(parsed: ParsedStockPrice): CachedStockPrice {
  return {
    closePrice: parsed.closePrice,
    change: parsed.change,
    changePercent: parsed.changePercent,
    volume: parsed.volume,
    highPrice: parsed.highPrice,
    lowPrice: parsed.lowPrice,
    openPrice: parsed.openPrice,
    marketCap: parsed.marketCap,
    baseDate: parsed.baseDate,
  }
}

/**
 * 캐시 데이터를 Stock에 적용
 */
export function applyPriceToStock(stock: Stock, cached: CachedStockPrice): Stock {
  return {
    ...stock,
    livePrice: cached.closePrice,
    liveChange: cached.change,
    liveChangePercent: cached.changePercent,
    liveVolume: cached.volume,
    liveHigh: cached.highPrice,
    liveLow: cached.lowPrice,
    liveOpen: cached.openPrice,
    marketCap: cached.marketCap ?? stock.marketCap,
    baseDate: cached.baseDate,
    isLiveData: true,
    priceUpdatedAt: new Date().toISOString(),
  }
}

/**
 * 여러 종목의 시세를 동기화
 * - 캐시가 유효하면 캐시 사용
 * - 캐시에 없거나 만료된 종목만 API 호출
 */
export async function syncStockPrices(
  tickers: string[],
  options: {
    forceRefresh?: boolean
    onProgress?: (current: number, total: number) => void
  } = {}
): Promise<Map<string, CachedStockPrice>> {
  const { forceRefresh = false, onProgress } = options
  const result = new Map<string, CachedStockPrice>()

  // 1. 기존 캐시 확인
  const cache = loadPriceCache()
  const cacheExpired = !cache || isCacheExpired(cache)

  // 2. 캐시에서 유효한 데이터 로드
  if (!forceRefresh && cache && !cacheExpired) {
    for (const ticker of tickers) {
      if (cache.data[ticker]) {
        result.set(ticker, cache.data[ticker])
      }
    }

    // 모든 종목이 캐시에 있으면 바로 반환
    if (result.size === tickers.length) {
      console.log(`All ${tickers.length} prices loaded from cache`)
      return result
    }
  }

  // 3. 캐시에 없는 종목 목록
  const missingTickers = forceRefresh
    ? tickers
    : getMissingTickers(tickers)

  if (missingTickers.length === 0) {
    return result
  }

  console.log(`Fetching ${missingTickers.length} stock prices from API...`)

  // 4. API 호출 (배치 처리)
  try {
    const apiPrices = await getMultipleStockPrices(missingTickers)

    // 5. 결과 병합
    const newCacheData: Record<string, CachedStockPrice> = {}

    apiPrices.forEach((parsed, ticker) => {
      const cached = parsedPriceToCached(parsed)
      result.set(ticker, cached)
      newCacheData[ticker] = cached
    })

    // 6. 캐시 업데이트
    const mergedData = {
      ...(cache?.data || {}),
      ...newCacheData,
    }
    savePriceCache(mergedData)

    console.log(`Synced ${apiPrices.size} prices, ${Object.keys(mergedData).length} total in cache`)
    onProgress?.(tickers.length, tickers.length)

    return result
  } catch (error) {
    console.error('Failed to sync stock prices:', error)
    // API 실패 시 캐시된 데이터라도 반환
    return result
  }
}

/**
 * Stock 배열에 실시간 가격 적용
 */
export async function syncStocksWithPrices(
  stocks: Stock[],
  options: {
    forceRefresh?: boolean
    onProgress?: (current: number, total: number) => void
  } = {}
): Promise<Stock[]> {
  const tickers = stocks.map((s) => s.ticker)

  // 시세 동기화
  const prices = await syncStockPrices(tickers, options)

  // Stock에 가격 적용
  return stocks.map((stock) => {
    const cached = prices.get(stock.ticker)
    if (cached) {
      return applyPriceToStock(stock, cached)
    }
    // 캐시에 없으면 원본 반환 (더미 데이터)
    return { ...stock, isLiveData: false }
  })
}

/**
 * 단일 종목 시세 동기화
 */
export async function syncSingleStock(
  stock: Stock,
  forceRefresh = false
): Promise<Stock> {
  const prices = await syncStockPrices([stock.ticker], { forceRefresh })
  const cached = prices.get(stock.ticker)

  if (cached) {
    return applyPriceToStock(stock, cached)
  }
  return { ...stock, isLiveData: false }
}

export default {
  syncStockPrices,
  syncStocksWithPrices,
  syncSingleStock,
  applyPriceToStock,
}
