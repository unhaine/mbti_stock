import { useState, useMemo, useEffect } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import BottomSheet from '../../common/BottomSheet'
import { Tabs } from '../../common/Tabs'
import { usePortfolioContext } from '../../../contexts/PortfolioContext'
import toast from 'react-hot-toast'
import { useStockDisplay } from '../../../hooks'
import { cn } from '../../../utils/helpers'
import { formatCurrency } from '../../../utils/formatters'

import { Stock } from '../../../types'
import StockOverviewTab from './stock-detail-tabs/StockOverviewTab'
import StockFinancialsTab from './stock-detail-tabs/StockFinancialsTab'
import StockCommunityTab from './stock-detail-tabs/StockCommunityTab'
import { getOrGenerateUnifiedContent } from '../../../services/gemini'
import { useSettings, useStockHistory } from '../../../hooks'
import StockLogo from '../../ui/stock-logo'
import { useCommunityPosts } from '../../../hooks/useCommunityPosts'

interface StockDetailBottomSheetProps {
  stock: Stock | null
  mbti?: string
  isOpen: boolean
  onClose: () => void
}

function generateChartData(basePrice: number, changePercent: number) {
  const data = []
  const points = 100 // 데이터 포인트 증가 (30 -> 100)
  let currentPrice = basePrice * (1 - (changePercent * 0.8) / 100)

  for (let i = 0; i < points; i++) {
    // 서서히 목표가(basePrice)에 도달하도록 트렌드 부여
    const trend = (basePrice - currentPrice) / (points - i)
    const volatility = basePrice * 0.005 // 변동성 조절
    const noise = (Math.random() - 0.5) * volatility
    
    currentPrice += trend + noise
    data.push({ 
      price: Math.max(0, currentPrice),
      date: i // X축 인덱스
    })
  }
  
  // 마지막 데이터는 정확한 현재가로 설정
  data[data.length - 1].price = basePrice
  return data
}

