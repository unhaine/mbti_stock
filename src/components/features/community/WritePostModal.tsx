import { motion, AnimatePresence } from 'framer-motion'
import { getMBTI } from '../../../utils/storage'
import Card from '../../common/Card'
import Button from '../../common/Button'
import profilesData from '../../../data/mbti-profiles.json'

interface WritePostModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * 글쓰기 모달 컴포넌트
 */
export default function WritePostModal({ isOpen, onClose }: WritePostModalProps) {
  const mbti = getMBTI()
  const profile = profilesData.find((p) => p.id === mbti)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
          >
            <Card className="max-h-[80vh] overflow-y-auto bg-white border-dark-600 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark-50">새 글 작성</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary-100 text-dark-400 hover:text-dark-50 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 작성자 정보 */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-secondary-50 rounded-xl border border-dark-600/50">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    background: profile
                      ? `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  }}
                >
                  {profile?.emoji || '😊'}
                </div>
                <div>
                  <p className="text-dark-50 font-medium">나의 글</p>
                  <p className="text-dark-400 text-sm">{mbti || 'MBTI 미설정'}</p>
                </div>
              </div>

              {/* 카테고리 선택 */}
              <div className="mb-4">
                <label className="block text-dark-400 text-sm mb-2">카테고리</label>
                <select className="w-full bg-secondary-50 border border-dark-600 rounded-xl px-4 py-3 text-dark-50 focus:outline-none focus:border-primary-500">
                  <option>종목 토론</option>
                  <option>투자 토론</option>
                  <option>수익 인증</option>
                  <option>정보 공유</option>
                  <option>투자 질문</option>
                  <option>MBTI 투자</option>
                </select>
              </div>

              {/* 제목 */}
              <div className="mb-4">
                <label className="block text-dark-400 text-sm mb-2">제목</label>
                <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  className="w-full bg-secondary-50 border border-dark-600 rounded-xl px-4 py-3 text-dark-50 placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* 내용 */}
              <div className="mb-6">
                <label className="block text-dark-400 text-sm mb-2">내용</label>
                <textarea
                  rows={5}
                  placeholder="내용을 입력하세요..."
                  className="w-full bg-secondary-50 border border-dark-600 rounded-xl px-4 py-3 text-dark-50 placeholder:text-dark-400 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={onClose}>
                  취소
                </Button>
                <Button fullWidth onClick={onClose}>
                  작성 완료
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
