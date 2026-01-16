import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, getChangeArrow, cn } from '../../utils/helpers'

import { Stock } from '../../contexts/StockContext'

interface PortfolioItemProps {
  stock: Stock
  shares: number
  avgPrice: number
  gradient: string[]
  onClick?: () => void
}

/**
 * 포트폴리오 종목 아이템 컴포넌트
 */
export default function PortfolioItem({
  stock,
  shares,
  avgPrice,
  gradient,
  onClick,
}: PortfolioItemProps) {
  const currentValue = stock.price * shares
  const investedValue = avgPrice * shares
  const profit = currentValue - investedValue
  const profitPercent = (currentValue / investedValue - 1) * 100

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl px-4 py-2 cursor-pointer border border-dark-600/50 hover:border-dark-400 transition-all duration-300 shadow-sm"
    >
      {/* 상단: 아이콘 및 기본 정보 */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
          >
            {stock.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-dark-50 text-[15px] leading-tight mb-1">{stock.name}</h4>
            <div className="flex items-center gap-1.5 text-dark-400 text-xs font-medium">
              <span>{shares}주</span>
              <span className="w-0.5 h-0.5 rounded-full bg-dark-600" />
              <span>{formatCurrency(avgPrice)} 매수</span>
            </div>
          </div>
        </div>

        {/* 수익률 배지 */}
        <div
          className={cn(
            'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-0.5',
            profit >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
          )}
        >
          {getChangeArrow(profitPercent)}
          {formatPercent(profitPercent)}
        </div>
      </div>

      {/* 중단: 평가 금액 및 손익 */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-wider mb-1">
            평가 금액
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-dark-50 tracking-tight">
              {formatCurrency(currentValue)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={cn('text-sm font-semibold mb-0.5', getChangeColor(profit))}>
            {profit >= 0 ? '+' : ''}
            {formatCurrency(profit)}
          </p>
        </div>
      </div>

      {/* 하단: 시각적 수익 지표 (진척도 바) */}
      <div className="h-1.5 w-full bg-dark-700/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(profitPercent) * 2, 100)}%` }}
          transition={{ duration: 1, ease: 'circOut' }}
          className={cn('h-full rounded-full', profit >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
        />
      </div>
    </motion.div>
  )
}
