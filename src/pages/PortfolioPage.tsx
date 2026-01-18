import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useMBTI } from '../hooks'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { cn } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import StockDetailBottomSheet from '../components/features/stock/StockDetailBottomSheet'
import PortfolioItem from '../components/features/portfolio/PortfolioItem'
import SortDropdown from '../components/features/portfolio/SortDropdown'
import PullToRefreshWrapper from '../components/common/PullToRefreshWrapper'
import { PortfolioItemSkeleton, SkeletonList } from '../components/common/Skeleton'
import ConfirmModal from '../components/common/ConfirmModal'
import { usePortfolioContext } from '../contexts/PortfolioContext'
import { useStockContext } from '../contexts/StockContext'
import TransactionItem from '../components/features/portfolio/TransactionItem'
import profilesData from '../data/mbti-profiles.json'
// import stocksData from '../data/stocks.json' // Removed
import gamificationData from '../data/gamification.json'
import { Stock } from '../contexts/StockContext'
import { Wallet, TrendingUp, History, FolderOpen } from 'lucide-react'
interface PortfolioItemData {
  ticker: string
  shares: number
  avgPrice: number
  stock: Stock
  currentValue: number
  investedValue: number
  profit: number
  profitPercent: number
}

export default function PortfolioPage() {
  const { user } = useAuth()
  const [storedMBTI] = useMBTI()
  const mbti = storedMBTI || 'INTJ'
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')
  const [sortBy, setSortBy] = useState<'profit' | 'amount' | 'name'>('profit')
  const { stocks: masterStocks, refresh: refreshStocks } = useStockContext()
  const [isLoading, setIsLoading] = useState(true)

  // Roast State
  const [isRoastModalOpen, setIsRoastModalOpen] = useState(false)
  const [roastMessage, setRoastMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const mbtiProfile = useMemo(() => {
    return profilesData.find((p) => p.id === mbti) || profilesData[0]
  }, [mbti])

  const { portfolioStore, setPortfolioStore, transactions, refresh } = usePortfolioContext()

  // 가상 포트폴리오 초기화 (로그인하지 않은 유저 전용)
  useEffect(() => {
    if (user) return // 로그인 유저는 서버 데이터만 사용
    if (portfolioStore?.stocks && portfolioStore.stocks.length > 0) return
    if (masterStocks.length === 0) return 

    console.log('[PortfolioPage] Initializing virtual portfolio for guest user...')
    const riskLevel: number =
      ({
        'very-low': 0.1,
        low: 0.3,
        'low-medium': 0.4,
        medium: 0.5,
        'medium-high': 0.7,
        high: 0.9,
      } as any)[mbtiProfile.riskTolerance] || 0.5

    const suitableStocks = masterStocks.filter((s) => {
      if (riskLevel < 0.4) return s.volatility === 'low' || s.volatility === 'medium'
      if (riskLevel > 0.7) return s.volatility === 'high' || s.volatility === 'very-high'
      return true
    })

    const numStocks = Math.floor(Math.random() * 4) + 5
    const initialStocks = []
    const shuffled = [...suitableStocks].sort(() => Math.random() - 0.5)

    for (let i = 0; i < Math.min(numStocks, shuffled.length); i++) {
      const stock = shuffled[i]
      const shares = Math.floor(Math.random() * 50) + 10
      const avgPrice = stock.price * (0.9 + Math.random() * 0.2)
      initialStocks.push({
        ticker: stock.ticker,
        shares,
        avgPrice: Math.round(avgPrice),
      })
    }

    const initialCash = Math.floor(Math.random() * 3000000) + 2000000

    setPortfolioStore({
      ...portfolioStore,
      cash: initialCash,
      stocks: initialStocks,
    })
  }, [user, mbtiProfile, portfolioStore, setPortfolioStore, masterStocks])

  const portfolioData = useMemo(() => {
    const data = (portfolioStore?.stocks || [])
      .map((item: any) => {
        const stock = masterStocks.find((s) => s.ticker === item.ticker)
        if (!stock) return null

        const currentValue = stock.price * item.shares
        const investedValue = item.avgPrice * item.shares
        const profit = currentValue - investedValue
        const profitPercent = investedValue > 0 ? (currentValue / investedValue - 1) * 100 : 0

        return {
          ...item,
          stock,
          currentValue,
          investedValue,
          profit,
          profitPercent: parseFloat(profitPercent.toFixed(2)),
        }
      })
      .filter((item): item is PortfolioItemData => item !== null)

    switch (sortBy) {
      case 'profit':
        return data.sort((a, b) => b.profitPercent - a.profitPercent)
      case 'amount':
        return data.sort((a, b) => b.currentValue - a.currentValue)
      case 'name':
        return data.sort((a, b) => a.stock.name.localeCompare(b.stock.name))
      default:
        return data
    }
  }, [portfolioStore, masterStocks, sortBy])

  const totals = useMemo(() => {
    const cash = portfolioStore?.cash || 0
    let stocksValue = 0
    let investedValue = 0

    portfolioData.forEach(({ stock, shares, avgPrice }) => {
      stocksValue += stock.price * shares
      investedValue += avgPrice * shares
    })

    const total = cash + stocksValue
    const profit = stocksValue - investedValue
    const profitPercent = investedValue > 0 ? (stocksValue / investedValue - 1) * 100 : 0

    return {
      cash,
      stocks: Math.round(stocksValue),
      invested: Math.round(investedValue),
      total: Math.round(total),
      profit: Math.round(profit),
      profitPercent: parseFloat(profitPercent.toFixed(2)),
      stocksPercent: total > 0 ? Math.round((stocksValue / total) * 100) : 0,
    }
  }, [portfolioData, portfolioStore?.cash])

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  const handleRefresh = useCallback(async () => {
    await Promise.all([refresh(), refreshStocks()])
    toast.success('자산 현황이 업데이트되었습니다')
  }, [refresh, refreshStocks])

  const handleRoast = () => {
    const isGood = totals.profit >= 0
    const roasts = isGood ? (gamificationData.roasts as any).good : (gamificationData.roasts as any).bad
    const randIndex = Math.floor(Math.random() * roasts.length)
    const msg = roasts[randIndex].replace('{mbti}', mbti)
    setRoastMessage(msg)
    setIsRoastModalOpen(true)
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col min-h-0 pt-12 pb-14">
        {/* 상단 고정 영역 */}
        <div className="shrink-0 px-4 pt-4 bg-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 페이지 타이틀 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-secondary-500 text-sm">내 자산</span>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={handleRoast} 
                   className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                 >
                   🩺 팩폭진단
                 </button>
                 <span className="font-bold text-secondary-900">{mbti}</span>
               </div>
            </div>

            {/* Hero 금액 */}
            <div className="text-center mb-1">
              <span className="text-4xl font-black text-secondary-900 tracking-tight">
                {formatCurrency(totals.total)}
              </span>
            </div>
            
            {/* 변동 */}
            <div className={cn(
              "text-center text-base font-bold mb-4",
              totals.profit >= 0 ? "text-success" : "text-error"
            )}>
              {totals.profit >= 0 ? '+' : ''}
              {formatCurrency(totals.profit)} ({formatPercent(totals.profitPercent)})
            </div>

            {/* 현금/주식 배분 - 2분할 스타일 */}
            <div className="flex border-y border-secondary-100 divide-x divide-secondary-100 mb-4 bg-gray-50/50">
              {/* 현금 */}
              <div className="flex-1 py-4 px-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-secondary-500" />
                    <span className="text-sm text-secondary-500">현금</span>
                  </div>
                  <span className="font-bold text-secondary-900">{formatCurrency(totals.cash)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary-400">({100 - totals.stocksPercent}%)</span>
                </div>
              </div>

              {/* 주식 */}
              <div className="flex-1 py-4 px-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-secondary-500" />
                    <span className="text-sm text-secondary-500">주식</span>
                  </div>
                  <span className="font-bold text-secondary-900">{formatCurrency(totals.stocks)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary-400">({totals.stocksPercent}%)</span>
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-secondary-100">
              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  'flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center justify-center gap-1.5',
                  activeTab === 'overview'
                    ? 'text-secondary-900 font-bold border-secondary-900'
                    : 'text-secondary-400 border-transparent hover:text-secondary-600'
                )}
              >
                <FolderOpen className="w-4 h-4" />
                보유 종목
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={cn(
                  'flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center justify-center gap-1.5',
                  activeTab === 'history'
                    ? 'text-secondary-900 font-bold border-secondary-900'
                    : 'text-secondary-400 border-transparent hover:text-secondary-600'
                )}
              >
                <History className="w-4 h-4" />
                거래 내역
              </button>
            </div>

            {/* 종목 수 & 정렬 */}
            {activeTab === 'overview' && (
              <div className="flex justify-between items-center py-3 text-xs text-secondary-500">
                <span>{portfolioData.length}개 종목</span>
                <SortDropdown value={sortBy} onChange={(val: any) => setSortBy(val)} />
              </div>
            )}
          </motion.div>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-hidden">
          <PullToRefreshWrapper onRefresh={handleRefresh}>
            <div className="px-4 pb-4">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                  isLoading ? (
                    <SkeletonList count={5} Component={PortfolioItemSkeleton} gap="space-y-0" />
                  ) : (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {portfolioData.map(({ stock, shares, avgPrice }, index) => (
                        <motion.div
                          key={stock.ticker}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <PortfolioItem
                            stock={stock}
                            shares={shares}
                            avgPrice={avgPrice}
                            gradient={mbtiProfile.gradient}
                            onClick={() => handleStockClick(stock)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                ) : transactions.length > 0 ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {transactions.map((t: any) => (
                      <TransactionItem key={t.id} transaction={t} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-secondary-300" />
                    </div>
                    <h3 className="text-secondary-900 font-semibold mb-2">거래 내역이 없어요</h3>
                    <p className="text-secondary-400 text-sm">
                      아직 거래 내역이 없습니다.
                      <br />
                      종목을 매매해보세요!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PullToRefreshWrapper>
        </div>
      </div>

      <FooterNav />

      <StockDetailBottomSheet
        stock={selectedStock}
        mbti={mbti}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isRoastModalOpen}
        onClose={() => setIsRoastModalOpen(false)}
        onConfirm={() => setIsRoastModalOpen(false)}
        title="투자 성향 진단서 🩺"
        description={roastMessage}
        icon={totals.profit >= 0 ? '🎉' : '🚑'}
        confirmLabel="인정합니다"
        cancelLabel="반박불가"
      />
    </div>
  )
}
