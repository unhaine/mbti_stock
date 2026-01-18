import { Stock } from '../types'

// Gemini API 키 확인
const getApiKey = (): string | null => {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key) {
    console.warn('VITE_GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인하세요.')
    return null
  }
  return key
}

// 모델 설정
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'

// 레이트 리밋 쿨다운 (429 에러 발생 시 잠시 API 호출 중단)
let last429Time = 0
const COOLDOWN_MS = 10000 // 10초

// 중복 요청 방지 (In-flight requests)
const ongoingRequests = new Map<string, Promise<{ explanation: string; rationale: string }>>()

/**
 * AI 활성화 여부 확인 (Zustand persist storage에서 가져옴)
 */
function isAIEnabled(): boolean {
  try {
    const storage = localStorage.getItem('mbti-stock-settings-storage')
    if (!storage) return false
    const parsed = JSON.parse(storage)
    return parsed.state?.aiEnabled === true
  } catch (e) {
    return false
  }
}

/**
 * AI 분석을 위한 추가 컨텍스트 타입
 */
export interface AnalysisContext {
  currentPrice?: number
  changePercent?: number
  communitySentiment?: string // 예: "현재 하락세에 대한 걱정이 지배적입니다."
  aiMessage?: string // Ranker에서 생성한 분석 메시지
  themeTitle?: string // 추천 테마 제목
  themeDescription?: string // 추천 테마 설명
  themeCategory?: string // 추천 테마 카테고리
}

/**
 * 지능형 통합 AI 컨텐츠 생성 (설명 + 추천이유)
 */
export async function generateUnifiedAIContent(
  stock: Stock, 
  mbti: string,
  context?: AnalysisContext
): Promise<{ explanation: string; rationale: string }> {
  const apiKey = getApiKey()
  
  // 기본값 설정
  const fallback = {
    explanation: getDefaultExplanation(stock, mbti),
    rationale: `${mbti} 투자 스타일과 잘 어울리는 종목입니다.`
  }

  // 1. AI 활성화 체크
  if (!isAIEnabled()) {
    return fallback
  }

  if (!apiKey) return fallback

  // 쿨다운 체크
  if (Date.now() - last429Time < COOLDOWN_MS) {
    console.warn('🕒 Gemini API 쿨다운 중... 기본값을 사용합니다.')
    return fallback
  }

  if (!checkUsageLimit()) {
    return fallback
  }

  // 컨텍스트 정보 구성
  let contextInfo = ''
  if (context) {
    if (context.currentPrice) {
      contextInfo += `- 현재가: ${context.currentPrice.toLocaleString()}원 (${context.changePercent && context.changePercent > 0 ? '+' : ''}${context.changePercent}%) \n`
    }
    if (context.communitySentiment) {
      contextInfo += `- 커뮤니티 여론 요약: ${context.communitySentiment}\n`
    }
    if (context.aiMessage) {
       contextInfo += `- 기술적 분석 결과: ${context.aiMessage}\n`
    }
    if (context.themeTitle) {
       contextInfo += `- 추천 테마: "${context.themeTitle}" (${context.themeDescription})\n`
    }
  }

  const prompt = `
당신은 ${mbti} 성향의 투자자를 위한 전문 투자 고문입니다. 
다음 종목 정보를 바탕으로 2가지 항목을 JSON 형식으로 답변해주세요.
${context?.themeTitle ? `\n**중요**: 이 종목은 "${context.themeTitle}" 테마로 추천되었습니다. 테마의 핵심 컨셉에 맞는 "스토리"를 반드시 발굴하여 설명에 녹여주세요.\n` : ''}
특히 **'실시간 시세', '기술적 분석 결과', '테마 스토리'를 반드시 반영**하여 살아있는 조언을 해주세요.

종목 정보:
- 이름: ${stock.name}
- 업종: ${stock.sector}
- 변동성: ${stock.volatility}
${contextInfo}
- 재무: ${stock.hasFinancials ? '안정적 수익 구조' : '공격적 성장성 중심'}

요청 항목:
1. explanation: ${mbti} 투자자에게 전하는 통찰력 있는 한마디 (2-3문장, 은유 포함, ${context?.themeTitle ? '테마 스토리 필수 반영' : '현재 시세나 여론 상황 언급'})
2. rationale: 이 종목을 추천/비추천하는 핵심 이유 (1-2문장, 데이터 기반)

응답 형식 (반드시 JSON으로만 답변):
{
  "explanation": "...",
  "rationale": "..."
}
`.trim()

  try {
    console.log('🚀 Gemini 통합 API 호출 시도:', stock.name)
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    })

    if (response.status === 429) {
      console.warn('⚠️ Gemini API 할당량 초과 (429). 캐시 또는 기본값을 사용합니다.')
      last429Time = Date.now()
      return fallback
    }

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API Error details:', JSON.stringify(error, null, 2))
      return fallback
    }

    const data = await response.json()
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (content) {
      // JSON 마크다운 태그 제거 (있는 경우)
      content = content.replace(/```json/g, '').replace(/```/g, '').trim()
      
      try {
        const parsed = JSON.parse(content)
        console.log('✅ Gemini 통합 분석 성공')
        incrementUsage()
        return {
          explanation: parsed.explanation || fallback.explanation,
          rationale: parsed.rationale || fallback.rationale
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', content)
      }
    }

    return fallback
  } catch (error) {
    console.error('generateUnifiedAIContent Error:', error)
    return fallback
  }
}

