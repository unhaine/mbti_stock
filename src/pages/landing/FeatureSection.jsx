import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { LANDING_FEATURES } from '../../constants/landing'

const FeatureSection = forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-[70vh] snap-start flex flex-col justify-center py-12 px-6 z-10"
    >
      <div className="max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-dark-50 mb-3">
            왜 <span className="gradient-text">MBTI 투자</span>인가요?
          </h2>
          <p className="text-dark-200 text-sm">숫자가 아닌 스토리로 투자를 이해해보세요</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {LANDING_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white/50 backdrop-blur-sm border border-dark-600 rounded-xl p-3 md:p-4 relative overflow-hidden group aspect-3/4 flex flex-col items-center justify-center text-center"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative z-10">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <h3 className="text-dark-50 font-bold text-sm mb-2">{feature.title}</h3>
                <p className="text-dark-200 text-xs leading-relaxed keep-all">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
})

FeatureSection.displayName = 'FeatureSection'
export default FeatureSection
