import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../../utils/formatters'
import { getChangeColor, cn } from '../../../utils/helpers'
import { Stock } from '../../../contexts/StockContext'
import StockLogo from '../../ui/stock-logo'

interface PortfolioItemProps {
  stock: Stock
  shares: number
  avgPrice: number
  gradient?: string[]
  onClick?: () => void
}

/**
 * 포트폴리오 종목 아이템 컴포넌트 - 플랫 스타일
 */
export default function PortfolioItem({
  stock,
  shares,
  avgPrice,
  onClick,
}: PortfolioItemProps) {
  const currentValue = stock.price * shares
  const investedValue = avgPrice * shares
  const profit = currentValue - investedValue
  const profitPercent = (currentValue / investedValue - 1) * 100

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center py-4 border-b border-secondary-100 cursor-pointer hover:bg-secondary-50 transition-colors"
    >
      {/* 좌측: 로고 + 정보 */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <StockLogo 
          code={stock.ticker} 
          name={stock.name} 
          size="md" 
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-secondary-900 truncate">{stock.name}</p>
          <p className="text-xs text-secondary-500">
            {shares}주 · {formatCurrency(avgPrice)} 매수
          </p>
        </div>
      </div>

      {/* 우측: 평가금액 + 수익률 */}
      <div className="text-right shrink-0 pl-3">
        <p className="font-bold text-secondary-900">
          {formatCurrency(currentValue)}
        </p>
        <p className={cn(
          "text-sm font-bold",
          getChangeColor(profit)
        )}>
          {profit >= 0 ? '+' : ''}{formatPercent(profitPercent)}
        </p>
      </div>
    </motion.div>
  )
}
