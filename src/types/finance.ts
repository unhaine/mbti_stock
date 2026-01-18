/**
 * 재무 데이터 관련 타입 정의
 */

export type ProfitabilityLevel = 'high' | 'medium' | 'low';
export type StabilityLevel = 'stable' | 'moderate' | 'risky';
export type GrowthLevel = 'high' | 'stable' | 'low' | 'negative' | 'unknown'; // DB에 없을 수도 있음

export interface FinancialRatio {
  ticker: string;
  fiscalYear: string;         // fiscal_year
  
  // 손익계산서 항목
  revenue: number;            // revenue (매출액)
  operatingIncome: number;    // operating_income (영업이익)
  netIncome: number;          // net_income (당기순이익)
  
  // 주요 비율
  operatingMargin: number;    // operating_margin (영업이익률)
  netProfitMargin: number;    // net_profit_margin (순이익률)
  roe: number;                // roe (자기자본이익률)
  debtRatio: number;          // debt_ratio (부채비율)
  
  // 재무상태표 항목
  totalAssets: number;        // total_assets (자산총계)
  totalLiabilities: number;   // total_liabilities (부채총계)
  totalEquity: number;        // total_equity (자본총계)
  
  // 평가 등급
  profitabilityLevel: ProfitabilityLevel; // profitability_level
  stabilityLevel: StabilityLevel;         // stability_level
  growthLevel?: GrowthLevel;              // growth_level (optional)
  
  updatedAt: string;          // updated_at
}
