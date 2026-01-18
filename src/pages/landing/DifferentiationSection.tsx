import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const DifferentiationSection = forwardRef<HTMLDivElement, any>((_, ref) => {
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
            src="/src/assets/mascot_teacher.png" 
            alt="Teacher Typhy" 
            className="w-full h-full object-contain"
            style={{ mixBlendMode: 'multiply', filter: 'brightness(1.05) contrast(1.05)' }}
          />
        </motion.div>

        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-black text-secondary-900 mb-4 tracking-tight">
            어렵기만 한 주식 공부,
            <br />
            이제 재미있게 시작하세요
          </h2>
        </motion.div>

        {/* 비교 영역 - Flat Style */}
        <div className="mb-20 text-center">
          {/* 기존 방식 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-6 border-b border-secondary-100"
          >
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">
              기존 방식
            </p>
            <p className="text-secondary-500 text-[15px] leading-relaxed italic">
              "EPS 성장률이 12% 하락했으며, 현재 PER은 업종 평균 대비..."
            </p>
            <p className="text-secondary-400 text-xs mt-3">
              지루하고 어려운 분석 데이터
            </p>
          </motion.div>

          {/* MBTI 방식 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="py-10"
          >
            <p className="text-primary-500 text-xs font-bold uppercase tracking-wider mb-3">
              TypeFolio 방식
            </p>
            <p className="text-secondary-900 text-lg font-bold leading-tight">
              "INTJ인 당신에게, <br />
              <span className="text-primary-500">신중하게 성을 쌓는 듯한</span><br />
              종목이 추천됩니다."
            </p>
            <p className="text-secondary-400 text-xs mt-4">
              나의 언어로 들려주는 투자 이야기
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

DifferentiationSection.displayName = 'DifferentiationSection'
export default DifferentiationSection
