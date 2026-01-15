import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, getChangeArrow, cn } from '../../utils/helpers'

/**
 * 종목 카드 컴포넌트
 * @param {Object} props
 * @param {Object} props.stock - 종목 정보
 * @param {number} [props.index=0] - 애니메이션 딜레이용 인덱스
 * @param {string[]} props.gradient - 그라데이션 색상 [from, to]
 * @param {function} props.onClick - 클릭 핸들러
 * @param {string} [props.mbti] - 사용자 MBTI (맞춤 코멘트용)
 */
export default function StockCard({ stock, index = 0, gradient, onClick, mbti }) {
  const comment = stock.metaphors?.[mbti] || stock.metaphors?.default || stock.description

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl p-3 cursor-pointer border border-dark-600 hover:border-dark-400 active:bg-secondary-50 transition-all shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}90, ${gradient[1]}90)`,
          }}
        >
          {stock.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-dark-50 truncate">{stock.name}</h4>
            {stock.volatility === 'very-high' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 shrink-0 font-medium">
                🔥
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-dark-300 text-xs">{stock.sector}</span>
            {stock.dividendYield > 0 && (
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 rounded font-medium">
                배당 {stock.dividendYield}%
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-dark-50">{formatCurrency(stock.price)}</p>
          <p className={cn('text-xs font-medium', getChangeColor(stock.changePercent))}>
            {getChangeArrow(stock.changePercent)} {formatPercent(stock.changePercent)}
          </p>
        </div>
      </div>

      {/* MBTI 맞춤 코멘트 추가 */}
      <div className="pt-3 border-t border-dark-600/50">
        <p className="text-xs text-indigo-600 flex items-start gap-1.5 leading-relaxed font-medium ">
          <span className="text-base leading-none">💬</span>
          <span>"{comment}"</span>
        </p>
      </div>
    </motion.div>
  )
}
