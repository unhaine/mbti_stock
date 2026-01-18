/**
 * 일별 가격 동기화 스크립트
 * 공공데이터포털 API에서 주식 가격을 가져와 Supabase에 저장
 * 
 * 사용법: node scripts/sync-daily-prices.js
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// 환경변수
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const DATA_GO_KR_KEY = process.env.VITE_DATA_GO_KR_API_KEY
const STOCK_ENDPOINT = process.env.VITE_DATA_GO_KR_STOCK_ENDPOINT || 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService'

if (!SUPABASE_URL || !SUPABASE_KEY || !DATA_GO_KR_KEY) {
  console.error('❌ 필수 환경변수가 설정되지 않았습니다.')
  console.error('VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_DATA_GO_KR_API_KEY 필요')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// API 응답 타입
interface StockPriceItem {
  basDt: string
  srtnCd: string
  isinCd: string
  itmsNm: string
  mrktCtg: string
  clpr: string
  vs: string
  fltRt: string
  mkp: string
  hipr: string
  lopr: string
  trqu: string
  trPrc: string
  lstgStCnt: string
  mrktTotAmt: string
}

// 주식 가격 조회
async function fetchStockPrice(ticker: string): Promise<StockPriceItem | null> {
  try {
    const params = new URLSearchParams({
      serviceKey: DATA_GO_KR_KEY!,
      resultType: 'json',
      numOfRows: '1',
      pageNo: '1',
      likeSrtnCd: ticker,
    })

    const response = await fetch(
      `${STOCK_ENDPOINT}/getStockPriceInfo?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (data.response?.header?.resultCode !== '00') {
      console.error(`API Error for ${ticker}:`, data.response?.header?.resultMsg)
      return null
    }

    const items = data.response?.body?.items?.item
    if (!items || items.length === 0) {
      return null
    }

    return Array.isArray(items) ? items[0] : items
  } catch (error) {
    console.error(`Failed to fetch ${ticker}:`, error)
    return null
  }
}

// Supabase에 저장
async function savePriceToDb(ticker: string, price: StockPriceItem) {
  const priceData = {
    ticker,
    trade_date: `${price.basDt.slice(0, 4)}-${price.basDt.slice(4, 6)}-${price.basDt.slice(6, 8)}`,
    open_price: parseInt(price.mkp, 10) || 0,
    high_price: parseInt(price.hipr, 10) || 0,
    low_price: parseInt(price.lopr, 10) || 0,
    close_price: parseInt(price.clpr, 10) || 0,
    volume: parseInt(price.trqu, 10) || 0,
    change_amount: parseInt(price.vs, 10) || 0,
    change_percent: parseFloat(price.fltRt) || 0,
  }

  const { error } = await supabase
    .from('stock_prices_daily')
    .upsert(priceData, { onConflict: 'ticker,trade_date' })

  if (error) {
    console.error(`Failed to save ${ticker}:`, error)
    return false
  }

  return true
}

// 최신 시세 업데이트
async function updateLatestPrice(ticker: string, price: StockPriceItem) {
  const updateData = {
    price: parseInt(price.clpr, 10) || 0,
    change: parseInt(price.vs, 10) || 0,
    change_percent: parseFloat(price.fltRt) || 0,
    volume: parseInt(price.trqu, 10) || 0,
    open_price: parseInt(price.mkp, 10) || 0,
    high_price: parseInt(price.hipr, 10) || 0,
    low_price: parseInt(price.lopr, 10) || 0,
    market_cap: price.mrktTotAmt, // DB가 text 타입이므로 문자열로 전달
    last_sync_date: `${price.basDt.slice(0, 4)}-${price.basDt.slice(4, 6)}-${price.basDt.slice(6, 8)}`,
  }

  const { error } = await supabase
    .from('stocks')
    .update(updateData)
    .eq('ticker', ticker)

  if (error) {
    console.error(`Failed to update latest price for ${ticker}:`, error)
    return false
  }

  return true
}

// 메인 함수
async function main() {
  console.log('🚀 일별 가격 동기화 시작...')
  console.log(`📅 실행 시각: ${new Date().toLocaleString('ko-KR')}`)
  
  // 종목 목록 조회
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select('ticker, name')
    .order('ticker')

  if (error || !stocks) {
    console.error('❌ 종목 목록 조회 실패:', error)
    process.exit(1)
  }

  console.log(`📊 총 ${stocks.length}개 종목 동기화 예정`)

  let successCount = 0
  let failCount = 0

  // 배치 처리 (5개씩)
  const batchSize = 5
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize)
    
    const results = await Promise.all(
      batch.map(async (stock) => {
        const priceData = await fetchStockPrice(stock.ticker)
        
        if (!priceData) {
          console.log(`⚠️ ${stock.name} (${stock.ticker}): 데이터 없음`)
          return false
        }

        const dailySaved = await savePriceToDb(stock.ticker, priceData)
        const latestUpdated = await updateLatestPrice(stock.ticker, priceData)

        if (dailySaved && latestUpdated) {
          console.log(`✅ ${stock.name} (${stock.ticker}): ${priceData.clpr}원 (${priceData.fltRt}%)`)
          return true
        }

        return false
      })
    )

    successCount += results.filter(Boolean).length
    failCount += results.filter(r => !r).length

    // Rate limiting
    if (i + batchSize < stocks.length) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  console.log('')
  console.log('='.repeat(50))
  console.log(`✅ 성공: ${successCount}개`)
  console.log(`❌ 실패: ${failCount}개`)
  console.log('='.repeat(50))
}

main().catch(console.error)
