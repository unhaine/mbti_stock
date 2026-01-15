import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useMBTI } from '../hooks'
import { MBTI_EMOJI, MBTI_DESC, MBTI_GROUPS_DISPLAY } from '../constants/mbti'
import { VALID_MBTI_TYPES } from '../utils/validators'
import { cn } from '../utils/helpers'
import Button from '../components/common/Button'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [, setMBTI] = useMBTI()
  const [selectedMBTI, setSelectedMBTI] = useState(null)

  const handleSelect = (mbti) => {
    setSelectedMBTI(mbti)
  }

  const handleConfirm = () => {
    if (!selectedMBTI) return

    setMBTI(selectedMBTI)
    navigate('/loading')
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      {/* 헤더 */}
      <header className="py-6 px-6">
        <button
          onClick={() => navigate('/')}
          className="text-dark-200 hover:text-dark-50 transition-colors"
        >
          ← 돌아가기
        </button>
      </header>

      {/* 메인 */}
      <main className="flex-1 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <h1 className="text-xl font-bold text-dark-50 mb-1">당신의 MBTI를 선택하세요</h1>
          <p className="text-dark-200 text-sm mb-6">
            성격 유형에 맞는 투자 스타일을 분석해드릴게요
          </p>

          {/* MBTI 그룹별 표시 */}
          <div className="space-y-6">
            {MBTI_GROUPS_DISPLAY.map((group) => (
              <div key={group.name}>
                <h2 className="text-dark-200 text-sm font-medium mb-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-linear-to-r ${group.color}`} />
                  {group.name}
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {group.types.map((type) => (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(type)}
                      className={cn(
                        'relative flex flex-col items-center py-2 px-1 rounded-lg border transition-all',
                        selectedMBTI === type
                          ? 'border-primary-500 bg-primary-500/15 shadow-glow'
                          : 'border-dark-600 bg-white hover:border-primary-200 hover:bg-secondary-50'
                      )}
                    >
                      {selectedMBTI === type && (
                        <div className="absolute top-1.5 right-1.5 text-primary-400 bg-white rounded-full p-0.5">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                      )}
                      <span className="text-xl mb-0.5">{MBTI_EMOJI[type]}</span>
                      <span
                        className={cn(
                          'font-bold text-xs',
                          selectedMBTI === type ? 'text-dark-50' : 'text-dark-200'
                        )}
                      >
                        {type}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] mt-0.5',
                          selectedMBTI === type ? 'text-primary-600' : 'text-dark-300'
                        )}
                      >
                        {MBTI_DESC[type]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-dark-900 via-dark-900 to-transparent">
        <div className="max-w-lg mx-auto">
          <Button size="lg" fullWidth disabled={!selectedMBTI} onClick={handleConfirm}>
            {selectedMBTI
              ? `${MBTI_EMOJI[selectedMBTI]} ${selectedMBTI}로 분석 시작`
              : 'MBTI를 선택해주세요'}
          </Button>
        </div>
      </div>
    </div>
  )
}
