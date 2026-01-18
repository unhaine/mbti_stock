import { Info } from 'lucide-react'
import { useFinancialData } from '../../../../hooks'
import { FinancialHealthCard } from '../FinancialHealthCard'
import { FinancialSummaryCard } from '../FinancialSummaryCard'
import { FinancialsSkeleton } from '../../../../components/common/Skeleton'

interface StockFinancialsTabProps {
  ticker: string
}

/**
 * 주식 상세 - 재무분석 탭 (미니멀 스타일)
 */
export default function StockFinancialsTab({ ticker }: StockFinancialsTabProps) {
  const { data: financialData, isLoading, error } = useFinancialData(ticker)

  // 로딩 상태: 텍스트 대신 스켈레톤 표시
  if (isLoading) {
    return <FinancialsSkeleton />
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-20">
        <Info className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500 font-medium">데이터 로딩 실패</p>
        <p className="text-xs text-secondary-400 mt-1">{error}</p>
      </div>
    )
  }

  // 데이터 없음 상태
  if (!financialData) {
    return (
      <div className="text-center py-20">
        <Info className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500 font-medium">재무 데이터가 없습니다</p>
        <p className="text-xs text-secondary-400 mt-1">
          ETF/ETN 종목이거나 데이터 수집 중일 수 있습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FinancialHealthCard data={financialData} />
      <FinancialSummaryCard data={financialData} />
      
      {/* 상세 테이블 - 플랫 스타일 */}
      <section>
        <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-3">
          상세 지표
        </p>
        <div className="divide-y divide-secondary-100">
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">ROE</span>
            <span className="text-secondary-900 font-bold text-sm">{financialData.roe.toFixed(2)}%</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">자산총계</span>
            <span className="text-secondary-900 text-sm">{financialData.totalAssets.toLocaleString()}원</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">부채총계</span>
            <span className="text-secondary-900 text-sm">{financialData.totalLiabilities.toLocaleString()}원</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-secondary-500 text-sm">자본총계</span>
            <span className="text-secondary-900 text-sm">{financialData.totalEquity.toLocaleString()}원</span>
          </div>
        </div>
      </section>
    </div>
  )
}
