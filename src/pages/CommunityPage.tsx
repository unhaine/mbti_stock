import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PenSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { getMBTI } from '../utils/storage'
import { cn } from '../utils/helpers'
import { generatePosts, MBTI_GROUPS } from '../utils/postGenerator'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import PullToRefreshWrapper from '../components/common/PullToRefreshWrapper'
import { PostCard, PostDetailModal, WritePostModal } from '../components/features/community'
import { PostCardSkeleton, SkeletonList } from '../components/common/Skeleton'

// JSON 데이터
import profilesData from '../data/mbti-profiles.json'

import { Post } from '../types'

export default function CommunityPage() {
  const myMBTI = getMBTI() || 'INTJ'
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [activeTab, setActiveTab] = useState('hot') // hot | new | my
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // 새로고침용 키
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // 게시글 생성 (새로고침 시 재생성)
  const allPosts = useMemo(() => generatePosts() as Post[], [refreshKey])

  // 필터링된 게시글
  const filteredPosts = useMemo(() => {
    let posts = [...allPosts]

    // MBTI 그룹 필터
    if (selectedGroup > 0) {
      const groupTypes = MBTI_GROUPS[selectedGroup].types
      posts = posts.filter((p) => groupTypes.includes(p.mbti))
    }

    // 탭별 정렬
    if (activeTab === 'hot') {
      posts.sort((a, b) => b.likes - a.likes)
    } else if (activeTab === 'new') {
      posts.sort((a, b) => {
        const order = [
          '방금 전',
          '5분 전',
          '10분 전',
          '30분 전',
          '1시간 전',
          '2시간 전',
          '3시간 전',
          '오늘',
          '어제',
        ]
        return order.indexOf(a.timeAgo) - order.indexOf(b.timeAgo)
      })
    } else if (activeTab === 'my') {
      posts = posts.filter((p) => p.mbti === myMBTI)
    }

    return posts
  }, [allPosts, selectedGroup, activeTab, myMBTI])

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setIsPostModalOpen(true)
  }

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    // 새 게시글 생성
    setRefreshKey((prev) => prev + 1)
    toast.success('게시글이 업데이트되었습니다')
  }, [])

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col min-h-0 pt-14 pb-20">
        {/* 고정 영역: 헤더, 필터, 탭 */}
        <div className="shrink-0 px-4 py-2 bg-dark-900 z-10 space-y-2 shadow-sm border-b border-dark-600">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between py-1">
              <h1 className="text-lg font-bold text-dark-50">커뮤니티</h1>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWriteModalOpen(true)}
                className="px-3 py-1.5 bg-primary-500 text-dark-50 rounded-lg font-bold flex items-center gap-1.5 text-xs shadow-sm hover:bg-primary-600 transition-colors"
              >
                <PenSquare className="w-3 h-3" />
                글쓰기
              </motion.button>
            </div>

            {/* MBTI 그룹 필터 */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
              {MBTI_GROUPS.map((group, i) => (
                <motion.button
                  key={group.name}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedGroup(i)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                    selectedGroup === i
                      ? 'bg-primary-500 text-dark-50 border-primary-500 shadow-sm font-bold'
                      : 'bg-white text-dark-200 hover:text-dark-50 border border-dark-600'
                  )}
                >
                  {group.name}
                </motion.button>
              ))}
            </div>

            {/* 탭 */}
            <div className="flex gap-1 bg-secondary-100 rounded-lg border border-dark-600/50">
              {[
                { id: 'hot', label: '🔥 인기' },
                { id: 'new', label: '✨ 최신' },
                {
                  id: 'my',
                  label: `${profilesData.find((p) => p.id === myMBTI)?.emoji || '😊'} 내 유형`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1',
                    activeTab === tab.id
                      ? 'bg-white text-dark-50 shadow-sm'
                      : 'text-dark-300 hover:text-dark-50'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 스크롤 영역: 게시글 리스트 */}
        <div className="flex-1 overflow-hidden">
          <PullToRefreshWrapper onRefresh={handleRefresh}>
            <div className="px-4 py-4">
              <div className="space-y-4">
                {isLoading ? (
                  <SkeletonList count={5} Component={PostCardSkeleton} gap="space-y-4" />
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.slice(0, 15).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <PostCard post={post} onClick={() => handlePostClick(post)} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-dark-400">아직 게시글이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </PullToRefreshWrapper>
        </div>
      </div>

      <FooterNav />

      {/* 게시글 상세 모달 */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      {/* 글쓰기 모달 */}
      <WritePostModal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </div>
  )
}
