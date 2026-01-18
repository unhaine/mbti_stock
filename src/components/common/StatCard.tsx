import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
}

/**
 * 통계 아이템 - 플랫 스타일
 */
export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="py-3 border-b border-secondary-100 last:border-b-0">
      <p className="text-xs text-secondary-500 mb-1">{label}</p>
      <p className="text-sm font-bold text-secondary-900">{value}</p>
    </div>
  )
}
