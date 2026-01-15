import { motion } from 'framer-motion'
import { SAMPLE_MBTIS } from '../../constants/landing'

function MBTIPreviewCard({ mbti, emoji, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white/80 backdrop-blur-sm border border-dark-600 rounded-xl p-3 cursor-pointer"
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-dark-50 font-bold text-sm">{mbti}</div>
    </motion.div>
  )
}

export default function PreviewSection() {
  return (
    <section className="relative min-h-[60vh] snap-start flex flex-col justify-center py-12 px-6 bg-linear-to-b from-transparent via-white/30 to-transparent z-10">
      <div className="max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-dark-50 mb-3">
            당신의 <span className="gradient-text">투자 캐릭터</span>는?
          </h2>
          <p className="text-dark-200 text-sm">16가지 유형 중 나를 찾아보세요</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SAMPLE_MBTIS.map((item, i) => (
            <MBTIPreviewCard key={item.mbti} mbti={item.mbti} emoji={item.emoji} delay={i * 0.1} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-dark-300 text-sm mt-8"
        >
          +12개의 다른 유형이 기다리고 있어요
        </motion.p>
      </div>
    </section>
  )
}
