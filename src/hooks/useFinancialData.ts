import { useState, useEffect } from 'react';
import { FinancialRatio, ProfitabilityLevel, StabilityLevel, GrowthLevel } from '../types/finance';
import { getCachedFinancialData, cacheFinancialData } from '../services/financialDataCache';

interface UseFinancialDataResult {
  data: FinancialRatio | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Supabase REST API를 직접 호출하여 재무 데이터를 가져오는 함수
 */
async function fetchFinancialDataRest(ticker: string): Promise<FinancialRatio | null> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[fetchFinancialDataRest] Missing Supabase credentials');
    return null;
  }

  try {
    console.log(`[fetchFinancialDataRest] Fetching for ${ticker}...`);
    
    const url = `${supabaseUrl}/rest/v1/financial_ratios?ticker=eq.${ticker}&order=fiscal_year.desc&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    const rawData = data[0];
    const mappedData: FinancialRatio = {
      ticker: rawData.ticker,
      fiscalYear: rawData.fiscal_year,
      revenue: Number(rawData.revenue) || 0,
      operatingIncome: Number(rawData.operating_income) || 0,
      netIncome: Number(rawData.net_income) || 0,
      operatingMargin: Number(rawData.operating_margin) || 0,
      netProfitMargin: Number(rawData.net_profit_margin) || 0,
      roe: Number(rawData.roe) || 0,
      debtRatio: Number(rawData.debt_ratio) || 0,
      totalAssets: Number(rawData.total_assets) || 0,
      totalLiabilities: Number(rawData.total_liabilities) || 0,
      totalEquity: Number(rawData.total_equity) || 0,
      profitabilityLevel: (rawData.profitability_level as ProfitabilityLevel) || 'medium',
      stabilityLevel: (rawData.stability_level as StabilityLevel) || 'moderate',
      growthLevel: (rawData.growth_level as GrowthLevel) || 'unknown',
      updatedAt: rawData.updated_at,
    };

    return mappedData;

  } catch (error) {
    console.error(`[fetchFinancialDataRest] Error for ${ticker}:`, error);
    return null;
  }
}

/**
 * 특정 종목의 최신 재무 데이터를 가져오는 훅 (Persistent Caching 적용)
 * @param ticker 종목 코드
 */
export function useFinancialData(ticker: string | undefined): UseFinancialDataResult {
  const [data, setData] = useState<FinancialRatio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!ticker);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) {
      setData(null);
      setIsLoading(false);
      return;
    }

    // 1. Check persistent cache first
    const cached = getCachedFinancialData(ticker);
    if (cached) {
      // console.log(`[useFinancialData] Using cached data for ${ticker}`);
      setData(cached);
      setIsLoading(false);
      return;
    }

    // 2. Fetch new data if not in cache
    setIsLoading(true);
    setError(null);

    let isMounted = true;

    fetchFinancialDataRest(ticker)
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          // 3. Save to persistent cache
          if (result) {
            cacheFinancialData(ticker, result);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(`[useFinancialData] Error for ${ticker}:`, err);
          setError('데이터 로딩 실패');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  return { data, isLoading, error };
}

/**
 * 데이터를 미리 가져오는 함수 (Prefetching)
 */
export function prefetchFinancialData(ticker: string) {
  // Check persistent cache first
  const cached = getCachedFinancialData(ticker);
  if (cached) {
    return;
  }
  
  fetchFinancialDataRest(ticker).then((result) => {
    if (result) {
      cacheFinancialData(ticker, result);
    }
  });
}

export default useFinancialData;
