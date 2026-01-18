import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useMBTI } from '../hooks'
import { MBTI_DESC, MBTI_GROUPS_DISPLAY } from '../constants/mbti'
import { cn } from '../utils/helpers'
import mbtiProfiles from '../data/mbti-profiles.json'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [, setMBTI] = useMBTI()
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null)

  const handleSelect = (mbti: string) => {
    setSelectedMBTI(mbti)
  }

  const handleConfirm = () => {
    if (!selectedMBTI) return
    setMBTI(selectedMBTI)
    navigate('/loading')
  }

  // 진행률 계산 (1/3)
  const progress = selectedMBTI ? 100 : 33

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <header className="shrink-0 h-12 px-4 flex items-center justify-between border-b border-secondary-100">
        <button
          onClick={() => navigate('/')}
          className="text-secondary-500 text-sm hover:text-secondary-900 transition-colors"
        >
          ← 돌아가기
        </button>
        <button
          onClick={() => navigate('/main')}
          className="text-secondary-400 text-sm hover:text-secondary-600 transition-colors"
        >
          건너뛰기
        </button>
      </header>

      {/* 메인 */}
      <main className="flex-1 px-4 pb-24 overflow-y-auto">
        <div className="max-w-md mx-auto pt-6">
          {/* Progress */}
          <div className="mb-6">
            <p className="text-secondary-400 text-xs mb-2">Step 1 of 1</p>
            <div className="h-1 bg-secondary-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-secondary-900 rounded-full"
                initial={{ width: '33%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-xl font-bold text-secondary-900 mb-2">
              당신의 MBTI를 선택하세요
            </h1>
            <p className="text-secondary-500 text-sm">
              성격 유형에 맞는 투자 스타일을 분석해드릴게요
            </p>
          </motion.div>

          {/* MBTI 선택 - Flat Style with 구분선 */}
          <div className="space-y-6">
            {MBTI_GROUPS_DISPLAY.map((group) => (
              <div key={group.name}>
                {/* 그룹 타이틀 */}
                <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                  {group.name}
                </h2>
                
                {/* MBTI 리스트 */}
                <div className="divide-y divide-secondary-100">
                  {group.types.map((type) => {
                    const profile = mbtiProfiles.find((p) => p.id === type)
                    return (
                      <button
                        key={type}
                        onClick={() => handleSelect(type)}
                        className={cn(
                          'w-full py-4 flex items-center justify-between transition-colors',
                          selectedMBTI === type
                            ? 'bg-secondary-50 border-l-2 border-l-secondary-900 -ml-4 pl-4 pr-0'
                            : 'hover:bg-secondary-50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl w-8 text-center">{profile?.emoji}</div>
                          <div className="text-left">
                            <span className={cn(
                              'font-bold text-base block',
                              selectedMBTI === type ? 'text-secondary-900' : 'text-secondary-700'
                            )}>
                              {type}
                            </span>
                            <span className={cn(
                              'text-sm block',
                              selectedMBTI === type ? 'text-secondary-700' : 'text-secondary-400'
                            )}>
                              {(MBTI_DESC as any)[type]}
                            </span>
                          </div>
                        </div>
                        {selectedMBTI === type && (
                          <div className="w-2 h-2 rounded-full bg-secondary-900" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 하단 고정 CTA */}
      <div className="shrink-0 px-4 pb-6 pt-4 bg-white border-t border-secondary-100">
        <div className="max-w-md mx-auto">
          <button
            disabled={!selectedMBTI}
            onClick={handleConfirm}
            className={cn(
              'w-full h-12 rounded-xl font-bold transition-all duration-200',
              selectedMBTI
                ? 'bg-primary-500 text-white hover:bg-primary-600 active:scale-[0.98]'
                : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
            )}
          >
            {selectedMBTI ? `${selectedMBTI}로 분석 시작` : 'MBTI를 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  )
}
