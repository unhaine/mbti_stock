import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Sparkles } from 'lucide-react'
import Button from '../../components/common/Button'

interface HeroSectionProps {
  onScrollDown?: () => void
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <motion.section className="relative min-h-screen snap-start flex flex-col items-center justify-center px-6 py-10 md:py-20 z-10 overflow-hidden">
      {/* 장식용 배경 요소 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-primary-200/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* 로고 영역 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="relative mb-8 md:mb-12 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-primary-400 to-secondary-500 rounded-4xl flex items-center justify-center shadow-2xl shadow-primary-500/30 relative z-10"
            >
              <span className="text-4xl md:text-5xl drop-shadow-lg">💹</span>
            </motion.div>
            <div className="absolute inset-0 bg-primary-400 blur-2xl opacity-40 -z-10 animate-pulse" />
          </div>
        </motion.div>

        {/* 상단 포인트 태그 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-600 border border-primary-200 text-[10px] md:text-xs font-bold mb-6 tracking-wide uppercase"
        >
          <Sparkles size={12} />
          <span>성격 유형 기반 인공지능 분석</span>
        </motion.div>

        {/* 메인 타이틀 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl md:text-6xl font-black mb-4 md:mb-6 leading-[1.2] md:leading-[1.1] tracking-tight text-dark-50"
        >
          MBTI로 알아보는
          <br />
          <span className="gradient-text">나의 투자 성향</span>
        </motion.h1>

        {/* 설명 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-dark-200 text-base md:text-xl mb-8 md:mb-12 leading-relaxed max-w-lg mx-auto font-medium"
        >
          당신의 성격 속에 숨겨진
          <br />
          <span className="text-dark-50 font-bold border-b-2 border-primary-300">
            투자의 천재성
          </span>
          을 발견해보세요
        </motion.p>

        {/* CTA 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full max-w-sm"
          >
            <Button
              size="lg"
              fullWidth
              onClick={() => navigate('/signup')}
              className="h-14 md:h-16 text-base md:text-lg font-black shadow-2xl shadow-primary-500/20 rounded-2xl"
            >
              <span className="flex items-center justify-center gap-3">
                <span>🚀</span>
                <span>무료로 시작하기</span>
              </span>
            </Button>
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-dark-300 text-[10px] md:text-sm font-bold flex items-center gap-2 tracking-tight opacity-80 uppercase">
              <span className="w-6 md:w-8 h-px bg-dark-700/30" />
              <span>30초 분석 완료</span>
              <span className="w-6 md:w-8 h-px bg-dark-700/30" />
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 스크롤 다운 아이콘 - 모바일에서 위치 조정 */}
      <motion.button
        onClick={onScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-dark-400 mb-2 group-hover:text-primary-500 transition-colors">
          알아보기
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-1.5 rounded-full border border-dark-700/30 group-hover:border-primary-500 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-dark-400 group-hover:text-primary-500" />
        </motion.div>
      </motion.button>
    </motion.section>
  )
}
