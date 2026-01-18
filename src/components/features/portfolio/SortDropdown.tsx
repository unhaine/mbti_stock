import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../utils/helpers'

export interface SortOption {
  value: string
  label: string
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'profit', label: '수익률순' },
  { value: 'amount', label: '금액순' },
  { value: 'name', label: '이름순' },
  { value: 'recent', label: '최근 거래순' },
]

interface SortDropdownProps {
  value: string
  onChange: (value: string) => void
  options?: SortOption[]
  className?: string
}

/**
 * 정렬 드롭다운 컴포넌트 - 미니멀 스타일
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
        className="flex items-center gap-1 text-sm text-secondary-500 hover:text-secondary-900 transition-colors"
      >
        <span>{selectedOption?.label}</span>
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 bg-white border border-secondary-100 rounded-xl shadow-lg z-50 min-w-[140px] overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-3 text-left text-sm transition-colors border-b border-secondary-100 last:border-0',
                    value === option.value
                      ? 'font-bold text-secondary-900 bg-secondary-50'
                      : 'text-secondary-600 hover:bg-secondary-50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
