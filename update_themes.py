
import json
import random

# 1. Load the newly generated stocks
with open("c:/dev/mbti_stock/src/data/stocks.json", "r", encoding="utf-8") as f:
    stocks = json.load(f)

# Create a mapping of Name -> Ticker
name_to_ticker = {s['name']: s['ticker'] for s in stocks}

# 2. Load the existing themes
with open("c:/dev/mbti_stock/src/data/themes.json", "r", encoding="utf-8") as f:
    themes = json.load(f)

# 3. Old mapping (Manual or approximate)
old_to_name = {
    "005930": "삼성전자",
    "000660": "SK하이닉스",
    "035420": "NAVER",
    "035720": "카카오",
    "068270": "셀트리온",
    "207940": "삼성바이오로직스",
    "005490": "POSCO홀딩스",
    "051910": "LG화학",
    "006400": "삼성SDI",
    "000270": "기아",
    "247540": "에코프로비엠",
    "086520": "에코프로",
    "326030": "SK바이오팜",
    "352820": "하이브",
    "041510": "에스엠",
    "122870": "YG엔터테인먼트",
    "035900": "JYP Ent.",
    "036570": "엔씨소프트",
    "251270": "넷마블",
    "263750": "펄어비스",
    "112040": "위메이드",
    "293490": "카카오게임즈",
    "377300": "카카오페이",
    "402340": "SK스퀘어",
    "055550": "신한지주",
    "034730": "SK",
    "018260": "삼성에스디에스",
    "032640": "LG유플러스",
    "096770": "SK이노베이션",
    "003670": "포스코퓨처엠",
    "012330": "현대모비스",
    "028260": "삼성물산",
    "105560": "KB금융",
    "010140": "삼성중공업",
    "097950": "CJ제일제당",
    "028050": "삼성엔지니어링",
    "011170": "롯데케미칼",
    "034220": "LG디스플레이",
    "000720": "현대건설",
    "003550": "LG",
    "004020": "현대제철",
    "005940": "NH투자증권",
    "002380": "KCC",
    "066570": "LG전자",
    "108860": "셀바스AI",
    "950130": "엔지켐생명과학"
}

# 4. Update themes
total_updated = 0
all_tickers = [s['ticker'] for s in stocks]

for theme in themes:
    new_theme_stocks = []
    for old_ticker in theme['stocks']:
        name = old_to_name.get(old_ticker)
        if name and name in name_to_ticker:
            new_theme_stocks.append(name_to_ticker[name])
        else:
            new_theme_stocks.append(random.choice(all_tickers))
    
    # Ensure uniqueness and limit to 10
    theme['stocks'] = list(dict.fromkeys(new_theme_stocks))[:10]
    # If still too few, fill up
    while len(theme['stocks']) < 5:
        theme['stocks'].append(random.choice(all_tickers))
        theme['stocks'] = list(dict.fromkeys(theme['stocks']))
        
    total_updated += 1

# Rewrite themes.json
with open("c:/dev/mbti_stock/src/data/themes.json", "w", encoding="utf-8") as f:
    json.dump(themes, f, ensure_ascii=False, indent=2)

print(f"Updated {total_updated} themes with new tickers.")
