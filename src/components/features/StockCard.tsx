import { motion } from 'framer-motion'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { getChangeColor, getChangeArrow, cn } from '../../utils/helpers'
import { Stock } from '../../contexts/StockContext'

interface StockCardProps {
  stock: Stock
  index?: number
  gradient: string[]
  onClick?: () => void
  mbti?: string
}

/**
 * 종목 카드 컴포넌트
 */
export default function StockCard({ stock, index = 0, gradient, onClick, mbti }: StockCardProps) {
  // 기본 코멘트 (metaphors에서 가져옴)
  const defaultComment =
    (mbti && stock.metaphors?.[mbti]) ||
    stock.metaphors?.default ||
    stock.description ||
    '이 종목은 당신의 투자 스타일과 잘 어울립니다.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-4 cursor-pointer border border-dark-600 hover:border-dark-400 active:bg-secondary-50 transition-all shadow-sm relative group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg shadow-primary-500/20"
            style={{
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
          >
            {stock.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="text-lg font-black text-dark-50 truncate leading-tight">{stock.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-dark-300 text-xs font-medium">{stock.sector}</span>
              {stock.dividendYield > 0 && (
                <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                  배당 {stock.dividendYield}%
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-black text-dark-50 leading-tight">
            {formatCurrency(stock.price)}
          </p>
          <p
            className={cn(
              'text-xs font-bold mt-1 flex items-center justify-end gap-1',
              getChangeColor(stock.changePercent)
            )}
          >
            <span className="text-[10px]">{getChangeArrow(stock.changePercent)}</span>
            {formatPercent(stock.changePercent)}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-1.5 grayscale-[0.5] group-hover:grayscale-0 transition-all">
            <span className="text-sm mt-0.5" role="img" aria-label="speech">
              💬
            </span>
            <p className="text-[11px] text-indigo-500/80 font-bold leading-relaxed italic">
              "{defaultComment}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
