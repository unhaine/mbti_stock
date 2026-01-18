import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LANDING_FEATURES } from '../../constants/landing'

const FeatureSection = forwardRef<HTMLDivElement, any>((_, ref) => {
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
            src="/src/assets/mascot_analytical.png" 
            alt="Analytical Typhy" 
            className="w-full h-full object-contain"
            style={{ mixBlendMode: 'multiply', filter: 'brightness(1.05) contrast(1.05)' }}
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
            왜 MBTI 투자인가요?
          </h2>
          <p className="text-secondary-500 text-sm">
            숫자보다 확실한 내 성격 맞춤 투자 경험
          </p>
        </motion.div>

        {/* 피처 리스트 - Flat Style */}
        <div className="divide-y divide-secondary-100 mb-12">
          {LANDING_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="py-5"
            >
              <h3 className="text-secondary-900 font-bold text-base mb-1">
                {feature.title}
              </h3>
              <p className="text-secondary-500 text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

FeatureSection.displayName = 'FeatureSection'
export default FeatureSection