/**
 * MBTI 맞춤 종목 설명 생성 (하위 호환성 유지)
 */
export async function generateMBTIExplanation(stock: Stock, mbti: string): Promise<string> {
  const result = await generateUnifiedAIContent(stock, mbti)
  return result.explanation
}

/**
 * AI 추천 이유 생성 (하위 호환성 유지)
 */
export async function generateRecommendationRationale(stock: Stock, mbti: string): Promise<string> {
  const result = await generateUnifiedAIContent(stock, mbti)
  return result.rationale
}

export async function getOrGenerateUnifiedContent(
  stock: Stock,
  mbti: string,
  context?: AnalysisContext // 컨텍스트 추가
): Promise<{ explanation: string; rationale: string; fromCache: boolean }> {
  const expCached = getCachedExplanation(stock.ticker, mbti)
  const ratCached = getCachedRationale(stock.ticker, mbti)
  
  // 컨텍스트가 있으면 캐시를 무시할지 고민해봐야 함.
  // 일단 실시간성이 중요하므로, 컨텍스트(실시간 가격 등)가 전달되면 캐시를 무시하는 전략도 좋음.
  // 여기서는 1시간 캐시가 있더라도, 컨텍스트가 강력하면 새로 생성하도록 할 수 있음.
  // 하지만 비용 절감을 위해 일단은 캐시 우선 정책 유지 (추후 사용자 피드백 따라 변경)
  if (expCached && ratCached) {
    // return { explanation: expCached, rationale: ratCached, fromCache: true }
  }

  // 중복 요청 체크 (진행 중인 요청이 있으면 공유)
  const requestKey = `${stock.ticker}_${mbti}`
  if (ongoingRequests.has(requestKey)) {
    console.log('🔄 중복 요청 감지: 기존 요청을 공유합니다.', stock.name)
    const result = await ongoingRequests.get(requestKey)!
    return { ...result, fromCache: false }
  }

  // 새 요청 생성 및 등록
  // 컨텍스트 전달
  const promise = generateUnifiedAIContent(stock, mbti, context).then(result => {
    if (result) {
      setCachedExplanation(stock.ticker, mbti, result.explanation)
      setCachedRationale(stock.ticker, mbti, result.rationale)
    }
    return result
  }).finally(() => {
    ongoingRequests.delete(requestKey)
  })

  ongoingRequests.set(requestKey, promise)
  const result = await promise

  return { ...result, fromCache: false }
}

/**
 * 기본 설명 생성 (API 없을 때)
 */
