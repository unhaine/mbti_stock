import { useState, useMemo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Zap,
  PieChart,
  Newspaper,
  Coins,
  Minus,
  Plus,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, cn } from '../../utils/helpers'
import { usePortfolioContext } from '../../contexts/PortfolioContext'
import toast from 'react-hot-toast'

import { Stock } from '../../contexts/StockContext'

interface StockDetailModalProps {
  stock: Stock | null
  mbti?: string
  isOpen: boolean
  onClose: () => void
}

// Helper functions
function generateChartData(basePrice: number, changePercent: number) {
  const data = []
  // Start from a price slightly different to show trend
  let currentPrice = basePrice * (1 - (changePercent * 0.5) / 100)

  for (let i = 0; i < 30; i++) {
    const volatility = basePrice * 0.01
    const change = (Math.random() - 0.5) * volatility
    // Add trend
    if (changePercent > 0) currentPrice += volatility * 0.2
    else currentPrice -= volatility * 0.2

    currentPrice += change
    data.push({ price: Math.max(0, currentPrice) }) // Prevent negative price
  }

  // Ensure the last point smoothly approaches the current price
  data.push({ price: basePrice })

  return data
}

function getMockNews(stockName: string) {
  const templates = [
    (name: string) => `${name}, 글로벌 시장 진출 가속화`,
    (name: string) => `${name} 2분기 영업이익, 시장 기대치 상회 전망`,
    (name: string) => `[특징주] ${name}, 외국인/기관 동반 매수세`,
    (name: string) => `${name}, 신규 파이프라인 기대감에 강세`,
    (name: string) => `증권가 "${name}, 지금이 저가 매수 기회" 리포트`,
    (name: string) => `${name}, 업계 최초 혁신 기술 개발 소식`,
  ]

  const sources = ['한국경제', '매일경제', '이데일리', '머니투데이', '파이낸셜뉴스']

  return Array.from({ length: 3 }).map((_, _idx) => ({
    title: templates[Math.floor(Math.random() * templates.length)](stockName),
    source: sources[Math.floor(Math.random() * sources.length)],
    time: `${Math.floor(Math.random() * 12) + 1}시간 전`,
  }))
}

