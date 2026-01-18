
import { useEffect, useState } from 'react'
import { recommendationService, StockRecommendation } from '../../../services/recommendationService'
import { getMBTI } from '../../../utils/storage'
import { RefreshCw, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePortfolioContext } from '../../../contexts/PortfolioContext'

// Map metrics keys to readable labels
const METRIC_LABELS: Record<string, string> = {
  rsi: 'RSI',
  volatility: '변동성',
  momentum: '모멘텀'
}

export function AIRecommendation() {
  const mbti = getMBTI() || 'INTJ' // Default to INTJ if not found
  const { buyStock } = usePortfolioContext()
  
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      const data = await recommendationService.getRecommendations(mbti)
      setRecommendations(data)
    } catch (error) {
      console.error(error)
      toast.error('AI 추천을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleBuy = async (ticker: string, name: string, price: number) => {
      // Mock price if 0 (since AI might not return price yet)
      const executionPrice = price || 50000 
      const success = await buyStock({
          ticker,
          name,
          price: executionPrice,
          change: 0,
          changePercent: 0,
          marketCap: 0,
          volume: 0,
          sector: '', // Optional fields
          isLiveData: false,
          volatility: 'medium',
          dividendYield: 0
      }, 1, executionPrice) // Buy 1 share for simplicity
      
      if (success) {
          // toast handled in buyStock
      }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [mbti])

  if (!mbti) return null

  return (
    <section className="space-y-4 px-1">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            🤖 <span className="text-indigo-600">{mbti}</span> 맞춤 AI 추천
            </h2>
            <p className="text-xs text-gray-500 mt-1">
                성향과 실시간 시장 데이터를 분석한 결과입니다.
            </p>
        </div>
        <button 
            onClick={fetchRecommendations} 
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && recommendations.length === 0 ? (
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                <p className="text-sm text-gray-400">실시간 데이터 분석 중...</p>
            </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {recommendations.map((item) => (
                <div key={item.ticker} className="flex-none w-64 md:w-auto bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="text-xs font-medium text-gray-400 block mb-1">{item.ticker}</span>
                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.score >= 90 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.score}점
                        </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-4 grow bg-gray-50 p-2 rounded-lg leading-relaxed">
                        💡 {item.reason}
                    </p>

                    {/* Metrics Grid */}
                    {item.metrics && (
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                            {Object.entries(item.metrics).map(([key, val]) => {
                                if (key === 'close') return null; // Hide raw price
                                return (
                                    <div key={key} className="bg-white border rounded p-1">
                                        <div className="text-[10px] text-gray-400 uppercase">{METRIC_LABELS[key] || key}</div>
                                        <div className="text-xs font-semibold text-gray-700">{val}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <button 
                        onClick={() => handleBuy(item.ticker, item.name, item.metrics?.close || 0)}
                        className="w-full mt-auto py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                        <TrendingUp className="w-3 h-3" /> 매수하기
                    </button>
                </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg text-sm">
            추천 종목을 불러오지 못했습니다.<br/>백엔드 서버를 확인해주세요.
        </div>
      )}
    </section>
  )
}
