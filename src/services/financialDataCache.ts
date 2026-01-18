/**
 * 재무 데이터(Financial Data) 캐싱 서비스
 * localStorage 기반으로 API 호출 결과를 캐싱하여 불필요한 네트워크 요청 방지
 */

import { FinancialRatio } from '../types/finance';

const CACHE_KEY = 'mbti_financial_cache';
const CACHE_VERSION = 1;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24시간 (재무제표는 자주 안 바뀜)

export interface CachedFinancialData {
  data: FinancialRatio;
  timestamp: number;
}

export interface FinancialCache {
  version: number;
  data: Record<string, CachedFinancialData>;
}

/**
 * 캐시 로드
 */
export function loadFinancialCache(): FinancialCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return { version: CACHE_VERSION, data: {} };
    }

    const cache: FinancialCache = JSON.parse(raw);

    // 버전 체크
    if (cache.version !== CACHE_VERSION) {
      console.log('[FinancialCache] Version mismatch, clearing cache');
      clearFinancialCache();
      return { version: CACHE_VERSION, data: {} };
    }

    return cache;
  } catch (error) {
    console.error('[FinancialCache] Failed to load cache:', error);
    return { version: CACHE_VERSION, data: {} };
  }
}

/**
 * 캐시 저장
 */
export function saveFinancialCache(cache: FinancialCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('[FinancialCache] Failed to save cache:', error);
  }
}

/**
 * 종목 데이터 캐싱 (Upsert)
 */
export function cacheFinancialData(ticker: string, data: FinancialRatio): void {
  const cache = loadFinancialCache();
  cache.data[ticker] = {
    data,
    timestamp: Date.now(),
  };
  saveFinancialCache(cache);
}

/**
 * 캐시된 데이터 조회 (만료 체크 포함)
 */
export function getCachedFinancialData(ticker: string): FinancialRatio | null {
  const cache = loadFinancialCache();
  const item = cache.data[ticker];

  if (!item) return null;

  // 만료 체크
  if (Date.now() - item.timestamp > CACHE_DURATION_MS) {
    // 만료된 데이터 삭제
    delete cache.data[ticker];
    saveFinancialCache(cache);
    return null;
  }

  return item.data;
}

/**
 * 캐시 초기화
 */
export function clearFinancialCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
