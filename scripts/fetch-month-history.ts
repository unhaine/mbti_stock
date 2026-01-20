import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// 환경변수
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const DATA_GO_KR_KEY = process.env.VITE_DATA_GO_KR_API_KEY
const STOCK_ENDPOINT = process.env.VITE_DATA_GO_KR_STOCK_ENDPOINT || 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService'

if (!SUPABASE_URL || !SUPABASE_KEY || !DATA_GO_KR_KEY) {
  console.error('❌ 필수 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function fetchHistory(ticker: string, days: number = 30) {
  try {
    const params = new URLSearchParams({
      serviceKey: DATA_GO_KR_KEY!,
      resultType: 'json',
      numOfRows: days.toString(),
      pageNo: '1',
      likeSrtnCd: ticker,
    })

    const response = await fetch(`${STOCK_ENDPOINT}/getStockPriceInfo?${params.toString()}`)
    const data = await response.json()

    if (data.response?.header?.resultCode !== '00') {
      return []
    }

    const items = data.response?.body?.items?.item
    if (!items) return []
    
    return Array.isArray(items) ? items : [items]
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error)
    return []
  }
}

async function main() {
  console.log('🚀 최근 30일 시세 데이터 수집 시작...')
  
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select('ticker, name')

  if (error || !stocks) {
    console.error('❌ 종목 목록 조회 실패:', error)
    return
  }

  console.log(`📊 총 ${stocks.length}개 종목에 대한 히스토리 수집 중...`)

  for (const stock of stocks) {
    const history = await fetchHistory(stock.ticker, 30)
    console.log(`📦 ${stock.name} (${stock.ticker}): ${history.length}건 수집됨`)

    if (history.length > 0) {
      const upsertData = history.map((item: any) => ({
        ticker: stock.ticker,
        trade_date: `${item.basDt.slice(0, 4)}-${item.basDt.slice(4, 6)}-${item.basDt.slice(6, 8)}`,
        open_price: parseInt(item.mkp, 10) || 0,
        high_price: parseInt(item.hipr, 10) || 0,
        low_price: parseInt(item.lopr, 10) || 0,
        close_price: parseInt(item.clpr, 10) || 0,
        volume: parseInt(item.trqu, 10) || 0,
        change_amount: parseInt(item.vs, 10) || 0,
        change_percent: parseFloat(item.fltRt) || 0,
      }))

      const { error: upsertError } = await supabase
        .from('stock_prices_daily')
        .upsert(upsertData, { onConflict: 'ticker,trade_date' })

      if (upsertError) {
        console.error(`❌ ${stock.name} 저장 실패:`, upsertError)
      }
    }
    
    // API 부하 방지
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  console.log('✅ 모든 데이터 수집 완료!')
}

main()
