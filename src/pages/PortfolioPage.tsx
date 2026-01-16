import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useMBTI } from '../hooks'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { getChangeArrow, cn } from '../utils/helpers'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import Card from '../components/common/Card'
import StockDetailModal from '../components/features/StockDetailModal'
import PortfolioItem from '../components/features/PortfolioItem'
import SortDropdown from '../components/features/SortDropdown'
import PullToRefreshWrapper from '../components/common/PullToRefreshWrapper'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { PortfolioItemSkeleton, SkeletonList } from '../components/common/Skeleton'
import { usePortfolioContext } from '../contexts/PortfolioContext'
import { useStockContext } from '../contexts/StockContext'
import TransactionItem from '../components/features/TransactionItem'

// JSON 데이터
import profilesData from '../data/mbti-profiles.json'
import stocksData from '../data/stocks.json'

import { Stock } from '../contexts/StockContext'

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
  const [storedMBTI] = useMBTI()
  const mbti = storedMBTI || 'INTJ'
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')
  const [sortBy, setSortBy] = useState<'profit' | 'amount' | 'name'>('profit')
  const { stocks: masterStocks, refresh: refreshStocks } = useStockContext()
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // MBTI 프로필
  const mbtiProfile = useMemo(() => {
    return profilesData.find((p) => p.id === mbti) || profilesData[0]
  }, [mbti])

  // 공통 포트폴리오 훅 사용
  const { portfolioStore, setPortfolioStore, transactions, refresh } = usePortfolioContext()

  // 가상 포트폴리오 데이터 초기화 (내부에 데이터가 없을 때만)
  useEffect(() => {
    if (portfolioStore?.stocks && portfolioStore.stocks.length > 0) return

    // 성향에 맞는 종목 필터링 및 생성
    const riskLevel: number =
      (
        {
          'very-low': 0.1,
          low: 0.3,
          'low-medium': 0.4,
          medium: 0.5,
          'medium-high': 0.7,
          high: 0.9,
        } as any
      )[mbtiProfile.riskTolerance] || 0.5

    const suitableStocks = (stocksData as any[]).filter((s) => {
      const riskLevelVal = riskLevel
      if (riskLevelVal < 0.4) return s.volatility === 'low' || s.volatility === 'medium'
      if (riskLevelVal > 0.7) return s.volatility === 'high' || s.volatility === 'very-high'
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
  }, [mbtiProfile, portfolioStore, setPortfolioStore, masterStocks])

  // 로컬 렌더링용 데이터 변환 (stocksData와 매칭)
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

    // 정렬 적용
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

  // 총자산 계산
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

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    await Promise.all([refresh(), refreshStocks()])
    toast.success('자산 현황이 업데이트되었습니다')
  }, [refresh, refreshStocks])

  return (
    <div className="h-screen bg-dark-900 flex flex-col overflow-hidden">
      <Header />

      {/* 메인 콘텐츠 영역: 고정 + 스크롤 */}
      <div className="flex-1 flex flex-col min-h-0 pt-14 pb-20">
        {/* 1. 상단 고정 영역 (스크롤 안됨) */}
        <div className="shrink-0 px-4 pt-2 bg-dark-900 z-10 shadow-sm shadow-dark-900/50 pb-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 페이지 타이틀 */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-lg font-bold text-dark-50">내 자산</h1>
              <div className="flex items-center gap-1">
                <span className="text-xl">{mbtiProfile.emoji}</span>
                <span className="text-primary-600 font-bold">{mbti}</span>
              </div>
            </div>

            {/* 자산 등 리뉴얼 레이아웃 */}
            <div className="flex gap-2 mb-4 h-32">
              {/* 좌측: 총 자산 & 차트 (가로 배치) */}
              <Card
                variant="glass"
                className="flex-[1.6] relative overflow-hidden flex flex-row items-center p-3 gap-3"
              >
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    background: `linear-gradient(135deg, ${mbtiProfile.gradient[0]} 0%, ${mbtiProfile.gradient[1]} 100%)`,
                  }}
                />

                <div className="relative z-10 shrink-0 w-[86px] h-[86px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '주식', value: totals.stocks },
                          { name: '현금', value: totals.cash },
                        ]}
                        innerRadius={30}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={mbtiProfile.gradient[0]} />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[10px] font-black text-dark-50">{totals.stocksPercent}%</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col justify-center min-w-0">
                  <p className="text-dark-300 text-[10px] font-medium mb-0.5">총 자산</p>
                  <p className="text-base font-bold text-dark-50 tracking-tight leading-tight mb-1 truncate">
                    {formatCurrency(totals.total)}
                  </p>
                  <div
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/50 w-fit',
                      totals.profit >= 0 ? 'text-accent-bull' : 'text-accent-bear'
                    )}
                  >
                    {getChangeArrow(totals.profit)}
                    {formatCurrency(Math.abs(totals.profit), { suffix: '' })}
                    <span className="opacity-80">({formatPercent(totals.profitPercent)})</span>
                  </div>
                </div>
              </Card>

              {/* 우측: 현금/주식 분할 */}
              <div className="flex-1 flex flex-col gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 bg-white rounded-xl px-3 py-2 border border-dark-600 shadow-sm flex flex-col justify-between min-w-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">💵</span>
                      <span className="text-dark-300 text-[10px] font-medium">현금 자산</span>
                    </div>
                    <span className="text-dark-400 text-[9px] bg-secondary-50 px-1.5 py-0.5 rounded">
                      {100 - totals.stocksPercent}%
                    </span>
                  </div>
                  <p className="text-dark-50 font-bold text-xs truncate text-right mt-1">
                    {formatCurrency(totals.cash)}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 bg-white rounded-xl px-3 py-2 border border-dark-600 shadow-sm flex flex-col justify-between min-w-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <span className="text-sm">📈</span>
                      <span className="text-dark-300 text-[10px] font-medium">주식 자산</span>
                    </div>
                    <span className="text-dark-400 text-[9px] bg-secondary-50 px-1.5 py-0.5 rounded">
                      {totals.stocksPercent}%
                    </span>
                  </div>
                  <p className="text-dark-50 font-bold text-xs truncate text-right mt-1">
                    {formatCurrency(totals.stocks)}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-1 mb-2 bg-secondary-100 rounded-xl border border-dark-600/50">
              {(
                [
                  { id: 'overview', label: '보유 종목' },
                  { id: 'history', label: '거래 내역' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-white text-dark-50 shadow-sm font-bold'
                      : 'text-dark-300 hover:text-dark-50'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 리스트 헤더 (보유 종목일 때만) */}
            {activeTab === 'overview' && (
              <div className="flex justify-between items-center px-1 mb-2 mt-3 border-b border-dark-600 pb-2">
                <h2 className="text-md font-bold text-dark-50 flex items-center gap-2">
                  <span>📊</span> 보유 종목
                  <span className="text-dark-300 text-xs bg-white px-2 py-0.5 rounded-full border border-dark-600 font-medium">
                    {portfolioData.length}개
                  </span>
                </h2>
                <SortDropdown value={sortBy} onChange={(val: any) => setSortBy(val)} />
              </div>
            )}
          </motion.div>
        </div>

        {/* 2. 스크롤 영역 (리스트) */}
        <div className="flex-1 overflow-hidden">
          <PullToRefreshWrapper onRefresh={handleRefresh}>
            <div className="px-4 pb-4 pt-2">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                  isLoading ? (
                    <SkeletonList count={5} Component={PortfolioItemSkeleton} gap="space-y-2" />
                  ) : (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      {portfolioData.map(({ stock, shares, avgPrice }, index) => (
                        <motion.div
                          key={stock.ticker}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
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
                    className="space-y-2"
                  >
                    {transactions.map((t: any) => (
                      <TransactionItem key={t.id} transaction={t} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-empty"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center py-20"
                  >
                    <div className="text-5xl mb-4 grayscale opacity-50">📝</div>
                    <h3 className="text-dark-50 font-semibold mb-2">거래 내역</h3>
                    <p className="text-dark-400 text-sm">
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

      {/* 종목 상세 모달 */}
      <StockDetailModal
        stock={selectedStock}
        mbti={mbti}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
