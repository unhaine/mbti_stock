/**
 * 재무제표 API 서비스
 * OpenDART - 금융감독원 전자공시시스템
 * https://opendart.fss.or.kr
 */

const API_KEY = import.meta.env.VITE_OPENDART_API_KEY
const BASE_URL = import.meta.env.VITE_OPENDART_ENDPOINT

// 회사 고유번호 조회 응답
export interface CorpCodeResponse {
  status: string
  message: string
  list?: CorpCodeItem[]
}

export interface CorpCodeItem {
  corp_code: string // 고유번호
  corp_name: string // 회사명
  stock_code: string // 종목코드
  modify_date: string // 최종변경일
}

// 재무제표 응답
export interface FinancialStatementResponse {
  status: string
  message: string
  list?: FinancialStatementItem[]
}

export interface FinancialStatementItem {
  rcept_no: string // 접수번호
  reprt_code: string // 보고서코드
  bsns_year: string // 사업연도
  corp_code: string // 고유번호
  sj_div: string // 재무제표구분 (BS: 재무상태표, IS: 손익계산서, CIS: 포괄손익계산서, CF: 현금흐름표)
  sj_nm: string // 재무제표명
  account_id: string // 계정ID
  account_nm: string // 계정명
  account_detail: string // 계정상세
  thstrm_nm: string // 당기명
  thstrm_amount: string // 당기금액
  thstrm_add_amount: string // 당기누적금액
  frmtrm_nm: string // 전기명
  frmtrm_amount: string // 전기금액
  frmtrm_add_amount: string // 전기누적금액
  bfefrmtrm_nm: string // 전전기명
  bfefrmtrm_amount: string // 전전기금액
  ord: string // 계정과목 정렬순서
  currency: string // 통화단위
}

// 주요 재무비율 (계산용)
export interface FinancialRatios {
  ticker: string
  corpCode: string
  corpName: string
  fiscalYear: string
  // 수익성 지표
  revenue: number // 매출액
  operatingIncome: number // 영업이익
  netIncome: number // 당기순이익
  operatingMargin: number // 영업이익률
  netProfitMargin: number // 순이익률
  // 안정성 지표
  totalAssets: number // 총자산
  totalLiabilities: number // 총부채
  totalEquity: number // 총자본
  debtRatio: number // 부채비율
  // 성장성 지표
  revenueGrowth?: number // 매출성장률
  operatingIncomeGrowth?: number // 영업이익성장률
}

// 파싱 헬퍼 함수
function parseAmount(value: string): number {
  if (!value || value === '-') return 0
  return parseInt(value.replace(/,/g, ''), 10) || 0
}

/**
 * 회사 고유번호 조회 (종목코드 → 고유번호)
 * 주의: OpenDART는 종목코드가 아닌 고유번호를 사용합니다
 */
let corpCodeCache: Map<string, string> | null = null

export async function getCorpCode(stockCode: string): Promise<string | null> {
  // 캐시가 없으면 전체 목록 로드 (최초 1회)
  if (!corpCodeCache) {
    // OpenDART 고유번호는 XML 파일로만 제공되어 별도 처리 필요
    // 여기서는 간단히 주요 종목만 하드코딩 (실제로는 DB 저장 권장)
    corpCodeCache = new Map([
      ['005930', '00126380'], // 삼성전자
      ['000660', '00164779'], // SK하이닉스
      ['035420', '00401731'], // NAVER
      ['005380', '00164742'], // 현대차
      ['035720', '00266961'], // 카카오
      ['051910', '00356361'], // LG화학
      ['006400', '00126562'], // 삼성SDI
      ['068270', '00413046'], // 셀트리온
      ['028260', '00401904'], // 삼성물산
      ['105560', '00567851'], // KB금융
      // 추가 종목은 API나 DB에서 로드
    ])
  }

  return corpCodeCache.get(stockCode) || null
}

