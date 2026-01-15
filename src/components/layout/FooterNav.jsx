import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/helpers'

import { Home, MessageSquare, PieChart, Settings } from 'lucide-react'

const navItems = [
  {
    path: '/main',
    label: '홈',
    icon: <Home className="w-6 h-6" />,
    iconFilled: <Home className="w-6 h-6" fill="currentColor" />,
  },
  {
    path: '/community',
    label: '커뮤니티',
    icon: <MessageSquare className="w-6 h-6" />,
    iconFilled: <MessageSquare className="w-6 h-6" fill="currentColor" />,
  },
  {
    path: '/portfolio',
    label: '자산',
    icon: <PieChart className="w-6 h-6" />,
    iconFilled: <PieChart className="w-6 h-6" fill="currentColor" />,
  },
  {
    path: '/settings',
    label: '설정',
    icon: <Settings className="w-6 h-6" />,
    iconFilled: <Settings className="w-6 h-6" fill="currentColor" />,
  },
]

export default function FooterNav() {
  const location = useLocation()

  // 특정 페이지에서는 숨김
  const hiddenPaths = ['/', '/onboarding', '/loading']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-dark-600 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto px-4">
        <div className="h-16 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 min-w-[64px]',
                  isActive
                    ? 'text-dark-50' // 카카오페이는 활성 탭이 보통 검정(또는 진한 회색)
                    : 'text-dark-400 hover:text-dark-200'
                )}
              >
                <span className="mb-1">
                  {isActive ? (
                    // 활성 아이콘에 노란색 포인트나 검정색 적용 (여기선 검정)
                    <div className="text-dark-50">{item.iconFilled}</div>
                  ) : (
                    item.icon
                  )}
                </span>
                <span className={cn('text-xs font-medium', isActive && 'font-semibold')}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
