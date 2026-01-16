import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/helpers'

export interface SortOption {
  value: string
  label: string
  icon?: string
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'profit', label: '수익률순', icon: '📈' },
  { value: 'amount', label: '금액순', icon: '💰' },
  { value: 'name', label: '이름순', icon: '🔤' },
  { value: 'recent', label: '최근 거래순', icon: '🕐' },
]

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
  options?: SortOption[]
  className?: string
}

/**
 * 정렬 드롭다운 컴포넌트
 */
export default function SortDropdown({
  value,
  onChange,
  options = DEFAULT_SORT_OPTIONS,
  className = '',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-dark-200 hover:border-dark-500 hover:bg-dark-700 transition-colors"
      >
        <span className="text-sm">{selectedOption?.icon}</span>
        <span className="text-sm font-medium">{selectedOption?.label}</span>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* 드롭다운 메뉴 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 bg-dark-800 border border-dark-600 rounded-xl shadow-lg z-50 min-w-[160px] overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-2.5 flex items-center gap-3 hover:bg-dark-700 transition-colors border-b border-dark-700 last:border-0',
                    value === option.value && 'bg-dark-700'
                  )}
                >
                  <span className="text-base">{option.icon}</span>
                  <span className="text-sm font-medium text-dark-50">{option.label}</span>
                  {value === option.value && <span className="ml-auto text-primary-500">✓</span>}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
