/**
 * 주식 시세 API 훅
 * 공공데이터포털 주식시세 데이터를 React 컴포넌트에서 쉽게 사용
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getStockPrice,
  getMultipleStockPrices,
  searchStockByName,
  type ParsedStockPrice,
} from '../services/stockPrice'

interface UseStockPriceOptions {
  autoFetch?: boolean
}

/**
 * 단일 종목 시세 조회 훅
 */
export function useStockPrice(
  ticker: string | null,
  options: UseStockPriceOptions = { autoFetch: true }
) {
  const [data, setData] = useState<ParsedStockPrice | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPrice = useCallback(async () => {
    if (!ticker) return

    setLoading(true)
    setError(null)

    try {
      const result = await getStockPrice(ticker)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stock price'))
    } finally {
      setLoading(false)
    }
  }, [ticker])

  useEffect(() => {
    if (options.autoFetch && ticker) {
      fetchPrice()
    }
  }, [ticker, options.autoFetch, fetchPrice])

  return { data, loading, error, refetch: fetchPrice }
}

/**
 * 여러 종목 시세 조회 훅
 */
export function useMultipleStockPrices(
  tickers: string[],
  options: UseStockPriceOptions = { autoFetch: true }
) {
  const [data, setData] = useState<Map<string, ParsedStockPrice>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPrices = useCallback(async () => {
    if (tickers.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const result = await getMultipleStockPrices(tickers)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stock prices'))
    } finally {
      setLoading(false)
    }
  }, [tickers])

  useEffect(() => {
    if (options.autoFetch && tickers.length > 0) {
      fetchPrices()
    }
  }, [tickers, options.autoFetch, fetchPrices])

  return { data, loading, error, refetch: fetchPrices }
}

/**
 * 종목 검색 훅
 */
export function useStockSearch() {
  const [results, setResults] = useState<ParsedStockPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await searchStockByName(query)
      setResults(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search stocks'))
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
  }, [])

  return { results, loading, error, search, clear }
}
