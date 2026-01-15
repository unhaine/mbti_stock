import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { setOnboarded } from '../utils/storage'
import { useMBTI } from '../hooks'

// JSON 데이터
import profilesData from '../data/mbti-profiles.json'

// 로딩 메시지
const loadingSteps = [
  { icon: '🔍', text: 'MBTI 성향 분석 중...' },
  { icon: '📊', text: '투자 스타일 파악 중...' },
  { icon: '🎯', text: '맞춤 테마 선정 중...' },
  { icon: '💎', text: '추천 종목 매칭 중...' },
  { icon: '✨', text: '투자 캐릭터 생성 완료!' },
]

export default function LoadingPage() {
  const navigate = useNavigate()
  const [mbti] = useMBTI()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // MBTI 프로필
  const mbtiProfile = useMemo(() => {
    if (!mbti) return null
    return profilesData.find((p) => p.id === mbti)
  }, [mbti])

  // 프로그레스 애니메이션
  useEffect(() => {
    const stepDuration = 600 // 각 단계 600ms
    const totalDuration = stepDuration * loadingSteps.length
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      const newStep = Math.min(
        Math.floor((elapsed / totalDuration) * loadingSteps.length),
        loadingSteps.length - 1
      )

      setProgress(newProgress)
      setCurrentStep(newStep)

      if (newProgress >= 100) {
        setIsComplete(true)
        // 잠시 후 메인 페이지로 이동
        setTimeout(() => {
          setOnboarded()
          navigate('/main', { replace: true })
        }, 800)
      } else {
        requestAnimationFrame(updateProgress)
      }
    }

    const animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [navigate])

  if (!mbti) {
    navigate('/onboarding', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      {/* 배경 효과 */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: mbtiProfile
              ? `radial-gradient(circle, ${mbtiProfile.gradient[0]}40, transparent)`
              : 'radial-gradient(circle, var(--color-primary-500) 40, transparent)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: mbtiProfile
              ? `radial-gradient(circle, ${mbtiProfile.gradient[1]}40, transparent)`
              : 'radial-gradient(circle, var(--color-primary-600) 40, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* MBTI 아이콘 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 30px ${mbtiProfile?.gradient[0]}40`,
                `0 0 60px ${mbtiProfile?.gradient[0]}60`,
                `0 0 30px ${mbtiProfile?.gradient[0]}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-32 h-32 rounded-3xl flex items-center justify-center relative"
            style={{
              background: mbtiProfile
                ? `linear-gradient(135deg, ${mbtiProfile.gradient[0]}, ${mbtiProfile.gradient[1]})`
                : 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl"
            >
              {mbtiProfile?.emoji || '🎮'}
            </motion.span>

            {/* 회전 링 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-3xl border-2 border-dashed border-dark-50/20"
            />
          </motion.div>
        </motion.div>

        {/* MBTI 타입 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-dark-50 mb-2">{mbti}</h1>
          <p className="text-dark-200 text-lg">{mbtiProfile?.tagline}</p>
        </motion.div>

        {/* 프로그레스 바 */}
        <div className="mb-6">
          <div className="h-2 bg-dark-300/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: mbtiProfile
                  ? `linear-gradient(90deg, ${mbtiProfile.gradient[0]}, ${mbtiProfile.gradient[1]})`
                  : 'linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600))',
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-dark-300 text-sm">분석 중</span>
            <span className="text-dark-50 text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 로딩 메시지 */}
        <div className="h-20 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-5 py-3 rounded-2xl border border-dark-600">
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-2xl"
                >
                  {loadingSteps[currentStep]?.icon}
                </motion.span>
                <span className="text-dark-50 font-medium">{loadingSteps[currentStep]?.text}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 완료 상태 */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-5xl mb-4"
              >
                🎉
              </motion.div>
              <p className="text-primary-400 font-semibold">
                분석 완료! 메인 화면으로 이동합니다...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 팁 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-dark-300 text-sm">
            💡 <span className="text-dark-100">{mbti}</span> 유형은{' '}
            <span className="text-dark-100">{mbtiProfile?.investmentStyle}</span> 스타일이에요
          </p>
        </motion.div>
      </div>
    </div>
  )
}
