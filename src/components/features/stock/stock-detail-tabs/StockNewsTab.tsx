interface NewsItem {
  title: string
  source: string
  time: string
}

interface StockNewsTabProps {
  news: NewsItem[]
}

/**
 * 주식 상세 - 뉴스 탭 (플랫 스타일)
 */
export default function StockNewsTab({ news }: StockNewsTabProps) {
  return (
    <div>
      <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-3">
        관련 뉴스
      </p>
      
      <div className="divide-y divide-secondary-100">
        {news.map((item, idx) => (
          <div key={idx} className="py-4">
            <h5 className="text-sm font-bold text-secondary-900 leading-snug line-clamp-2 mb-2">
              {item.title}
            </h5>
            <div className="flex items-center gap-2 text-xs text-secondary-400">
              <span className="text-primary-500 font-medium">{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
