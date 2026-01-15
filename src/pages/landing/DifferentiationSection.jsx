import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function DifferentiationSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[70vh] snap-start flex flex-col justify-center py-12 px-6 z-10">
      <div className="max-w-lg mx-auto w-full space-y-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-dark-50 mb-3">
              이렇게 <span className="gradient-text">다릅니다</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {/* 기존 방식 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/50 border border-dark-600 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-dark-300 text-sm">❌ 기존 방식</span>
              </div>
              <p className="text-dark-200 text-sm leading-relaxed">
                "삼성전자는 PER 15배, PBR 1.2배..."
              </p>
            </motion.div>

            {/* 우리 방식 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-linear-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary-400 text-sm">✨ MBTI 투자</span>
              </div>
              <p className="text-dark-50 text-sm leading-relaxed">
                "<strong>INTJ</strong> 성향에 맞는 <strong>'천천히 쌓이는 성'</strong> 같은
                종목이에요."
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-linear-to-br from-white to-secondary-50 border border-dark-600 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-dark-50 mb-1">무료로 시작해보세요</h2>
            <p className="text-dark-200 mb-6 text-sm">나만의 투자 캐릭터를 만들어보세요</p>

            <Button size="md" fullWidth onClick={() => navigate('/onboarding')}>
              🚀 분석 시작하기
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
