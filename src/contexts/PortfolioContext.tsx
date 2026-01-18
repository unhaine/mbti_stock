import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'
import { useAuth } from './AuthContext.tsx'
import useLocalStorage from '../hooks/useLocalStorage'
import { KEYS } from '../utils/storage'
import toast from 'react-hot-toast'
import { logStockBuy } from '../services/analytics'

import { Stock, Transaction, PortfolioStore, Portfolio } from '../types'

// ... (interfaces remain same)

// Supabase REST API Helper
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const apiHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation' // 응답 받기 위해 설정
}

async function fetchRest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...apiHeaders,
      ...options.headers
    }
  })
  
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`)
  }
  
  return response.json()
}

interface LocalPortfolio {
  cash: number
  stocks: Array<{
    ticker: string
    name: string
    shares: number
    avgPrice: number
  }>
}

// LocalTransaction removed

export interface Holding {
  id: string
  portfolio_id: string
  ticker: string
  quantity: number
  avg_price: number
  created_at: string
}

interface PortfolioContextType {
  portfolioStore: PortfolioStore
  setPortfolioStore: (newState: PortfolioStore) => void
  buyStock: (stock: Stock, quantity: number, price: number) => Promise<boolean>
  sellStock: (stock: Stock, quantity: number, price: number) => Promise<boolean>
  transactions: Transaction[]
  holdings: Holding[]
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

  // ... (localTransactions state remains same)
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
      console.log('[Portfolio] Fetching data for user (REST):', user.id)

      // 1. 포트폴리오 정보
      let pfData: Portfolio
      const portQuery = `portfolios?user_id=eq.${user.id}&select=*&limit=1`
      const portfolios = await fetchRest(portQuery)
      
      if (portfolios.length === 0) {
        console.log('[Portfolio] No portfolio found, creating one...')
        const newPf = await fetchRest('portfolios', {
          method: 'POST',
          body: JSON.stringify({
            user_id: user.id,
            cash_balance: 10000000,
            total_assets: 10000000,
          })
        })
        pfData = newPf[0]
      } else {
        pfData = portfolios[0]
      }

      console.log('[Portfolio] Found portfolio:', pfData.id)

      // 2. 보유 종목
      const hData = await fetchRest(`holdings?portfolio_id=eq.${pfData.id}&select=*`)
      
      setPortfolio(pfData)
      setHoldings(hData || [])

      // 3. 거래 내역
      const tData = await fetchRest(`transactions?portfolio_id=eq.${pfData.id}&select=*&order=executed_at.desc&limit=20`)
      setTransactions(tData || [])

      // 4. 자동 마이그레이션 체크
      if (
        !migrationInProgress &&
        pfData.cash_balance === 10000000 &&
        (!hData || hData.length === 0) &&
        (localPortfolio.cash !== 10000000 || localPortfolio.stocks.length > 0)
      ) {
        console.log('[Portfolio] Local data found. Migration condition met.')
      }
    } catch (error) {
      console.error('[Portfolio] Critical Error fetching portfolio:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchPortfolioData()
    } else {
      setPortfolio(null)
      setHoldings([])
      setTransactions([])
    }
  }, [user, fetchPortfolioData])

  const portfolioStore: PortfolioStore = useMemo(() => {
    if (user) {
      return {
        cash: portfolio?.cash_balance ?? 10000000,
        stocks: (holdings || []).map((h) => ({
          ticker: h.ticker,
          shares: h.quantity,
          avgPrice: h.avg_price,
        })),
      }
    }
    return localPortfolio || {
        cash: 10000000,
        stocks: [],
      }
  }, [user, portfolio?.cash_balance, holdings, localPortfolio])

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
      
      // Analytics 로깅 (ML 학습 데이터 - 가장 강한 positive signal!)
      logStockBuy({
        userId: 'local',
        mbti: 'INTJ', // TODO: Get from context
        stockTicker: stock.ticker,
        quantity,
        price
      }).catch(err => console.error('[Analytics] Failed to log buy:', err))
      
      return true
    }

    // PROVEN WORKING LOGIC: REST API
    try {
      console.log('[BuyStock] Step 0: Starting (REST)...', { ticker: stock.ticker, quantity, price })
      const totalCost = price * quantity

      // 1. 내 포트폴리오 찾기
      console.log('[BuyStock] Step 1: Finding user portfolio...')
      const portfolios = await fetchRest(`portfolios?user_id=eq.${user.id}&select=id,cash_balance&limit=1`)
      
      if (portfolios.length === 0) throw new Error('포트폴리오를 찾을 수 없습니다.')
      
      const pf = portfolios[0]
      const pfId = pf.id
      const currentCash = pf.cash_balance

      console.log(`[BuyStock] Portfolio Found: ${pfId}, Cash: ${currentCash}`)

      if (currentCash < totalCost) throw new Error('Insufficient funds')

      // 2. 잔액 차감
      console.log('[BuyStock] Step 2: Deducting cash...')
      await fetchRest(`portfolios?id=eq.${pfId}`, {
         method: 'PATCH',
         body: JSON.stringify({ cash_balance: currentCash - totalCost })
      })

      // 3. 보유 주식 처리
      console.log('[BuyStock] Step 3: Checking holdings...')
      const holdingsData = await fetchRest(`holdings?portfolio_id=eq.${pfId}&ticker=eq.${stock.ticker}&select=*&limit=1`)
      const holding = holdingsData.length > 0 ? holdingsData[0] : null
      
      if (holding) {
        console.log('[BuyStock] Step 3-1: Updating existing holding...')
        const newQuantity = holding.quantity + quantity
        const newAvgPrice = ((holding.quantity * holding.avg_price) + totalCost) / newQuantity
        
        await fetchRest(`holdings?id=eq.${holding.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
             quantity: newQuantity,
             avg_price: newAvgPrice
          })
        })
      } else {
        console.log('[BuyStock] Step 3-2: Creating new holding...')
        await fetchRest('holdings', {
          method: 'POST',
          body: JSON.stringify({
            portfolio_id: pfId,
            ticker: stock.ticker,
            quantity: quantity,
            avg_price: price
          })
        })
      }

      // 4. 거래 내역
      console.log('[BuyStock] Step 4: Recording transaction...')
      await fetchRest('transactions', {
        method: 'POST',
        body: JSON.stringify({
          portfolio_id: pfId,
          ticker: stock.ticker,
          type: 'buy',
          quantity: quantity,
          price: price,
          total_amount: totalCost,
          executed_at: new Date().toISOString()
        })
      })
      
      console.log('[BuyStock] Success! Updating Local State & Refreshing UI...')
      
      // 1. 잔액(Portfolio) 상태 즉시 업데이트
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          cash_balance: currentCash - totalCost
        })
      }

      // 2. 보유 주식(Holdings) 상태 즉시 업데이트
      const newHoldings = [...holdings]
      const targetIndex = newHoldings.findIndex(h => h.ticker === stock.ticker)
      
      if (holding) {
        // 기존 보유: 수량/평단가 갱신
        if (targetIndex !== -1) {
          const newQty = holding.quantity + quantity
          const newAvg = ((holding.quantity * holding.avg_price) + totalCost) / newQty
          
          newHoldings[targetIndex] = {
            ...newHoldings[targetIndex],
            quantity: newQty,
            avg_price: newAvg
          }
        }
      } else {
        // 신규 보유: 목록에 추가
        newHoldings.push({
          id: 'temp-' + Date.now(), // 임시 ID
          portfolio_id: pfId,
          ticker: stock.ticker,
          quantity: quantity,
          avg_price: price,
          created_at: new Date().toISOString()
        })
      }
      setHoldings(newHoldings)

      // 3. 거래 내역(Transactions) 상태 즉시 업데이트
      const newTransaction = {
        id: 'temp-tx-' + Date.now(),
        portfolio_id: pfId,
        ticker: stock.ticker,
        type: 'buy' as const,
        quantity: quantity,
        price: price,
        total_amount: totalCost,
        executed_at: new Date().toISOString()
      }
      setTransactions([newTransaction as Transaction, ...transactions])

      // 4. 백그라운드 데이터 갱신
      fetchPortfolioData().catch(e => console.warn('Background refresh failed:', e))
      
      toast.success('매수가 체결되었습니다.')
      return true
    } catch (error: any) {
      console.error('[BuyStock] Error:', error)
      toast.error('매수 실패: ' + (error.message || '알 수 없는 오류'))
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
      console.log('[SellStock] Starting (REST)...', { ticker: stock.ticker, quantity, price })
      const totalRevenue = price * quantity

      // 1. 포트폴리오 확인
      const portfolios = await fetchRest(`portfolios?user_id=eq.${user.id}&select=id,cash_balance&limit=1`)
      
      if (portfolios.length === 0) throw new Error('포트폴리오를 찾을 수 없습니다.')
      
      const pf = portfolios[0]
      const pfId = pf.id

      // 2. 보유 주식 확인
      const holdingsData = await fetchRest(`holdings?portfolio_id=eq.${pfId}&ticker=eq.${stock.ticker}&select=*&limit=1`)
      const holding = holdingsData.length > 0 ? holdingsData[0] : null
      
      if (!holding || holding.quantity < quantity) {
        throw new Error('보유 수량이 부족합니다.')
      }

      // 3. 보유 수량 차감
      if (holding.quantity === quantity) {
        await fetchRest(`holdings?id=eq.${holding.id}`, { method: 'DELETE' })
      } else {
        await fetchRest(`holdings?id=eq.${holding.id}`, { 
           method: 'PATCH',
           body: JSON.stringify({ quantity: holding.quantity - quantity })
        })
      }

      // 4. 현금 지급
      await fetchRest(`portfolios?id=eq.${pfId}`, {
        method: 'PATCH',
        body: JSON.stringify({ cash_balance: pf.cash_balance + totalRevenue })
      })

      // 5. 거래 내역
      await fetchRest('transactions', {
        method: 'POST',
        body: JSON.stringify({
          portfolio_id: pfId,
          ticker: stock.ticker,
          type: 'sell',
          quantity: quantity,
          price: price,
          total_amount: totalRevenue,
          executed_at: new Date().toISOString()
        })
      })

      console.log('[SellStock] Success! Updating Local State & Refreshing UI...')

      // 1. 잔액 업데이트
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          cash_balance: pf.cash_balance + totalRevenue
        })
      }

      // 2. 보유 주식 업데이트
      let updatedHoldings = [...holdings]
      const holdIdx = updatedHoldings.findIndex(h => h.ticker === stock.ticker)
      
      if (holdIdx !== -1) {
        if (holding.quantity === quantity) {
          // 전량 매도 -> 삭제
          updatedHoldings.splice(holdIdx, 1)
        } else {
          // 부분 매도 -> 수량 차감
          updatedHoldings[holdIdx] = {
            ...updatedHoldings[holdIdx],
            quantity: holding.quantity - quantity
          }
        }
        setHoldings(updatedHoldings)
      }

      // 3. 거래 내역 업데이트
      const newTx = {
        id: 'temp-tx-' + Date.now(),
        portfolio_id: pfId,
        ticker: stock.ticker,
        type: 'sell' as const,
        quantity: quantity,
        price: price,
        total_amount: totalRevenue,
        executed_at: new Date().toISOString()
      }
      setTransactions([newTx as Transaction, ...transactions])

      fetchPortfolioData().catch(e => console.warn('Background refresh failed:', e))
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
        await fetchRest(`portfolios?id=eq.${targetPortfolioId}`, {
          method: 'PATCH',
          body: JSON.stringify({ cash_balance: localPortfolio.cash })
        })

        // 2. 주식 보유 현황 동기화
        if (localPortfolio.stocks.length > 0) {
          const holdingsToInsert = localPortfolio.stocks.map((s) => ({
            portfolio_id: targetPortfolioId,
            ticker: s.ticker,
            quantity: s.shares,
            avg_price: s.avgPrice,
          }))

          await fetchRest('holdings', {
            method: 'POST',
            body: JSON.stringify(holdingsToInsert) // Supabase REST API supports batch insert
          })
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
    holdings,
    isLoading,
    refresh: fetchPortfolioData,
  }

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}
