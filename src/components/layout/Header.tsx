import { Link, useLocation } from 'react-router-dom'
import { Search, Settings } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface HeaderProps {
  showIcons?: boolean
  title?: string
  onSearchClick?: () => void
  mbti?: string
}

export default function Header({ showIcons = true, title, onSearchClick, mbti }: HeaderProps) {
  const location = useLocation()

  // 특정 페이지에서는 헤더 숨김
  if (
    location.pathname === '/' ||
    location.pathname === '/onboarding' ||
    location.pathname === '/loading'
  ) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-12 bg-white border-b border-secondary-100 safe-area-top">
      <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-between">
        {/* 로고 - 텍스트만, 20px font-black */}
        <Link to="/main" className="flex items-center gap-2">
          {/* 로고 아이콘 */}
          <img 
            src="/src/assets/logo_typhy.png" 
            alt="TypeFolio Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="font-black text-xl text-secondary-900 tracking-tight">
            TypeFolio
          </span>
          {mbti && (
            <span className="px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[10px] font-bold border border-primary-100">
              {mbti}
            </span>
          )}
        </Link>

        {/* 타이틀 (옵션) */}
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-secondary-900">
            {title}
          </h1>
        )}

        {/* 아이콘 - gray-500 */}
        {showIcons && (
          <div className="flex items-center gap-1">
            {/* 검색 */}
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="p-2 text-secondary-500 hover:text-secondary-900 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* 설정 */}
            <Link
              to="/settings"
              className={cn(
                'p-2 transition-colors',
                location.pathname === '/settings'
                  ? 'text-secondary-900'
                  : 'text-secondary-500 hover:text-secondary-900'
              )}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
