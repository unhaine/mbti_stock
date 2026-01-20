import { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface Theme {
  id: string
  title: string
}

interface ThemeSelectorProps {
  themes: Theme[]
  selectedTheme: number // 0-4
  onSelectTheme: (index: number) => void
}

export default function ThemeSelector({
  themes,
  selectedTheme,
  onSelectTheme
}: ThemeSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const controls = useAnimation()
  const [isAnimating, setIsAnimating] = useState(false)
  
  // 내부 가상 인덱스 (무한 스크롤용, 중간 세트 기준)
  const [virtualIndex, setVirtualIndex] = useState(selectedTheme + themes.length)
  
  // 테마 3배 복제 (무한 스크롤 효과용)
  const tripleThemes = useMemo(() => {
    return [...themes, ...themes, ...themes]
  }, [themes])

  // 버튼 너비 측정하여 특정 인덱스까지의 오프셋 계산
  const calculateOffset = useCallback((targetVirtualIndex: number) => {
    let offset = 0
    for (let i = 0; i < targetVirtualIndex; i++) {
      const button = buttonRefs.current.get(i)
      if (button) {
        offset += button.offsetWidth + 4 // 4px gap (gap-1)
      }
    }
    // 선택된 버튼을 약간 오른쪽에 위치시키기 위한 여유값
    return -offset + 40
  }, [])

  // 선택 변경 시 가상 인덱스 업데이트 및 애니메이션
  const handleSelect = useCallback(async (clickedVirtualIndex: number) => {
    if (isAnimating) return
    
    const actualIndex = clickedVirtualIndex % themes.length
    const currentActualIndex = virtualIndex % themes.length
    
    // 같은 테마면 무시
    if (actualIndex === currentActualIndex) return
    
    setIsAnimating(true)
    
    // 1. 먼저 클릭된 버튼을 선택 상태(검은색)로 변경
    setVirtualIndex(clickedVirtualIndex)
    
    // 2. 색상 변경이 보이도록 짧게 대기
    await new Promise(resolve => setTimeout(resolve, 80))
    
    // 3. 그 다음 슬라이드 애니메이션 실행 (빠르고 스냅감 있게)
    const targetOffset = calculateOffset(clickedVirtualIndex)
    
    await controls.start({
      x: targetOffset,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 35,
        mass: 0.5
      }
    })
    
    // 애니메이션 완료 후 실제 선택 업데이트
    onSelectTheme(actualIndex)
    
    // 중간 세트로 순간 이동 (경계 도달 시)
    const middleSetIndex = actualIndex + themes.length
    if (clickedVirtualIndex !== middleSetIndex) {
      const middleOffset = calculateOffset(middleSetIndex)
      await controls.set({ x: middleOffset })
      setVirtualIndex(middleSetIndex)
    }
    
    setIsAnimating(false)
  }, [isAnimating, virtualIndex, themes.length, calculateOffset, controls, onSelectTheme])

  // 외부에서 selectedTheme이 변경될 때 동기화
  useEffect(() => {
    const middleSetIndex = selectedTheme + themes.length
    setVirtualIndex(middleSetIndex)
    
    // 버튼 렌더링 후 오프셋 계산
    requestAnimationFrame(() => {
      const offset = calculateOffset(middleSetIndex)
      controls.set({ x: offset })
    })
  }, [selectedTheme, themes.length, calculateOffset, controls])

  return (
    <div className="shrink-0 bg-white border-y border-secondary-50">
      {/* 헤더 */}
      <div className="px-4 pt-3 pb-1 border-b border-secondary-50/50">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-500 fill-primary-100" />
          <span className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.15em]">
            Your MBTI Picks
          </span>
        </div>
      </div>

      {/* 슬롯 컨테이너 */}
      <div 
        ref={containerRef}
        className="relative h-14 flex items-center overflow-hidden"
      >
        {/* 왼쪽 페이드 그라데이션 */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        
        {/* 슬라이딩 버튼 컨테이너 */}
        <motion.div 
          className="flex gap-1 items-center pl-12 pr-4"
          animate={controls}
        >
          {tripleThemes.map((theme, index) => {
            const isSelected = index === virtualIndex
            const isPeeking = index === virtualIndex - 1
            
            return (
              <motion.button
                key={`${theme.id}-${index}`}
                ref={(el) => { 
                  if (el) buttonRefs.current.set(index, el)
                }}
                onClick={() => handleSelect(index)}
                animate={{
                  scale: isSelected ? 1 : 0.95,
                  opacity: isPeeking ? 0.6 : 1
                }}
                transition={{ duration: 0.2 }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold border whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-secondary-900 border-secondary-900 text-white shadow-sm'
                    : 'bg-white border-secondary-100 text-secondary-400 hover:border-secondary-300'
                }`}
              >
                {theme.title}
              </motion.button>
            )
          })}
        </motion.div>

        {/* 오른쪽 페이드 그라데이션 */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  )
}
