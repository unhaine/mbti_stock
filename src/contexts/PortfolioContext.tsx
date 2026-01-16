import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext.tsx'
import { supabase } from '../lib/supabaseClient'
import useLocalStorage from '../hooks/useLocalStorage'
import { KEYS } from '../utils/storage'
import toast from 'react-hot-toast'

import { Stock, Transaction, PortfolioStore } from '../types'

interface LocalPortfolio {
  cash: number
  stocks: Array<{
    ticker: string
    name: string
    shares: number
    avgPrice: number
  }>
}

interface LocalTransaction extends Transaction {
  id: string
}

interface Holding {
  id: string
  portfolio_id: string
  ticker: string
  quantity: number
  avg_price: number
  created_at: string
}

interface Portfolio {
  id: string
  user_id: string
  cash_balance: number
  total_assets: number
  created_at: string
}

interface PortfolioContextType {
  portfolioStore: PortfolioStore
  setPortfolioStore: (newState: PortfolioStore) => void
  buyStock: (stock: Stock, quantity: number, price: number) => Promise<boolean>
  sellStock: (stock: Stock, quantity: number, price: number) => Promise<boolean>
  transactions: Transaction[]
  isLoading: boolean
  refresh: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export function usePortfolioContext() {
  const context = useContext(PortfolioContext)
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider')
  }
  return context
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  // 로컬 스토리지 Fallback
  const [localPortfolio, setLocalPortfolio] = useLocalStorage<LocalPortfolio>(KEYS.PORTFOLIO, {
    cash: 10000000,
    stocks: [],
  })

  const [localTransactions, setLocalTransactions] = useLocalStorage<Transaction[]>(
    'mbti-stock-local-transactions',
    []
  )

  // 서버 상태
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [migrationInProgress, setMigrationInProgress] = useState(false)

