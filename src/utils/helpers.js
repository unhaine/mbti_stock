/**
 * 헬퍼 유틸리티 함수
 */

// 배열에서 랜덤 선택
export function randomChoice(array) {
    if (!array || array.length === 0) return null
    return array[Math.floor(Math.random() * array.length)]
}

// 랜덤 정수 생성 (min ~ max 포함)
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// 시장 상태 결정 (상승/보합/하락)
export function getMarketCondition() {
    const rand = Math.random()
    if (rand < 0.33) return 'bear'
    if (rand < 0.66) return 'neutral'
    return 'bull'
}

// MBTI 코멘트 선택
export function getMBTIComment(comments, mbti, condition = null) {
    if (!comments || !mbti) return null

    const mbtiComments = comments[mbti.toUpperCase()]
    if (!mbtiComments) return null

    const marketCondition = condition || getMarketCondition()
    const conditionComments = mbtiComments[marketCondition]

    if (!conditionComments || conditionComments.length === 0) return null

    return randomChoice(conditionComments)
}

// 변동 색상 반환
export function getChangeColor(value) {
    if (value > 0) return 'text-emerald-400' // 상승
    if (value < 0) return 'text-red-400' // 하락
    return 'text-gray-400' // 보합
}

// 변동 배경색 반환
export function getChangeBgColor(value) {
    if (value > 0) return 'bg-emerald-500/20'
    if (value < 0) return 'bg-red-500/20'
    return 'bg-gray-500/20'
}

// 변동 아이콘 반환
export function getChangeArrow(value) {
    if (value > 0) return '▲'
    if (value < 0) return '▼'
    return '−'
}

// 스와이프 파워 계산 (Framer Motion용)
export function swipePower(offset, velocity) {
    return Math.abs(offset) * velocity
}

// 스와이프 임계값
export const SWIPE_THRESHOLD = 10000

// 디바운스
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// 쓰로틀
export function throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

// 클래스명 조합
export function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}

// 딜레이 (Promise)
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// 클립보드에 복사
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

export default {
    randomChoice,
    randomInt,
    getMarketCondition,
    getMBTIComment,
    getChangeColor,
    getChangeBgColor,
    getChangeArrow,
    swipePower,
    SWIPE_THRESHOLD,
    debounce,
    throttle,
    cn,
    delay,
    copyToClipboard,
}
