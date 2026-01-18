import { formatCurrency, formatDate } from '../../../utils/formatters'
import { cn } from '../../../utils/helpers'
import { useStockContext } from '../../../contexts/StockContext'
import StockLogo from '../../ui/stock-logo'

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

/**
 * 거래 내역 아이템 - 플랫 스타일
 */
export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { stocks } = useStockContext()
  const stock = stocks.find((s) => s.ticker === transaction.ticker)
  const isBuy = transaction.type === 'BUY'

  return (
    <div className="py-4 border-b border-secondary-100">
      {/* 상단: 종목명 + 태그 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <StockLogo 
            code={transaction.ticker} 
            name={stock?.name || transaction.ticker} 
            size="sm" 
            className="shrink-0"
          />
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-bold text-secondary-900 truncate">
              {stock?.name || transaction.ticker}
            </span>
            <span className="text-xs text-secondary-400 shrink-0">{transaction.ticker}</span>
          </div>
        </div>
        <span
          className={cn(
            'text-xs font-bold px-2 py-0.5 rounded',
            isBuy 
              ? 'bg-success/10 text-success' 
              : 'bg-error/10 text-error'
          )}
        >
          {isBuy ? '매수' : '매도'}
        </span>
      </div>

      {/* 중단: 수량/가격 + 총액 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-secondary-500">
          {transaction.quantity}주 · {formatCurrency(transaction.price)}
        </span>
        <span className={cn(
          'font-bold',
          isBuy ? 'text-secondary-900' : 'text-success'
        )}>
          {isBuy ? '-' : '+'}
          {formatCurrency(transaction.total_amount)}
        </span>
      </div>

      {/* 하단: 날짜 */}
      <p className="text-xs text-secondary-400 mt-1">
        {formatDate(transaction.executed_at)}
      </p>
    </div>
  )
}
