import { useRef, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '../../../utils/helpers'

interface Theme {
  id: string
  title: string
  // other props...
}

interface ThemeSelectorProps {
  themes: any[] // Using any for simplicity as Theme type is implicit in data
  selectedTheme: number
  onSelectTheme: (index: number) => void
}

export default function ThemeSelector({
  themes,
  selectedTheme,
  onSelectTheme
}: ThemeSelectorProps) {
  const themeNavRef = useRef<HTMLDivElement>(null)
  const activeThemeRef = useRef<HTMLButtonElement>(null)

  // 테마 변경 시 해당 버튼이 보이도록 스크롤
  useEffect(() => {
    if (activeThemeRef.current) {
      activeThemeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
    }
  }, [selectedTheme])

  return (
    <div className="shrink-0 bg-white border-y border-secondary-50">
      <div className="px-4 pt-3 pb-1 border-b border-secondary-50/50">
         <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-500 fill-primary-100" />
            <span className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.15em]">Your MBTI Picks</span>
         </div>
      </div>
      <div 
        ref={themeNavRef}
        className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2 bg-white snap-x snap-mandatory"
      >
        <button
          ref={selectedTheme === -1 ? activeThemeRef : null}
          onClick={() => onSelectTheme(-1)}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border snap-start scroll-ml-4",
            selectedTheme === -1 
              ? "bg-secondary-900 border-secondary-900 text-white shadow-sm" 
              : "bg-white border-secondary-100 text-secondary-500 hover:border-secondary-300"
          )}
        >
          ✨ 실시간 랭킹
        </button>
        {themes.map((theme, index) => (
          <button
            key={theme.id || index}
            ref={selectedTheme === index ? activeThemeRef : null}
            onClick={() => onSelectTheme(index)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-[13px] font-bold transition-all border snap-start scroll-ml-4",
              selectedTheme === index 
                ? "bg-secondary-900 border-secondary-900 text-white shadow-sm" 
                : "bg-white border-secondary-100 text-secondary-400 hover:border-secondary-300"
            )}
          >
            {theme.title}
          </button>
        ))}
      </div>
    </div>
  )
}
