import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMBTI } from '../hooks'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { getChangeColor, getChangeArrow, cn, randomChoice } from '../utils/helpers'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import Card from '../components/common/Card'
import CircularProgress from '../components/common/CircularProgress'
import StockDetailModal from '../components/features/StockDetailModal'
import PortfolioItem from '../components/features/PortfolioItem'

// JSON 데이터
import profilesData from '../data/mbti-profiles.json'
import stocksData from '../data/stocks.json'

export default function PortfolioPage() {
  const [storedMBTI] = useMBTI()
  const mbti = storedMBTI || 'INTJ'
  const [selectedStock, setSelectedStock] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // overview | holdings | history

  // MBTI 프로필
  const mbtiProfile = useMemo(() => {
    return profilesData.find((p) => p.id === mbti) || profilesData[0]
  }, [mbti])

  // 가상 포트폴리오 데이터 생성
  const portfolioData = useMemo(() => {
    // 랜덤 보유 종목 생성 (MBTI 성향 반영)
    const riskLevel =
      {
        'very-low': 0.1,
        low: 0.3,
        'low-medium': 0.4,
        medium: 0.5,
        'medium-high': 0.7,
        high: 0.9,
      }[mbtiProfile.riskTolerance] || 0.5

    // 성향에 맞는 종목 필터링
    const suitableStocks = stocksData.filter((s) => {
      if (riskLevel < 0.4) return s.volatility === 'low' || s.volatility === 'medium'
      if (riskLevel > 0.7) return s.volatility === 'high' || s.volatility === 'very-high'
      return true
    })

    // 랜덤 종목 선택 (5~8개)
    const numStocks = Math.floor(Math.random() * 4) + 5
    const selectedStocks = []
    const shuffled = [...suitableStocks].sort(() => Math.random() - 0.5)

    for (let i = 0; i < Math.min(numStocks, shuffled.length); i++) {
      const stock = shuffled[i]
      const shares = Math.floor(Math.random() * 50) + 10
      const avgPrice = stock.price * (0.9 + Math.random() * 0.2) // 현재가의 ±10%
      selectedStocks.push({
        stock,
        shares,
        avgPrice: Math.round(avgPrice),
      })
    }

    return selectedStocks
  }, [mbtiProfile])

  // 총자산 계산
  const totals = useMemo(() => {
    const cash = Math.floor(Math.random() * 3000000) + 2000000
    let stocks = 0
    let invested = 0

    portfolioData.forEach(({ stock, shares, avgPrice }) => {
      stocks += stock.price * shares
      invested += avgPrice * shares
    })

    const total = cash + stocks
    const profit = stocks - invested
    const profitPercent = invested > 0 ? (stocks / invested - 1) * 100 : 0

    return {
      cash,
      stocks: Math.round(stocks),
      invested: Math.round(invested),
      total: Math.round(total),
      profit: Math.round(profit),
      profitPercent: parseFloat(profitPercent.toFixed(2)),
      stocksPercent: Math.round((stocks / total) * 100),
    }
  }, [portfolioData])

  const handleStockClick = (stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  return (
    <div className="h-screen bg-dark-900 flex flex-col overflow-hidden">
      <Header />

      {/* 메인 콘텐츠 영역: 고정 + 스크롤 */}
      <div className="flex-1 flex flex-col min-h-0 pt-14 pb-20">
        {/* 1. 상단 고정 영역 (스크롤 안됨) */}
        <div className="shrink-0 px-4 pt-2 bg-dark-900 z-10 shadow-sm shadow-dark-900/50 pb-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 페이지 타이틀 */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-dark-50">내 자산</h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mbtiProfile.emoji}</span>
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

                <div className="relative z-10 shrink-0">
                  <CircularProgress percentage={totals.stocksPercent} size={64} strokeWidth={6}>
                    <div className="text-center leading-none">
                      <p className="text-sm font-bold text-dark-50">{totals.stocksPercent}%</p>
                    </div>
                  </CircularProgress>
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
            <div className="flex gap-2 mb-2 p-1 bg-secondary-100 rounded-xl border border-dark-600/50">
              {[
                { id: 'overview', label: '보유 종목' },
                { id: 'history', label: '거래 내역' },
              ].map((tab) => (
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
              <div className="flex justify-between items-center px-1 mb-2 mt-4 border-b border-dark-600 pb-2">
                <h2 className="text-lg font-bold text-dark-50 flex items-center gap-2">
                  <span>📊</span> 보유 종목
                </h2>
                <span className="text-dark-200 text-xs bg-white px-2 py-1 rounded-full border border-dark-600 font-medium">
                  {portfolioData.length}개
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* 2. 스크롤 영역 (리스트) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 pt-2"
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
            ) : (
              <motion.div
                key="history"
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
