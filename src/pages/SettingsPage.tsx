import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clear, resetOnboarding } from '../utils/storage'
import { useMBTI, useSettings } from '../hooks'
import { useAuth } from '../contexts/AuthContext.tsx'
import ConfirmModal from '../components/common/ConfirmModal'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import Toggle from '../components/common/Toggle'
import toast from 'react-hot-toast'
import profilesData from '../data/mbti-profiles.json'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [mbti] = useMBTI()
  const [settings, setSettings] = useSettings()
  const { user, signOut } = useAuth()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showMBTIChange, setShowMBTIChange] = useState(false)

  const mbtiProfile = useMemo(() => {
    if (!mbti) return null
    return profilesData.find((p) => p.id === mbti)
  }, [mbti])

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ [key]: value })
  }

  const handleReset = () => {
    clear()
    navigate('/', { replace: true })
  }

  const handleChangeMBTI = () => {
    resetOnboarding()
    navigate('/onboarding')
  }

  const handleLogout = async () => {
    toast.success('로그아웃 되었습니다.')
    localStorage.clear()
    signOut().catch((err) => console.error('[Auth] Background signOut error:', err))
    window.location.replace('/')
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto pb-14 pt-12 scrollbar-hide">
        <div className="max-w-md mx-auto px-4 py-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* 페이지 타이틀 */}
            <h1 className="text-xl font-bold text-secondary-900 mb-6">설정</h1>

            {/* 프로필 섹션 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                프로필
              </h2>
              <div className="divide-y divide-secondary-100">
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-500 text-sm">MBTI</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600">{mbti || '미설정'}</span>
                    <button
                      onClick={() => setShowMBTIChange(true)}
                      className="text-[11px] font-bold text-secondary-500 px-2 py-1 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors"
                    >
                      변경
                    </button>
                  </div>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-500 text-sm">성향</span>
                  <span className="text-secondary-900">{mbtiProfile?.tagline || '-'}</span>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-500 text-sm">리스크</span>
                  <span className="text-secondary-900">{(mbtiProfile as any)?.riskTolerance || '-'}</span>
                </div>
              </div>
            </section>

            {/* 계정 섹션 */}
            {user && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                  계정
                </h2>
                <div className="divide-y divide-secondary-100">
                  <div className="py-4 flex items-center justify-between">
                    <span className="text-secondary-500 text-sm">이메일</span>
                    <span className="text-secondary-900 text-sm">{user.email}</span>
                  </div>
                  <div className="py-4">
                    <button
                      onClick={handleLogout}
                      className="text-error text-sm hover:underline"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* 일반 설정 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                일반
              </h2>
              <div className="divide-y divide-secondary-100">
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">푸시 알림</span>
                  <Toggle
                    checked={settings.notifications}
                    onChange={(v) => handleSettingChange('notifications', v)}
                  />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">다크 모드</span>
                  <Toggle
                    checked={settings.darkMode ?? true}
                    onChange={(v) => handleSettingChange('darkMode', v)}
                  />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">효과음</span>
                  <Toggle
                    checked={settings.soundEffects ?? false}
                    onChange={(v) => handleSettingChange('soundEffects', v)}
                  />
                </div>
              </div>
            </section>

            {/* AI 분석 설정 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                AI 분석
              </h2>
              <div className="bg-secondary-50/50 rounded-xl p-4 border border-secondary-100 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-secondary-900 font-bold text-sm">Gemini AI 인사이트</span>
                  <Toggle
                    checked={settings.aiEnabled}
                    onChange={(v) => handleSettingChange('aiEnabled', v)}
                  />
                </div>
                <p className="text-[11px] text-secondary-500 leading-relaxed">
                  활성화하면 Google Gemini AI가 당신의 MBTI를 분석하여 맞춤형 투자 조언과 종목 분석 리포트를 생성합니다. (API 호출이 발생합니다)
                </p>
              </div>
            </section>

            {/* 데이터 설정 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                데이터
              </h2>
              <div className="divide-y divide-secondary-100">
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">자동 새로고침</span>
                  <Toggle
                    checked={settings.refreshInterval === 300}
                    onChange={(v) => handleSettingChange('refreshInterval', v ? 300 : 30)}
                  />
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">캐시 정리</span>
                  <button className="text-secondary-500 text-sm hover:text-secondary-900">
                    정리
                  </button>
                </div>
              </div>
            </section>

            {/* 앱 정보 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                앱 정보
              </h2>
              <div className="divide-y divide-secondary-100">
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">버전</span>
                  <span className="text-secondary-500 text-sm">v1.0.0</span>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">피드백</span>
                  <span className="text-secondary-500 text-sm">→</span>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <span className="text-secondary-900 text-sm">리뷰</span>
                  <span className="text-secondary-500 text-sm">→</span>
                </div>
              </div>
            </section>

            {/* 위험 영역 */}
            <section>
              <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">
                위험 영역
              </h2>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-error text-sm hover:underline"
              >
                모든 데이터 초기화
              </button>
            </section>
          </motion.div>
        </div>
      </main>

      <FooterNav />

      {/* 초기화 확인 모달 */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="정말 초기화할까요?"
        description={
          <>
            모든 데이터가 삭제되며
            <br />
            복구할 수 없습니다.
          </>
        }
        confirmLabel="초기화"
        confirmVariant="danger"
      />

      {/* MBTI 변경 확인 모달 */}
      <ConfirmModal
        isOpen={showMBTIChange}
        onClose={() => setShowMBTIChange(false)}
        onConfirm={handleChangeMBTI}
        title="MBTI를 변경할까요?"
        description={
          <>
            새로운 MBTI로 투자 성향을
            <br />
            다시 분석합니다.
          </>
        }
        confirmLabel="변경하기"
      />
    </div>
  )
}
