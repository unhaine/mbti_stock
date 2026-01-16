import { Stock } from '../contexts/StockContext'

// API 키 확인
const getApiKey = (): string | null => {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    console.warn('VITE_OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인하세요.')
    return null
  }
  return key
}

// 모델 설정
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

/**
 * MBTI 맞춤 종목 설명 생성
 */
export async function generateMBTIExplanation(stock: Stock, mbti: string): Promise<string> {
  const apiKey = getApiKey()

  if (!apiKey) {
    // API 키가 없으면 기본 설명 반환
    return getDefaultExplanation(stock, mbti)
  }

  // 사용량 확인
  if (!checkUsageLimit()) {
    throw new Error('일일 사용 한도를 초과했습니다.')
  }

  const prompt = createPrompt(stock, mbti)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are a creative investment storyteller who uses metaphors to explain stocks based on MBTI personality types. Always respond in Korean.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API Error:', error)
      throw new Error(error.error?.message || 'API 요청 실패')
    }

    const data = await response.json()
    const explanation = data.choices[0]?.message?.content?.trim()

    if (explanation) {
      // 성공 시 사용량 증가
      incrementUsage()
      return explanation
    }

    throw new Error('빈 응답')
  } catch (error) {
    console.error('generateMBTIExplanation Error:', error)
    // 에러 시 기본 설명 반환
    return getDefaultExplanation(stock, mbti)
  }
}

/**
 * 프롬프트 생성
 */
function createPrompt(stock: Stock, mbti: string): string {
  return `
당신은 ${mbti} 성향의 투자자를 위한 투자 조언가입니다.

종목 정보:
- 이름: ${stock.name}
- 업종: ${stock.sector}
- 시가총액: ${stock.marketCap}
- 변동성: ${translateVolatility(stock.volatility)}
- 배당률: ${stock.dividendYield || 0}%

${mbti} 성향의 투자자 관점에서 이 종목을 은유적으로 설명해주세요.
(예: "천천히 쌓이는 성", "로켓 발사", "안정적인 항해" 등)

조건:
1. 2-3문장으로 간결하게
2. ${mbti} 성향의 특징을 반영
3. 긍정적이고 흥미로운 표현 사용
4. 투자 조언이 아닌 은유적 설명만

설명:
`.trim()
}

/**
 * 변동성 한글화
 */
function translateVolatility(volatility: string): string {
  const map: Record<string, string> = {
    low: '낮음',
    medium: '보통',
    high: '높음',
    'very-high': '매우 높음',
  }
  return map[volatility] || volatility
}

/**
 * 기본 설명 생성 (API 없을 때)
 */
function getDefaultExplanation(stock: Stock, mbti: string): string {
  // 종목에 이미 있는 metaphors 사용
  const metaphor = stock.metaphors?.[mbti] || stock.metaphors?.default

  if (metaphor) {
    return metaphor
  }

  // 없으면 기본 템플릿
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

const USAGE_KEY = 'openai_usage'
const DAILY_LIMIT = 100 // 일일 요청 제한

interface UsageData {
  date: string
  count: number
}

/**
 * 사용량 확인
 */
function checkUsageLimit(): boolean {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    resetUsage()
    return true
  }

  return usage.count < DAILY_LIMIT
}

/**
 * 사용량 증가
 */
function incrementUsage(): void {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    setUsage({ date: today, count: 1 })
  } else {
    setUsage({ ...usage, count: usage.count + 1 })
  }
}

/**
 * 사용량 가져오기
 */
function getUsage(): UsageData {
  try {
    const data = localStorage.getItem(USAGE_KEY)
    return data ? JSON.parse(data) : { date: '', count: 0 }
  } catch {
    return { date: '', count: 0 }
  }
}

/**
 * 사용량 저장
 */
function setUsage(usage: UsageData): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage))
}

/**
 * 사용량 초기화
 */
function resetUsage(): void {
  setUsage({ date: new Date().toDateString(), count: 0 })
}

/**
 * 남은 사용량 확인
 */
export function getRemainingUsage(): number {
  const usage = getUsage()
  const today = new Date().toDateString()

  if (usage.date !== today) {
    return DAILY_LIMIT
  }

  return Math.max(0, DAILY_LIMIT - usage.count)
}

// ============ 캐싱 ============

const CACHE_PREFIX = 'ai_explanation_'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24시간

interface CacheData {
  data: string
  timestamp: number
}

/**
 * 캐시에서 설명 가져오기
 */
export function getCachedExplanation(ticker: string, mbti: string): string | null {
  try {
    const key = `${CACHE_PREFIX}${ticker}_${mbti}`
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp }: CacheData = JSON.parse(cached)

    // 만료 확인
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
 * 캐시에 설명 저장
 */
export function setCachedExplanation(ticker: string, mbti: string, explanation: string): void {
  try {
    const key = `${CACHE_PREFIX}${ticker}_${mbti}`
    const cacheData: CacheData = {
      data: explanation,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * 캐시 우선 설명 생성
 * 캐시에 있으면 캐시 반환, 없으면 새로 생성
 */
export async function getOrGenerateExplanation(
  stock: Stock,
  mbti: string
): Promise<{ explanation: string; fromCache: boolean }> {
  // 1. 캐시 확인
  const cached = getCachedExplanation(stock.ticker, mbti)
  if (cached) {
    return { explanation: cached, fromCache: true }
  }

  // 2. 새로 생성
  const explanation = await generateMBTIExplanation(stock, mbti)

  // 3. 캐시 저장
  if (explanation) {
    setCachedExplanation(stock.ticker, mbti, explanation)
  }

  return { explanation, fromCache: false }
}

/**
 * 캐시 전체 삭제
 */
export function clearExplanationCache(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}
