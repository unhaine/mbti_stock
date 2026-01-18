import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext.tsx'
import { cn } from '../utils/helpers'
import HeroSection from './landing/HeroSection'
import FeatureSection from './landing/FeatureSection'
import PreviewSection from './landing/PreviewSection'
import DifferentiationSection from './landing/DifferentiationSection'
import SignupCTASection from './landing/SignupCTASection'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [onboardingStarted, setOnboardingStarted] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (!loading && user) {
      navigate('/main')
    }
  }, [user, loading, navigate])

  if (loading) return null

  const handleNext = () => {
    if (activeSlide < 3) {
      setActiveSlide(activeSlide + 1)
    }
  }

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1)
    }
  }

  // 온보딩 단계들 (Hero 제외)
  const onboardingSlides = [
    <FeatureSection />,
    <PreviewSection />,
    <DifferentiationSection />,
    <SignupCTASection />
  ]

  // 1. 시작 화면 (Hero)
  if (!onboardingStarted) {
    return (
      <HeroSection onScrollDown={() => setOnboardingStarted(true)} />
    )
  }

  const isLastSlide = activeSlide === onboardingSlides.length - 1

  // 2. 온보딩 캐로셀 화면
  return (
    <div className="h-screen bg-white overflow-hidden flex flex-col relative">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) handleNext()
              else if (info.offset.x > 100) handlePrev()
            }}
            className="absolute inset-0 touch-none"
          >
            {onboardingSlides[activeSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 고정 하단 버튼 영역 */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-white via-white/90 to-transparent pt-12">
        <div className="max-w-md mx-auto space-y-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => isLastSlide ? navigate('/signup') : handleNext()}
            className={cn(
              "w-full h-14 rounded-2xl font-black text-lg transition-all duration-300 shadow-lg",
              isLastSlide 
                ? "bg-primary-500 text-white shadow-primary-200" 
                : "bg-secondary-900 text-white shadow-secondary-200"
            )}
          >
            {isLastSlide ? "지금 가입하고 시작하기" : "다음"}
          </motion.button>

          {/* 하단 점 인디케이터 */}
          <div className="flex justify-center gap-2 pb-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  idx === activeSlide ? "bg-secondary-900 scale-125" : "bg-secondary-200"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
