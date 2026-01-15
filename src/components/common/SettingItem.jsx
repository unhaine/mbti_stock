/**
 * 설정 아이템 컴포넌트
 * @param {Object} props
 * @param {string} props.icon - 아이콘 이모지
 * @param {string} props.title - 설정 제목
 * @param {string} [props.description] - 설정 설명
 * @param {React.ReactNode} props.children - 우측 컨트롤 영역
 */
export default function SettingItem({ icon, title, description, children }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-dark-50 font-medium">{title}</p>
          {description && <p className="text-dark-200 text-sm font-medium">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
