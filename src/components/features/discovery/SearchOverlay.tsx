import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '../../../utils/helpers'
import { getStockDisplay } from '../../../utils/stockDisplay'
import { Stock } from '../../../contexts/StockContext'
import StockLogo from '../../ui/stock-logo'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filteredStocks: Stock[]
  onStockClick: (stock: Stock) => void
}

export default function SearchOverlay({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  filteredStocks,
  onStockClick
}: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="종목명 또는 티커 검색"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="flex-1 text-lg outline-none"
            />
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            {filteredStocks.map((stock) => {
              const display = getStockDisplay(stock)
              return (
                <button
                  key={stock.ticker}
                  onClick={() => onStockClick(stock)}
                  className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-50 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <StockLogo 
                      code={stock.ticker} 
                      name={stock.name} 
                      size="md" 
                      className="shrink-0"
                    />
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{stock.name}</div>
                      <div className="text-xs text-gray-500">{stock.ticker} · {stock.sector}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{display.formattedPrice}</div>
                    <div className={cn("text-sm", display.changeColorClass)}>
                      {display.changeSymbol}{display.formattedChangePercent}
                    </div>
                  </div>
                </button>
              )
            })}
            {searchQuery && filteredStocks.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
