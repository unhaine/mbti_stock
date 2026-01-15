import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clear, resetOnboarding } from '../utils/storage'
import { useMBTI, useSettings } from '../hooks'
import ConfirmModal from '../components/common/ConfirmModal'
import Header from '../components/layout/Header'
import FooterNav from '../components/layout/FooterNav'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Toggle from '../components/common/Toggle'
import SettingItem from '../components/common/SettingItem'

// JSON 데이터
import profilesData from '../data/mbti-profiles.json'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [mbti, setMBTI] = useMBTI()
  const [settings, setSettings] = useSettings()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showMBTIChange, setShowMBTIChange] = useState(false)

  // MBTI 프로필
  const mbtiProfile = useMemo(() => {
    if (!mbti) return null
    return profilesData.find((p) => p.id === mbti)
  }, [mbti])

  // 설정 변경 핸들러
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // 데이터 초기화
  const handleReset = () => {
    clear()
    navigate('/', { replace: true })
  }

  // MBTI 변경
  const handleChangeMBTI = () => {
    resetOnboarding()
    navigate('/onboarding')
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto pb-24 pt-14 scrollbar-hide">
        <div className="max-w-lg mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-dark-50 mb-6">설정</h1>

            {/* 프로필 섹션 */}
            <section className="mb-6">
              <h2 className="text-dark-100 text-sm font-bold mb-3">내 프로필</h2>
              <Card className="relative overflow-hidden">
                {/* 배경 그라데이션 */}
                {mbtiProfile && (
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `linear-gradient(135deg, ${mbtiProfile.gradient[0]} 0%, ${mbtiProfile.gradient[1]} 100%)`,
                    }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      background: mbtiProfile
                        ? `linear-gradient(135deg, ${mbtiProfile.gradient[0]}, ${mbtiProfile.gradient[1]})`
                        : 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                    }}
                  >
                    {mbtiProfile?.emoji || '❓'}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-dark-50">{mbti || '미설정'}</p>
                    <p className="text-dark-200 text-sm font-medium">
                      {mbtiProfile?.tagline || '투자 성향을 분석해보세요'}
                    </p>
                    {mbtiProfile && (
                      <p className="text-dark-300 text-xs mt-1 font-medium">
                        리스크 성향: {mbtiProfile.riskTolerance}
                      </p>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowMBTIChange(true)}>
                    변경
                  </Button>
                </div>
              </Card>
            </section>

            {/* 일반 설정 */}
            <section className="mb-6">
              <h2 className="text-dark-100 text-sm font-bold mb-3">일반</h2>
              <Card className="divide-y divide-dark-600">
                <SettingItem icon="🔔" title="푸시 알림" description="시장 변동 및 새 소식 알림">
                  <Toggle
                    checked={settings.notifications}
                    onChange={(v) => handleSettingChange('notifications', v)}
                  />
                </SettingItem>

                <SettingItem icon="🌙" title="다크 모드" description="항상 어두운 테마 사용">
                  <Toggle
                    checked={settings.darkMode ?? true}
                    onChange={(v) => handleSettingChange('darkMode', v)}
                  />
                </SettingItem>

                <SettingItem icon="🔊" title="효과음" description="버튼 클릭 시 효과음">
                  <Toggle
                    checked={settings.soundEnabled ?? false}
                    onChange={(v) => handleSettingChange('soundEnabled', v)}
                  />
                </SettingItem>
              </Card>
            </section>

            {/* 데이터 설정 */}
            <section className="mb-6">
              <h2 className="text-dark-100 text-sm font-bold mb-3">데이터</h2>
              <Card className="divide-y divide-dark-600">
                <SettingItem icon="📊" title="자동 새로고침" description="5분마다 데이터 업데이트">
                  <Toggle
                    checked={settings.autoRefresh ?? true}
                    onChange={(v) => handleSettingChange('autoRefresh', v)}
                  />
                </SettingItem>

                <SettingItem icon="💾" title="캐시 정리" description="저장된 임시 데이터 삭제">
                  <Button variant="ghost" size="sm">
                    정리
                  </Button>
                </SettingItem>
              </Card>
            </section>

            {/* 앱 정보 */}
            <section className="mb-6">
              <h2 className="text-dark-100 text-sm font-bold mb-3">앱 정보</h2>
              <Card>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-dark-200 font-medium">앱 버전</span>
                    <span className="text-dark-50 font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-200 font-medium">개발</span>
                    <span className="text-dark-50 font-medium">조별과제 팀</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-200 font-medium">빌드</span>
                    <span className="text-dark-50 font-medium">2026.01.15</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-600 flex gap-3">
                  <Button variant="ghost" size="sm" fullWidth>
                    📝 피드백
                  </Button>
                  <Button variant="ghost" size="sm" fullWidth>
                    ⭐ 리뷰
                  </Button>
                </div>
              </Card>
            </section>

            {/* 위험 영역 */}
            <section>
              <h2 className="text-dark-100 text-sm font-bold mb-3">위험 영역</h2>
              <Card className="border-red-900/30">
                <Button variant="danger" fullWidth onClick={() => setShowResetConfirm(true)}>
                  🗑️ 모든 데이터 초기화
                </Button>
                <p className="text-dark-300 text-xs text-center mt-3 font-medium">
                  MBTI 설정, 가상 자산, 모든 설정이 삭제됩니다
                </p>
              </Card>
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
        icon="⚠️"
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
        icon="🔄"
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
