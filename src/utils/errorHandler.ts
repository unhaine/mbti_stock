/**
 * 통합 에러 핸들링 유틸리티
 */

import toast from 'react-hot-toast'

// 에러 타입 정의
export type ErrorType =
  | 'network'
  | 'api'
  | 'validation'
  | 'auth'
  | 'notfound'
  | 'unknown'

// 에러 컨텍스트
export interface ErrorContext {
  component?: string
  action?: string
  ticker?: string
  userId?: string
}

// 에러 핸들링 옵션
export interface ErrorHandlerOptions {
  showToast?: boolean
  toastMessage?: string
  logToConsole?: boolean
  fallback?: () => void
  context?: ErrorContext
  rethrow?: boolean
}

// 에러 정보
export interface ErrorInfo {
  type: ErrorType
  message: string
  originalError?: unknown
  context?: ErrorContext
  timestamp: string
}

// 에러 타입 감지
function detectErrorType(error: unknown): ErrorType {
  if (error instanceof TypeError) {
    return 'network'
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'network'
    }
    if (message.includes('unauthorized') || message.includes('auth')) {
      return 'auth'
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'notfound'
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation'
    }
    if (message.includes('api') || message.includes('http')) {
      return 'api'
    }
  }
  
  return 'unknown'
}

// 사용자 친화적 에러 메시지
function getUserFriendlyMessage(type: ErrorType, originalMessage?: string): string {
  const messages: Record<ErrorType, string> = {
    network: '네트워크 연결을 확인해주세요.',
    api: '서버와 통신 중 오류가 발생했습니다.',
    validation: '입력 값을 확인해주세요.',
    auth: '로그인이 필요합니다.',
    notfound: '요청한 정보를 찾을 수 없습니다.',
    unknown: '알 수 없는 오류가 발생했습니다.',
  }
  
  return messages[type] || originalMessage || messages.unknown
}

/**
 * 통합 에러 핸들러
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): ErrorInfo {
  const {
    showToast = true,
    toastMessage,
    logToConsole = true,
    fallback,
    context,
    rethrow = false,
  } = options
  
  const errorType = detectErrorType(error)
  const originalMessage = error instanceof Error ? error.message : String(error)
  const userMessage = toastMessage || getUserFriendlyMessage(errorType, originalMessage)
  
  const errorInfo: ErrorInfo = {
    type: errorType,
    message: userMessage,
    originalError: error,
    context,
    timestamp: new Date().toISOString(),
  }
  
  // 콘솔 로깅
  if (logToConsole) {
    console.error('[ErrorHandler]', {
      type: errorType,
      message: originalMessage,
      context,
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
  
  // 토스트 알림
  if (showToast) {
    toast.error(userMessage)
  }
  
  // 폴백 함수 실행
  if (fallback) {
    try {
      fallback()
    } catch (fallbackError) {
      console.error('[ErrorHandler] Fallback failed:', fallbackError)
    }
  }
  
  // 에러 재던지기
  if (rethrow) {
    throw error
  }
  
  return errorInfo
}

/**
 * 비동기 함수 래퍼 (에러 자동 처리)
 */
export function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: ErrorHandlerOptions
): () => Promise<T | null> {
  return async () => {
    try {
      return await fn()
    } catch (error) {
      handleError(error, options)
      return null
    }
  }
}

/**
 * try-catch 헬퍼
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  options?: ErrorHandlerOptions
): Promise<[T, null] | [null, ErrorInfo]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    const errorInfo = handleError(error, { ...options, showToast: false })
    return [null, errorInfo]
  }
}

export default {
  handleError,
  withErrorHandling,
  tryCatch,
}
