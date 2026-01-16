import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.tsx'
import Card from '../../components/common/Card'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()

    const safeEmail = email.trim()
    const safePassword = password.trim()
    const safeConfirm = confirmPassword.trim()

    if (!safeEmail || !safePassword || !safeConfirm) {
      toast.error('모든 필드를 입력해주세요.')
      return
    }

    if (safePassword !== safeConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }

    if (safePassword.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      setLoading(true)
      const { error } = await signUp({ email: safeEmail, password: safePassword })

      if (error) throw error

      toast.success('가입을 환영합니다!')
      navigate('/onboarding')
    } catch (error: any) {
      console.error(error)
      let msg = '회원가입 실패'

      // 자세한 에러 메시지 처리
      if (error.message?.includes('Password should be')) msg = '비밀번호 유효성 오류 (너무 쉬움 등)'
      else if (error.message?.includes('User already registered')) msg = '이미 가입된 이메일입니다.'
      else if (error.message?.includes('valid email')) msg = '유효하지 않은 이메일 형식입니다.'
      else if (error.message?.includes('rate limit')) msg = '잠시 후 다시 시도해주세요.'

      toast.error(msg + ` (${error.message})`) // 괄호 안에 원문도 표시하여 디버깅 도움
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <span className="text-4xl mb-4 block">🚀</span>
          <h1 className="text-3xl font-bold text-dark-50 mb-2">시작해볼까요?</h1>
          <p className="text-dark-300">투자의 새로운 즐거움을 발견하세요</p>
        </motion.div>

        <Card className="p-6 bg-dark-800 border-dark-700">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-600 text-dark-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-600 text-dark-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                placeholder="6자 이상 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-dark-600 text-dark-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
                placeholder="비밀번호를 한번 더 입력하세요"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '계정 만들기'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium ml-1"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
