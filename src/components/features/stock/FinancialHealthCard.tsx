import React from 'react'
import { FinancialRatio } from '../../../types/finance'
import { cn } from '../../../utils/helpers'

interface FinancialHealthCardProps {
  data: FinancialRatio
}

/**
 * 재무 헬스체크 섹션 - 플랫 스타일
 */
export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({ data }) => {
  return (
    <section>
      <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-4">
        재무 헬스체크
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        <HealthItem 
          label="수익성" 
          level={data.profitabilityLevel} 
          mainValue={`${data.operatingMargin.toFixed(1)}%`}
          subValue="영업이익률"
        />
        
        <HealthItem 
          label="안정성" 
          level={data.stabilityLevel} 
          mainValue={`${data.debtRatio.toFixed(1)}%`}
          subValue="부채비율"
        />
        
        <HealthItem 
          label="성장성" 
          level={data.growthLevel || 'unknown'} 
          mainValue={getGrowthText(data.growthLevel)}
          subValue="매출 성장"
        />
      </div>
    </section>
  )
}

interface HealthItemProps {
  label: string
  level: string
  mainValue: string
  subValue: string
}

const HealthItem: React.FC<HealthItemProps> = ({ label, level, mainValue, subValue }) => {
  const { color, text } = getLevelConfig(level)
  
  return (
    <div className="text-center py-3">
      <p className="text-xs text-secondary-500 mb-2">{label}</p>
      
      {/* 텍스트 뱃지 - 이모지 제거 */}
      <span className={cn('inline-block px-2 py-0.5 rounded text-xs font-bold mb-2', color)}>
        {text}
      </span>
      
      <div>
        <p className="text-sm font-bold text-secondary-900">{mainValue}</p>
        <p className="text-[10px] text-secondary-400">{subValue}</p>
      </div>
    </div>
  )
}

// 레벨별 색상 설정 - 이모지 제거
function getLevelConfig(level: string) {
  switch (level) {
    case 'high':
    case 'stable':
      return { color: 'bg-success/10 text-success', text: '우수' }
    case 'medium':
    case 'moderate':
      return { color: 'bg-amber-100 text-amber-700', text: '보통' }
    case 'low':
    case 'risky':
    case 'negative':
      return { color: 'bg-error/10 text-error', text: '주의' }
    default:
      return { color: 'bg-secondary-100 text-secondary-500', text: '판단불가' }
  }
}

function getGrowthText(level: string | undefined) {
  if (level === 'high') return '고성장'
  if (level === 'stable') return '안정적'
  if (level === 'low') return '저성장'
  if (level === 'negative') return '역성장'
  return '-'
}
