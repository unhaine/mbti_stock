import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getMBTI } from '../utils/storage'
import { cn } from '../utils/helpers'
import { MBTI_GROUPS } from '../utils/postGenerator'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import { PostCard, WritePostModal } from '../components/features/community'
import { PostCardSkeleton, SkeletonList } from '../components/common/Skeleton'
import { useCommunityPosts } from '../hooks/useCommunityPosts'
// import { AIRecommendation } from '../components/features/stock/AIRecommendation' // Removed

import { Post } from '../types'

export default function CommunityPage() {
  const myMBTI = getMBTI() || 'INTJ'
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [activeTab, setActiveTab] = useState('hot')
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  // 실제 데이터 훅 사용 (티커 없이 호출하여 전체 글 조회)
  const { posts: allPosts, loading: isLoading } = useCommunityPosts()

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts]

    if (selectedGroup > 0) {
      const groupTypes = MBTI_GROUPS[selectedGroup].types
      posts = posts.filter((p) => groupTypes.includes(p.mbti))
    }

    if (activeTab === 'hot') {
      posts.sort((a, b) => b.likes - a.likes)
    } else if (activeTab === 'new') {
      // 이미 최신순이지만 명시적으로 정렬 (필요시)
      // fetchPosts에서 이미 정렬되어 오므로 skip 가능하지만, 클라이언트 정렬 유지
    } else if (activeTab === 'my') {
      posts = posts.filter((p) => p.mbti === myMBTI)
    }

    return posts
  }, [allPosts, selectedGroup, activeTab, myMBTI])

  // 글 읽기 기능 비활성화
  const handlePostClick = () => {}

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col min-h-0 pt-12 pb-14">
        {/* 고정 영역 */}
        <div className="shrink-0 px-4 pt-4 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* 페이지 타이틀 */}
            <h1 className="text-xl font-bold text-secondary-900 mb-4">커뮤니티</h1>

            {/* AI 추천 삭제됨 */}

            {/* MBTI 그룹 필터 - 가로 스크롤 */}
            <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              {MBTI_GROUPS.map((group, i) => (
                <button
                  key={group.name}
                  onClick={() => setSelectedGroup(i)}
                  className={cn(
                    'shrink-0 text-sm transition-colors',
                    selectedGroup === i
                      ? 'font-bold text-secondary-900 border-b-2 border-secondary-900 pb-1'
                      : 'text-secondary-400 hover:text-secondary-600'
                  )}
                >
                  {group.name}
                </button>
              ))}
            </div>

            {/* 탭 */}
            <div className="flex border-b border-secondary-100">
              {[
                { id: 'hot', label: '인기' },
                { id: 'new', label: '최신' },
                { id: 'my', label: '내 유형' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                    activeTab === tab.id
                      ? 'text-secondary-900 font-bold border-secondary-900'
                      : 'text-secondary-400 border-transparent hover:text-secondary-600'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {isLoading ? (
            <SkeletonList count={5} Component={PostCardSkeleton} gap="space-y-0" />
          ) : filteredPosts.length > 0 ? (
            <div className="divide-y divide-secondary-100">
              {filteredPosts.slice(0, 15).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <PostCard post={post} onClick={() => handlePostClick()} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-secondary-400 text-sm">아직 게시글이 없습니다. 첫 글을 남겨보세요!</p>
            </div>
          )}
        </div>
      </div>

      {/* 글쓰기 버튼 - 하단 우측 */}
      <button
        onClick={() => setIsWriteModalOpen(true)}
        className="fixed bottom-20 right-4 z-30 px-4 py-2.5 bg-primary-500 text-white font-bold 
                   rounded-xl shadow-lg hover:bg-primary-600 transition-colors text-sm"
      >
        글쓰기
      </button>

      <FooterNav />

      <WritePostModal 
        isOpen={isWriteModalOpen} 
        onClose={() => setIsWriteModalOpen(false)} 
      />
    </div>
  )
}
