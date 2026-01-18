import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface HeroSectionProps {
  onScrollDown?: () => void
}

export default function HeroSection({ onScrollDown }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      {/* 메인 컨텐츠 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-md w-full"
      >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-40 h-40 mx-auto mb-10"
          >
            <img 
              src="/src/assets/mascot_hello.png" 
              alt="TypeFolio Mascot Typhy Greeting" 
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(1.05) contrast(1.05)' }}
            />
          </motion.div>

        {/* 로고 - 텍스트만 */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-black text-secondary-900 mb-4 tracking-tight"
        >
          TypeFolio
        </motion.h1>

        {/* 설명 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-secondary-500 text-sm mb-16"
        >
          MBTI로 알아보는 나의 투자 성향
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Primary CTA - 빨간색 */}
          <button
            onClick={onScrollDown}
            className="w-full h-12 bg-primary-500 text-white font-bold rounded-xl 
                       hover:bg-primary-600 transition-colors duration-200
                       active:scale-[0.98] transform"
          >
            시작하기
          </button>

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-secondary-500 text-sm mb-1">
              이미 계정이 있으신가요?
            </p>
            <button
              onClick={() => navigate('/login')}
              className="text-secondary-900 text-sm underline underline-offset-2 
                         hover:text-primary-500 transition-colors"
            >
              로그인
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
