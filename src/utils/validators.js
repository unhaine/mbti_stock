/**
 * 검증 유틸리티 함수
 */

// 유효한 MBTI 목록
export const VALID_MBTI_TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

// MBTI 유효성 검사
export function isValidMBTI(mbti) {
    if (!mbti) return false
    return VALID_MBTI_TYPES.includes(mbti.toUpperCase())
}

// MBTI 검증 (에러 throw)
export function validateMBTI(mbti) {
    if (!mbti) {
        throw new Error('MBTI가 선택되지 않았습니다.')
    }

    const upperMBTI = mbti.toUpperCase()

    if (!isValidMBTI(upperMBTI)) {
        throw new Error(`유효하지 않은 MBTI 유형입니다: ${mbti}`)
    }

    return upperMBTI
}

// 포트폴리오 검증
export function validatePortfolio(portfolio) {
    if (!portfolio) {
        throw new Error('포트폴리오가 없습니다.')
    }

    if (typeof portfolio.cash !== 'number' || portfolio.cash < 0) {
        throw new Error('잘못된 현금 잔액입니다.')
    }

    if (!Array.isArray(portfolio.stocks)) {
        throw new Error('잘못된 주식 목록입니다.')
    }

    return true
}

// 주식 티커 유효성 검사
export function isValidTicker(ticker) {
    if (!ticker) return false
    // 한국 주식: 6자리 숫자
    const koreanPattern = /^\d{6}$/
    return koreanPattern.test(ticker)
}

// 가격 유효성 검사
export function isValidPrice(price) {
    return typeof price === 'number' && price > 0 && isFinite(price)
}

// 수량 유효성 검사
export function isValidQuantity(quantity) {
    return Number.isInteger(quantity) && quantity > 0
}

export default {
    VALID_MBTI_TYPES,
    isValidMBTI,
    validateMBTI,
    validatePortfolio,
    isValidTicker,
    isValidPrice,
    isValidQuantity,
}
