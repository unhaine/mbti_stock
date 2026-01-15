/**
 * 데이터 로더
 * JSON 데이터 파일을 캐싱하여 로드
 */

// 캐시 저장소
const cache = new Map()

// 데이터 로드 함수
async function loadData(path) {
    if (cache.has(path)) {
        return cache.get(path)
    }

    try {
        const module = await import(path)
        const data = module.default
        cache.set(path, data)
        return data
    } catch (error) {
        console.error(`Failed to load data from ${path}:`, error)
        return null
    }
}

// MBTI 프로필 로드
export async function loadProfiles() {
    return loadData('../data/mbti-profiles.json')
}

// 테마 로드
export async function loadThemes() {
    return loadData('../data/themes.json')
}

// 종목 로드
export async function loadStocks() {
    return loadData('../data/stocks.json')
}

// MBTI 코멘트 로드
export async function loadComments() {
    return loadData('../data/mbti-comments.json')
}

// 특정 MBTI 프로필 가져오기
export async function getMBTIProfile(mbti) {
    const profiles = await loadProfiles()
    if (!profiles) return null
    return profiles.find(p => p.id === mbti.toUpperCase())
}

// 특정 MBTI의 테마 가져오기
export async function getMBTIThemes(mbti) {
    const themes = await loadThemes()
    if (!themes) return []
    return themes.filter(t => t.mbti === mbti.toUpperCase())
}

// 특정 종목 정보 가져오기
export async function getStock(ticker) {
    const stocks = await loadStocks()
    if (!stocks) return null
    return stocks.find(s => s.ticker === ticker)
}

// 테마별 종목 목록 가져오기
export async function getThemeStocks(themeId) {
    const themes = await loadThemes()
    const stocks = await loadStocks()

    if (!themes || !stocks) return []

    const theme = themes.find(t => t.id === themeId)
    if (!theme) return []

    return theme.stocks
        .map(ticker => stocks.find(s => s.ticker === ticker))
        .filter(Boolean)
}

// 캐시 클리어
export function clearCache() {
    cache.clear()
}

// 데이터 프리로드
export async function preloadAllData() {
    await Promise.all([
        loadProfiles(),
        loadThemes(),
        loadStocks(),
        loadComments(),
    ])
}

export default {
    loadProfiles,
    loadThemes,
    loadStocks,
    loadComments,
    getMBTIProfile,
    getMBTIThemes,
    getStock,
    getThemeStocks,
    clearCache,
    preloadAllData,
}
