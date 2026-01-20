import { useState, useEffect } from 'react';

interface HistoryPoint {
  price: number;
  date: string;
}

export function useStockHistory(ticker: string | undefined) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker) return;

    async function fetchHistory() {
      setLoading(true);
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const url = `${supabaseUrl}/rest/v1/stock_prices_daily?ticker=eq.${ticker}&order=trade_date.asc&limit=100`;
        
        const response = await fetch(url, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map((item: any) => ({
            price: item.close_price,
            date: item.trade_date
          }));
          setHistory(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [ticker]);

  return { history, loading };
}