/**
 * 단일 회사 재무제표 조회
 * @param corpCode 고유번호
 * @param bsnsYear 사업연도 (YYYY)
 * @param reprtCode 보고서코드 (11011: 사업보고서, 11012: 반기보고서, 11013: 1분기보고서, 11014: 3분기보고서)
 */
export async function getFinancialStatement(
  corpCode: string,
  bsnsYear: string,
  reprtCode: string = '11011'
): Promise<FinancialStatementItem[]> {
  try {
    const params = new URLSearchParams({
      crtfc_key: API_KEY,
      corp_code: corpCode,
      bsns_year: bsnsYear,
      reprt_code: reprtCode,
      fs_div: 'CFS', // 연결재무제표
    })

    const response = await fetch(
      `${BASE_URL}/fnlttSinglAcntAll.json?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: FinancialStatementResponse = await response.json()

    if (data.status !== '000') {
      console.error('OpenDART API Error:', data.message)
      return []
    }

    return data.list || []
  } catch (error) {
    console.error('Failed to fetch financial statement:', error)
    return []
  }
}

/**
 * 재무비율 계산
 * @param corpCode 고유번호
 * @param bsnsYear 사업연도
 */
export async function getFinancialRatios(
  ticker: string,
  corpCode: string,
  bsnsYear: string
): Promise<FinancialRatios | null> {
  try {
    const statements = await getFinancialStatement(corpCode, bsnsYear)

    if (statements.length === 0) {
      return null
    }

    // 주요 계정과목 추출
    const findAccount = (sjDivs: string | string[], accountNames: string[], accountIds: string[] = []): number => {
      const divs = Array.isArray(sjDivs) ? sjDivs : [sjDivs]
      
      // 1. Exact Name matches
      for (const div of divs) {
        for (const name of accountNames) {
          const item = statements.find(s => s.sj_div === div && s.account_nm === name)
          if (item) return parseAmount(item.thstrm_amount)
        }
      }

      // 2. Account ID matches (Standardized IFRS tags)
      if (accountIds.length > 0) {
        for (const div of divs) {
          for (const id of accountIds) {
            const item = statements.find(s => s.sj_div === div && s.account_id === id)
            if (item) return parseAmount(item.thstrm_amount)
          }
        }
      }
      
      // 3. Partial Name matches
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

    // 회사명 추출
    const corpName = statements[0]?.corp_code || ''

    return {
      ticker,
      corpCode,
      corpName,
      fiscalYear: bsnsYear,
      revenue,
      operatingIncome,
      netIncome,
      operatingMargin: Math.round(operatingMargin * 100) / 100,
      netProfitMargin: Math.round(netProfitMargin * 100) / 100,
      totalAssets,
      totalLiabilities,
      totalEquity,
      debtRatio: Math.round(debtRatio * 100) / 100,
    }
  } catch (error) {
    console.error('Failed to calculate financial ratios:', error)
    return null
  }
}

/**
 * 간편 재무정보 조회 (종목코드 기반)
 * @param ticker 종목코드
 * @param year 사업연도 (미지정시 전년도)
 */
export async function getSimpleFinancials(
  ticker: string,
  year?: string
): Promise<FinancialRatios | null> {
  const corpCode = await getCorpCode(ticker)

  if (!corpCode) {
    console.warn(`Corp code not found for ticker: ${ticker}`)
    return null
  }

  const targetYear = year || (new Date().getFullYear() - 1).toString()
  return getFinancialRatios(ticker, corpCode, targetYear)
}

/**
 * 여러 종목의 재무정보 일괄 조회
 */
export async function getMultipleFinancials(
  tickers: string[],
  year?: string
): Promise<Map<string, FinancialRatios>> {
  const results = new Map<string, FinancialRatios>()

  // 순차 처리 (API 부하 고려)
  for (const ticker of tickers) {
    const ratios = await getSimpleFinancials(ticker, year)
    if (ratios) {
      results.set(ticker, ratios)
    }
    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  return results
}

export default {
  getCorpCode,
  getFinancialStatement,
  getFinancialRatios,
  getSimpleFinancials,
  getMultipleFinancials,
}
