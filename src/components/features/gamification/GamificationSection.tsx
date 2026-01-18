import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '../../../utils/helpers'

interface GamificationItem {
  id: string
  type: string
}

interface GamificationSectionProps {
  items: GamificationItem[]
  activeIndex: number
  dailyMission: any
  todaysFortune: string
}

export default function GamificationSection({
  items,
  activeIndex,
  dailyMission,
  todaysFortune
}: GamificationSectionProps) {
  return (
    <div className="mt-4 px-1 relative overflow-hidden">
      <motion.div 
        animate={{ x: `-${activeIndex * 100}%` }}
        transition={activeIndex === 0 ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
        className="flex w-full"
      >
        {items.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="w-full shrink-0 px-1">
            {item.type === 'insight' ? (
              <div className="bg-linear-to-br from-secondary-50 to-white border border-secondary-100 rounded-2xl p-4 pb-6 shadow-xs h-full min-h-[110px] flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Today's Insight</span>
                </div>
                <p className="text-[14px] font-bold text-secondary-800 leading-relaxed break-keep tracking-tight">
                  "{todaysFortune}"
                </p>
              </div>
            ) : (
              <div className="bg-linear-to-r from-secondary-900 to-secondary-800 rounded-2xl p-4 pb-6 shadow-lg relative overflow-hidden h-full min-h-[110px] flex flex-col justify-center">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[10px] font-black text-secondary-300 uppercase tracking-[0.2em]">Active Mission</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-black text-yellow-400">EXP</span>
                    <span className="text-[10px] font-black text-white">+{dailyMission?.reward.split('+')[1]}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-inner">
                    🎯
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1 leading-tight">{dailyMission?.task}</p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        className="h-full bg-linear-to-r from-yellow-400 to-orange-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </motion.div>
      
      {/* 카드 내부로 들어온 인디케이터 (논리적 인덱스 0, 1 유지) */}
      {dailyMission && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-xs",
            (activeIndex === 0 || activeIndex === 2) ? "bg-primary-600 w-3" : "bg-secondary-200"
          )} />
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-xs",
            activeIndex === 1 ? "bg-white w-3" : "bg-secondary-200"
          )} />
        </div>
      )}
    </div>
  )
}
