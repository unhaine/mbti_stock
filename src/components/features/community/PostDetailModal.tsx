import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, MoreVertical, Heart, MessageSquare, Share2 } from 'lucide-react'
import { cn } from '../../../utils/helpers'
import Button from '../../common/Button'
import profilesData from '../../../data/mbti-profiles.json'

import { Post } from '../../../types'

interface PostDetailModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

/**
 * 게시글 상세 모달 컴포넌트 (전체 화면)
 */
export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const [liked, setLiked] = useState(false)
  const profile = profilesData.find((p) => p.id === post?.mbti)

  if (!post) return null

  // 가상 댓글
  const comments = [
    {
      author: '투자고수',
      mbti: 'INTJ',
      content: '좋은 정보 감사합니다! 저도 비슷하게 생각하고 있었어요.',
      timeAgo: '10분 전',
    },
    {
      author: '주린이',
      mbti: 'ENFP',
      content: '오 대박! 저도 참고해볼게요 🙌',
      timeAgo: '25분 전',
    },
    {
      author: '차트분석가',
      mbti: 'ISTP',
      content: '기술적으로도 좋아보이네요.',
      timeAgo: '1시간 전',
    },
  ]

  // 카테고리별 본문 내용 매핑
  const getCategoryContent = (category: string) => {
    const contentMap: Record<string, string> = {
      '수익 인증':
        '오늘 드디어 목표했던 수익률을 달성했어요! 꾸준히 분석하고 기다린 보람이 있네요. 모두들 화이팅!',
      '종목 토론':
        '이 종목에 대해 여러분의 생각이 궁금해요. 펀더멘털도 좋고 차트도 좋아보이는데, 다양한 관점에서 의견 나눠주세요!',
      '투자 토론':
        '투자 스타일에 대해 많이 고민하게 됩니다. 장기 투자의 안정감도 좋지만, 단타의 짜릿함도 있잖아요?',
      '첫 투자':
        '드디어 첫 주식을 매수했어요! 떨리기도 하고 설레기도 하고... 선배님들의 조언 부탁드립니다 🙏',
      '테마 분석':
        '요즘 이 테마가 정말 핫한 것 같아요. 관련 종목들 정리해봤는데 같이 공유드립니다!',
      '정보 공유': '제가 열심히 조사한 내용 공유드려요. 도움이 되셨으면 좋겠습니다!',
      포트폴리오: '제 포트폴리오를 공개합니다! 비슷한 성향의 분들께 참고가 되었으면 해요.',
      '투자 질문': '고민이 많아서 글 올려봅니다. 경험 많으신 분들의 조언 부탁드려요!',
      '시장 분석': '오늘 시장 동향을 분석해봤습니다. 제 관점이니 참고만 해주세요!',
      'MBTI 투자':
        '제 MBTI에 딱 맞는 투자 스타일을 찾은 것 같아요! 역시 성격별 투자가 맞는 것 같습니다 ㅎㅎ',
      '투자 팁':
        '제가 수익을 낼 수 있었던 비결을 공유합니다. 완전 특별한 건 아니지만 기본에 충실한 게 답인 것 같아요.',
      '초보 질문': '아직 주식에 대해 잘 모르는 초보입니다. 기초부터 차근차근 배우고 싶어요!',
      '종목 비교': '두 종목을 비교 분석해봤습니다. 여러분은 어떤 종목이 더 좋아 보이시나요?',
      '투자 철학': '투자를 하면서 나만의 철학이 생기게 되었어요. 공유드리니 의견 부탁드립니다!',
    }
    return contentMap[category] || ''
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* 전체 화면 컨테이너 */}
          <div className="h-full flex flex-col">
            {/* 헤더 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="shrink-0 px-4 py-3 flex items-center justify-between border-b border-dark-600 bg-white/95 backdrop-blur-sm"
            >
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-secondary-100 text-dark-400 hover:text-dark-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold text-dark-50">게시글</h1>
              <button className="p-2 -mr-2 rounded-full hover:bg-secondary-100 text-dark-400 hover:text-dark-50 transition-colors">
                <MoreVertical className="w-6 h-6" />
              </button>
            </motion.div>

            {/* 스크롤 가능한 내용 */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-lg mx-auto">
                {/* 작성자 정보 */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="px-4 py-4 border-b border-dark-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{
                        background: profile
                          ? `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`
                          : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      }}
                    >
                      {post.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-dark-50">{post.author}</span>
                        <span
                          className="px-2 py-0.5 text-xs rounded-md text-dark-50 font-medium"
                          style={{ backgroundColor: `${profile?.gradient[0]}80` }}
                        >
                          {post.mbti}
                        </span>
                        {post.isHot && (
                          <span className="px-1.5 py-0.5 text-xs rounded-md bg-red-500/20 text-red-400">
                            🔥 HOT
                          </span>
                        )}
                      </div>
                      <span className="text-dark-400 text-sm">
                        {post.timeAgo} • 조회 {post.views}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* 본문 */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-5 border-b border-dark-700"
                >
                  <span className="inline-block px-3 py-1 text-xs rounded-lg bg-primary-500/10 text-primary-700 font-medium mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-bold text-dark-50 mb-4">{post.title}</h2>
                  <p className="text-dark-200 leading-relaxed">
                    안녕하세요! {post.mbti} 유형의 {post.author}입니다.
                    <br />
                    <br />
                    {getCategoryContent(post.category)}
                    <br />
                    <br />
                    의견 남겨주시면 감사하겠습니다! 🙏
                  </p>
                </motion.div>

                {/* 좋아요/댓글 바 */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="px-4 py-4 border-b border-dark-700 flex items-center gap-4"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLiked(!liked)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full transition-colors',
                      liked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-dark-700 text-dark-300 hover:text-white'
                    )}
                  >
                    <Heart className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} />
                    <span className="font-medium">{post.likes + (liked ? 1 : 0)}</span>
                  </motion.button>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700 text-dark-300">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{post.comments}</span>
                  </div>

                  <button className="ml-auto p-2 rounded-full bg-dark-700 text-dark-300 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </motion.div>

                {/* 댓글 영역 */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-4"
                >
                  <h3 className="font-semibold text-dark-50 mb-4">댓글 {comments.length}</h3>
                  <div className="space-y-4">
                    {comments.map((comment, i) => {
                      const commentProfile = profilesData.find((p) => p.id === comment.mbti)
                      return (
                        <div key={i} className="flex gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{
                              background: commentProfile
                                ? `linear-gradient(135deg, ${commentProfile.gradient[0]}80, ${commentProfile.gradient[1]}80)`
                                : '#6366f180',
                            }}
                          >
                            {commentProfile?.emoji || '😊'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-dark-50 text-sm">
                                {comment.author}
                              </span>
                              <span className="text-xs text-dark-500">{comment.mbti}</span>
                              <span className="text-xs text-dark-600">•</span>
                              <span className="text-xs text-dark-500">{comment.timeAgo}</span>
                            </div>
                            <p className="text-dark-300 text-sm leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* 댓글 입력 - 하단 고정 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="shrink-0 px-4 py-3 border-t border-dark-600 bg-white/95 backdrop-blur-sm"
            >
              <div className="max-w-lg mx-auto flex gap-3">
                <input
                  type="text"
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 bg-secondary-50 border border-dark-600 rounded-xl px-4 py-3 text-dark-50 placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
                />
                <Button size="md">등록</Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
