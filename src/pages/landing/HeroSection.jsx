import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Button from '../../components/common/Button'

export default function HeroSection({ onScrollDown }) {
  const navigate = useNavigate()

  return (
    <motion.section className="relative min-h-[80vh] snap-start flex flex-col items-center justify-center px-6 py-8 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* 로고 애니메이션 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0,
          }}
          className="relative mb-8"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(254, 229, 0, 0.3)',
                '0 0 60px rgba(254, 229, 0, 0.5)',
                '0 0 20px rgba(254, 229, 0, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto bg-linear-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center"
          >
            <span className="text-4xl">💹</span>
          </motion.div>
        </motion.div>
        <p className="h-4"></p>
        {/* 메인 타이틀 */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
        >
          <span className="gradient-text">MBTI</span>
          <span className="text-dark-50">로 알아보는</span>
          <br />
          <motion.span
            className="text-dark-50 inline-block"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            나의 투자 성향
          </motion.span>
        </motion.h1>

        <p className="h-4"></p>

        {/* 부제목 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-dark-200 text-base mb-6 leading-relaxed"
        >
          성격 유형을 기반으로
          <br />
          <span className="text-primary-400 font-medium">나에게 맞는 투자 테마와 종목</span>을
          추천받아보세요
        </motion.p>

        <p className="h-4"></p>

        {/* CTA 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="md"
              fullWidth
              onClick={() => navigate('/onboarding')}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>🚀</span>
                <span>무료로 시작하기</span>
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-primary-400 to-secondary-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
          <p className="h-4"></p>

          <p className="text-dark-300 text-sm flex items-center justify-center gap-2">
            <span>⏱️</span>
            <span>30초 만에 나의 투자 유형 분석 완료</span>
          </p>
        </motion.div>
      </motion.div>

      {/* 스크롤 인디케이터 (버튼) */}
      <motion.button
        onClick={onScrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20 hover:text-dark-50 transition-colors"
        aria-label="아래로 스크롤"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-dark-300"
        >
          <span className="text-xs mb-2 font-medium">알아보기</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </motion.section>
  )
}
