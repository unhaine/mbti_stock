import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import Button from './Button'

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  icon, 
  title, 
  description, 
  confirmLabel = "확인", 
  cancelLabel = "취소",
  confirmVariant = "primary" // 'primary' | 'danger'
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
          >
            <Card>
              <div className="text-center">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-dark-50 mb-2">
                  {title}
                </h3>
                <div className="text-dark-400 mb-6">
                  {description}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    variant={confirmVariant}
                    fullWidth
                    onClick={onConfirm}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
