import { Link, useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Header({ showIcons = true, title }) {
  const location = useLocation()

  // 랜딩 페이지에서는 헤더 숨김
  if (
    location.pathname === '/' ||
    location.pathname === '/onboarding' ||
    location.pathname === '/loading'
  ) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-white/80 backdrop-blur-lg border-b border-dark-600 safe-area-top">
      <div className="h-full max-w-lg mx-auto px-4 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/main" className="flex items-center gap-2">
          <span className="text-2xl">💹</span>
          <span className="font-bold text-lg text-dark-50">TypeFolio</span>
        </Link>

        {/* 타이틀 (옵션) */}
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-dark-50">{title}</h1>
        )}

        {/* 아이콘 */}
        {showIcons && (
          <div className="flex items-center gap-2">
            {/* 알림 */}
            <button className="p-2 rounded-lg hover:bg-secondary-100 text-dark-400 hover:text-dark-50 transition-colors">
              <Bell className="w-6 h-6" />
            </button>

            {/* 설정 */}
            <Link
              to="/settings"
              className={cn(
                'p-2 rounded-lg hover:bg-secondary-100 transition-colors',
                location.pathname === '/settings'
                  ? 'text-primary-600'
                  : 'text-dark-400 hover:text-dark-50'
              )}
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
