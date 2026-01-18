import { ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * 바텀 시트 공통 컴포넌트
 * - 하단에서 슬라이드 업
 * - 드래그로 닫기
 * - 배경 클릭 시 닫기
 */
export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)



  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 40, 
              stiffness: 400,
              mass: 0.8,
              restDelta: 0.001
            }}
            className="fixed inset-0 z-50 bg-white flex flex-col"
            style={{ touchAction: 'none' }}
          >
            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-white">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
