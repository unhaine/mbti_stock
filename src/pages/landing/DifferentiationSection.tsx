import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, ArrowRight, ArrowDown, ChevronDown } from 'lucide-react'
import Button from '../../components/common/Button'

interface DifferentiationSectionProps {
  onScrollDown?: () => void
}

const DifferentiationSection = forwardRef<HTMLDivElement, DifferentiationSectionProps>(
  ({ onScrollDown }, ref) => {
    const navigate = useNavigate()

    return (
      <section
        ref={ref}
        className="relative min-h-screen snap-start flex flex-col justify-center py-20 md:py-24 px-6 z-10 bg-linear-to-b from-white to-secondary-50/20 overflow-hidden"
      >
        {/* 장식용 요소 */}
        <div className="absolute bottom-0 right-0 w-[60vw] md:w-[40vw] h-[60vw] md:h-[40vw] bg-secondary-500/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto w-full">
          {/* 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-block px-3 py-1 bg-dark-800 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Comparison
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-dark-50 mb-3 md:mb-4 tracking-tight leading-tight">
              어렵기만 한 주식 공부,
              <br />
              <span className="gradient-text">이제 재미있게</span> 시작하세요
            </h2>
          </motion.div>

          {/* 비교 카드 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-20 relative">
            {/* 중앙 아이콘 (데스크톱: ArrowRight, 모바일: ArrowDown) */}
            <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-dark-600 shadow-lg items-center justify-center z-10 md:flex">
              <ArrowRight className="hidden md:block w-5 h-5 text-dark-300" />
              <ArrowDown className="md:hidden w-5 h-5 text-dark-300" />
            </div>

            {/* 기존 방식 (좌측) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 bg-dark-50/5 border border-dark-600 rounded-4xl md:rounded-4xl relative opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-dark-400" />
                <span className="text-dark-300 font-black text-[10px] md:text-xs uppercase tracking-widest">
                  Complex Finance
                </span>
              </div>
              <div className="text-dark-200 text-xs md:text-sm leading-relaxed p-3 md:p-4 bg-dark-900/5 rounded-2xl italic">
                "EPS 성장률이 12% 하락했으며, 현재 PER은 업종 평균 대비..."
              </div>
              <p className="text-[10px] md:text-[11px] text-dark-400 font-bold">
                지루하고 어려운 분석 데이터
              </p>
            </motion.div>

            {/* MBTI 방식 (우측) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 bg-white border-2 border-primary-500 rounded-4xl md:rounded-4xl shadow-2xl shadow-primary-500/10 relative mt-4 md:mt-0"
            >
              <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 px-3 py-1 md:px-4 md:py-1.5 bg-primary-500 text-white text-[8px] md:text-[10px] font-black rounded-full shadow-lg">
                BEST
              </div>
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary-500" />
                <span className="text-primary-600 font-black text-[10px] md:text-xs uppercase tracking-widest">
                  AI Storytelling
                </span>
              </div>
              <div className="text-dark-50 text-sm md:text-base font-bold leading-relaxed p-3 md:p-4 bg-primary-50 rounded-2xl">
                "INTJ인 당신에게, <span className="text-primary-600">신중하게 성을 쌓는 듯한</span>{' '}
                종목이 추천됩니다."
              </div>
              <p className="text-[10px] md:text-[11px] text-dark-400 font-bold">
                나의 언어로 들려주는 투자 이야기
              </p>
            </motion.div>
          </div>

          {/* 최종 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-white border border-dark-600 rounded-5xl md:rounded-5xl p-8 md:p-10 shadow-2xl shadow-dark-900/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

              <h2 className="text-xl md:text-2xl font-black text-dark-50 mb-2 tracking-tight">
                준비되셨나요?
              </h2>
              <p className="text-dark-200 mb-6 md:mb-8 text-sm md:text-base font-medium opacity-80">
                당신만의 투자 캐릭터가 기다리고 있습니다.
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  fullWidth
                  onClick={() => navigate('/onboarding')}
                  className="h-14 md:h-16 text-base md:text-lg font-black shadow-xl shadow-primary-500/20"
                >
                  🚀 지금 바로 시작하기
                </Button>
              </motion.div>
            </div>

            <p className="mt-6 md:mt-8 text-[9px] md:text-[11px] font-black text-dark-400 uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-50">
              Professional AI analysis for your growth
            </p>
          </motion.div>
        </div>

        {/* 다음 섹션으로 이동 버튼 (푸터로 이동 가능성) */}
        {onScrollDown && (
          <button
            onClick={onScrollDown}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="p-1.5 rounded-full border border-dark-700/10 group-hover:border-primary-500 transition-colors bg-white/50 backdrop-blur-sm"
            >
              <ChevronDown className="w-4 h-4 text-dark-400 group-hover:text-primary-500" />
            </motion.div>
          </button>
        )}
      </section>
    )
  }
)

DifferentiationSection.displayName = 'DifferentiationSection'
export default DifferentiationSection
