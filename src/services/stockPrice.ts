/**
 * 주식 시세 API 서비스
 * 공공데이터포털 - 금융위원회_주식시세정보
 * https://www.data.go.kr/data/15094808/openapi.do
 */

const API_KEY = import.meta.env.VITE_DATA_GO_KR_API_KEY
const BASE_URL = import.meta.env.VITE_DATA_GO_KR_STOCK_ENDPOINT

// API 응답 타입 정의
export interface StockPriceResponse {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      numOfRows: number
      pageNo: number
      totalCount: number
      items: {
        item: StockPriceItem[]
      }
    }
  }
}

export interface StockPriceItem {
  basDt: string // 기준일자 (YYYYMMDD)
  srtnCd: string // 단축코드 (종목코드)
  isinCd: string // ISIN코드
  itmsNm: string // 종목명
  mrktCtg: string // 시장구분 (KOSPI/KOSDAQ)
  clpr: string // 종가
  vs: string // 전일대비
  fltRt: string // 등락률
  mkp: string // 시가
  hipr: string // 고가
  lopr: string // 저가
  trqu: string // 거래량
  trPrc: string // 거래대금
  lstgStCnt: string // 상장주식수
  mrktTotAmt: string // 시가총액
}

// 파싱된 주식 시세 데이터
export interface ParsedStockPrice {
  baseDate: string // 기준일자
  ticker: string // 종목코드
  isinCode: string // ISIN코드
  name: string // 종목명
  market: string // 시장구분
  closePrice: number // 종가
  change: number // 전일대비
  changePercent: number // 등락률
  openPrice: number // 시가
  highPrice: number // 고가
  lowPrice: number // 저가
  volume: number // 거래량
  tradingValue: number // 거래대금
  listedShares: number // 상장주식수
  marketCap: number // 시가총액
}

/**
 * API 응답을 파싱하여 사용하기 쉬운 형태로 변환
 */
function parseStockPrice(item: StockPriceItem): ParsedStockPrice {
  return {
    baseDate: item.basDt,
    ticker: item.srtnCd,
    isinCode: item.isinCd,
    name: item.itmsNm,
    market: item.mrktCtg,
    closePrice: parseInt(item.clpr, 10) || 0,
    change: parseInt(item.vs, 10) || 0,
    changePercent: parseFloat(item.fltRt) || 0,
    openPrice: parseInt(item.mkp, 10) || 0,
    highPrice: parseInt(item.hipr, 10) || 0,
    lowPrice: parseInt(item.lopr, 10) || 0,
    volume: parseInt(item.trqu, 10) || 0,
    tradingValue: parseInt(item.trPrc, 10) || 0,
    listedShares: parseInt(item.lstgStCnt, 10) || 0,
    marketCap: parseInt(item.mrktTotAmt, 10) || 0,
  }
}

/**
 * 특정 종목의 시세 조회
 * @param ticker 종목코드 (예: "005930" 삼성전자)
 * @param baseDate 기준일자 (YYYYMMDD, 미지정시 최근일)
 */
export async function getStockPrice(
  ticker: string,
  baseDate?: string
): Promise<ParsedStockPrice | null> {
  try {
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      resultType: 'json',
      numOfRows: '1',
      pageNo: '1',
      likeSrtnCd: ticker,
    })

    if (baseDate) {
      params.append('basDt', baseDate)
    }

    const response = await fetch(
      `${BASE_URL}/getStockPriceInfo?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: StockPriceResponse = await response.json()

    if (data.response.header.resultCode !== '00') {
      console.error('API Error:', data.response.header.resultMsg)
      return null
    }

    const items = data.response.body.items?.item
    if (!items || items.length === 0) {
      return null
    }

    return parseStockPrice(items[0])
  } catch (error) {
    console.error('Failed to fetch stock price:', error)
    return null
  }
}

/**
 * 여러 종목의 시세 일괄 조회
 * @param tickers 종목코드 배열
 */
export async function getMultipleStockPrices(
  tickers: string[]
): Promise<Map<string, ParsedStockPrice>> {
  const results = new Map<string, ParsedStockPrice>()

  // 병렬 요청 (API 부하 고려하여 5개씩 배치 처리)
  const batchSize = 5
  for (let i = 0; i < tickers.length; i += batchSize) {
    const batch = tickers.slice(i, i + batchSize)
    const promises = batch.map((ticker) => getStockPrice(ticker))
    const batchResults = await Promise.all(promises)

    batchResults.forEach((result, index) => {
      if (result) {
        results.set(batch[index], result)
      }
    })

    // Rate limiting: 배치 사이 100ms 대기
    if (i + batchSize < tickers.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return results
}

/**
 * 전체 주식 시세 목록 조회 (페이지네이션)
 * @param pageNo 페이지 번호
 * @param numOfRows 한 페이지 결과 수
 * @param marketType 시장구분 (KOSPI/KOSDAQ)
 */
export async function getStockPriceList(
  pageNo: number = 1,
  numOfRows: number = 100,
  marketType?: 'KOSPI' | 'KOSDAQ'
): Promise<{
  items: ParsedStockPrice[]
  totalCount: number
  pageNo: number
  numOfRows: number
}> {
  try {
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      resultType: 'json',
      numOfRows: numOfRows.toString(),
      pageNo: pageNo.toString(),
    })

    if (marketType) {
      params.append('mrktCls', marketType)
    }

    const response = await fetch(
      `${BASE_URL}/getStockPriceInfo?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: StockPriceResponse = await response.json()

    if (data.response.header.resultCode !== '00') {
      console.error('API Error:', data.response.header.resultMsg)
      return { items: [], totalCount: 0, pageNo, numOfRows }
    }

    const items = data.response.body.items?.item || []
    const parsedItems = Array.isArray(items)
      ? items.map(parseStockPrice)
      : [parseStockPrice(items)]

    return {
      items: parsedItems,
      totalCount: data.response.body.totalCount,
      pageNo: data.response.body.pageNo,
      numOfRows: data.response.body.numOfRows,
    }
  } catch (error) {
    console.error('Failed to fetch stock price list:', error)
    return { items: [], totalCount: 0, pageNo, numOfRows }
  }
}

/**
 * 종목명으로 검색
 * @param name 종목명 (일부 매칭)
 */
export async function searchStockByName(
  name: string
): Promise<ParsedStockPrice[]> {
  try {
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      resultType: 'json',
      numOfRows: '20',
      pageNo: '1',
      likeItmsNm: name,
    })

    const response = await fetch(
      `${BASE_URL}/getStockPriceInfo?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: StockPriceResponse = await response.json()

    if (data.response.header.resultCode !== '00') {
      console.error('API Error:', data.response.header.resultMsg)
      return []
    }

    const items = data.response.body.items?.item || []
    return Array.isArray(items)
      ? items.map(parseStockPrice)
      : [parseStockPrice(items)]
  } catch (error) {
    console.error('Failed to search stock:', error)
    return []
  }
}

export default {
  getStockPrice,
  getMultipleStockPrices,
  getStockPriceList,
  searchStockByName,
}
