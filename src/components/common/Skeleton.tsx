import { motion } from 'framer-motion'
import { cn } from '../../utils/helpers'
import { FC } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: string
}

/**
 * 기본 스켈레톤 로더 - 미니멀 스타일
 */
export default function Skeleton({
  width = '100%',
  height = '20px',
  className = '',
  rounded = 'lg',
}: SkeletonProps) {
  return (
    <motion.div
      className={cn('bg-secondary-100', `rounded-${rounded}`, className)}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/**
 * 종목 카드 스켈레톤 - 플랫 스타일
 */
export function StockCardSkeleton() {
  return (
    <div className="flex items-center py-4 border-b border-secondary-100">
      {/* 아이콘 */}
      <Skeleton width="40px" height="40px" rounded="lg" className="shrink-0 mr-3" />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <Skeleton width="100px" height="14px" className="mb-2" />
        <Skeleton width="70px" height="12px" />
      </div>

      {/* 가격 */}
      <div className="text-right shrink-0">
        <Skeleton width="70px" height="14px" className="mb-2 ml-auto" />
        <Skeleton width="45px" height="12px" className="ml-auto" />
      </div>
    </div>
  )
}

/**
 * 게시글 카드 스켈레톤 - 플랫 스타일
 */
export function PostCardSkeleton() {
  return (
    <div className="py-4 border-b border-secondary-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton width="32px" height="32px" rounded="full" className="shrink-0" />
        <Skeleton width="80px" height="12px" />
        <Skeleton width="40px" height="12px" />
      </div>

      {/* 본문 */}
      <div className="space-y-2 mb-3">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="85%" height="14px" />
      </div>

      {/* 푸터 */}
      <div className="flex gap-4">
        <Skeleton width="40px" height="12px" />
        <Skeleton width="40px" height="12px" />
      </div>
    </div>
  )
}

/**
 * 포트폴리오 아이템 스켈레톤 - 플랫 스타일
 */
export function PortfolioItemSkeleton() {
  return (
    <div className="flex items-center py-4 border-b border-secondary-100">
      {/* 아이콘 */}
      <Skeleton width="40px" height="40px" rounded="full" className="shrink-0 mr-3" />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <Skeleton width="90px" height="14px" className="mb-2" />
        <Skeleton width="60px" height="12px" />
      </div>

      {/* 가격 및 수익률 */}
      <div className="text-right shrink-0">
        <Skeleton width="80px" height="14px" className="mb-2 ml-auto" />
        <Skeleton width="50px" height="12px" className="ml-auto" />
      </div>
    </div>
  )
}

/**
 * 자산 카드 스켈레톤 - 플랫 스타일
 */
export function AssetCardSkeleton() {
  return (
    <div className="py-6">
      {/* 자산 */}
      <div className="text-center mb-4">
        <Skeleton width="180px" height="32px" className="mx-auto mb-2" />
        <Skeleton width="100px" height="16px" className="mx-auto" />
      </div>

      {/* 비율 */}
      <div className="divide-y divide-secondary-100">
        <div className="py-4 flex justify-between">
          <Skeleton width="40px" height="14px" />
          <Skeleton width="80px" height="14px" />
        </div>
        <div className="py-4 flex justify-between">
          <Skeleton width="40px" height="14px" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
    </div>
  )
}

/**
 * 테마 캐러셀 스켈레톤
 */
export function ThemeCarouselSkeleton() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3 px-4">
        <Skeleton width="120px" height="16px" />
        <Skeleton width="80px" height="14px" />
      </div>
      <div className="px-4">
        <Skeleton width="100%" height="60px" rounded="xl" />
      </div>
    </div>
  )
}

/**
 * 재무 데이터 탭 스켈레톤
 */
export function FinancialsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Health Card */}
      <Skeleton width="100%" height="140px" rounded="xl" />
      
      {/* Summary Card */}
      <Skeleton width="100%" height="100px" rounded="xl" />
      
      {/* Table */}
      <div className="space-y-3">
         <Skeleton width="80px" height="14px" />
         <div className="space-y-3 border-t border-secondary-100 pt-3">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="flex justify-between">
               <Skeleton width="60px" height="14px" />
               <Skeleton width="80px" height="14px" />
             </div>
           ))}
         </div>
      </div>
    </div>
  )
}

interface SkeletonListProps {
  count?: number
  Component?: FC
  gap?: string
  className?: string
}

/**
 * 스켈레톤 리스트 헬퍼
 */
export function SkeletonList({
  count = 5,
  Component = StockCardSkeleton,
  gap = 'space-y-0',
  className = '',
}: SkeletonListProps) {
  return (
    <div className={cn(gap, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.03 }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  )
}
