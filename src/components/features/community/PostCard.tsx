import { motion } from 'framer-motion'
import { Heart, MessageSquare } from 'lucide-react'
import profilesData from '../../../data/mbti-profiles.json'

import { Post } from '../../../types'

interface PostCardProps {
  post: Post
  onClick?: () => void
}

/**
 * 게시글 카드 컴포넌트
 */
export default function PostCard({ post, onClick }: PostCardProps) {
  const profile = profilesData.find((p) => p.id === post.mbti)

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="bg-white rounded-xl p-3 cursor-pointer border border-dark-600 hover:border-dark-400 transition-all shadow-sm"
    >
      {/* 헤더 */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: profile
              ? `linear-gradient(135deg, ${profile.gradient[0]}80, ${profile.gradient[1]}80)`
              : 'linear-gradient(135deg, #6366f180, #8b5cf680)',
          }}
        >
          {post.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-dark-50 text-sm">{post.author}</span>
            <span
              className="px-1 py-0.5 text-xs rounded-md text-dark-50 font-medium border border-dark-600/10"
              style={{ backgroundColor: `${profile?.gradient[0]}60` || '#6366f160' }}
            >
              {post.mbti}
            </span>
            {post.isHot && (
              <span className="px-1 py-0.5 text-xs rounded-md bg-red-500/20 text-red-400">
                🔥 HOT
              </span>
            )}
          </div>
          <span className="text-dark-300 text-xs">{post.timeAgo}</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="mb-3">
        <h3 className="text-dark-50 font-semibold mb-1 leading-snug">{post.title}</h3>
        <p className="text-dark-300 text-sm line-clamp-2">{post.preview}</p>
      </div>

      {/* 카테고리 & 통계 */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 text-xs rounded-lg bg-secondary-100 text-dark-400 font-medium">
          {post.category}
        </span>
        <div className="flex items-center gap-4 text-dark-500 text-sm">
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
    </motion.div>
  )
}
