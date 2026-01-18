/**
 * Analytics Service
 * 사용자 행동을 Supabase에 로깅하여 ML 학습 데이터 수집
 * REST API 방식 사용
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const apiHeaders = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
}

async function logAction(data: any) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_actions`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Analytics] API Error:', error)
    }
  } catch (e) {
    console.error('[Analytics] Exception:', e)
  }
}

interface LogStockViewParams {
  userId: string
  mbti: string
  stockTicker: string
  themeId: string
  themeTitle: string
  rankPosition: number
}

interface LogStockClickParams {
  userId: string
  mbti: string
  stockTicker: string
  themeId: string
  themeTitle: string
  rankPosition: number
}

interface LogStockBuyParams {
  userId: string
  mbti: string
  stockTicker: string
  quantity: number
  price: number
  themeId?: string
}

interface LogStockSellParams {
  userId: string
  mbti: string
  stockTicker: string
  quantity: number
  price: number
}

/**
 * 추천 종목 노출 로깅
 */
export async function logStockView(params: LogStockViewParams) {
  await logAction({
    user_id: params.userId,
    mbti: params.mbti.toUpperCase(),
    action_type: 'view',
    stock_ticker: params.stockTicker,
    theme_id: params.themeId,
    theme_title: params.themeTitle,
    rank_position: params.rankPosition,
    timestamp: new Date().toISOString()
  })
}

/**
 * 종목 클릭 로깅
 */
export async function logStockClick(params: LogStockClickParams) {
  await logAction({
    user_id: params.userId,
    mbti: params.mbti.toUpperCase(),
    action_type: 'click',
    stock_ticker: params.stockTicker,
    theme_id: params.themeId,
    theme_title: params.themeTitle,
    rank_position: params.rankPosition,
    timestamp: new Date().toISOString()
  })
}

/**
 * 상세 페이지 진입 로깅
 */
export async function logDetailView(
  userId: string,
  mbti: string,
  stockTicker: string,
  themeId?: string,
  themeTitle?: string
) {
  await logAction({
    user_id: userId,
    mbti: mbti.toUpperCase(),
    action_type: 'detail_view',
    stock_ticker: stockTicker,
    theme_id: themeId,
    theme_title: themeTitle,
    timestamp: new Date().toISOString()
  })
}

/**
 * 매수 로깅
 */
export async function logStockBuy(params: LogStockBuyParams) {
  await logAction({
    user_id: params.userId,
    mbti: params.mbti.toUpperCase(),
    action_type: 'buy',
    stock_ticker: params.stockTicker,
    theme_id: params.themeId,
    quantity: params.quantity,
    price: params.price,
    timestamp: new Date().toISOString()
  })
}

/**
 * 매도 로깅
 */
export async function logStockSell(params: LogStockSellParams) {
  await logAction({
    user_id: params.userId,
    mbti: params.mbti.toUpperCase(),
    action_type: 'sell',
    stock_ticker: params.stockTicker,
    quantity: params.quantity,
    price: params.price,
    timestamp: new Date().toISOString()
  })
}

/**
 * 배치 로깅 (추천 리스트 전체 노출)
 */
export async function logRecommendationListView(
  userId: string,
  mbti: string,
  themeId: string,
  themeTitle: string,
  stocks: Array<{ ticker: string; rank: number }>
) {
  const actions = stocks.map(stock => ({
    user_id: userId,
    mbti: mbti.toUpperCase(),
    action_type: 'view',
    stock_ticker: stock.ticker,
    theme_id: themeId,
    theme_title: themeTitle,
    rank_position: stock.rank,
    timestamp: new Date().toISOString()
  }))

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_actions`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(actions)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Analytics] Batch insert error:', error)
    }
  } catch (e) {
    console.error('[Analytics] Exception in batch insert:', e)
  }
}
