import React, { ErrorInfo, ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: null, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">앗! 오류가 발생했어요 😱</h1>
          <p className="text-gray-600 mb-6">앱을 실행하는 도중 예상치 못한 문제가 발생했습니다.</p>
          <div className="bg-gray-100 p-4 rounded-lg text-left overflow-auto max-w-2xl w-full mb-6 border border-gray-300">
            <p className="font-bold text-red-600 mb-2">
              {this.state.error && this.state.error.toString()}
            </p>
            <pre className="text-xs text-gray-500 whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()}>새로고침</Button>
            <Button
              variant="secondary"
              onClick={() => {
                localStorage.clear()
                window.location.href = '/'
              }}
            >
              데이터 초기화 및 재시작
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
