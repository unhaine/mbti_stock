import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PullToRefreshWrapper from '../../common/PullToRefreshWrapper'
import { StockCardSkeleton, SkeletonList } from '../../common/Skeleton'
import StockCard from './StockCard'
import AIPickCard from './AIPickCard'
import { Stock } from '../../../contexts/StockContext'

interface StockListSectionProps {
  isLoading: boolean
  onRefresh: () => Promise<void>
  selectedTheme: number
  swipeDirection: number
  themeStocks: Stock[]
  topStock?: Stock
  mbti: string
  aiEnabled: boolean
  onStockClick: (stock: Stock) => void
  onSwipe: (direction: 'left' | 'right') => void
  mbtiProfileGradient?: string[]
}

export default function StockListSection({
  isLoading,
  onRefresh,
  selectedTheme,
  swipeDirection,
  themeStocks,
  topStock,
  mbti,
  aiEnabled,
  onStockClick,
  onSwipe,
  mbtiProfileGradient
}: StockListSectionProps) {
  const stockListRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex-1 min-h-0 relative">
      <PullToRefreshWrapper onRefresh={onRefresh}>
        <div ref={stockListRef} className="px-4 py-2">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <SkeletonList count={8} Component={StockCardSkeleton} gap="space-y-0" />
            ) : (
              <motion.div
                key={selectedTheme}
                initial={{ opacity: 0, x: swipeDirection * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -swipeDirection * 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -100) onSwipe('left')
                  else if (info.offset.x > 100) onSwipe('right')
                }}
              >
                {/* 최상단 AI 추천 카드 */}
                <AIPickCard 
                  topStock={topStock}
                  mbti={mbti}
                  aiEnabled={aiEnabled}
                  onStockClick={onStockClick}
                />

                {themeStocks.map((stock, index) => (
                  <StockCard
                    key={stock.ticker}
                    stock={stock}
                    index={index}
                    gradient={mbtiProfileGradient}
                    onClick={() => onStockClick(stock)}
                    mbti={mbti}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PullToRefreshWrapper>
    </div>
  )
}
