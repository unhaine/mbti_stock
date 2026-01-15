import { motion } from 'framer-motion'

/**
 * 원형 진행률 컴포넌트
 * @param {Object} props
 * @param {number} props.percentage - 진행률 (0-100)
 * @param {number} [props.size=120] - 컴포넌트 크기 (px)
 * @param {number} [props.strokeWidth=8] - 선 두께 (px)
 * @param {string} [props.gradientFrom='#0ea5e9'] - 그라데이션 시작 색상
 * @param {string} [props.gradientTo='#d946ef'] - 그라데이션 끝 색상
 * @param {React.ReactNode} props.children - 중앙 콘텐츠
 */
export default function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  gradientFrom = '#0ea5e9',
  gradientTo = '#d946ef',
  children,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  // 고유 ID 생성 (여러 인스턴스 사용 시 충돌 방지)
  const gradientId = `circular-gradient-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-200"
        />
        {/* 진행률 원 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
