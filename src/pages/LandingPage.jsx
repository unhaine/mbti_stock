import { useRef } from 'react'
import FloatingParticles from '../components/effects/FloatingParticles'
import HeroSection from './landing/HeroSection'
import FeatureSection from './landing/FeatureSection'
import PreviewSection from './landing/PreviewSection'
import DifferentiationSection from './landing/DifferentiationSection'

export default function LandingPage() {
  const containerRef = useRef(null)
  const featuresRef = useRef(null)

  const handleScrollDown = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={containerRef}
      className="h-screen bg-dark-900 overflow-y-auto snap-y snap-mandatory scroll-smooth overflow-x-hidden"
    >
      {/* 배경 효과 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingParticles />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary-500/15 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl opacity-50" />
      </div>

      <HeroSection onScrollDown={handleScrollDown} />
      <FeatureSection ref={featuresRef} />
      <PreviewSection />
      <DifferentiationSection />

      {/* 푸터 */}
      <footer className="py-8 text-center text-dark-300 text-sm border-t border-dark-600 snap-align-none">
        <p className="mb-2">💡 엔터테인먼트 목적 · 투자 조언 아님</p>
        <p>© 2026 MBTI 투자 캐릭터 생성기</p>
      </footer>
    </div>
  )
}
