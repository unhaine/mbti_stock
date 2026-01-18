import { motion } from 'framer-motion'
import { cn } from '../../../utils/helpers'
import { Stock } from '../../../contexts/StockContext'
import { useStockDisplay } from '../../../hooks'
import { prefetchFinancialData } from '../../../hooks/useFinancialData'
import StockLogo from '../../ui/stock-logo'

interface StockCardProps {
  stock: Stock
  index?: number
  gradient?: string[]
  onClick?: () => void
  mbti?: string
}

/**
 * 종목 리스트 아이템 컴포넌트
 * 플랫 디자인 - 카드 스타일 제거
 */
export default function StockCard({ stock, index = 0, onClick }: StockCardProps) {
  // ViewModel 패턴 적용
  const display = useStockDisplay(stock)
  
  if (!display) return null

  const recommendation = stock.recommendation

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      onMouseEnter={() => prefetchFinancialData(stock.ticker)}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 cursor-pointer active:bg-gray-50 transition-colors"
    >
      {/* 좌측: 로고 + 정보 */}
      <div className="flex items-center gap-3 min-w-0">
        <StockLogo 
          code={stock.ticker} 
          name={stock.name} 
          size="md" 
          className="shrink-0"
        />
        <div className="min-w-0">
          <div className="font-bold text-gray-900 truncate">{stock.name}</div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-xs text-secondary-500">{stock.sector}</span>
            {recommendation && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[9px] font-bold border",
                recommendation.totalScore >= 1.5 
                  ? "bg-indigo-50 text-indigo-500 border-indigo-100" 
                  : "bg-green-50 text-green-500 border-green-100"
              )}>
                {Math.round(Math.min(recommendation.totalScore * 50, 99))}% 일치
              </span>
            )}
            {recommendation?.matchReasons?.map((reason, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-md bg-secondary-50 text-secondary-400 text-[9px] font-medium border border-secondary-100">
                {reason}
              </span>
            ))}
            {display.isLive && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="실시간" />
            )}
          </div>
        </div>
      </div>

      {/* 우측: 가격 정보 */}
      <div className="text-right shrink-0 pl-3">
        <div className="font-bold text-gray-900">
          {display.formattedPrice}
        </div>
        <div className={cn(
          "text-sm font-medium",
          display.changeColorClass
        )}>
          {display.changeSymbol}{display.formattedChangePercent}
        </div>
      </div>
    </motion.div>
  )
}
