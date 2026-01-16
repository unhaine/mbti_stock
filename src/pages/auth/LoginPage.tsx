import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext.tsx'
import Card from '../../components/common/Card'

export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const safeEmail = email.trim()
    const safePassword = password.trim()

    if (!safeEmail || !safePassword) {
      toast.error('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      const { error } = await signIn({ email: safeEmail, password: safePassword })

      if (error) throw error

      toast.success('로그인 성공!')
      navigate('/main') // 메인으로 이동
    } catch (error: any) {
      console.error(error)
      let msg = '로그인 실패'

      if (error.message?.includes('Invalid login credentials'))
        msg = '이메일 또는 비밀번호가 올바르지 않습니다.'
      else if (error.message?.includes('Email not confirmed'))
        msg = '이메일 인증이 필요합니다. (Supabase 설정 확인)'
      else if (error.message?.includes('rate limit')) msg = '잠시 후 다시 시도해주세요.'

      toast.error(msg)
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
          <span className="text-4xl mb-4 block">👻</span>
          <h1 className="text-3xl font-bold text-dark-50 mb-2">다시 오셨군요!</h1>
          <p className="text-dark-300">MBTI 투자 성향 분석을 계속해보세요</p>
        </motion.div>

        <Card className="p-6 bg-dark-800 border-dark-700">
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="비밀번호를 입력하세요"
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
                '로그인하기'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm">
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                className="text-primary-400 hover:text-primary-300 font-medium ml-1"
              >
                회원가입하기
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
