
import { useState, useMemo, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useMBTI, usePortfolio, useSettings, useSearchStocks, useGamification } from '../hooks'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import StockDetailBottomSheet from '../components/features/stock/StockDetailBottomSheet'
import AssetHeader from '../components/features/portfolio/AssetHeader'
import GamificationSection from '../components/features/gamification/GamificationSection'
import SearchOverlay from '../components/features/discovery/SearchOverlay'
import ThemeSelector from '../components/features/discovery/ThemeSelector'
import StockListSection from '../components/features/stock/StockListSection'
import { useStockContext, Stock } from '../contexts/StockContext'
import { recommendationService, ThemeRecommendation } from '../services/recommendationService'
import { logRecommendationListView, logStockClick } from '../services/analytics'

// JSON 데이터 임포트
import profilesData from '../data/mbti-profiles.json'
import themesData from '../data/themes.json'

export default function MainPage() {
  const [storedMBTI] = useMBTI()
  const mbti = storedMBTI || 'INTJ'
  const { user } = useAuth()
  const userId = user?.id || 'anonymous'
  
  // Custom Hooks
  const { 
    isSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    filteredStocks, 
    openSearch, 
    closeSearch 
  } = useSearchStocks()
  
  const { 
    gamificationItems, 
    activeGamificationIndex, 
    dailyMission, 
    todaysFortune 
  } = useGamification(mbti)

  const [selectedTheme, setSelectedTheme] = useState(0)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { stocks: masterStocks, refresh: refreshStocks } = useStockContext()
  const [isLoading, setIsLoading] = useState(true)
  
  // AI Generated Themes State
  const [aiThemes, setAiThemes] = useState<ThemeRecommendation[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Fetch AI Themes on Mount
  useEffect(() => {
    const fetchThemes = async () => {
      setIsAiLoading(true)
      try {
          const themes = await recommendationService.getThemeRecommendations(mbti)
          if (themes && themes.length > 0) {
              setAiThemes(themes)
          }
      } catch (e) {
          console.error("AI Theme Fetch Error", e)
      } finally {
          setIsAiLoading(false)
          setIsLoading(false) // Ready
      }
    }
    fetchThemes()
  }, [mbti])

  // 레벨 시스템 (가상)
  const userLevel = useMemo(() => Math.floor(Math.random() * 20) + 1, [])

  // MBTI 프로필 찾기
  const mbtiProfile = useMemo(() => {
    return profilesData.find((p) => p.id === mbti) || profilesData[0]
  }, [mbti])

  // 공통 포트폴리오 훅 사용
  const [portfolioStore, setPortfolioStore] = usePortfolio()
  const [settings] = useSettings()
  const aiEnabled = settings.aiEnabled

  // 포트폴리오 데이터 계산
  const portfolio = useMemo(() => {
    const cash = portfolioStore?.cash || 10000000
    const stocks = portfolioStore?.stocks || []

    let totalStockValue = 0
    let totalInvested = 0

    stocks.forEach((item: any) => {
      const currentStock = masterStocks.find((s) => s.ticker === item.ticker)
      if (currentStock) {
        const price = currentStock.livePrice ?? currentStock.price
        totalStockValue += price * item.shares
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

  // MBTI 테마 필터 (AI 우선 사용, 실패시 JSON 폴백)
  const mbtiThemes: any[] = useMemo(() => {
    if (aiThemes.length > 0) return aiThemes
    
    // Fallback to JSON
    return (themesData as any[]).filter((t) => t.mbti === mbti).slice(0, 5)
  }, [mbti, aiThemes])

  // 현재 선택된 테마
  const currentTheme = mbtiThemes[selectedTheme] || mbtiThemes[0]

  // 테마에 해당하는 종목들 가져오기 + 추천 점수 매핑
  const themeStocks = useMemo(() => {
    if (!currentTheme) return []
    
    // 1. AI 테마인 경우 (stocks에 이미 추천 정보가 있음)
    if (aiThemes.length > 0) { // Check if we are using AI data
        return (currentTheme.stocks || []).map((aiStock: any) => {
             // Find full stock info from master to fill gaps (logo, tags etc)
             const master = masterStocks.find(s => s.ticker === aiStock.ticker)
             
             // Construct merged stock object
             return {
                 ...(master || {}), // Master info (name, sector, etc)
                 ticker: aiStock.ticker,
                 name: aiStock.name,
                 price: aiStock.price, // Use AI price (real-time)
                 // Map recommendation to match RecommendationInfo type
                 recommendation: {
                     totalScore: aiStock.score,
                     matchReasons: [], // Hide reason in list
                 },
                 aiMessage: aiStock.ai_message,
                 // Theme context for AI
                 themeTitle: currentTheme.title,
                 themeDescription: currentTheme.description,
                 themeCategory: currentTheme.category,
                 // Add missing fields if master not found
                 change: master?.change || 0,
                 changePercent: master?.changePercent || 0,
                 marketCap: master?.marketCap || 0,
                 volatility: master?.volatility || 'medium', // Add missing required prop
                 dividendYield: master?.dividendYield || 0   // Add missing required prop
             } as Stock
        })
    }
    
    // 2. JSON 폴백인 경우 (기존 로직)
    // ... (기존 로직 생략 또는 간소화: API가 잘 될테니)
    let targetStocks = (currentTheme.stocks as string[])
      .map((ticker) => masterStocks.find((s) => s.ticker === ticker))
      .filter((s): s is Stock => s !== undefined)

    if (targetStocks.length === 0 && masterStocks.length > 0) {
      targetStocks = masterStocks.slice(0, 10)
    }
    
    // Mock Scoring for fallback
    return targetStocks.map(stock => ({
        ...stock,
        recommendation: {
            score: Math.floor(Math.random() * 30) + 70,
            reason: `${currentTheme.title} 테마에 부합하는 종목`,
            ticker: stock.ticker
        }
    }))

  }, [currentTheme, masterStocks, aiThemes])

  const topStock = themeStocks[0]

  // 추천 리스트 노출 로깅 (ML 학습 데이터)
  // 상위 5개만 로깅하여 데이터 양 조절
  useEffect(() => {
    if (themeStocks.length > 0 && currentTheme) {
      const stocks = themeStocks.slice(0, 5).map((stock: Stock, index: number) => ({
        ticker: stock.ticker,
        rank: index + 1
      }))
      
      logRecommendationListView(
        userId,
        mbti,
        currentTheme.id,
        currentTheme.title,
        stocks
      ).catch(err => console.error('[Analytics] Failed to log list view:', err))
    }
  }, [themeStocks, currentTheme, userId, mbti])

  // 종목 클릭 핸들러
  const handleStockClick = (stock: Stock) => {
    // 클릭 로깅 (ML 학습 데이터 - 중요!)
    const rankPosition = themeStocks.findIndex((s: Stock) => s.ticker === stock.ticker) + 1
    if (rankPosition > 0 && currentTheme) {
      logStockClick({
        userId,
        mbti,
        stockTicker: stock.ticker,
        themeId: currentTheme.id,
        themeTitle: currentTheme.title,
        rankPosition
      }).catch(err => console.error('[Analytics] Failed to log click:', err))
    }
    
    setSelectedStock(stock)
    setIsModalOpen(true)
    closeSearch()
  }

  // 새로고침 핸들러
  const handleRefresh = async () => {
    const rand = Math.random()
    const newCondition = rand < 0.4 ? 'bull' : rand < 0.7 ? 'neutral' : 'bear'
    await refreshStocks()

    if (portfolioStore && portfolioStore.stocks && portfolioStore.stocks.length > 0) {
      setPortfolioStore({ ...portfolioStore })
    }

    const marketInfo = {
      bull: '상승장',
      neutral: '보합장',
      bear: '하락장',
    }
    const conditionText = marketInfo[newCondition]
    toast.success(`시장 상황 업데이트: ${conditionText}`)
  }

  // 테마 선택 핸들러
  const handleThemeSelect = (index: number) => {
    setSelectedTheme(index)
  }

  // 스와이프 핸들러 (무한 로테이트 적용)
  const handleSwipe = (direction: 'left' | 'right') => {
    const total = mbtiThemes.length
    if (total <= 1) return

    if (direction === 'left') { // 다음 테마 (왼쪽으로 스와이프)
      const nextIndex = (selectedTheme + 1) % total
      handleThemeSelect(nextIndex)
    } else { // 이전 테마 (오른쪽으로 스와이프)
      const prevIndex = (selectedTheme - 1 + total) % total
      handleThemeSelect(prevIndex)
    }
  }

  // Scroll to top when theme changes
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedTheme])

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* 헤더 */}
      <Header 
        onSearchClick={openSearch}
      />

      {/* 검색 오버레이 */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredStocks={filteredStocks}
        onStockClick={handleStockClick}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col min-h-0 pt-14">
        {/* 상단 고정 영역: 자산 요약 및 캐릭터 + 게이미피케이션 */}
        <div className="shrink-0 p-4 pb-6 bg-white">
          <AssetHeader 
            mbtiProfile={mbtiProfile}
            mbti={mbti}
            userLevel={userLevel}
            portfolio={portfolio}
          />
          <GamificationSection 
             items={gamificationItems}
             activeIndex={activeGamificationIndex}
             dailyMission={dailyMission}
             todaysFortune={todaysFortune}
          />
        </div>

        {/* 섹션 헤더: 테마 캐로셀 */}
        <ThemeSelector 
          themes={mbtiThemes}
          selectedTheme={selectedTheme}
          onSelectTheme={handleThemeSelect}
        />

        {/* 종목 리스트 - 스크롤 영역 */}
        <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide"
        >
            {isAiLoading && aiThemes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-400 text-sm">AI가 {mbti} 맞춤 테마를 분석 중입니다...</p>
                </div>
            ) : (
                <StockListSection 
                  isLoading={isLoading}
                  onRefresh={handleRefresh}
                  themeStocks={themeStocks}
                  topStock={topStock}
                  mbti={mbti}
                  aiEnabled={aiEnabled}
                  onStockClick={handleStockClick}
                  onSwipe={handleSwipe}
                  mbtiProfileGradient={mbtiProfile.gradient}
                />
            )}
        </div>
      </div>

      {/* 푸터 */}
      <FooterNav />

      {/* 종목 상세 바텀시트 */}
      <StockDetailBottomSheet
        stock={selectedStock}
        mbti={mbti}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  )
}
