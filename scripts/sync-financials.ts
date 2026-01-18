/**
 * 재무제표 동기화 스크립트
 * OpenDART API에서 재무데이터를 가져와 Supabase에 저장
 * 
 * 사용법: node scripts/sync-financials.ts
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// 환경변수
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const DART_API_KEY = process.env.VITE_OPENDART_API_KEY
const DART_ENDPOINT = process.env.VITE_OPENDART_ENDPOINT || 'https://opendart.fss.or.kr/api'

if (!SUPABASE_URL || !SUPABASE_KEY || !DART_API_KEY) {
  console.error('❌ 필수 환경변수가 설정되지 않았습니다.')
  console.error('VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_OPENDART_API_KEY 필요')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 재무제표 항목
interface FinancialStatementItem {
  rcept_no: string
  reprt_code: string
  bsns_year: string
  corp_code: string
  sj_div: string
  sj_nm: string
  account_id: string
  account_nm: string
  account_detail: string
  thstrm_nm: string
  thstrm_amount: string
  thstrm_add_amount: string
  frmtrm_nm: string
  frmtrm_amount: string
  ord: string
  currency: string
}

// 금액 파싱
function parseAmount(value: string): number {
  if (!value || value === '-') return 0
  return parseInt(value.replace(/,/g, ''), 10) || 0
}

// 재무제표 조회
async function fetchFinancialStatement(
  corpCode: string,
  year: string
): Promise<FinancialStatementItem[]> {
  try {
    const params = new URLSearchParams({
      crtfc_key: DART_API_KEY!,
      corp_code: corpCode,
      bsns_year: year,
      reprt_code: '11011', // 사업보고서
      fs_div: 'CFS', // 연결재무제표
    })

    const response = await fetch(
      `${DART_ENDPOINT}/fnlttSinglAcntAll.json?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== '000') {
      console.log(`OpenDART: ${data.message}`)
      return []
    }

    return data.list || []
  } catch (error) {
    console.error(`Failed to fetch financials for ${corpCode}:`, error)
    return []
  }
}

// 재무비율 계산
function calculateRatios(statements: FinancialStatementItem[]) {
  const findAccount = (sjDivs: string | string[], accountNames: string[], accountIds: string[] = []): number => {
    const divs = Array.isArray(sjDivs) ? sjDivs : [sjDivs]
    
    // Priority 1: Exact Name matches
    for (const div of divs) {
      for (const name of accountNames) {
        const item = statements.find(s => s.sj_div === div && s.account_nm === name)
        if (item) return parseAmount(item.thstrm_amount)
      }
    }

    // Priority 2: Account ID matches (Standardized IFRS tags)
    if (accountIds.length > 0) {
      for (const div of divs) {
        for (const id of accountIds) {
          const item = statements.find(s => s.sj_div === div && s.account_id === id)
          if (item) return parseAmount(item.thstrm_amount)
        }
      }
    }
    
    // Priority 3: Partial Name matches
    for (const div of divs) {
      for (const name of accountNames) {
        const item = statements.find(s => s.sj_div === div && s.account_nm.includes(name))
        if (item) return parseAmount(item.thstrm_amount)
      }
    }
    
    return 0
  }

  // 재무상태표 (BS) 항목
  const totalAssets = findAccount('BS', ['자산총계', '총자산'], ['ifrs-full_Assets', 'ifrs_Assets'])
  const totalLiabilities = findAccount('BS', ['부채총계', '총부채'], ['ifrs-full_Liabilities', 'ifrs_Liabilities'])
  const totalEquity = findAccount('BS', ['자본총계', '총자본'], ['ifrs-full_Equity', 'ifrs_Equity'])

  // 손익계산서 (IS/CIS) 항목
  const incomeDivs = ['IS', 'CIS']
  const revenue = findAccount(incomeDivs, 
    ['매출액', '영업수익', '수익(매출액)', '수익', '매출'],
    ['ifrs-full_Revenue', 'ifrs_Revenue', 'ifrs-full_RevenueFromInterestsDividendsAndRoyalties']
  )
  const operatingIncome = findAccount(incomeDivs, 
    ['영업이익', '영업손실', '영업이익(손실)', '영업손실(이익)'],
    ['dart_OperatingIncomeLoss', 'ifrs-full_OperatingProfitLoss']
  )
  const netIncome = findAccount(incomeDivs, 
    ['당기순이익', '분기순이익', '반기순이익', '당기순이익(손실)', '당기순손실(이익)', '연결당기순이익'],
    ['ifrs-full_ProfitLoss', 'ifrs_ProfitLoss', 'ifrs-full_ProfitLossAttributableToOwnersOfParent']
  )

  // 비율 계산
  const operatingMargin = revenue > 0 ? (operatingIncome / revenue) * 100 : 0
  const netProfitMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
  const debtRatio = totalEquity > 0 ? (totalLiabilities / totalEquity) * 100 : 0
  const roe = totalEquity > 0 ? (netIncome / totalEquity) * 100 : 0

  // 레벨 분류
  const profitabilityLevel = 
    operatingMargin >= 15 ? 'high' :
    operatingMargin >= 5 ? 'medium' :
    operatingMargin > 0 ? 'low' : 'loss'

  const stabilityLevel =
    debtRatio <= 50 ? 'stable' :
    debtRatio <= 150 ? 'moderate' : 'risky'

  return {
    revenue: Math.round(revenue / 1000000), // 백만원 단위
    operatingIncome: Math.round(operatingIncome / 1000000),
    netIncome: Math.round(netIncome / 1000000),
    operatingMargin: Math.round(operatingMargin * 100) / 100,
    netProfitMargin: Math.round(netProfitMargin * 100) / 100,
    roe: Math.round(roe * 100) / 100,
    totalAssets: Math.round(totalAssets / 1000000),
    totalLiabilities: Math.round(totalLiabilities / 1000000),
    totalEquity: Math.round(totalEquity / 1000000),
    debtRatio: Math.round(debtRatio * 100) / 100,
    profitabilityLevel,
    stabilityLevel,
    growthLevel: 'stable', // 성장성은 전년 대비 필요
  }
}

// Supabase에 저장
async function saveRatiosToDb(
  ticker: string,
  corpCode: string,
  fiscalYear: string,
  ratios: ReturnType<typeof calculateRatios>
) {
  // DB 컬럼명(snake_case)에 맞춰 데이터 매핑
  const dbData = {
    ticker,
    corp_code: corpCode,
    fiscal_year: fiscalYear,
    revenue: ratios.revenue,
    operating_income: ratios.operatingIncome,
    net_income: ratios.netIncome,
    operating_margin: ratios.operatingMargin,
    net_profit_margin: ratios.netProfitMargin,
    roe: ratios.roe,
    total_assets: ratios.totalAssets,
    total_liabilities: ratios.totalLiabilities,
    total_equity: ratios.totalEquity,
    debt_ratio: ratios.debtRatio,
    profitability_level: ratios.profitabilityLevel,
    stability_level: ratios.stabilityLevel,
    growth_level: ratios.growthLevel,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('financial_ratios')
    .upsert(dbData, { onConflict: 'ticker,fiscal_year' })

  if (error) {
    console.error(`Failed to save ratios for ${ticker}:`, error)
    return false
  }

  return true
}

// 메인 함수
async function main() {
  console.log('🚀 재무제표 동기화 시작...')
  console.log(`📅 실행 시각: ${new Date().toLocaleString('ko-KR')}`)

  // 현재 연도 기준 2년 전 (확실한 데이터 확보)
  // 예: 2026년 1월 -> 2024년 데이터 조회
  const targetYear = (new Date().getFullYear() - 2).toString()
  console.log(`📊 대상 연도: ${targetYear}년`)

  // corp_codes 테이블에서 고유번호 조회
  const { data: corpCodes, error } = await supabase
    .from('corp_codes')
    .select('ticker, corp_code, corp_name')

  if (error || !corpCodes || corpCodes.length === 0) {
    console.error('❌ corp_codes 테이블이 비어있습니다.')
    console.error('먼저 create-tables.sql을 실행하여 초기 데이터를 삽입하세요.')
    process.exit(1)
  }

  console.log(`📊 총 ${corpCodes.length}개 종목 동기화 예정`)

  let successCount = 0
  let failCount = 0

  // 순차 처리 (API 부하 고려)
  for (const corp of corpCodes) {
    const statements = await fetchFinancialStatement(corp.corp_code, targetYear)

    if (statements.length === 0) {
      console.log(`⚠️ ${corp.corp_name} (${corp.ticker}): 재무제표 없음`)
      failCount++
      continue
    }

    const ratios = calculateRatios(statements)
    const saved = await saveRatiosToDb(corp.ticker, corp.corp_code, targetYear, ratios)

    if (saved) {
      console.log(`✅ ${corp.corp_name} (${corp.ticker}): 영업이익률 ${ratios.operatingMargin}%, 부채비율 ${ratios.debtRatio}%`)
      successCount++
    } else {
      failCount++
    }

    // Rate limiting (DART API 제한 고려)
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  // stocks 테이블 업데이트
  const { error: updateError } = await supabase
    .from('stocks')
    .update({ has_financials: true })
    .in('ticker', corpCodes.map(c => c.ticker))

  if (updateError) {
    console.error('stocks 테이블 업데이트 실패:', updateError)
  }

  console.log('')
  console.log('='.repeat(50))
  console.log(`✅ 성공: ${successCount}개`)
  console.log(`❌ 실패: ${failCount}개`)
  console.log('='.repeat(50))
}

main().catch(console.error)