  // 데이터 로드
  const fetchPortfolioData = useCallback(async () => {
    if (!user) return

    try {
      setIsLoading(true)
      console.log('[Portfolio] Fetching data for user:', user.id)

      // 1. 포트폴리오 정보
      let { data: pfData, error: pfError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (pfError && pfError.code === 'PGRST116') {
        console.log('[Portfolio] No portfolio found, creating one...')
        const { data: newPf, error: createError } = await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            cash_balance: 10000000,
            total_assets: 10000000,
          })
          .select()
          .single()

        if (createError) throw createError
        pfData = newPf
        pfError = null
      } else if (pfError) {
        throw pfError
      }

      console.log('[Portfolio] Found portfolio:', pfData.id)

      // 2. 보유 종목
      const { data: hData, error: hError } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', pfData.id)

      if (hError) throw hError

      setPortfolio(pfData)
      setHoldings(hData || [])

      // 3. 거래 내역
      const { data: tData, error: tError } = await supabase
        .from('transactions')
        .select('*')
        .eq('portfolio_id', pfData.id)
        .order('executed_at', { ascending: false })
        .limit(20)

      if (!tError) setTransactions(tData || [])

      // 4. 자동 마이그레이션 체크 (한 번만 실행되도록 체크)
      if (
        !migrationInProgress &&
        pfData.cash_balance === 10000000 &&
        (!hData || hData.length === 0) &&
        (localPortfolio.cash !== 10000000 || localPortfolio.stocks.length > 0)
      ) {
        console.log('[Portfolio] Local data found. Migration condition met.')
        // migrateLocalData를 여기서 직접 호출하는 대신 트리거만 설정할 수도 있지만
        // 일단 순환 참조 방지를 위해 migrationInProgress 상우를 먼저 확인합니다.
      }
    } catch (error) {
      console.error('[Portfolio] Critical Error fetching portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, migrationInProgress, localPortfolio.cash, localPortfolio.stocks.length])

  useEffect(() => {
    if (user) {
      fetchPortfolioData()
    } else {
      setPortfolio(null)
      setHoldings([])
      setTransactions([])
    }
  }, [user, fetchPortfolioData])

  const portfolioStore: PortfolioStore = user
    ? {
        cash: portfolio?.cash_balance ?? 10000000,
        stocks: (holdings || []).map((h) => ({
          ticker: h.ticker,
          shares: h.quantity,
          avgPrice: h.avg_price,
        })),
      }
    : localPortfolio || {
        cash: 10000000,
        stocks: [],
      }

  const buyStock = async (stock: Stock, quantity: number, price: number): Promise<boolean> => {
    if (!user) {
      const totalCost = price * quantity
      if (localPortfolio.cash < totalCost) {
        toast.error('현금이 부족합니다.')
        return false
      }

      const newStocks = [...(localPortfolio?.stocks || [])]
      const existingIdx = newStocks.findIndex((s) => s.ticker === stock.ticker)

      if (existingIdx >= 0) {
        const item = newStocks[existingIdx]
        const newShares = item.shares + quantity
        const newAvgPrice = (item.shares * item.avgPrice + totalCost) / newShares
        newStocks[existingIdx] = { ...item, shares: newShares, avgPrice: newAvgPrice }
      } else {
        newStocks.push({
          ticker: stock.ticker,
          name: stock.name,
          shares: quantity,
          avgPrice: price,
        })
      }

      setLocalPortfolio({
        ...localPortfolio,
        cash: localPortfolio.cash - totalCost,
        stocks: newStocks,
      })

      const newTx: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        portfolio_id: 'local',
        ticker: stock.ticker,
        type: 'buy',
        quantity: quantity,
        price: price,
        total_amount: totalCost,
        executed_at: new Date().toISOString(),
      }
      setLocalTransactions([newTx, ...localTransactions])

      toast.success(`${quantity}주 매수 완료!`)
      return true
    }

    try {
      console.log('Starting buy_stock RPC:', { ticker: stock.ticker, quantity, price })
      const { data, error } = await supabase.rpc('buy_stock', {
        p_ticker: stock.ticker,
        p_quantity: quantity,
        p_price: price,
      })

      if (error) {
        console.error('RPC Error:', error)
        throw error
      }

      console.log('RPC Result:', data)
      if (!data?.success) throw new Error(data?.error || '구매 처리 중 서버 오류가 발생했습니다.')

      await fetchPortfolioData()
      toast.success('매수가 체결되었습니다.')
      return true
    } catch (error: any) {
      console.error('Buy error details:', error)
      toast.error(
        error.message === 'Insufficient funds'
          ? '잔액이 부족합니다.'
          : '매수 실패: ' + (error.message || '알 수 없는 오류')
      )
      return false
    }
  }

  const sellStock = async (stock: Stock, quantity: number, price: number): Promise<boolean> => {
    if (!user) {
      const stockIdx = (localPortfolio?.stocks || []).findIndex((s) => s.ticker === stock.ticker)
      if (stockIdx === -1 || (localPortfolio?.stocks || [])[stockIdx].shares < quantity) {
        toast.error('보유 수량이 부족합니다.')
        return false
      }

      const totalRevenue = price * quantity
      const newStocks = [...localPortfolio.stocks]
      const item = newStocks[stockIdx]

      if (item.shares === quantity) {
        newStocks.splice(stockIdx, 1)
      } else {
        newStocks[stockIdx] = { ...item, shares: item.shares - quantity }
      }

      setLocalPortfolio({
        ...localPortfolio,
        cash: localPortfolio.cash + totalRevenue,
        stocks: newStocks,
      })

      const newTx: Transaction = {
        id: Math.random().toString(36).substring(2, 11),
        portfolio_id: 'local',
        ticker: stock.ticker,
        type: 'sell',
        quantity: quantity,
        price: price,
        total_amount: totalRevenue,
        executed_at: new Date().toISOString(),
      }
      setLocalTransactions([newTx, ...localTransactions])

      toast.success(`${quantity}주 매도 완료!`)
      return true
    }

    try {
      console.log('Starting sell_stock RPC:', { ticker: stock.ticker, quantity, price })
      const { data, error } = await supabase.rpc('sell_stock', {
        p_ticker: stock.ticker,
        p_quantity: quantity,
        p_price: price,
      })

      if (error) {
        console.error('RPC Error:', error)
        throw error
      }

      console.log('RPC Result:', data)
      if (!data?.success) throw new Error(data?.error || '판매 처리 중 서버 오류가 발생했습니다.')

      await fetchPortfolioData()
      toast.success('매도가 체결되었습니다.')
      return true
    } catch (error: any) {
      console.error('Sell error details:', error)
      toast.error('매도 실패: ' + (error.message || '알 수 없는 오류'))
      return false
    }
  }

  const setPortfolioStore = (newState: PortfolioStore) => {
    if (!user) {
      setLocalPortfolio(newState as LocalPortfolio)
    } else {
      fetchPortfolioData()
    }
  }

  const migrateLocalData = useCallback(
    async (targetPortfolioId: string) => {
      if (!user || !targetPortfolioId || migrationInProgress) return

      try {
        setMigrationInProgress(true)
        console.log('[Migration] Starting migration to portfolio:', targetPortfolioId)
        toast.loading('로컬 데이터를 서버와 동기화하고 있습니다...', { id: 'migration' })

        // 1. 캐시 동기화
        const { error: pfError } = await supabase
          .from('portfolios')
          .update({ cash_balance: localPortfolio.cash })
          .eq('id', targetPortfolioId)

        if (pfError) throw pfError

        // 2. 주식 보유 현황 동기화
        if (localPortfolio.stocks.length > 0) {
          const holdingsToInsert = localPortfolio.stocks.map((s) => ({
            portfolio_id: targetPortfolioId,
            ticker: s.ticker,
            quantity: s.shares,
            avg_price: s.avgPrice,
          }))

          const { error: hError } = await supabase.from('holdings').insert(holdingsToInsert)
          if (hError) throw hError
        }

        toast.success('로컬 데이터가 계정과 동기화되었습니다!', { id: 'migration' })

        // 마이그레이션이 끝났으면 로컬 데이터 초기화 (선택 사항)
        // setLocalPortfolio({ cash: 10000000, stocks: [] });

        await fetchPortfolioData()
      } catch (error) {
        console.error('[Migration] Failed:', error)
        toast.error('데이터 동기화에 실패했습니다.', { id: 'migration' })
      } finally {
        setMigrationInProgress(false)
      }
    },
    [user, localPortfolio, migrationInProgress, fetchPortfolioData]
  )

  // 초기 마이그레이션 트리거
  useEffect(() => {
    if (
      user &&
      portfolio?.id &&
      !migrationInProgress &&
      portfolio.cash_balance === 10000000 &&
      holdings.length === 0 &&
      (localPortfolio.cash !== 10000000 || localPortfolio.stocks.length > 0)
    ) {
      migrateLocalData(portfolio.id)
    }
  }, [user, portfolio?.id, migrationInProgress, localPortfolio, holdings.length, migrateLocalData])

  const value = {
    portfolioStore,
    setPortfolioStore,
    buyStock,
    sellStock,
    transactions: user ? transactions : localTransactions,
    isLoading,
    refresh: fetchPortfolioData,
  }

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}
