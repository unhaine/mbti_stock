import { useState, useEffect } from 'react'

/**
 * 로컬 스토리지와 상태를 동기화하는 커스텀 훅
 * @param {string} key 스토리지 키
 * @param {any} initialValue 초기값
 * @returns {[any, function]} [값, 설정함수]
 */
export default function useLocalStorage(key, initialValue) {
  // 초기값 로드
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  // 값 변경 함수
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
        
        // 같은 탭 내의 다른 훅 인스턴스들에게 알림
        window.dispatchEvent(new Event('local-storage'))
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key)
        setStoredValue(item ? JSON.parse(item) : initialValue)
      } catch (error) {
        console.error(error)
      }
    }

    // 다른 탭에서의 변경 감지
    window.addEventListener('storage', handleStorageChange)
    
    // 같은 탭 내에서의 변경 감지 (커스텀 이벤트)
    window.addEventListener('local-storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue]
}
