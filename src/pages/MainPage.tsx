import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMBTI, usePortfolio } from '../hooks'
import { getChangeColor, getChangeArrow, cn, randomChoice } from '../utils/helpers'
import { formatCurrency, formatPercent } from '../utils/formatters'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import Card from '../components/common/Card'
import StockDetailModal from '../components/features/StockDetailModal'
import PullToRefreshWrapper from '../components/common/PullToRefreshWrapper'
import StockCard from '../components/features/StockCard'
import StockSearch from '../components/features/StockSearch'
import { StockCardSkeleton, SkeletonList } from '../components/common/Skeleton'
import { useStockContext, Stock } from '../contexts/StockContext'

// JSON 데이터 임포트
import profilesData from '../data/mbti-profiles.json'
import themesData from '../data/themes.json'
import commentsData from '../data/mbti-comments.json'

interface MarketIcon {
  icon: string
  text: string
  color: string
}

export default function MainPage() {
  const [storedMBTI] = useMBTI()
  const mbti = storedMBTI || 'INTJ'
  const [selectedTheme, setSelectedTheme] = useState(0)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { stocks: masterStocks, refresh: refreshStocks } = useStockContext()
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const stockListRef = useRef<HTMLDivElement>(null)

  // 시장 상황 (세션 동안 유지)
  const [marketCondition, setMarketCondition] = useState<'bull' | 'neutral' | 'bear'>(() => {
    const rand = Math.random()
    if (rand < 0.4) return 'bull'
    if (rand < 0.7) return 'neutral'
    return 'bear'
  })

  // MBTI 프로필 찾기
  const mbtiProfile = useMemo(() => {
    return profilesData.find((p) => p.id === mbti) || profilesData[0]
  }, [mbti])

  // 공통 포트폴리오 훅 사용
  const [portfolioStore, setPortfolioStore] = usePortfolio()

  // 포트폴리오 데이터 계산
  const portfolio = useMemo(() => {
    const cash = portfolioStore?.cash || 10000000
    const stocks = portfolioStore?.stocks || []

    // 현재 시장가 기준으로 총 가치 계산
    let totalStockValue = 0
    let totalInvested = 0

    stocks.forEach((item: any) => {
      const currentStock = masterStocks.find((s) => s.ticker === item.ticker)
      if (currentStock) {
        totalStockValue += currentStock.price * item.shares
        totalInvested += item.avgPrice * item.shares
      }
    })

    const totalValue = cash + totalStockValue
    const profit = totalStockValue - totalInvested
    const profitPercent = totalInvested > 0 ? (totalStockValue / totalInvested - 1) * 100 : 0

    return {
      totalValue,
      change: profit,
      changePercent: parseFloat(profitPercent.toFixed(2)),
    }
  }, [portfolioStore, masterStocks])

  // MBTI 테마 필터
  const mbtiThemes = useMemo(() => {
    return (themesData as any[]).filter((t) => t.mbti === mbti).slice(0, 5)
  }, [mbti])

  // 현재 선택된 테마
  const currentTheme = mbtiThemes[selectedTheme] || mbtiThemes[0]

  // 테마에 해당하는 종목들 가져오기
  const themeStocks = useMemo(() => {
    if (!currentTheme) return []
    return (currentTheme.stocks as string[])
      .map((ticker) => masterStocks.find((s) => s.ticker === ticker))
      .filter((s): s is Stock => s !== undefined)
      .slice(0, 10)
  }, [currentTheme, masterStocks])

  // MBTI 코멘트 선택
  const mbtiComment = useMemo<string>(() => {
    const comments = (commentsData as any)[mbti]
    if (!comments) return '투자는 신중하게!'
    const conditionComments = comments[marketCondition]
    return (randomChoice(conditionComments) as string) || '오늘도 현명한 투자 되세요!'
  }, [mbti, marketCondition])

  // 새로고침 핸들러
  const handleRefresh = async () => {
    // 1. 시장 상황 변경
    const rand = Math.random()
    const newCondition = rand < 0.4 ? 'bull' : rand < 0.7 ? 'neutral' : 'bear'
    setMarketCondition(newCondition)

    // 2. DB 데이터 새로고침
    await refreshStocks()

    // 2. 포트폴리오 랜덤 변동 (현실감 부여)
    if (portfolioStore && portfolioStore.stocks && portfolioStore.stocks.length > 0) {
      setPortfolioStore({
        ...portfolioStore,
      })
    }

    // 3. 토스트 알림
    const conditionText =
      newCondition === 'bull' ? '📈 상승장' : newCondition === 'bear' ? '📉 하락장' : '📊 보합장'
    toast.success(`시장 상황 업데이트: ${conditionText}`)
  }

  // 종목 클릭 핸들러
  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setIsModalOpen(true)
  }

  // 캐러셀 슬라이드
  const handlePrevTheme = () => {
    if (selectedTheme > 0) setSelectedTheme(selectedTheme - 1)
  }

  const handleNextTheme = () => {
    if (selectedTheme < mbtiThemes.length - 1) setSelectedTheme(selectedTheme + 1)
  }

  // 시장 상황 아이콘
  const marketIcons: Record<'bull' | 'neutral' | 'bear', MarketIcon> = {
    bull: { icon: '📈', text: '상승장', color: 'text-accent-bull' },
    neutral: { icon: '📊', text: '보합장', color: 'text-accent-neutral' },
    bear: { icon: '📉', text: '하락장', color: 'text-accent-bear' },
  }
  const marketIcon = marketIcons[marketCondition]

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      {/* 헤더 - 고정 */}
      <Header />

      {/* 메인 콘텐츠 영역 - 헤더/푸터 사이 */}
      <div className="flex-1 flex flex-col min-h-0 pt-18">
        {/* 고정 영역: 자산 카드 + 리스트 타이틀 */}
        <div className="shrink-0 px-4 z-10 bg-dark-900 pb-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="glass" className="relative overflow-hidden mb-4">
              {/* 배경 그라데이션 */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${mbtiProfile.gradient[0]} 0%, ${mbtiProfile.gradient[1]} 100%)`,
                }}
              />

              <div className="relative z-10">
                {/* MBTI 배지 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mbtiProfile.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-dark-50">{mbti}</span>
                        <span
                          className="px-2 py-0.5 text-xs rounded-full text-dark-50 font-medium border border-dark-600/20"
                          style={{ backgroundColor: `${mbtiProfile.gradient[0]}40` }}
                        >
                          {mbtiProfile.tagline}
                        </span>
                      </div>
                      <p className="text-dark-200 text-xs font-medium">{mbtiProfile.description}</p>
                    </div>
                  </div>
                  <span
                    className={cn('text-xs flex items-center gap-1 font-medium', marketIcon.color)}
                  >
                    {marketIcon.icon} {marketIcon.text}
                  </span>
                </div>

                {/* 총 자산 */}
                <div className="mb-2">
                  <p className="text-dark-300 text-xs font-bold">보유 자산</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-dark-50">
                      {formatCurrency(portfolio.totalValue)}
                    </span>
                    <span
                      className={cn(
                        'text-base font-semibold',
                        getChangeColor(portfolio.changePercent)
                      )}
                    >
                      {getChangeArrow(portfolio.changePercent)}{' '}
                      {formatPercent(portfolio.changePercent)}
                    </span>
                  </div>
                </div>

                {/* MBTI 코멘트 */}
                <div className="p-1.5 rounded-xl bg-white/60 border border-dark-600">
                  <p className="text-xs text-dark-100 leading-relaxed font-medium">
                    💬 {mbtiComment}
                  </p>
                </div>
              </div>
            </Card>

            {/* 검색 */}
            <div className="mb-3">
              <StockSearch
                stocks={masterStocks}
                onSelect={(stock: Stock) => handleStockClick(stock)}
              />
            </div>

            {/* 리스트 헤더 (고정) */}
            <div className="flex items-center justify-between px-1 mb-1">
              <h3 className="text-dark-50 font-bold flex items-center gap-2 text-md">
                <span>📌</span>
                <span>추천 종목 포트폴리오</span>
              </h3>
              <span className="text-xs text-dark-200 bg-white px-2 py-1 rounded-full border border-dark-600 shadow-sm font-medium">
                {themeStocks.length}개 종목
              </span>
            </div>
          </motion.div>
        </div>

        {/* 종목 리스트 - 스크롤 영역 (중앙) */}
        <div className="flex-1 min-h-0 relative">
          <PullToRefreshWrapper onRefresh={handleRefresh}>
            <div ref={stockListRef} className="px-4 py-2 pb-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <SkeletonList count={5} Component={StockCardSkeleton} gap="space-y-1" />
                ) : (
                  <motion.div
                    key={currentTheme?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col"
                  >
                    {themeStocks.map((stock, index) => (
                      <div key={stock.ticker} className="last:mb-0" style={{ marginBottom: '4px' }}>
                        <StockCard
                          stock={stock}
                          index={index}
                          gradient={mbtiProfile.gradient}
                          onClick={() => handleStockClick(stock)}
                          mbti={mbti}
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PullToRefreshWrapper>
        </div>

        {/* 테마 영역 - 하단 고정 (리스트와 겹치지 않음) */}
        <div className="shrink-0 bg-dark-900 border-t border-dark-600/30 z-10 pb-20">
          {/* 캐러셀 */}
          <div className="px-3 py-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-dark-100 flex items-center gap-1">
                <span>✨</span>
                <span>{mbti} 추천 테마</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevTheme}
                disabled={selectedTheme === 0}
                className={cn(
                  'p-2 rounded-full transition-colors shrink-0 ',
                  selectedTheme === 0
                    ? 'text-dark-400 cursor-not-allowed opacity-50'
                    : 'text-dark-400 hover:text-dark-50 hover:bg-white'
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 overflow-hidden">
                <motion.div
                  key={currentTheme?.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className=" rounded-xl p-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentTheme?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-dark-50 text-sm mb-0.5 truncate">
                        {currentTheme?.title}
                      </h3>
                      <p className="text-dark-300 text-xs truncate font-medium">
                        {currentTheme?.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={handleNextTheme}
                disabled={selectedTheme === mbtiThemes.length - 1}
                className={cn(
                  'p-2 rounded-full transition-colors shrink-0 ',
                  selectedTheme === mbtiThemes.length - 1
                    ? 'text-dark-400 cursor-not-allowed opacity-50'
                    : 'text-dark-400 hover:text-dark-50 hover:bg-white'
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex justify-center gap-1">
                {mbtiThemes.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all',
                      i === selectedTheme ? 'bg-primary-500 w-3' : 'bg-dark-400'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 - 고정 */}
      <FooterNav />

      {/* 종목 상세 모달 (전체 화면) */}
      <StockDetailModal
        stock={selectedStock}
        mbti={mbti}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
