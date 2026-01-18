import { Stock } from '../types';
import { formatCurrency, formatPercent } from './formatters';
import { getChangeColor } from './helpers';

export interface StockDisplayModel {
  price: number;
  change: number;
  changePercent: number;
  formattedPrice: string;
  formattedChange: string;
  formattedChangePercent: string;
  changeColorClass: string;
  changeSymbol: string;
  isLive: boolean;
}

/**
 * Stock 객체를 받아 UI 표시에 적합한 형태(ViewModel)로 변환합니다.
 * 실시간 데이터(live*)가 있으면 우선 사용하고, 없으면 기본 데이터를 사용합니다.
 */
export function getStockDisplay(stock: Stock): StockDisplayModel {
  const price = stock.livePrice ?? stock.price;
  // change는 금액 변동, changePercent는 등락률
  const change = stock.liveChange ?? stock.change;
  const changePercent = stock.liveChangePercent ?? stock.changePercent;
  const isLive = stock.isLiveData ?? false;

  return {
    price,
    change,
    changePercent,
    formattedPrice: formatCurrency(price),
    formattedChange: formatCurrency(Math.abs(change)), // 부호 없이 절대값만 포맷팅
    formattedChangePercent: formatPercent(changePercent),
    changeColorClass: getChangeColor(changePercent),
    changeSymbol: changePercent > 0 ? '+' : '',
    isLive
  };
}
