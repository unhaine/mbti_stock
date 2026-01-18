
import { useState, useEffect, useCallback } from 'react'
import { Post } from '../types'
import { communityService } from '../services/community/communityService'
import { crawlerService } from '../services/community/crawlerService'

export function useCommunityPosts(ticker?: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      
      console.log('📌 Fetching posts for ticker:', ticker)
      const [dbPosts, crawlerPosts] = await Promise.all([
        communityService.getPosts(ticker),
        ticker ? crawlerService.getNaverDiscussions(ticker) : Promise.resolve([])
      ])
      console.log('✅ Fetched posts:', { db: dbPosts.length, naver: crawlerPosts.length })

      // DB 데이터와 크롤링 데이터 병합 및 정렬 (최신순)
      // 크롤링 데이터는 날짜 포맷이 다양하므로, 일단 단순 병합보다는 교차 배치를 하거나,
      // 크롤링 데이터를 우선 보여주는 것이 사용자 경험상 좋음 (최신 반응이므로)
      
      const combined = [...crawlerPosts, ...dbPosts]
      
      // 날짜 파싱이 가능한 경우 정렬 시도 (참고용)
      // combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setPosts(combined)
    } catch (err) {
      console.error(err)
      setError('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [ticker])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const createPost = async (content: string, mbti: string, sentiment: 'bull' | 'bear' | 'neutral') => {
    const success = await communityService.createPost({
      stock_ticker: ticker || 'GENERAL', // 티커가 없으면 전체 게시판(GENERAL)으로 취급
      mbti,
      sentiment,
      content
    })

    if (success) {
      await fetchPosts() // 게시글 작성 후 목록 갱신
    }
    return success
  }

  return { posts, loading, error, refresh: fetchPosts, createPost }
}
