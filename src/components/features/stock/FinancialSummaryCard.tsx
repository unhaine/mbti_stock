import React from 'react'
import { FinancialRatio } from '../../../types/finance'

interface FinancialSummaryCardProps {
  data: FinancialRatio
}

/**
 * 손익 요약 섹션 - 플랫 스타일
 */
export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ data }) => {
  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000000000) {
      return `${(val / 1000000000000).toFixed(1)}조`
    }
    if (Math.abs(val) >= 100000000) {
      return `${(val / 100000000).toFixed(0)}억`
    }
    return val.toLocaleString()
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider">
          손익 요약
        </p>
        <span className="text-xs text-secondary-400">{data.fiscalYear}년</span>
      </div>
      
      <div className="divide-y divide-secondary-100">
        <div className="py-3 flex justify-between items-center">
          <span className="text-secondary-500 text-sm">매출액</span>
          <span className="font-bold text-secondary-900">{formatMoney(data.revenue)}</span>
        </div>
        
        <div className="py-3 flex justify-between items-center">
          <span className="text-secondary-500 text-sm">영업이익</span>
          <div className="text-right">
            <span className="font-bold text-secondary-900 mr-1">{formatMoney(data.operatingIncome)}</span>
            <span className="text-xs text-secondary-400">({data.operatingMargin.toFixed(1)}%)</span>
          </div>
        </div>
        
        <div className="py-3 flex justify-between items-center">
          <span className="text-secondary-500 text-sm">당기순이익</span>
          <div className="text-right">
            <span className="font-bold text-secondary-900 mr-1">{formatMoney(data.netIncome)}</span>
            <span className="text-xs text-secondary-400">({data.netProfitMargin.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
