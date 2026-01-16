import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { cn } from '../../utils/helpers'
import { useStockContext } from '../../contexts/StockContext'

interface Transaction {
  ticker: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  total_amount: number
  executed_at: string
}

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { stocks } = useStockContext()
  const stock = stocks.find((s) => s.ticker === transaction.ticker)
  const isBuy = transaction.type === 'BUY'

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl p-3 border border-dark-600 shadow-sm flex items-center gap-3"
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0',
          isBuy ? 'bg-accent-bull/10 text-accent-bull' : 'bg-accent-bear/10 text-accent-bear'
        )}
      >
        {isBuy ? '🛍️' : '💰'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-dark-50 truncate">
            {stock?.name || transaction.ticker}
            <span className="ml-2 text-[10px] font-medium text-dark-300">{transaction.ticker}</span>
          </h4>
          <span
            className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded',
              isBuy ? 'bg-accent-bull/10 text-accent-bull' : 'bg-accent-bear/10 text-accent-bear'
            )}
          >
            {isBuy ? '매수' : '매도'}
          </span>
        </div>
        <div className="flex justify-between items-end mt-1">
          <p className="text-xs text-dark-300 font-medium">
            {transaction.quantity}주 · {formatCurrency(transaction.price)}
          </p>
          <p className="text-sm font-bold text-dark-50">
            {isBuy ? '-' : '+'}
            {formatCurrency(transaction.total_amount)}
          </p>
        </div>
        <p className="text-[10px] text-dark-400 mt-1">{formatDate(transaction.executed_at)}</p>
      </div>
    </motion.div>
  )
}
