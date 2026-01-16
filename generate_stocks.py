
import json
import random

def generate_stocks():
    sectors = {
        "반도체": ["삼성전자", "SK하이닉스", "DB하이텍", "리노공업", "주성엔지니어링", "HPSP", "이오테크닉스", "원익IPS", "유진테크", "하나마이크론", "솔브레인", "덕산네오룩스", "SFA반도체", "네패스", "테크윙", "에이디테크놀로지", "가온칩스", "오픈엣지테크놀로지", "칩스앤미디어", "텔레칩스", "제우스", "태성", "필옵틱스", "아이쓰리시스템", "미코"],
        "바이오": ["셀트리온", "삼성바이오로직스", "HLB", "알테오젠", "셀트리온제약", "메디톡스", "휴젤", "클래시스", "파마리서치", "에스티팜", "삼천당제약", "오스코텍", "보로노이", "큐리옥스바이오시스템즈", "지아이이노베이션", "올릭스", "디앤디파마텍", "에스티큐브", "지씨셀"],
        "2차전지": ["에코프로", "에코프로비엠", "엘앤에프", "엔켐", "나노신소재", "대주전자재료", "천보", "성일하이텍", "새빗켐", "윤성에프앤씨", "더블유씨피", "제이오", "중앙첨단소재", "정석케미칼"],
        "게임": ["엔씨소프트", "넷마블", "크래프톤", "카카오게임즈", "펄어비스", "위메이드", "컴투스", "데브시스터즈", "넥슨게임즈", "네오위즈", "위메이드맥스"],
        "엔터": ["하이브", "JYP Ent.", "에스엠", "와이지엔터테인먼트", "디어유", "팬엔터테인먼트", "큐브엔터", "감성코퍼레이션"],
        "플랫폼/IT": ["NAVER", "카카오", "카카오뱅크", "카카오페이", "안랩", "이스트소프트", "솔트룩스", "클로봇", "코난테크놀로지", "마음AI", "셀바스AI"],
        "로봇": ["레인보우로보틱스", "두산로보틱스", "유진로봇", "로보티즈", "유일로보틱스", "에스비비테크", "뉴로메카", "하이젠알앤엠"],
        "에너지/소재": ["POSCO홀딩스", "포스코퓨처엠", "LG화학", "삼성SDI", "SK이노베이션", "LS마린솔루션", "비에이치아이", "우리기술", "에코프로에이치엔"],
        "금융": ["신한지주", "KB금융", "하나금융지주", "우리금융지주", "메리츠금융지주", "삼성증권", "미래에셋증권", "NH투자증권", "인카금융서비스", "코나아이"],
        "자동차": ["현대차", "기아", "현대모비스", "현대위아", "에스엘", "화신", "성우하이텍"],
        "소비재/기타": ["CJ제일제당", "오리온", "농심", "삼양식품", "매일유업", "빙그레", "아모레퍼시픽", "LG생활건강", "코스맥스", "한국콜마", "펌텍코리아"]
    }

    mbti_templates = {
        "반도체": {
            "INTJ": "시스템의 설계자. 초정밀 공정의 마스터.",
            "INTP": "기술의 근본을 파고드는 반도체 아키텍트.",
            "ENTJ": "초격차 전략으로 시장을 지배하는 제왕.",
            "default": "글로벌 공급망의 핵심 기술 파트너"
        },
        "바이오": {
            "INFJ": "인류의 고통을 덜어주는 보이지 않는 구원자.",
            "INTJ": "데이터와 임상으로 증명하는 생명의 가치.",
            "ENFP": "불가능을 가능케 하는 혁신 신약의 꿈.",
            "default": "차세대 신약 개발로 창조하는 생명 연장의 꿈"
        },
        "2차전지": {
            "ENTP": "에너지 패러다임을 뒤바꾸는 게임 체인저.",
            "ESTP": "변동성을 즐기며 질주하는 하이테크 스타.",
            "ENTJ": "전기차 시대의 심장을 만드는 거침없는 행보.",
            "default": "친환경 미래를 앞당기는 에너지 소재의 주역"
        },
        "게임": {
            "ENFP": "상상력이 현실이 되는 무한한 유니버스.",
            "INTP": "완벽한 밸런스와 몰입감을 설계하는 장인.",
            "ESFP": "모두가 열광하는 즐거움의 축제장.",
            "default": "글로벌 시장을 사로잡는 강력한 IP 보유사"
        },
        "엔터": {
            "ENFJ": "글로벌 팬덤을 하나로 묶는 가슴 뛰는 울림.",
            "ISFP": "예술적 감성으로 시대를 풍미하는 아이콘.",
            "ESFP": "무대 위에서 가장 빛나는 화려한 열정.",
            "default": "K-컬처의 글로벌 확산을 선도하는 엔터 제국"
        },
        "플랫폼/IT": {
            "ENTP": "일상의 모든 순간을 연결하는 디지털 마법.",
            "INTJ": "방대한 데이터를 지식으로 바꾸는 인텔리전스.",
            "INFJ": "사람과 소통의 가치를 최우선으로 하는 연결자.",
            "default": "디지털 전환 시대의 핵심 플랫폼 및 IT 솔루션"
        }
    }

    tags_pool = ["대형주", "성장주", "우량주", "배당주", "가치주", "고변동성", "글로벌", "강소기업", "AI", "친환경", "혁신"]

    stocks = []
    
    # Generate ~150 stocks
    tickers = set()
    while len(tickers) < 150:
        tickers.add("".join([str(random.randint(0, 9)) for _ in range(6)]))
    
    ticker_list = list(tickers)
    idx = 0
    
    for sector, names in sectors.items():
        for name in names:
            if idx >= 150: break
            
            price = random.randint(5000, 1000000)
            change = random.randint(-int(price*0.1), int(price*0.1))
            change_percent = round((change / price) * 100, 2)
            volatility = random.choice(["low", "medium", "high", "very-high"])
            dividend = round(random.uniform(0, 6), 1)
            
            # Select metaphor based on sector or default
            temp = mbti_templates.get(sector, mbti_templates["플랫폼/IT"])
            metaphors = {
                "INTJ": temp.get("INTJ", "치밀한 계획으로 미래를 준비하는 설계자."),
                "ENTJ": temp.get("ENTJ", "압도적인 리더십으로 시장을 선도하는 리더."),
                "ENFP": temp.get("ENFP", "무한한 호기심으로 새로운 가치를 만드는 탐험가."),
                "default": temp.get("default", "지속 가능한 성장을 추구하는 우량 기업")
            }
            
            # Additional random metaphors to feel rich
            metaphors["INTP"] = "원리를 이해하고 시스템을 최적화하는 분석가."
            metaphors["INFJ"] = "가치 지향적 목표를 향해 묵묵히 나아가는 비전형 인재."
            
            stock = {
                "ticker": ticker_list[idx],
                "name": name,
                "sector": sector,
                "marketCap": f"{random.randint(1, 500)}조" if price > 50000 else f"{random.randint(1000, 9999)}억",
                "price": price,
                "change": change,
                "changePercent": change_percent,
                "volatility": volatility,
                "dividendYield": dividend,
                "metaphors": metaphors,
                "tags": random.sample(tags_pool, 3) + [sector]
            }
            stocks.append(stock)
            idx += 1
            
    # Fill remaining to reach 150 if needed with randomized names
    # (Actually we have about 110-120 from real list above, let's just use what we have or add more)
    
    return stocks