export default function StockDetailModal({ stock, mbti, isOpen, onClose }: StockDetailModalProps) {
  const { buyStock } = usePortfolioContext()
  const [tradeMode, setTradeMode] = useState(false) // false | true
  const [quantity, setQuantity] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const metaphor = useMemo(() => {
    if (!stock) return ''
    return (
      (mbti && stock.metaphors?.[mbti]) ||
      stock.metaphors?.default ||
      '이 종목에 대한 분석이 진행 중입니다.'
    )
  }, [stock, mbti])

  const chartData = useMemo(() => {
    if (!stock) return []
    return generateChartData(stock.price, stock.changePercent)
  }, [stock?.ticker, stock?.price, stock?.changePercent])

  const news = useMemo(() => {
    if (!stock) return []
    return getMockNews(stock.name)
  }, [stock?.ticker, stock?.name])

  if (!stock) return null

  const isRising = stock.changePercent >= 0
  const accentColor = isRising ? '#ef4444' : '#3b82f6'

  const handleBuy = async () => {
    if (quantity < 1 || !stock) return
    try {
      setIsProcessing(true)
      // 모의 투자 로직
      const success = await buyStock(stock as any, quantity, stock.price)
      if (success) {
        setTradeMode(false)
        onClose()
      }
    } catch (error) {
      console.error('구매 중 오류 발생:', error)
      toast.error('주문 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* 상단바 */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-dark-600/50">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-dark-400 hover:text-dark-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-dark-400 uppercase tracking-tighter leading-none mb-0.5">
                {stock.ticker}
              </span>
              <h2 className="text-dark-50 font-extrabold text-sm">{stock.name}</h2>
            </div>
            <button className="p-2 -mr-2 rounded-full text-dark-400">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white scrollbar-hide pb-32">
            {/* 1. HERO 섹션 */}
            <div className="px-6 py-4 flex justify-between items-end border-b border-dark-600/30 pb-6">
              {/* 왼쪽: 종목 정보 */}
              <div className="flex flex-col gap-2">
                {/* 상단 배지 */}
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded-lg bg-secondary-100 text-dark-400 text-[10px] font-bold border border-dark-600/20">
                    {stock.sector}
                  </span>
                  {stock.dividendYield && stock.dividendYield > 0 ? (
                    <span className="flex items-center gap-1 px-1 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100/50">
                      <Coins size={12} className="opacity-70" /> 배당 {stock.dividendYield}%
                    </span>
                  ) : null}
                </div>

                {/* 메인 정보 */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-dark-600/10"
                    style={{
                      background: isRising
                        ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    }}
                  >
                    {stock.emoji || stock.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-black text-dark-50 tracking-tight mb-0.5">
                      {stock.name}
                    </h1>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-dark-50 tracking-tighter">
                        {formatCurrency(stock.price)}
                      </span>
                      <div
                        className={cn(
                          'flex items-center font-bold text-sm',
                          getChangeColor(stock.changePercent)
                        )}
                      >
                        {getChangeColor(stock.changePercent).includes('red') ? '▲' : '▼'}{' '}
                        {formatPercent(stock.changePercent)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 차트 영역 (Full Width) */}
            <div className="h-48 w-full bg-linear-to-b from-transparent to-gray-50/50 mb-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradientDetail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accentColor} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 p-2 rounded-lg shadow-xl outline-none">
                            <p className="text-[10px] font-bold text-dark-400 mb-0.5 uppercase">
                              가격
                            </p>
                            <p className="text-sm font-black text-dark-50">
                              {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                    cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={accentColor}
                    strokeWidth={3}
                    fill="url(#chartGradientDetail)"
                    animationDuration={1500}
                    activeDot={{
                      r: 6,
                      fill: accentColor,
                      stroke: '#ffffff',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* 기간 선택 탭 */}
              <div className="absolute bottom-2 left-6 right-6 flex justify-between px-4 py-1 bg-white/80 backdrop-blur rounded-full border border-gray-100 shadow-sm">
                {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      period === '1D' ? 'bg-dark-800 text-white' : 'text-dark-400'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 space-y-6">
              {/* 3. AI 맞춤 코멘트 (Insights) */}
              <section>
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Zap size={64} className="text-indigo-600" />
                  </div>

                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 text-xs">
                      AI
                    </div>
                    <div>
                      <h4 className="text-indigo-900 font-bold text-sm leading-none">
                        {mbti} 투자자 분석
                      </h4>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                        Insight
                      </p>
                    </div>
                  </div>
                  <p className="text-indigo-950 text-lg font-bold leading-relaxed italic relative z-10">
                    "{metaphor}"
                  </p>
                </div>
              </section>

              {/* 2. 주요 지표 (Grid Stats) */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-dark-50 font-bold text-lg flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary-500" />
                    주요 지표
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="시가총액"
                    value={stock.marketCap || '-'}
                    icon={<PieChart size={14} className="text-dark-400" />}
                  />
                  <StatCard
                    label="변동성"
                    value={
                      stock.volatility === 'very-high'
                        ? '매우 높음'
                        : stock.volatility === 'high'
                        ? '높음'
                        : stock.volatility === 'medium'
                        ? '보통'
                        : '낮음'
                    }
                    icon={<Zap size={14} className="text-orange-400" />}
                  />
                  <StatCard
                    label="배당수익률"
                    value={stock.dividendYield ? `${stock.dividendYield}%` : '0%'}
                    icon={<TrendingUp size={14} className="text-emerald-400" />}
                  />
                  <StatCard
                    label="안정성"
                    value={stock.volatility === 'low' ? '안정적' : '주의'}
                    icon={<ShieldCheck size={14} className="text-blue-400" />}
                  />
                </div>
              </section>

              {/* 4. 최신 뉴스 (News) */}
              <section>
                <h3 className="text-dark-50 font-bold text-lg mb-4 flex items-center gap-2">
                  <Newspaper size={20} className="text-primary-500" />
                  주요 뉴스
                </h3>
                <div className="space-y-3">
                  {news.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white border border-dark-600/50 rounded-2xl flex flex-col gap-2 shadow-sm active:bg-gray-50 transition-colors"
                    >
                      <h5 className="text-sm font-bold text-dark-50 leading-snug line-clamp-2">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-dark-400 font-bold uppercase tracking-tighter">
                        <span className="text-primary-600">{item.source}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-dark-400" />
                        <span>{item.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* 하단 버튼 바 */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-dark-600 z-30 pb- safe-area-bottom">
            {tradeMode ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-secondary-50 p-1.5 rounded-xl border border-dark-600">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-dark-600 active:scale-95 transition-transform"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-dark-600 active:scale-95 transition-transform"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-300 font-medium mb-0.5">예상 결제 금액</p>
                    <p className="text-xl font-black text-primary-600">
                      {formatCurrency(stock.price * quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTradeMode(false)}
                    className="flex-1 bg-dark-100 hover:bg-dark-200 text-dark-500 py-3.5 rounded-xl font-bold transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleBuy}
                    disabled={isProcessing}
                    className="flex-2 bg-primary-600 hover:bg-primary-500 text-white py-3.5 rounded-xl font-black transition-all shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>{isProcessing ? '처리 중...' : '매수하기'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button className="flex-1 bg-dark-800 hover:bg-dark-700  py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-dark-600/10">
                  관심 종목
                </button>
                <button
                  onClick={() => setTradeMode(true)}
                  className="flex-1 bg-primary-600 hover:bg-primary-500  py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-primary-500/20"
                >
                  주문하기
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-dark-600 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-1.5 mb-2 text-dark-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
      </div>
      <div className="text-dark-50 font-extrabold text-base tracking-tight leading-none">
        {value}
      </div>
    </div>
  )
}
