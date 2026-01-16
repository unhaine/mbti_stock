import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LANDING_FEATURES } from '../../constants/landing'
import { ChevronDown } from 'lucide-react'

interface FeatureSectionProps {
  onScrollDown?: () => void
}

const FeatureSection = forwardRef<HTMLDivElement, FeatureSectionProps>(({ onScrollDown }, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-screen snap-start flex flex-col justify-center py-10 md:py-24 px-4 md:px-6 z-10 bg-linear-to-b from-white to-secondary-50/30 overflow-hidden"
    >
      <div className="max-w-xl mx-auto w-full mb-12">
        {/* 섹션 헤더 - 더 콤팩트하게 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="inline-block px-2 py-0.5 bg-secondary-100 text-secondary-600 rounded-md text-[9px] font-black uppercase tracking-[0.2em] mb-3">
            Core Features
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-dark-50 mb-2 md:mb-4 tracking-tight leading-tight">
            왜 <span className="gradient-text">MBTI 투자</span>인가요?
          </h2>
          <p className="text-dark-200 text-xs md:text-base font-medium opacity-80">
            숫자보다 확실한 내 성격 맞춤 투자 경험
          </p>
        </motion.div>

        {/* 피처 그리드 - 모바일에서도 2열로 배치 */}
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {LANDING_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group relative bg-white border border-dark-600/50 rounded-3xl p-4 md:p-8 shadow-xl shadow-dark-600/5 transition-all duration-300 overflow-hidden flex flex-col items-center text-center"
            >
              {/* 그라데이션 배경 장식 */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-linear-to-br ${feature.gradient} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full`}
              />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-white to-dark-900/5 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl mb-3 md:mb-6 shadow-sm border border-dark-700/50 group-hover:scale-110 transition-transform duration-300">
                  {feature.emoji}
                </div>
                <h3 className="text-dark-50 font-black text-sm md:text-xl mb-1 md:mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-dark-200 text-[10px] md:text-sm leading-snug md:leading-relaxed font-medium opacity-90 keep-all">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 다음 섹션으로 이동 버튼 */}
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
})

FeatureSection.displayName = 'FeatureSection'
export default FeatureSection
