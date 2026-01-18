import { motion } from 'framer-motion'
import { cn } from '../../../utils/helpers'
import { getStockDisplay } from '../../../utils/stockDisplay'
import { Stock } from '../../../contexts/StockContext'

interface AIPickCardProps {
  topStock: Stock | undefined
  mbti: string
  aiEnabled: boolean
  onStockClick: (stock: Stock) => void
}

export default function AIPickCard({
  topStock,
  mbti,
  aiEnabled,
  onStockClick
}: AIPickCardProps) {
  if (!topStock || !aiEnabled) return null

  const display = getStockDisplay(topStock)
  const pickMessage = topStock.aiMessage || `${mbti} 투자자에게 가장 적합한 종목입니다.`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-2xl bg-linear-to-br from-primary-50 to-indigo-50 border border-primary-100 shadow-sm cursor-pointer"
      onClick={() => onStockClick(topStock)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-tight">AI's Pick</span>
          <span className="text-sm font-bold text-secondary-900 truncate max-w-[120px]">{topStock.name}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-secondary-900">{display.formattedPrice}</div>
          <div className={cn("text-xs font-medium", display.changeColorClass)}>
            {display.changeSymbol}{display.formattedChangePercent}
          </div>
        </div>
      </div>
      <p className="text-xs text-secondary-600 leading-relaxed font-medium break-keep">
        {pickMessage}
      </p>
    </motion.div>
  )
}
