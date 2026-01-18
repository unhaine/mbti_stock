import { Heart, MessageSquare } from 'lucide-react'
import { cn } from '../../../utils/helpers'
import { Post } from '../../../types'

interface PostCardProps {
  post: Post
  onClick?: () => void
}

// MBTI 그룹 컬러
const MBTI_GROUP_COLORS: Record<string, string> = {
  // 분석가 (NT)
  INTJ: 'text-indigo-600', INTP: 'text-indigo-600',
  ENTJ: 'text-indigo-600', ENTP: 'text-indigo-600',
  // 외교관 (NF)
  INFJ: 'text-emerald-600', INFP: 'text-emerald-600',
  ENFJ: 'text-emerald-600', ENFP: 'text-emerald-600',
  // 관리자 (SJ)
  ISTJ: 'text-blue-600', ISFJ: 'text-blue-600',
  ESTJ: 'text-blue-600', ESFJ: 'text-blue-600',
  // 탐험가 (SP)
  ISTP: 'text-amber-600', ISFP: 'text-amber-600',
  ESTP: 'text-amber-600', ESFP: 'text-amber-600',
}

/**
 * 게시글 카드 컴포넌트 - 플랫 스타일
 */
export default function PostCard({ post, onClick }: PostCardProps) {
  const mbtiColor = MBTI_GROUP_COLORS[post.mbti] || 'text-secondary-600'

  return (
    <div
      onClick={onClick}
      className="py-4 cursor-pointer hover:bg-secondary-50 transition-colors -mx-4 px-4"
    >
      {/* 헤더: 작성자 + 시간 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-secondary-700">{post.author}</span>
        <span className={cn('text-sm font-bold', mbtiColor)}>{post.mbti}</span>
        <span className="text-xs text-secondary-400">· {post.timeAgo}</span>
      </div>

      {/* 본문: 제목 + 미리보기 */}
      <div className="mb-3">
        <h3 className="font-bold text-secondary-900 mb-1 leading-snug">{post.title}</h3>
        <p className="text-secondary-500 text-sm line-clamp-2">{post.preview}</p>
      </div>

      {/* 푸터: 카테고리 + 통계 */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-secondary-400">{post.category}</span>
        <div className="flex items-center gap-4 text-secondary-400 text-sm">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  )
}
