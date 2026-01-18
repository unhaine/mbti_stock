/**
 * Supabase 실시간 구독 훅
 * stocks 테이블 변경사항 실시간 반영
 */

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Stock } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseStockSubscriptionOptions {
  onUpdate: (updatedStock: Partial<Stock> & { ticker: string }) => void
  enabled?: boolean
}

/**
 * Supabase Realtime 구독 훅
 * stocks 테이블의 UPDATE 이벤트를 구독하여 실시간 업데이트 처리
 */
export function useStockSubscription({ 
  onUpdate, 
  enabled = true 
}: UseStockSubscriptionOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled) return

    // 기존 채널이 있으면 정리
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    // 새 채널 생성 및 구독
    const channel = supabase
      .channel('stocks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'stocks',
        },
        (payload: any) => {
          const newData = payload.new
          
          onUpdate({
            ticker: newData.ticker,
            price: Number(newData.price),
            change: Number(newData.change),
            changePercent: Number(newData.change_percent),
            volume: Number(newData.volume || 0),
            openPrice: Number(newData.open_price),
            highPrice: Number(newData.high_price),
            lowPrice: Number(newData.low_price),
            lastSyncDate: newData.last_sync_date,
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [enabled, onUpdate])
}

export default useStockSubscription
