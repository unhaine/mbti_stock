import { useMemo } from 'react';
import { Stock } from '../types';
import { getStockDisplay, StockDisplayModel } from '../utils/stockDisplay';

/**
 * Stock 객체를 받아 UI 표시에 최적화된 ViewModel을 반환하는 훅
 * 메모이제이션을 통해 불필요한 재연산을 방지합니다.
 */
export function useStockDisplay(stock: Stock | null | undefined): StockDisplayModel | null {
  return useMemo(() => {
    if (!stock) return null;
    return getStockDisplay(stock);
  }, [stock]);
}

export type { StockDisplayModel };
