import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SAMPLE_MBTIS } from '../../constants/landing'

interface MBTIPreviewCardProps {
  mbti: string
  emoji: string
  delay: number
}

function MBTIPreviewCard({ mbti, emoji, delay }: MBTIPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        y: -10,
        scale: 1.05,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
      className="bg-white border border-dark-600/50 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group relative overflow-hidden"
    >
      {/* 배경 장식용 원 */}
      <div className="absolute -top-10 -right-10 w-20 h-20 md:w-24 md:h-24 bg-primary-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm">
          {emoji}
        </div>
        <div className="text-dark-50 font-black text-base md:text-lg tracking-tighter uppercase mb-1">
          {mbti}
        </div>
        <div className="w-4 h-0.5 bg-primary-300 rounded-full group-hover:w-10 transition-all duration-300 mx-auto" />
      </div>

      <div className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] md:text-[10px] font-black text-dark-400 uppercase tracking-widest leading-none">
        View Type
      </div>
    </motion.div>
  )
}

interface PreviewSectionProps {
  onScrollDown?: () => void
}

const PreviewSection = forwardRef<HTMLDivElement, PreviewSectionProps>(({ onScrollDown }, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-screen snap-start flex flex-col justify-center py-20 md:py-24 px-6 bg-white overflow-hidden"
    >
      {/* 우주 같은 느낌의 장식 요소 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] md:w-[120%] h-full md:h-[120%] pointer-events-none opacity-[0.05]">
        <div className="w-full h-full border border-dark-900 rounded-full" />
        <div className="absolute inset-10 md:inset-20 border border-dark-900 rounded-full opacity-50" />
        <div className="absolute inset-20 md:inset-40 border border-dark-900 rounded-full opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Characters
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-dark-50 mb-3 md:mb-4 tracking-tight">
            당신의 <span className="gradient-text">투자 캐릭터</span>는?
          </h2>
          <p className="text-dark-200 text-sm md:text-base font-medium opacity-80 max-w-md mx-auto keep-all">
            열정적인 활동가부터 냉철한 전략가까지,
            <br />
            16가지 유형 속에 당신의 모습이 담겨 있습니다.
          </p>
        </motion.div>

        {/* MBTI 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {SAMPLE_MBTIS.map((item, i) => (
            <MBTIPreviewCard key={item.mbti} mbti={item.mbti} emoji={item.emoji} delay={i * 0.1} />
          ))}
        </div>

        {/* 푸터 텍스트 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10 md:mt-12 flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-dark-800 flex items-center justify-center text-[8px] md:text-[10px] text-white"
              >
                👤
              </div>
            ))}
          </div>
          <p className="text-dark-400 text-[10px] md:text-sm font-bold uppercase tracking-widest leading-none">
            + 12 more types are waiting for you
          </p>
        </motion.div>
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

PreviewSection.displayName = 'PreviewSection'
export default PreviewSection
