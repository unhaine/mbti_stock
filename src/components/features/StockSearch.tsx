import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/helpers'
import { Stock } from '../../contexts/StockContext'

interface StockSearchProps {
  stocks: Stock[]
  onSelect?: (stock: Stock) => void
  className?: string
}

/**
 * 종목 검색 컴포넌트
 * 종목명, 코드, 섹터로 검색 가능
 */
export default function StockSearch({ stocks = [], onSelect, className = '' }: StockSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredStocks = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return stocks
      .filter(
        (stock) =>
          stock.name.toLowerCase().includes(lowerQuery) ||
          stock.ticker.toLowerCase().includes(lowerQuery) ||
          stock.sector?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 10) // 최대 10개만 표시
  }, [stocks, query])

  const handleSelect = (stock: Stock) => {
    onSelect?.(stock)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      {/* 검색 입력 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="종목명 또는 코드 검색..."
          className="w-full pl-10 pr-10 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-dark-50 placeholder-dark-400 focus:border-primary-500 focus:outline-none transition-colors text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-dark-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-dark-400 hover:text-dark-200" />
          </button>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-dark-800 border border-dark-600 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <button
                  key={stock.ticker}
                  onClick={() => handleSelect(stock)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-700 transition-colors border-b border-dark-700 last:border-0"
                >
                  <div className="text-left">
                    <div className="font-medium text-dark-50">{stock.name}</div>
                    <div className="text-xs text-dark-400">
                      {stock.ticker} · {stock.sector}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-dark-50">
                      {stock.price?.toLocaleString()}원
                    </div>
                    <div
                      className={cn(
                        'text-xs font-medium',
                        stock.changePercent > 0
                          ? 'text-red-400'
                          : stock.changePercent < 0
                          ? 'text-blue-400'
                          : 'text-dark-400'
                      )}
                    >
                      {stock.changePercent > 0 ? '+' : ''}
                      {stock.changePercent}%
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-dark-400">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm">검색 결과가 없습니다</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 클릭 외부 감지용 오버레이 */}
      {isOpen && query && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
