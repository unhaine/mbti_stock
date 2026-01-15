import { motion } from 'framer-motion'
import profilesData from '../../../data/mbti-profiles.json'

/**
 * 게시글 카드 컴포넌트
 * @param {Object} props
 * @param {Object} props.post - 게시글 정보
 * @param {function} props.onClick - 클릭 핸들러
 */
export default function PostCard({ post, onClick }) {
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
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-medium text-dark-50 text-sm">{post.author}</span>
            <span
              className="px-1.5 py-0.5 text-xs rounded-md text-dark-50 font-medium border border-dark-600/10"
              style={{ backgroundColor: `${profile?.gradient[0]}60` || '#6366f160' }}
            >
              {post.mbti}
            </span>
            {post.isHot && (
              <span className="px-1.5 py-0.5 text-xs rounded-md bg-red-500/20 text-red-400">
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {post.comments}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
