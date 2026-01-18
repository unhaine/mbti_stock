import { motion } from 'framer-motion'

export default function SignupCTASection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-24 px-6 bg-white overflow-hidden pb-40">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-50 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10 w-full max-w-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-48 h-48 mx-auto mb-8 drop-shadow-3xl"
          >
            <img 
              src="/src/assets/mascot_final.png" 
              alt="TypeFolio Mascot Typhy Celebrating" 
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply', filter: 'brightness(1.05) contrast(1.05)' }}
            />
          </motion.div>
          <h2 className="text-4xl font-black text-secondary-900 mb-4 tracking-tight">
            준비되셨나요?
          </h2>
          <p className="text-secondary-500 font-medium text-lg leading-relaxed">
            당신만의 투자 캐릭터가<br />
            기다리고 있습니다.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
