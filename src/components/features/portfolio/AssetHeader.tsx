import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '../../../utils/helpers'
import { formatCurrency, formatPercent } from '../../../utils/formatters'
import { PortfolioStore } from '../../../types'

interface AssetHeaderProps {
  mbtiProfile: any
  mbti: string
  userLevel: number
  portfolio: {
    totalValue: number;
    change: number;
    changePercent: number;
  }
}

export default function AssetHeader({
  mbtiProfile,
  mbti,
  userLevel,
  portfolio
}: AssetHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 2열 레이아웃: 캐릭터(좌) vs 자산(우) */}
      <div className="flex justify-between items-end mb-4 px-2">
        {/* 캐릭터 정보 */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-secondary-100">
            {mbtiProfile?.emoji}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-black text-secondary-900 tracking-tight">{mbtiProfile?.tagline}</span>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[10px] font-bold border border-primary-100">
                {mbti}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-secondary-50 text-secondary-600 text-[10px] font-bold border border-secondary-100">
                LV.{userLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 자산 정보 */}
        <div className="text-right pb-1">
          <div className="text-lg font-black text-secondary-900 tracking-tight leading-none mb-1">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className={cn(
            "text-xs font-bold",
            portfolio.changePercent >= 0 ? "text-success" : "text-error"
          )}>
            {portfolio.changePercent >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(portfolio.change))} ({formatPercent(portfolio.changePercent)})
          </div>
        </div>
      </div>
    </motion.div>
  )
}
