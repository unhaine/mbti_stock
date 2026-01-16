import { ReactNode } from 'react'

interface SettingItemProps {
  icon: string | ReactNode
  title: string
  description?: string
  children: ReactNode
}

/**
 * 설정 아이템 컴포넌트
 */
export default function SettingItem({ icon, title, description, children }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-dark-50 font-medium text-sm">{title}</p>
          {description && <p className="text-dark-200 text-xs font-medium">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
