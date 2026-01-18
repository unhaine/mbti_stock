/**
 * 재무제표 API 훅
 * OpenDART 재무데이터를 React 컴포넌트에서 쉽게 사용
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getSimpleFinancials,
  getMultipleFinancials,
  type FinancialRatios,
} from '../services/financial'

interface UseFinancialsOptions {
  autoFetch?: boolean
  year?: string
}

/**
 * 단일 종목 재무정보 조회 훅
 */
export function useFinancials(
  ticker: string | null,
  options: UseFinancialsOptions = { autoFetch: true }
) {
  const [data, setData] = useState<FinancialRatios | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchFinancials = useCallback(async () => {
    if (!ticker) return

    setLoading(true)
    setError(null)

    try {
      const result = await getSimpleFinancials(ticker, options.year)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch financials'))
    } finally {
      setLoading(false)
    }
  }, [ticker, options.year])

  useEffect(() => {
    if (options.autoFetch && ticker) {
      fetchFinancials()
    }
  }, [ticker, options.autoFetch, fetchFinancials])

  return { data, loading, error, refetch: fetchFinancials }
}

/**
 * 여러 종목 재무정보 조회 훅
 */
export function useMultipleFinancials(
  tickers: string[],
  options: UseFinancialsOptions = { autoFetch: true }
) {
  const [data, setData] = useState<Map<string, FinancialRatios>>(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchFinancials = useCallback(async () => {
    if (tickers.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const result = await getMultipleFinancials(tickers, options.year)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch financials'))
    } finally {
      setLoading(false)
    }
  }, [tickers, options.year])

  useEffect(() => {
    if (options.autoFetch && tickers.length > 0) {
      fetchFinancials()
    }
  }, [tickers, options.autoFetch, fetchFinancials])

  return { data, loading, error, refetch: fetchFinancials }
}

/**
 * 재무비율 포맷팅 헬퍼
 */
export function formatFinancialValue(value: number, type: 'currency' | 'percent' | 'ratio'): string {
  switch (type) {
    case 'currency':
      if (value >= 1_000_000_000_000) {
        return `${(value / 1_000_000_000_000).toFixed(1)}조`
      } else if (value >= 100_000_000) {
        return `${(value / 100_000_000).toFixed(0)}억`
      } else if (value >= 10_000) {
        return `${(value / 10_000).toFixed(0)}만`
      }
      return value.toLocaleString()

    case 'percent':
      return `${value.toFixed(2)}%`

    case 'ratio':
      return value.toFixed(2)

    default:
      return value.toString()
  }
}