function getDefaultExplanation(stock: Stock, mbti: string): string {
  const rawMetaphor = stock.metaphors?.[mbti] || stock.metaphors?.default

  if (rawMetaphor) {
    return typeof rawMetaphor === 'string' ? rawMetaphor : rawMetaphor.text || ''
  }

  const templates: Record<string, string> = {
    INTJ: `${stock.name}은(는) 전략적 사고가 필요한 종목입니다. 장기적 관점에서 분석해보세요.`,
    INTP: `${stock.name}에서 숨겨진 가치를 찾아보세요. 논리적 분석이 빛을 발할 종목입니다.`,
    ENTJ: `${stock.name}은(는) 리더십과 결단력이 필요한 투자입니다.`,
    ENTP: `${stock.name}은(는) 혁신과 변화의 중심에 있습니다. 새로운 가능성을 탐색해보세요.`,
    INFJ: `${stock.name}에서 가치와 비전을 발견해보세요.`,
    INFP: `${stock.name}은(는) 당신의 가치관과 맞는지 확인해보세요.`,
    ENFJ: `${stock.name}은(는) 사회적 가치를 창출하는 기업입니다.`,
    ENFP: `${stock.name}은(는) 흥미진진한 가능성을 품고 있습니다.`,
    ISTJ: `${stock.name}은(는) 안정적이고 검증된 투자처입니다.`,
    ISFJ: `${stock.name}은(는) 보수적인 접근이 어울리는 종목입니다.`,
    ESTJ: `${stock.name}은(는) 효율성과 실적을 중시하는 투자자에게 적합합니다.`,
    ESFJ: `${stock.name}은(는) 안정적인 수익을 기대할 수 있는 종목입니다.`,
    ISTP: `${stock.name}은(는) 기술적 분석이 필요한 종목입니다.`,
    ISFP: `${stock.name}에서 감성적 가치를 느껴보세요.`,
    ESTP: `${stock.name}은(는) 빠른 판단이 필요한 액션 종목입니다.`,
    ESFP: `${stock.name}은(는) 재미있고 역동적인 투자 기회입니다.`,
  }

  return templates[mbti] || `${stock.name}은(는) ${stock.sector} 섹터의 주목할 종목입니다.`
}

// ============ 사용량 관리 ============

const USAGE_KEY = 'gemini_usage_v1'
const DAILY_LIMIT = 100 

interface UsageData {
  date: string
  count: number
}

function checkUsageLimit(): boolean {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    resetUsage()
    return true
  }

  return usage.count < DAILY_LIMIT
}

function incrementUsage(): void {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    setUsage({ date: today, count: 1 })
  } else {
    setUsage({ ...usage, count: usage.count + 1 })
  }
}

function getUsage(): UsageData {
  try {
    const data = localStorage.getItem(USAGE_KEY)
    return data ? JSON.parse(data) : { date: '', count: 0 }
  } catch {
    return { date: '', count: 0 }
  }
}

function setUsage(usage: UsageData): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
}

function resetUsage(): void {
  setUsage({ date: new Date().toDateString(), count: 0 })
}

export function getRemainingUsage(): number {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    return DAILY_LIMIT
  }

  return Math.max(0, DAILY_LIMIT - usage.count)
}

// ============ 캐싱 ============

const CACHE_EXP_PREFIX = 'gemini_exp_v3_'
const CACHE_RAT_PREFIX = 'gemini_rat_v3_'
const CACHE_DURATION = 24 * 60 * 60 * 1000 

interface CacheData {
  data: string
  timestamp: number
}

/**
 * 캐시에서 가져오기 (범용)
 */
function getFromCache(key: string): string | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp }: CacheData = JSON.parse(cached)

    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

/**
 * 캐시에 저장하기 (범용)
 */
function saveToCache(key: string, data: string): void {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

export function getCachedExplanation(ticker: string, mbti: string): string | null {
  return getFromCache(`${CACHE_EXP_PREFIX}${ticker}_${mbti}`)
}

export function setCachedExplanation(ticker: string, mbti: string, explanation: string): void {
  saveToCache(`${CACHE_EXP_PREFIX}${ticker}_${mbti}`, explanation)
}

export function getCachedRationale(ticker: string, mbti: string): string | null {
  return getFromCache(`${CACHE_RAT_PREFIX}${ticker}_${mbti}`)
}

export function setCachedRationale(ticker: string, mbti: string, rationale: string): void {
  saveToCache(`${CACHE_RAT_PREFIX}${ticker}_${mbti}`, rationale)
}

export async function getOrGenerateExplanation(
  stock: Stock,
  mbti: string
): Promise<{ explanation: string; fromCache: boolean }> {
  const cached = getCachedExplanation(stock.ticker, mbti)
  if (cached) {
    return { explanation: cached, fromCache: true }
  }

  const explanation = await generateMBTIExplanation(stock, mbti)

  if (explanation) {
    setCachedExplanation(stock.ticker, mbti, explanation)
  }

  return { explanation, fromCache: false }
}

export async function getOrGenerateRationale(
  stock: Stock,
  mbti: string
): Promise<{ rationale: string; fromCache: boolean }> {
  const cached = getCachedRationale(stock.ticker, mbti)
  if (cached) {
    return { rationale: cached, fromCache: true }
  }

  const rationale = await generateRecommendationRationale(stock, mbti)

  if (rationale) {
    setCachedRationale(stock.ticker, mbti, rationale)
  }

  return { rationale, fromCache: false }
}

export function clearAIACache(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('gemini_'))
      .forEach((k) => localStorage.removeItem(k))
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}
