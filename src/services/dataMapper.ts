import { Stock, VolatilityLevel } from '../types';

export interface RawStock {
  ticker: string;
  name: string;
  sector: string;
  stockMBTI?: string;
  marketCap: string | number;
  price: number;
  change: number;
  changePercent: number;
  volatility: string;
  dividendYield: number;
  metaphors?: Record<string, string | undefined>;
  tags?: string[];
}

export function mapRawStockToStock(raw: RawStock): Stock {
  return {
    ticker: raw.ticker,
    name: raw.name,
    sector: raw.sector,
    marketCap: raw.marketCap,
    price: raw.price,
    change: raw.change,
    changePercent: raw.changePercent,
    volatility: raw.volatility as VolatilityLevel,
    dividendYield: raw.dividendYield,
    metaphors: raw.metaphors as unknown as Record<string, string>,
    tags: raw.tags,
    stockMBTI: raw.stockMBTI,
    // Initialize optional fields
    isLiveData: false
  };
}
