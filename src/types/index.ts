export interface Stock {
  ticker: string
  name: string
  sector: string
  marketCap: number | string
  price: number
  change: number
  changePercent: number
  volatility: string
  dividendYield: number
  metaphors?: Record<string, any>
  tags?: string[]
  emoji?: string
  description?: string
  [key: string]: any
}

export interface PortfolioStore {
  cash: number
  stocks: Array<{
    ticker: string
    shares: number
    avgPrice: number
    name?: string
  }>
}

export interface Transaction {
  id: string
  portfolio_id: string
  ticker: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  total_amount: number
  executed_at: string
}

export interface Post {
  id: number | string
  title: string
  category: string
  mbti: string
  emoji: string
  author: string
  likes: number
  comments: number
  views: number
  timeAgo: string
  isHot: boolean
  preview: string
}
