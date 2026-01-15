import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, getChangeArrow, cn } from '../../utils/helpers'

/**
 * 포트폴리오 종목 아이템 컴포넌트
 * @param {Object} props
 * @param {Object} props.stock - 종목 정보
 * @param {number} props.shares - 보유 수량
 * @param {number} props.avgPrice - 평균 매입가
 * @param {string[]} props.gradient - 그라데이션 색상 [from, to]
 * @param {function} props.onClick - 클릭 핸들러
 */
export default function PortfolioItem({ stock, shares, avgPrice, gradient, onClick }) {
  const currentValue = stock.price * shares
  const investedValue = avgPrice * shares
  const profit = currentValue - investedValue
  const profitPercent = (currentValue / investedValue - 1) * 100

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-white rounded-xl p-3 cursor-pointer border border-dark-600 hover:border-dark-400 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}80, ${gradient[1]}80)`,
          }}
        >
          {stock.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-dark-50">{stock.name}</h4>
          <p className="text-dark-300 text-sm font-medium">{shares}주 보유</p>
        </div>
        <svg
          className="w-5 h-5 text-dark-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-dark-300 text-xs mb-1 font-medium">현재 가치</p>
          <p className="text-dark-50 font-semibold">{formatCurrency(currentValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-dark-300 text-xs mb-1 font-medium">수익률</p>
          <p className={cn('font-semibold', getChangeColor(profitPercent))}>
            {getChangeArrow(profitPercent)} {formatPercent(profitPercent)}
          </p>
        </div>
      </div>

      {/* 손익 바 */}
      <div className="mt-3 pt-3 border-t border-dark-700">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-dark-300 font-medium">평가손익</span>
          <span className={getChangeColor(profit)}>
            {profit >= 0 ? '+' : ''}
            {formatCurrency(profit, { suffix: '' })}
          </span>
        </div>
        <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(profitPercent), 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn('h-full rounded-full', profit >= 0 ? 'bg-emerald-500' : 'bg-red-500')}
          />
        </div>
      </div>
    </motion.div>
  )
}
