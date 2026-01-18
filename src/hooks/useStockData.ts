/**
 * Supabase 주식 데이터 페칭 훅
 * StockContext에서 분리된 데이터 페칭 로직
 */

import { useState, useCallback } from 'react'
import { Stock } from '../types'

interface FetchStocksResult {
  stocks: Stock[]
  error: string | null
}

interface UseStockDataReturn {
  fetchStocks: (signal?: AbortSignal) => Promise<FetchStocksResult>
  isLoading: boolean
}

/**
 * Supabase에서 주식 데이터를 페칭하는 훅
 * 에러 시 stocks.json으로 폴백
 */
export function useStockData(): UseStockDataReturn {
  const [isLoading, setIsLoading] = useState(false)

  const fetchStocks = useCallback(async (signal?: AbortSignal): Promise<FetchStocksResult> => {
    setIsLoading(true)
    
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(`${supabaseUrl}/rest/v1/stocks?order=name.asc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data && data.length > 0) {
        const mappedStocks: Stock[] = data.map((s: any) => ({
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          marketCap: s.marketCap || s.market_cap,
          
          // 시세 정보 매핑
          price: Number(s.price),
          change: Number(s.change),
          changePercent: Number(s.changePercent || s.change_percent),
          volume: Number(s.volume || 0),
          openPrice: Number(s.open_price || s.price),
          highPrice: Number(s.high_price || s.price),
          lowPrice: Number(s.low_price || s.price),
          
          // 추가 정보
          volatility: s.volatility,
          dividendYield: Number(s.dividendYield || s.dividend_yield),
          lastSyncDate: s.last_sync_date,
          
          metaphors: s.metaphors,
          tags: s.tags,
          recommendation: undefined, // 초기 로딩 시 없음
          
          // AI 관련 필드 기본값
          isLiveData: true
        }))

        return { stocks: mappedStocks, error: null }
      } else {
        console.warn('DB stocks table is empty, using fallback')
        return { stocks: getFallbackStocks(), error: null }
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return { stocks: [], error: null }
      }
      
      console.error('Failed to fetch stocks from DB:', error)
      return { 
        stocks: getFallbackStocks(), 
        error: error.message || 'Failed to fetch stocks' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { fetchStocks, isLoading }
}

/**
 * 폴백 데이터 반환 (빈 배열)
 */
function getFallbackStocks(): Stock[] {
  return []
}

export default useStockData
