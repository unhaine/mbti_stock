import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, getChangeArrow, cn } from '../../utils/helpers'

// 가상 차트 데이터 생성 함수
const generateChartData = (basePrice, changePercent) => {
  const data = []
  const points = 20 // 포인트 수 줄임 (미니 차트용)

  // 시작 가격 역산
  let currentPrice = basePrice / (1 + changePercent / 100)
  const volatility = 0.015

  for (let i = 0; i < points; i++) {
    if (i === points - 1) {
      data.push({ time: i, price: basePrice })
      break
    }
    const change = (Math.random() - 0.5) * volatility
    const trend = (changePercent >= 0 ? 0.005 : -0.005) * (i / points)
    currentPrice = currentPrice * (1 + change + trend)
    data.push({ time: i, price: currentPrice })
  }
  return data
}

export default function StockDetailModal({ stock, mbti, isOpen, onClose }) {
  if (!stock) return null

  const metaphor =
    stock.metaphors?.[mbti] || stock.metaphors?.default || '이 종목에 대한 설명이 준비중입니다.'

  const chartData = useMemo(() => {
    return generateChartData(stock.price, stock.changePercent)
  }, [stock.ticker])

  const isRising = stock.changePercent >= 0
  const chartColor = isRising ? '#34d399' : '#f87171'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          {/* 헤더 Wrapper */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600 bg-white">
            <button
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-dark-400 hover:text-dark-50 hover:bg-secondary-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-dark-50 font-bold text-lg">{stock.name}</h2>
            <button className="p-2 -mr-2 rounded-full text-dark-400">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* 메인 컨텐츠 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto bg-background">
            <div className="px-5 py-6 space-y-6">
              {/* 1. Hero Card: 상단 배너 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-5 border border-dark-600 shadow-xl relative overflow-hidden"
              >
                {/* 배경 효과 */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4">
                  {/* 상단: 아이콘 + 이름 + 미니차트/가격 */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                        style={{
                          background: isRising
                            ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        }} // 상승: 레드, 하락: 블루 (한국식)
                      >
                        {stock.name.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-dark-50 flex items-center gap-1">
                          {stock.name}
                          {stock.volatility === 'very-high' && <span className="text-sm">🔥</span>}
                        </h1>
                        <span className="text-dark-300 text-sm font-medium">{stock.sector}</span>
                      </div>
                    </div>

                    {/* 가격 정보 (오른쪽) */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-dark-50 tracking-tight">
                        {formatCurrency(stock.price)}
                      </div>
                      <div
                        className={cn(
                          'text-xs font-bold flex items-center justify-end gap-1',
                          getChangeColor(stock.changePercent)
                        )}
                      >
                        {getChangeArrow(stock.changePercent)} {formatPercent(stock.changePercent)}
                      </div>
                    </div>
                  </div>

                  {/* 하단: 말풍선 & 미니차트 */}
                  <div className="flex items-end justify-between mt-2">
                    {/* 말풍선 */}
                    <div className="flex-1 mr-4">
                      <div className="bg-secondary-50/60 backdrop-blur-md rounded-2xl rounded-tl-none p-3 border border-dark-600/50 inline-block max-w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💬</span>
                          <p className="text-sm text-dark-100 font-medium line-clamp-1 truncate">
                            "{metaphor}"
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 미니 차트 (작게) */}
                    <div className="w-24 h-12 shrink-0 opacity-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="miniChartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                              <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={chartColor}
                            strokeWidth={2}
                            fill="url(#miniChartGradient)"
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2. Grid Stats: 2x2 그리드 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="font-bold text-dark-50 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary-500 rounded-full" />
                  종목 정보
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-dark-600 shadow-sm">
                    <span className="text-dark-300 text-xs block mb-1">시가총액</span>
                    <span className="text-dark-50 font-bold text-lg">
                      {stock.marketCap || '정보 없음'}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-dark-600 shadow-sm">
                    <span className="text-dark-300 text-xs block mb-1">변동성</span>
                    <span className="text-dark-50 font-bold text-lg flex items-center gap-1">
                      {stock.volatility === 'very-high' && '⚡ 매우 높음'}
                      {stock.volatility === 'high' && '🔥 높음'}
                      {stock.volatility === 'medium' && '📊 보통'}
                      {stock.volatility === 'low' && '🛡️ 낮음'}
                      {!stock.volatility && '보통'}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-dark-600 shadow-sm">
                    <span className="text-dark-300 text-xs block mb-1">배당수익률</span>
                    <span className="text-dark-50 font-bold text-lg">
                      {stock.dividendYield ? `${stock.dividendYield}%` : '없음'}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-dark-600 shadow-sm">
                    <span className="text-dark-300 text-xs block mb-1">업종</span>
                    <span className="text-dark-50 font-bold text-lg truncate">{stock.sector}</span>
                  </div>
                </div>
              </motion.div>

              {/* 3. Tags: 특징 */}
              {stock.tags && stock.tags.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="font-bold text-dark-50 mb-3 text-sm">특징</h3>
                  <div className="flex flex-wrap gap-2">
                    {stock.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-primary-600 text-sm font-medium bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 4. Analysis: 상세 분석 (AI 코멘트) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="pb-8"
              >
                <h3 className="font-bold text-dark-50 mb-3 text-lg">종목 분석</h3>
                <div className="bg-white rounded-2xl p-6 border border-dark-600 shadow-sm relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-4xl opacity-10 grayscale">🤖</div>
                  <h4 className="text-primary-600 font-bold mb-4 text-sm tracking-wide uppercase">
                    AI가 분석한 {mbti} 맞춤 코멘트
                  </h4>
                  <p className="text-dark-100 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                    "{metaphor}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-dark-600/50 flex items-center justify-between text-xs text-dark-300">
                    <span>Generated by MBTI Stock AI</span>
                    <span>{new Date().toLocaleDateString()} 기준</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
