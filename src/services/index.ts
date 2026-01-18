/**
 * API 서비스 통합 모듈
 * 주식 시세, 재무제표, 감성분석 등 외부 API 통합
 */

// 주식 시세 API (공공데이터포털)
export {
  getStockPrice,
  getMultipleStockPrices,
  getStockPriceList,
  searchStockByName,
  type StockPriceItem,
  type ParsedStockPrice,
} from './stockPrice'

// 재무제표 API (OpenDART)
export {
  getCorpCode,
  getFinancialStatement,
  getFinancialRatios,
  getSimpleFinancials,
  getMultipleFinancials,
  type FinancialStatementItem,
  type FinancialRatios,
} from './financial'

// OpenAI 서비스 (기존)
export { default as openaiService } from './openai'
