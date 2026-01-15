/**
 * LocalStorage 유틸리티 함수
 */

export const KEYS = {
    MBTI: 'mbti-stock-mbti',
    PORTFOLIO: 'mbti-stock-portfolio',
    ONBOARDING: 'mbti-stock-onboarding',
    SETTINGS: 'mbti-stock-settings',
}

// MBTI 관련
export function setMBTI(mbti) {
    if (!mbti) return
    localStorage.setItem(KEYS.MBTI, mbti.toUpperCase())
    localStorage.setItem(KEYS.ONBOARDING, 'completed')
}

export function getMBTI() {
    return localStorage.getItem(KEYS.MBTI)
}

export function clearMBTI() {
    localStorage.removeItem(KEYS.MBTI)
}

// 온보딩 관련
export function isOnboardingCompleted() {
    return localStorage.getItem(KEYS.ONBOARDING) === 'completed'
}

export function setOnboarded() {
    localStorage.setItem(KEYS.ONBOARDING, 'completed')
}

export function resetOnboarding() {
    localStorage.removeItem(KEYS.ONBOARDING)
    localStorage.removeItem(KEYS.MBTI)
}

// 포트폴리오 관련
export function initPortfolio() {
    const defaultPortfolio = {
        cash: 10000000, // 1천만원
        stocks: [],
        history: [],
        createdAt: new Date().toISOString(),
    }
    localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(defaultPortfolio))
    return defaultPortfolio
}

export function getPortfolio() {
    const data = localStorage.getItem(KEYS.PORTFOLIO)
    if (!data) return initPortfolio()
    try {
        return JSON.parse(data)
    } catch {
        return initPortfolio()
    }
}

export function updatePortfolio(updates) {
    const current = getPortfolio()
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
    localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(updated))
    return updated
}

// 설정 관련
export function getSettings() {
    const data = localStorage.getItem(KEYS.SETTINGS)
    if (!data) return { notifications: true, darkMode: true }
    try {
        return JSON.parse(data)
    } catch {
        return { notifications: true, darkMode: true }
    }
}

export function updateSettings(updates) {
    const current = getSettings()
    const updated = { ...current, ...updates }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated))
    return updated
}

// 전체 초기화
export function clear() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key))
}

export default {
    setMBTI,
    getMBTI,
    clearMBTI,
    isOnboardingCompleted,
    setOnboarded,
    resetOnboarding,
    initPortfolio,
    getPortfolio,
    updatePortfolio,
    getSettings,
    updateSettings,
    clear,
}
