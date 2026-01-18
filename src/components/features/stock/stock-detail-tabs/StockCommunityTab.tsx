
import { MessageSquare, ThumbsUp } from 'lucide-react'
import { useCommunityPosts } from '../../../../hooks/useCommunityPosts'
import { cn } from '../../../../utils/helpers'

import { Post } from '../../../../types' // Import Post type

interface StockCommunityTabProps {
  ticker: string
  initialPosts?: Post[]
  isLoading?: boolean
}

export default function StockCommunityTab({ ticker, initialPosts, isLoading }: StockCommunityTabProps) {
  // initialPosts가 있으면 그것을 사용, 없으면 훅에서 가져옴
  const { posts: fetchedPosts, loading: fetchLoading, error } = useCommunityPosts(ticker)
  
  const posts = initialPosts && initialPosts.length > 0 ? initialPosts : fetchedPosts
  const loading = isLoading !== undefined ? isLoading : fetchLoading

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 rounded-full border-4 border-gray-100 border-t-primary-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center text-secondary-500">
        게시글을 불러올 수 없습니다
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-secondary-500">
        아직 등록된 게시글이 없습니다.
        <br />
        첫 번째 글을 남겨보세요!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-secondary-900">실시간 종목 토론</h3>
        <button className="text-sm font-medium text-primary-500 hover:text-primary-600">
          글쓰기
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div 
            key={post.id}
            className="py-4 border-b border-secondary-100 last:border-0 space-y-2 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-xl">{post.emoji}</span>
                <span className="font-bold text-secondary-900 text-sm">
                  {post.author}
                </span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-medium",
                  post.sentiment === 'bull' && "bg-red-100 text-red-600",
                  post.sentiment === 'bear' && "bg-blue-100 text-blue-600",
                  post.sentiment === 'neutral' && "bg-gray-100 text-gray-600"
                )}>
                  {post.mbti}
                </span>
              </div>
              <span className="text-xs text-secondary-400">
                {post.timeAgo}
              </span>
            </div>
            
            <p className="text-secondary-700 text-sm leading-relaxed whitespace-pre-wrap">
              {post.preview}
            </p>

            <div className="flex items-center gap-4 pt-1">
              <button className="flex items-center gap-1.5 text-secondary-400 hover:text-red-500 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-secondary-400 hover:text-primary-500 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-xs">{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
