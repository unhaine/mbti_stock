import json

def json_to_sql():
    with open('src/data/stocks.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    sql = """-- Stocks Table Schema
CREATE TABLE IF NOT EXISTS public.stocks (
    ticker TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sector TEXT,
    market_cap TEXT,
    price NUMERIC NOT NULL,
    change NUMERIC,
    change_percent NUMERIC,
    volatility TEXT,
    dividend_yield NUMERIC,
    metaphors JSONB,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Settings
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.stocks FOR SELECT USING (true);

-- Seed Data
"""

    for item in data:
        # Escape single quotes in names and metaphors
        name = item['name'].replace("'", "''")
        sector = item.get('sector', '').replace("'", "''")
        market_cap = item.get('marketCap', '').replace("'", "''")
        metaphors = json.dumps(item.get('metaphors', {}), ensure_ascii=False).replace("'", "''")
        tags = "{" + ",".join([f'"{tag}"' for tag in item.get('tags', [])]) + "}"
        
        sql += f"INSERT INTO public.stocks (ticker, name, sector, market_cap, price, change, change_percent, volatility, dividend_yield, metaphors, tags) "
        sql += f"VALUES ('{item['ticker']}', '{name}', '{sector}', '{market_cap}', {item['price']}, {item['change']}, {item['changePercent']}, '{item['volatility']}', {item.get('dividendYield', 0)}, '{metaphors}', '{tags}') "
        sql += "ON CONFLICT (ticker) DO UPDATE SET price = EXCLUDED.price, change = EXCLUDED.change, change_percent = EXCLUDED.change_percent;\n"

    with open('docs/db_seed_stocks.sql', 'w', encoding='utf-8') as f:
        f.write(sql)

if __name__ == "__main__":
    json_to_sql()
