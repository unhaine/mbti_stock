import { Link, useLocation } from 'react-router-dom'
import { LayoutGrid, MessageSquare, PieChart, Settings } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface NavItem {
  path: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { path: '/main', label: '홈', icon: LayoutGrid },
  { path: '/community', label: '커뮤니티', icon: MessageSquare },
  { path: '/portfolio', label: '자산', icon: PieChart },
  { path: '/settings', label: '설정', icon: Settings },
]

export default function FooterNav() {
  const location = useLocation()

  // 특정 페이지에서는 숨김
  const hiddenPaths = ['/', '/onboarding', '/loading']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  return (
    <nav className="fixed py-4 bottom-0 left-0 right-0 z-40 bg-white border-t border-secondary-100 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4">
        <div className="h-14 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex flex-col items-center justify-center py-1 px-4 min-w-[64px] transition-colors',
                  isActive
                    ? 'text-secondary-900'
                    : 'text-secondary-400 hover:text-secondary-600'
                )}
              >
                <Icon className={cn("w-6 h-6 mb-0.5", isActive && "stroke-[2.5px]")} />
                <span className={cn(
                  'text-[10px]',
                  isActive ? 'font-bold' : 'font-medium'
                )}>
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