stocks = generate_stocks()
with open("c:/dev/mbti_stock/src/data/stocks.json", "w", encoding="utf-8") as f:
    json.dump(stocks, f, ensure_ascii=False, indent=2)

print(f"Generated {len(stocks)} stocks.")

# Generate SQL script
sql = "INSERT INTO stocks (ticker, name, sector, market_cap, price, change, change_percent, volatility, dividend_yield, metaphors, tags)\nVALUES\n"
values = []
for s in stocks:
    tags_str = "ARRAY[" + ", ".join([f"'{t}'" for t in s['tags']]) + "]"
    metaphors_json = json.dumps(s['metaphors'], ensure_ascii=False).replace("'", "''")
    values.append(f"('{s['ticker']}', '{s['name']}', '{s['sector']}', '{s['marketCap']}', {s['price']}, {s['change']}, {s['changePercent']}, '{s['volatility']}', {s['dividendYield']}, '{metaphors_json}'::jsonb, {tags_str})")

sql += ",\n".join(values)
sql += "\nON CONFLICT (ticker) DO UPDATE SET\n  price = EXCLUDED.price,\n  change = EXCLUDED.change,\n  change_percent = EXCLUDED.change_percent;"

with open("c:/dev/mbti_stock/insert_stocks_large.sql", "w", encoding="utf-8") as f:
    f.write(sql)
