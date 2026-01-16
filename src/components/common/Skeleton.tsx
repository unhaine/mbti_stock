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
 * 기본 스켈레톤 로더
 */
export default function Skeleton({
  width = '100%',
  height = '20px',
  className = '',
  rounded = 'lg',
}: SkeletonProps) {
  return (
    <motion.div
      className={cn('bg-dark-700', `rounded-${rounded}`, className)}
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
 * 종목 카드 스켈레톤
 */
export function StockCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-dark-700">
      <div className="flex items-center gap-4">
        {/* 아이콘 */}
        <Skeleton width="48px" height="48px" className="rounded-full shrink-0" />

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <Skeleton width="120px" height="16px" className="mb-2" />
          <Skeleton width="80px" height="14px" />
        </div>

        {/* 가격 */}
        <div className="text-right shrink-0">
          <Skeleton width="80px" height="18px" className="mb-2 ml-auto" />
          <Skeleton width="50px" height="14px" className="ml-auto" />
        </div>
      </div>
    </div>
  )
}

/**
 * 게시글 카드 스켈레톤
 */
export function PostCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-dark-700">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton width="36px" height="36px" className="rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton width="100px" height="14px" className="mb-1" />
          <Skeleton width="60px" height="12px" />
        </div>
      </div>

      {/* 본문 */}
      <div className="space-y-2 mb-3">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="80%" height="14px" />
        <Skeleton width="60%" height="14px" />
      </div>

      {/* 푸터 */}
      <div className="flex gap-4">
        <Skeleton width="50px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>
    </div>
  )
}

/**
 * 포트폴리오 아이템 스켈레톤
 */
export function PortfolioItemSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-dark-700">
      <div className="flex items-center gap-4">
        {/* 아이콘 */}
        <Skeleton width="44px" height="44px" className="rounded-xl shrink-0" />

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <Skeleton width="100px" height="16px" className="mb-2" />
          <Skeleton width="70px" height="12px" />
        </div>

        {/* 가격 및 수익률 */}
        <div className="text-right shrink-0">
          <Skeleton width="90px" height="16px" className="mb-2 ml-auto" />
          <Skeleton width="60px" height="14px" className="ml-auto" />
        </div>
      </div>
    </div>
  )
}

/**
 * 자산 카드 스켈레톤
 */
export function AssetCardSkeleton() {
  return (
    <div className="bg-surface rounded-3xl p-6 border border-dark-700">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton width="48px" height="48px" className="rounded-2xl shrink-0" />
          <div>
            <Skeleton width="80px" height="16px" className="mb-1" />
            <Skeleton width="120px" height="12px" />
          </div>
        </div>
      </div>

      {/* 자산 */}
      <div className="mb-4">
        <Skeleton width="180px" height="32px" className="mb-2" />
        <Skeleton width="100px" height="16px" />
      </div>

      {/* 코멘트 */}
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="70%" height="14px" />
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
        <Skeleton width="150px" height="20px" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="8px" height="8px" className="rounded-full" />
          ))}
        </div>
      </div>
      <div className="px-4">
        <Skeleton width="100%" height="80px" className="rounded-2xl" />
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
  gap = 'space-y-3',
  className = '',
}: SkeletonListProps) {
  return (
    <div className={cn(gap, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Component />
        </motion.div>
      ))}
    </div>
  )
}
