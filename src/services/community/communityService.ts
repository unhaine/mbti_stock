
import { Post } from '../../types'

// Supabase 설정값 (순수 REST API 호출용)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export interface CreatePostParams {
  stock_ticker?: string
  mbti: string
  sentiment: 'bull' | 'bear' | 'neutral'
  content: string
  user_nickname?: string
}

export const communityService = {
  /**
   * 게시글 목록 조회 (REST API)
   * GET /rest/v1/posts
   */
  async getPosts(ticker?: string, limit = 20): Promise<Post[]> {
    try {
      // 쿼리 파라미터 구성
      const params = new URLSearchParams({
        select: '*',
        order: 'created_at.desc',
        limit: limit.toString()
      })

      if (ticker) {
        params.append('stock_ticker', `eq.${ticker}`)
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?${params.toString()}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      return data.map((post: any) => ({
        id: post.id,
        title: post.content.slice(0, 30) + '...',
        category: 'general',
        mbti: post.mbti,
        emoji: getEmojiBySentiment(post.sentiment), 
        author: post.user_nickname || '익명',
        likes: post.likes || 0,
        comments: 0,
        views: 0,
        timeAgo: getTimeAgo(post.created_at),
        isHot: (post.likes || 0) > 50,
        preview: post.content,
        sentiment: post.sentiment
      }))
    } catch (error) {
      console.error('REST API Fetch Error:', error)
      return []
    }
  },

  /**
   * 게시글 작성 (REST API)
   * POST /rest/v1/posts
   */
  async createPost(params: CreatePostParams): Promise<boolean> {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal' // 응답 본문을 최소화
        },
        body: JSON.stringify({
          stock_ticker: params.stock_ticker,
          mbti: params.mbti.toUpperCase(),
          sentiment: params.sentiment,
          content: params.content,
          user_nickname: params.user_nickname || `User${Math.floor(Math.random() * 9000) + 1000}`,
          likes: 0
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('REST API Create Error:', error)
      return false
    }
  }
}

// 헬퍼 함수들은 그대로 유지
function getEmojiBySentiment(sentiment: string): string {
  switch (sentiment) {
    case 'bull': return '🚀'
    case 'bear': return '💧'
    case 'neutral': return '👀'
    default: return '💬'
  }
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  return `${Math.floor(diffInSeconds / 86400)}일 전`
}