export default function StockDetailBottomSheet({ 
  stock, 
  mbti, 
  isOpen, 
  onClose 
}: StockDetailBottomSheetProps) {
  const { buyStock, sellStock, holdings } = usePortfolioContext()
  const [settings] = useSettings()
  const [tradeMode, setTradeMode] = useState(false)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [aiExplanation, setAiExplanation] = useState<string>('')
  const [aiRationale, setAiRationale] = useState<string>('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  
  // 커뮤니티 데이터 미리 로딩 (Bottom Sheet가 열릴 때)
  const { posts: communityPosts, loading: loadingCommunity, refresh: refreshCommunity } = useCommunityPosts(stock?.ticker)

  // ViewModel 적용
  const display = useStockDisplay(stock)

  // Chart data uses raw values from ViewModel if available, or 0
  const displayPrice = display?.price ?? 0
  const displayChange = display?.changePercent ?? 0

  // 실시간 히스토리 데이터 가져오기
  const { history: realHistory } = useStockHistory(stock?.ticker)

  const chartData = useMemo(() => {
    if (!stock) return []
    
    // 실제 히스토리 데이터가 어느 정도 쌓여 있으면 우선적으로 사용 (현실감)
    if (realHistory && realHistory.length > 5) {
      // 차트가 좀 더 꽉 차 보이도록 데이터가 적으면 시뮬레이션과 섞거나 조절 가능
      // 여기서는 실제 데이터 그대로 사용
      return realHistory
    }
    
    // 실제 데이터가 없거나 부족할 때만 시뮬레이션 데이터 생성
    return generateChartData(displayPrice, displayChange)
  }, [stock?.ticker, displayPrice, displayChange, realHistory])

  // ... (rest of the component logic)

  // ... (rest of the component logic)

  useEffect(() => {
    if (isOpen && stock?.ticker) {
      refreshCommunity()
    }
  }, [isOpen, stock?.ticker, refreshCommunity])

  // ... (rest of the component logic)

  const aiEnabled = settings.aiEnabled

  // 보유 주식 확인
  const myHolding = useMemo(() => {
    if (!stock || !holdings) return null
    return holdings.find(h => h.ticker === stock.ticker)
  }, [stock, holdings])

  // Bottom Sheet 열릴 때 초기화 (한 번만)
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview')
      setTradeMode(false)
      setTradeType('buy')
      setQuantity(1)
      setAiExplanation('')
      setAiRationale('')
      // AI 기능이 켜져있을 때만 로딩 상태 설정
      setIsLoadingAI(aiEnabled)
    }
  }, [isOpen, aiEnabled])

  // AI 콘텐츠 로딩 (AI 기능이 켜져있고, 커뮤니티 로딩 완료 후)
  useEffect(() => {
    async function fetchAI() {
      if (!stock || !isOpen || !mbti) {
        return
      }

      // AI 기능이 꺼져있으면 ranker의 aiMessage를 fallback으로 사용
      if (!aiEnabled) {
        const fallbackMessage = stock.aiMessage || `${mbti} 투자자에게 적합한 종목입니다.`
        setAiExplanation(fallbackMessage)
        setAiRationale(fallbackMessage)
        setIsLoadingAI(false)
        return
      }
      
      // 커뮤니티 로딩 중이면 대기
      if (loadingCommunity) return
      
      try {
        setIsLoadingAI(true)

        // 커뮤니티 여론 요약
        const sentimentSummary = communityPosts.length > 0 
          ? communityPosts.slice(0, 5).map(p => p.title).join(' / ')
          : undefined

        const context = {
          currentPrice: displayPrice,
          changePercent: displayChange,
          communitySentiment: sentimentSummary,
          aiMessage: stock.aiMessage,
          themeTitle: stock.themeTitle,
          themeDescription: stock.themeDescription,
          themeCategory: stock.themeCategory
        }

        const result = await getOrGenerateUnifiedContent(stock, mbti, context)
        
        setAiExplanation(result.explanation)
        setAiRationale(result.rationale)
        
        // 캐시에서 가져온 경우 즉시 로딩 종료
        if (result.fromCache) {
          setIsLoadingAI(false)
        } else {
          // 새로 생성한 경우 약간의 딜레이 후 종료 (UX)
          setTimeout(() => setIsLoadingAI(false), 300)
        }
      } catch (error) {
        console.error('AI fetch error:', error)
        // Gemini 실패 시에도 ranker의 aiMessage를 fallback으로 사용
        const fallbackMessage = stock.aiMessage || `${mbti} 투자자에게 적합한 종목입니다.`
        setAiExplanation(fallbackMessage)
        setAiRationale(fallbackMessage)
        setIsLoadingAI(false)
      }
    }
    
    fetchAI()
  }, [stock?.ticker, isOpen, mbti, aiEnabled, loadingCommunity, communityPosts, displayPrice, displayChange])

  
  if (!stock || !display) return null

  const isRising = displayChange >= 0
  const accentColor = isRising ? '#16A34A' : '#DC2626'

  const maxSellQuantity = myHolding?.quantity || 0

  const handleTrade = async () => {
    // ... (trade logic)
    if (quantity < 1 || !stock) return
    
    // 매도 시 수량 체크
    if (tradeType === 'sell' && quantity > maxSellQuantity) {
      toast.error(`최대 ${maxSellQuantity}주까지만 매도할 수 있습니다.`)
      return
    }

    try {
      setIsProcessing(true)
      let success = false
      
      if (tradeType === 'buy') {
        success = await buyStock(stock, quantity, displayPrice)
      } else {
        success = await sellStock(stock, quantity, displayPrice)
      }

      if (success) {
        setTradeMode(false)
        setQuantity(1) 
      }
    } catch (error) {
      console.error('거래 중 오류 발생:', error)
      toast.error('주문 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const startTrade = (type: 'buy' | 'sell') => {
    setTradeType(type)
    setQuantity(1)
    setTradeMode(true)
  }

  const tabs = [
    { id: 'overview', label: '종목 홈' },
    { id: 'financials', label: '재무분석' },
    { id: 'community', label: '커뮤니티' },
  ]


  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {/* 헤더 - 미니멀 스타일 */}
      <div className="px-4 pb-4 border-b border-secondary-100 shrink-0">
        <div className="flex justify-between items-start pt-3 mb-3">
          <div className="flex items-center gap-3">
            <StockLogo 
              code={stock.ticker} 
              name={stock.name} 
              size="lg" 
              className="shrink-0"
            />
            <div>
              <h2 className="text-xl font-black text-secondary-900">{stock.name}</h2>
              <p className="text-sm text-secondary-500">
                {stock.ticker} · {stock.sector}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 가격 - Hero Typography */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-black text-secondary-900 tracking-tight">
            {display.formattedPrice}
          </span>
          <span className={cn(
            "text-base font-bold",
            display.changeColorClass
          )}>
            {display.changeSymbol}{display.formattedChangePercent}
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 - 플랫 스타일 */}
      <div className="shrink-0 border-b border-secondary-100 px-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeTab === 'overview' && (
            <StockOverviewTab
              stock={stock}
              mbti={mbti}
              metaphor={aiExplanation}
              rationale={aiRationale}
              isLoadingAI={isLoadingAI}
              aiEnabled={aiEnabled}
              chartData={chartData}
              accentColor={accentColor}
            />
          )}


          {activeTab === 'financials' && (
            <StockFinancialsTab ticker={stock.ticker} />
          )}

          {activeTab === 'community' && (
            <StockCommunityTab 
              ticker={stock.ticker} 
              initialPosts={communityPosts}
              isLoading={loadingCommunity}
            />
          )}
        </div>
      </div>

      {/* 하단 CTA - 미니멀 스타일 */}
      <div className="shrink-0 px-4 py-3 bg-white border-t border-secondary-100 safe-area-bottom">
        {tradeMode ? (
          <div className="space-y-3">
            {/* 매도/매수 모드 헤더 */}
            <div className="text-center font-bold text-lg mb-2">
              {tradeType === 'buy' ? '매수하기' : '매도하기'}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 bg-secondary-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-secondary-500 mb-0.5">
                  {tradeType === 'buy' ? '예상 결제 금액' : '예상 매도 금액'}
                </p>
                <p className="text-xl font-black text-secondary-900">
                  {formatCurrency(displayPrice * quantity)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pb-4">
              <button
                onClick={() => setTradeMode(false)}
                className="flex-1 bg-secondary-100 text-secondary-700 py-3.5 rounded-xl font-bold"
              >
                취소
              </button>
              <button
                onClick={handleTrade}
                disabled={isProcessing}
                className={cn(
                  "flex-2 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2",
                  tradeType === 'buy' ? "bg-primary-500 hover:bg-primary-600" : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {isProcessing && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {isProcessing ? '처리 중...' : (tradeType === 'buy' ? '매수하기' : '매도하기')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 pb-4">
            {myHolding && (
              <button
                onClick={() => startTrade('sell')}
                className={cn(
                  "flex-1 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]",
                  "bg-blue-500 hover:bg-blue-600 flex flex-col items-center justify-center leading-none"
                )}
              >
                <span className="text-[15px]">매도하기</span>
                <span className="text-[11px] opacity-80 mt-1 font-medium">
                  {myHolding.quantity}주 보유
                </span>
              </button>
            )}
            <button
              onClick={() => startTrade('buy')}
              className={cn(
                "flex-1 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]",
                "bg-primary-500 hover:bg-primary-600 flex items-center justify-center text-[15px]"
              )}
            >
              매수하기
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  )
}

