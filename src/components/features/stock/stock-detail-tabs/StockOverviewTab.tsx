import { lazy, Suspense } from 'react'
import { Stock } from '../../../../types'
import { formatCurrency, formatMarketCap, formatCompact } from '../../../../utils/formatters'
import Skeleton from '../../../../components/common/Skeleton'

const StockMiniChart = lazy(() => import('../../charts/StockMiniChart'))

interface StockOverviewTabProps {
  stock: Stock
  mbti?: string
  metaphor: string
  rationale?: string
  isLoadingAI?: boolean
  aiEnabled?: boolean
  chartData: any[]
  accentColor: string
}

/**
 * 주식 상세 - 종목 개요 탭 (미니멀 스타일)
 */
export default function StockOverviewTab({ 
  stock, 
  mbti, 
  metaphor, 
  isLoadingAI,
  aiEnabled,
  chartData, 
  accentColor 
}: StockOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* AI 성향 분석 */}
      <section className="bg-secondary-50 rounded-xl p-4">
        {stock.stockMBTI && (
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-secondary-200 border-dashed">
            <span className="shrink-0 px-2 py-1 bg-white rounded-lg border border-secondary-200 text-xs font-bold text-secondary-700 shadow-sm">
              이 종목은 {stock.stockMBTI}
            </span>
            <span className="text-sm font-medium text-secondary-600">
              {stock.stockMBTI === mbti 
                ? '당신과 똑같은 성향이에요! ⚡️' 
                : '당신과 다른 매력이 있어요 💫'}
            </span>
          </div>
        )}
        
        {isLoadingAI ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
              <p className="text-xs font-bold text-primary-500 uppercase tracking-wider">
                AI가 {mbti || '당신'}의 성향을 분석 중...
              </p>
            </div>
            <Skeleton width="100%" height="60px" rounded="lg" />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider">
                {mbti || '투자자'}를 향한 {aiEnabled ? 'Gemini AI' : 'AI'} 한마디
              </p>
              {!aiEnabled && (
                <span className="text-[10px] font-bold text-secondary-400 bg-secondary-100 px-1.5 py-0.5 rounded cursor-help">
                  Gemini OFF
                </span>
              )}
            </div>
            <p className="text-secondary-900 font-bold text-base leading-relaxed break-keep">
              {metaphor || '분석 결과를 가져오지 못했습니다.'}
            </p>
            {!aiEnabled && (
              <p className="mt-3 text-[11px] text-secondary-400 leading-tight">
                💡 설정에서 Gemini AI를 켜면 {mbti}님만을 위한 더 깊이 있는 분석을 받아볼 수 있어요!
              </p>
            )}
          </div>
        )}
      </section>
      
      {/* 미니 차트 */}
      <section>
        <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-3">
          최근 추세
        </p>
        <Suspense fallback={<Skeleton height={160} width="100%" rounded="xl" />}>
          <StockMiniChart data={chartData} color={accentColor} />
        </Suspense>
      </section>

      {/* 주요 지표 - 플랫 스타일 */}
      <section>
        <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-3">
          주요 지표
        </p>
        <div className="divide-y divide-secondary-100">
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">시가총액</span>
            <span className="text-secondary-900 font-medium text-sm">
              {formatMarketCap(Number(stock.marketCap))}
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">거래량</span>
            <span className="text-secondary-900 font-medium text-sm">
              {formatCompact(stock.liveVolume ?? stock.volume)}주
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">시가</span>
            <span className="text-secondary-900 font-medium text-sm">
              {formatCurrency(stock.liveOpen ?? stock.openPrice)}
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">저가 - 고가</span>
            <span className="text-secondary-900 font-medium text-sm">
              {formatCurrency(stock.liveLow ?? stock.lowPrice)} - {formatCurrency(stock.liveHigh ?? stock.highPrice)}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
