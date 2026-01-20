import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// 환경변수
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ 필수 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkEarliestDate() {
  console.log('🔍 Supabase에서 가장 오래된 데이터 날짜 확인 중...')
  
  const { data, error } = await supabase
    .from('stock_prices_daily')
    .select('trade_date')
    .order('trade_date', { ascending: true })
    .limit(1)

  if (error) {
    console.error('❌ 데이터 조회 실패:', error)
    return
  }

  if (!data || data.length === 0) {
    console.log('⚠️ 테이블에 데이터가 없습니다.')
    return
  }

  const earliestDate = data[0].trade_date
  console.log('=' .repeat(50))
  console.log(`📅 가장 과거 데이터 날짜: ${earliestDate}`)
  console.log('=' .repeat(50))

  // 종목별로도 확인
  const { count, error: countError } = await supabase
    .from('stock_prices_daily')
    .select('*', { count: 'exact', head: true })

  if (!countError) {
    console.log(`📊 현재 저장된 일별 시세 총 레코드 수: ${count || 0}개`)
  }
}

checkEarliestDate()
