import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SAMPLE_MBTIS } from '../../constants/landing'

// MBTI 그룹별 색상
const groupColors: Record<string, string> = {
  '분석가': 'text-indigo-600',
  '외교관': 'text-emerald-600',
  '탐험가': 'text-amber-600',
  '관리자': 'text-blue-600',
}

const PreviewSection = forwardRef<HTMLDivElement, any>((_, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-start py-24 px-4 bg-white"
    >
      <div className="max-w-md mx-auto w-full pb-20">
        {/* 마스코트 */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 mx-auto mb-8"
        >
          <img 
            src="/src/assets/mascot.png" 
            alt="Character Typhy" 
            className="w-full h-full object-contain"
            style={{ mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.1)' }}
          />
        </motion.div>

        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-black text-secondary-900 mb-3 tracking-tight">
            당신의 투자 캐릭터는?
          </h2>
          <p className="text-secondary-500 text-sm">
            16가지 유형 속에 당신의 모습이 담겨 있습니다
          </p>
        </motion.div>

        {/* MBTI 그리드 - Minimal */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {SAMPLE_MBTIS.map((item, i) => (
            <motion.div
              key={item.mbti}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white py-6 flex flex-col items-center border-b border-secondary-100"
            >
              <span className="text-xl font-black text-secondary-900 tracking-tight mb-1">
                {item.mbti}
              </span>
              <span className={`text-xs font-medium ${groupColors[item.group]}`}>
                {item.group}
              </span>
            </motion.div>
          ))}
        </div>

        {/* 푸터 텍스트 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-secondary-400 text-xs"
        >
          + 12개 유형이 더 기다리고 있습니다
        </motion.p>
      </div>
    </section>
  )
})

PreviewSection.displayName = 'PreviewSection'
export default PreviewSection
