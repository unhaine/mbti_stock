import { motion } from 'framer-motion'

/**
 * 토글 스위치 컴포넌트
 * @param {Object} props
 * @param {boolean} props.checked - 체크 상태
 * @param {function} props.onChange - 상태 변경 콜백
 * @param {boolean} [props.disabled] - 비활성화 여부
 */
export default function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-7 rounded-full transition-colors ${
        checked ? 'bg-primary-500' : 'bg-dark-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
      />
    </button>
  )
}
