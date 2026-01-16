/**
 * LocalStorage 유틸리티 함수
 */

export const KEYS = {
  MBTI: 'mbti-stock-mbti',
  PORTFOLIO: 'mbti-stock-portfolio',
  ONBOARDING: 'mbti-stock-onboarding',
  SETTINGS: 'mbti-stock-settings',
} as const

// MBTI 관련
export function setMBTI(mbti: string | null): void {
  if (!mbti) return
  localStorage.setItem(KEYS.MBTI, mbti.toUpperCase())
  localStorage.setItem(KEYS.ONBOARDING, 'completed')
}

export function getMBTI(): string | null {
  return localStorage.getItem(KEYS.MBTI)
}

export function clearMBTI(): void {
  localStorage.removeItem(KEYS.MBTI)
}

// 온보딩 관련
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING) === 'completed'
}

export function setOnboarded(): void {
  localStorage.setItem(KEYS.ONBOARDING, 'completed')
}

export function resetOnboarding(): void {
  localStorage.removeItem(KEYS.ONBOARDING)
  localStorage.removeItem(KEYS.MBTI)
}

export interface StockHolding {
  ticker: string
  name: string
  price: number
  quantity: number
  buyPrice: number
  [key: string]: any
}

export interface PortfolioData {
  cash: number
  stocks: StockHolding[]
  history: any[]
  createdAt: string
  updatedAt?: string
}

// 포트폴리오 관련
export function initPortfolio(): PortfolioData {
  const defaultPortfolio: PortfolioData = {
    cash: 10000000, // 1천만원
    stocks: [],
    history: [],
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(defaultPortfolio))
  return defaultPortfolio
}

export function getPortfolio(): PortfolioData {
  const data = localStorage.getItem(KEYS.PORTFOLIO)
  if (!data) return initPortfolio()
  try {
    return JSON.parse(data) as PortfolioData
  } catch {
    return initPortfolio()
  }
}

export function updatePortfolio(updates: Partial<PortfolioData>): PortfolioData {
  const current = getPortfolio()
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
  localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(updated))
  return updated
}

export interface SettingsData {
  notifications: boolean
  darkMode: boolean
  [key: string]: any
}

// 설정 관련
export function getSettings(): SettingsData {
  const data = localStorage.getItem(KEYS.SETTINGS)
  const defaultSettings: SettingsData = { notifications: true, darkMode: true }
  if (!data) return defaultSettings
  try {
    return JSON.parse(data) as SettingsData
  } catch {
    return defaultSettings
  }
}

export function updateSettings(updates: Partial<SettingsData>): SettingsData {
  const current = getSettings()
  const updated = { ...current, ...updates }
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated))
  return updated
}

// 전체 초기화
export function clear(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
}

const storage = {
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

export default storage
