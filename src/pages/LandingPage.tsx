import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.tsx'
import FloatingParticles from '../components/effects/FloatingParticles'
import HeroSection from './landing/HeroSection'
import FeatureSection from './landing/FeatureSection'
import PreviewSection from './landing/PreviewSection'
import DifferentiationSection from './landing/DifferentiationSection'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const diffRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && user) {
      navigate('/main')
    }
  }, [user, loading, navigate])

  if (loading) return null

  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToPreview = () => previewRef.current?.scrollIntoView({ behavior: 'smooth' })
  const scrollToDiff = () => diffRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div
      ref={containerRef}
      className="h-screen bg-white overflow-y-auto snap-y snap-proximity scroll-smooth overflow-x-hidden selection:bg-primary-100 selection:text-primary-600"
    >
      {/* 프리미엄 배경 레이어 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingParticles />
        {/* 블러 레이어들 - 더 부드럽고 몽환적으로 조정 */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary-200/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] left-[-20%] w-[60vw] h-[60vw] bg-secondary-200/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-primary-100/15 rounded-full blur-[100px]" />

        {/* 미세한 그리드 패턴 (선택사항 - 더 깨끗한 느낌을 위해 얇은 라인 추가) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10">
        <HeroSection onScrollDown={scrollToFeatures} />
        <FeatureSection ref={featuresRef} onScrollDown={scrollToPreview} />
        <PreviewSection ref={previewRef} onScrollDown={scrollToDiff} />
        <DifferentiationSection ref={diffRef} />

        {/* 푸터 - 더 깔끔하게 다듬기 */}
        <footer className="py-16 text-center text-dark-300 text-sm snap-align-none bg-white">
          <div className="max-w-md mx-auto px-6">
            <div className="w-12 h-0.5 bg-dark-700/50 mx-auto mb-8" />
            <p className="mb-3 font-medium text-dark-400">💡 엔터테인먼트 목적 · 투자 조언 아님</p>
            <p className="opacity-60 text-[11px] uppercase tracking-widest font-bold">
              © 2026 MBTI STOCK · ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
