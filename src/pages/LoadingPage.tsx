import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { setOnboarded } from '../utils/storage'
import { useMBTI } from '../hooks'
import profilesData from '../data/mbti-profiles.json'
import gamificationData from '../data/gamification.json'

// MBTI 그룹 매핑
const getMBTIGroup = (mbti: string): 'Analyst' | 'Diplomat' | 'Sentinel' | 'Explorer' => {
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(mbti)) return 'Analyst'
  if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(mbti)) return 'Diplomat'
  if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(mbti)) return 'Sentinel'
  return 'Explorer'
}

export default function LoadingPage() {
  const navigate = useNavigate()
  const [mbti] = useMBTI()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const mbtiProfile = useMemo(() => {
    if (!mbti) return null
    return profilesData.find((p) => p.id === mbti)
  }, [mbti])

  // MBTI별 로딩 메시지 가져오기
  const loadingSteps = useMemo(() => {
    if (!mbti) return gamificationData.loadingMessages.default
    const group = getMBTIGroup(mbti)
    return gamificationData.loadingMessages[group] || gamificationData.loadingMessages.default
  }, [mbti])

  useEffect(() => {
    const stepDuration = 1200
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
  }, [navigate, loadingSteps])

  if (!mbti) {
    navigate('/onboarding', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {/* MBTI 타입 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-secondary-900 mb-2">{mbti}</h1>
          <p className="text-secondary-500 text-sm">{mbtiProfile?.tagline}</p>
        </motion.div>

        {/* 프로그레스 바 - 미니멀 */}
        <div className="mb-8">
          <div className="h-1 bg-secondary-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-secondary-400 text-xs">AI 분석 중</span>
            <span className="text-secondary-900 text-xs font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 로딩 메시지 */}
        <div className="h-12 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-secondary-700 text-sm font-medium">
                {loadingSteps[currentStep]?.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 완료 상태 */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <p className="text-primary-500 font-bold text-sm">
                캐릭터 생성 완료! 메인 화면으로 이동합니다...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 팁 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <p className="text-secondary-400 text-xs">
            <span className="text-secondary-900 font-bold">{mbti}</span> 유형은{' '}
            <span className="text-secondary-900">{mbtiProfile?.investmentStyle}</span> 스타일이에요
          </p>
        </motion.div>
      </div>
    </div>
  )
}
