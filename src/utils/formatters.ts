/**
 * 포맷팅 유틸리티 함수
 */

interface CurrencyOptions {
  suffix?: string
  compact?: boolean
}

// 통화 포맷 (10,000원)
export function formatCurrency(
  value: number | null | undefined,
  options: CurrencyOptions = {}
): string {
  const { suffix = '원', compact = false } = options

  if (value === null || value === undefined) return '-'

  if (compact) {
    return formatCompact(value) + suffix
  }

  return new Intl.NumberFormat('ko-KR').format(value) + suffix
}

interface ChangeOptions {
  suffix?: string
  showSign?: boolean
}

// 변동 금액 포맷 (+500원, -500원)
export function formatChange(
  value: number | null | undefined,
  options: ChangeOptions = {}
): string {
  const { suffix = '원', showSign = true } = options

  if (value === null || value === undefined) return '-'

  const formatted = new Intl.NumberFormat('ko-KR').format(Math.abs(value))
  const sign = showSign ? (value >= 0 ? '+' : '-') : ''

  return `${sign}${formatted}${suffix}`
}

interface PercentOptions {
  decimals?: number
  showSign?: boolean
}

// 퍼센트 포맷 (+2.50%, -1.30%)
export function formatPercent(
  value: number | null | undefined,
  options: PercentOptions = {}
): string {
  const { decimals = 2, showSign = true } = options

  if (value === null || value === undefined) return '-'

  const sign = showSign ? (value >= 0 ? '+' : '') : ''

  return `${sign}${value.toFixed(decimals)}%`
}

type DateFormat = 'full' | 'date' | 'time' | 'relative' | 'short'

// 날짜 포맷
export function formatDate(
  date: string | number | Date | null | undefined,
  format: DateFormat = 'short'
): string {
  if (!date) return '-'

  const d = new Date(date)

  switch (format) {
    case 'full':
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d)

    case 'date':
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d)

    case 'time':
      return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d)

    case 'relative':
      return formatRelativeTime(d)

    case 'short':
    default:
      return new Intl.DateTimeFormat('ko-KR', {
        month: 'short',
        day: 'numeric',
      }).format(d)
  }
}

// 상대 시간 포맷 (5분 전, 3시간 전)
export function formatRelativeTime(date: string | number | Date): string {
  const now = new Date().getTime()
  const diff = now - new Date(date).getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}

// 숫자 축약 (1K, 1M, 1B)
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'

  const absValue = Math.abs(value)

  if (absValue >= 1e12) {
    return (value / 1e12).toFixed(1) + '조'
  }
  if (absValue >= 1e8) {
    return (value / 1e8).toFixed(1) + '억'
  }
  if (absValue >= 1e4) {
    return (value / 1e4).toFixed(1) + '만'
  }

  return new Intl.NumberFormat('ko-KR').format(value)
}

// 시가총액 포맷
export function formatMarketCap(value: number | null | undefined): string {
  if (!value) return '-'

  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}조`
  }
  if (value >= 1e8) {
    return `${(value / 1e8).toFixed(0)}억`
  }

  return formatCurrency(value, { compact: true })
}

const formatters = {
  formatCurrency,
  formatChange,
  formatPercent,
  formatDate,
  formatRelativeTime,
  formatCompact,
  formatMarketCap,
}

export default formatters
