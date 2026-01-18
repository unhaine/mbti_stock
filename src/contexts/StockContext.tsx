import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import { syncStocksWithPrices } from '../services/stockPriceSync'
import toast from 'react-hot-toast'

import { Stock } from '../types'
export type { Stock }

interface StockContextType {
  stocks: Stock[]
  isLoading: boolean
  isSyncingPrices: boolean
  lastUpdated: Date
  priceLastSynced: Date | null
  refresh: () => Promise<void>
  refreshPrices: (forceRefresh?: boolean) => Promise<void>
  getStockByTicker: (ticker: string) => Stock | undefined
}

const StockContext = createContext<StockContextType | undefined>(undefined)

export function useStockContext() {
  const context = useContext(StockContext)
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider')
  }
  return context
}

export function StockProvider({ children }: { children: ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncingPrices, setIsSyncingPrices] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [priceLastSynced, setPriceLastSynced] = useState<Date | null>(null)

  // 기본 종목 데이터 로드 (Supabase REST API 직접 호출)
  const fetchStocks = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      console.log('Fetching stocks from Supabase (REST API)...')
      
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      const response = await fetch(`${supabaseUrl}/rest/v1/stocks?order=name.asc`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        signal: signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Fetch successful, received ${data?.length} stocks`)

      let baseStocks: Stock[]

      if (data && data.length > 0) {
        // DB 데이터가 있으면 매핑 (실시간 시세 필드 포함)
        baseStocks = data.map((s: any) => ({
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          marketCap: s.market_cap || s.marketCap,
          price: Number(s.price),
          change: Number(s.change),
          changePercent: Number(s.change_percent || s.changePercent),
          volatility: s.volatility,
          dividendYield: Number(s.dividend_yield || s.dividendYield),
          metaphors: s.metaphors,
          tags: s.tags,
          // DB에서 가져온 시세 필드를 live* 속성에 매핑
          livePrice: Number(s.price),
          liveChange: Number(s.change),
          liveChangePercent: Number(s.change_percent || s.changePercent),
          liveVolume: s.volume ? Number(s.volume) : undefined,
          liveHigh: s.high_price ? Number(s.high_price) : undefined,
          liveLow: s.low_price ? Number(s.low_price) : undefined,
          liveOpen: s.open_price ? Number(s.open_price) : undefined,
          priceUpdatedAt: s.updated_at || s.created_at,
          baseDate: s.last_sync_date,
          isLiveData: !!s.last_sync_date,
        }))
        

      } else {
        console.warn('DB stocks table is empty. No data will be shown.')
        baseStocks = []
      }

      setStocks(baseStocks)
      setLastUpdated(new Date())
      setPriceLastSynced(new Date()) // DB 데이터가 최신이라고 가정
    } catch (error: any) {
      // AbortError는 정상적인 취소이므로 무시
      if (error?.name === 'AbortError') {
        console.log('Fetch was aborted (this is normal during cleanup)')
        return
      }
      console.error('Failed to fetch stocks from DB:', error)
      
      // 폴백: 빈 배열 혹은 토스트 에러 메시지
      // stocks.json 삭제됨에 따라 폴백 제거
      toast.error('종목 정보를 불러오지 못했습니다.')
      setStocks([]) 
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 시세 동기화 (이제 DB 동기화 스크립트가 담당하므로 클라이언트에서는 수동 새로고침용으로만 남김)
  const syncPricesForStocks = async (stockList: Stock[], forceRefresh = false) => {
    // DB 중심 구조로 변경함에 따라 클라이언트 직접 호출은 최소화
    if (!forceRefresh) return
    
    try {
      setIsSyncingPrices(true)
      const syncedStocks = await syncStocksWithPrices(stockList, { forceRefresh })
      setStocks(syncedStocks)
      setPriceLastSynced(new Date())
    } catch (error) {
      console.error('Failed to sync prices:', error)
    } finally {
      setIsSyncingPrices(false)
    }
  }

  // 시세만 새로고침 (수동)
  const refreshPrices = useCallback(
    async (forceRefresh = false) => {
      await syncPricesForStocks(stocks, forceRefresh)
    },
    [stocks]
  )

  // 초기 로드
  useEffect(() => {
    const abortController = new AbortController()
    fetchStocks(abortController.signal)
    
    return () => {
      abortController.abort()
    }
  }, [fetchStocks])

  // 실시간 구독 (Supabase)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stocks',
        },
        (payload: any) => {
          setStocks((prev) =>
            prev.map((s: Stock) => {
              if (s.ticker === payload.new.ticker) {
                return {
                  ...s,
                  price: Number(payload.new.price),
                  change: Number(payload.new.change),
                  changePercent: Number(payload.new.change_percent),
                  // 실시간 시세 및 지표 필드 동기화 (DB snake_case -> App camelCase)
                  livePrice: Number(payload.new.price),
                  liveChange: Number(payload.new.change),
                  liveChangePercent: Number(payload.new.change_percent),
                  liveVolume: Number(payload.new.volume),
                  liveHigh: Number(payload.new.high_price),
                  liveLow: Number(payload.new.low_price),
                  liveOpen: Number(payload.new.open_price),
                  marketCap: payload.new.market_cap ?? s.marketCap,
                  isLiveData: true,
                  priceUpdatedAt: new Date().toISOString(),
                }
              }
              return s
            })
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const value = {
    stocks,
    isLoading,
    isSyncingPrices,
    lastUpdated,
    priceLastSynced,
    refresh: fetchStocks,
    refreshPrices,
    getStockByTicker: (ticker: string) => stocks.find((s) => s.ticker === ticker),
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}
