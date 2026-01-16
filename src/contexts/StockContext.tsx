import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'
import stocksData from '../data/stocks.json'

import { Stock } from '../types'
export type { Stock }

interface StockContextType {
  stocks: Stock[]
  isLoading: boolean
  lastUpdated: Date
  refresh: () => Promise<void>
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
  const [stocks, setStocks] = useState<Stock[]>(stocksData as Stock[]) // 초기값으로 로컬 데이터 사용
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchStocks = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        // DB 데이터가 있으면 매핑 (JSON 구조와 호환되도록 snake_case -> camelCase)
        const mappedStocks: Stock[] = data.map((s: any) => ({
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          marketCap: s.market_cap,
          price: Number(s.price),
          change: Number(s.change),
          changePercent: Number(s.change_percent),
          volatility: s.volatility,
          dividendYield: Number(s.dividend_yield),
          metaphors: s.metaphors,
          tags: s.tags,
        }))
        setStocks(mappedStocks)
      } else {
        console.warn('DB stocks table is empty. Falling back to local JSON data.')
        setStocks(stocksData as Stock[])
      }
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch stocks from DB:', error)
      setStocks(stocksData as Stock[]) // 에러 발생 시 로컬 데이터로 폴백
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  // 실시간 구독
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
    lastUpdated,
    refresh: fetchStocks,
    getStockByTicker: (ticker: string) => stocks.find((s) => s.ticker === ticker),
  }

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}
