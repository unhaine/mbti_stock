
import json
import os
from typing import Dict, List, Any

# Path to themes.json (project root relative)
THEMES_PATH = "../src/data/themes.json"

# MBTI 16 Profiles (Base Tendencies)
MBTI_PROFILES = {
    # Analysts (Tech, Finance, Strategy)
    "INTJ": {"rsi": -0.6, "volatility": -0.3, "pbr": -0.8, "desc": "용의주도한 전략가", "sectors": ["금융", "서비스", "반도체"]},
    "INTP": {"rsi": -0.4, "volatility": 0.2, "tech": 0.9, "desc": "논리적인 사색가", "sectors": ["반도체", "IT", "전기전자", "의약품"]},
    "ENTJ": {"rsi": 0.0, "volatility": 0.5, "market_cap": 1.0, "desc": "대담한 통솔자", "sectors": ["금융", "자동차", "화학"]},
    "ENTP": {"rsi": 0.5, "volatility": 0.9, "momentum": 0.8, "desc": "뜨거운 논쟁을 즐기는 변론가", "sectors": ["IT", "벤처", "기계"]},
    # Diplomats (Bio, Media, Service)
    "INFJ": {"rsi": -0.3, "volatility": -0.5, "esg": 1.0, "desc": "선의의 옹호자", "sectors": ["의약품", "서비스업", "교육"]},
    "INFP": {"rsi": -0.2, "volatility": 0.0, "story": 1.0, "desc": "열정적인 중재자", "sectors": ["예술", "미디어", "섬유의복"]},
    "ENFJ": {"rsi": 0.0, "volatility": -0.2, "buzz": 0.8, "desc": "정의로운 사회운동가", "sectors": ["서비스업", "통신업", "환경"]},
    "ENFP": {"rsi": 0.4, "volatility": 0.7, "momentum": 0.6, "desc": "재기발랄한 활동가", "sectors": ["엔터", "미디어", "여행", "유통"]},
    # Sentinels (Finance, Utility, Food)
    "ISTJ": {"rsi": -0.2, "volatility": -0.9, "dividend": 1.0, "desc": "청렴결백한 논리주의자", "sectors": ["금융업", "은행", "철강금속"]},
    "ISFJ": {"rsi": 0.0, "volatility": -0.8, "stability": 1.0, "desc": "용감한 수호자", "sectors": ["음식료품", "보험", "유틸리티"]},
    "ESTJ": {"rsi": 0.1, "volatility": -0.5, "profit": 1.0, "desc": "엄격한 관리자", "sectors": ["제조업", "건설업", "운수장비"]},
    "ESFJ": {"rsi": 0.0, "volatility": -0.4, "popular": 1.0, "desc": "사교적인 외교관", "sectors": ["유통업", "소비재", "음식료"]},
    # Explorers (Auto, Construction, Heavy)
    "ISTP": {"rsi": -0.7, "volatility": 0.4, "tech_chart": 1.0, "desc": "만능 재주꾼", "sectors": ["기계", "전기전자", "건설"]},
    "ISFP": {"rsi": -0.3, "volatility": 0.1, "design": 1.0, "desc": "호기심 많은 예술가", "sectors": ["섬유의복", "종이목재", "디자인"]},
    "ESTP": {"rsi": 0.8, "volatility": 1.0, "momentum": 1.0, "desc": "모험을 즐기는 사업가", "sectors": ["증권", "건설업", "운수창고"]},
    "ESFP": {"rsi": 0.5, "volatility": 0.6, "party": 1.0, "desc": "자유로운 영혼의 연예인", "sectors": ["오락", "문화", "호텔", "항공"]}
}

# Theme Personas (Hyper-specific modifiers)
# We treat each category as a distinct 'investor persona' to maximize variety
CATEGORY_WEIGHTS = {
    "가치 투자": {
        "pbr": -3.0, "rsi": -1.2, "dividend": 1.5, "market_cap": 0.5,
        "sectors": ["금융", "은행", "지주", "철강", "건설", "유통"],
        "avoid": ["IT", "바이오", "게임", "엔터"],
        "persona": "현금 부자 전설의 자산가"
    },
    "장기 투자": {
        "volatility": -2.0, "market_cap": 2.5, "dividend": 1.0,
        "sectors": ["전자", "자동차", "반도체", "에너지"],
        "persona": "자식에게 물려줄 우량주 수집가"
    },
    "기술주": {
        "tech": 5.0, "momentum": 1.2, "sector_match": 4.0,
        "sectors": ["반도체", "IT", "소프트웨어", "로봇", "인공지능"],
        "persona": "미래를 여는 테크 덕후"
    },
    "고성장주": {
        "momentum": 4.0, "volatility": 1.5, "market_cap": -1.0,
        "sectors": ["2차전지", "바이오", "전기차", "콘텐츠"],
        "persona": "내일의 텐배거를 찾는 모험가"
    },
    "배당 투자": {
        "dividend": 10.0, "volatility": -1.5,
        "sectors": ["금융", "통신", "유틸리티", "전력", "가스"],
        "persona": "매달 월세받는 배당 귀족"
    },
    "ESG 투자": {
        "esg": 4.0, "sector_match": 2.0,
        "sectors": ["친환경", "풍력", "태양광", "신생", "수소"],
        "persona": "세상을 바꾸는 착한 투자자"
    },
    "단기 매매": {
        "momentum": 5.0, "volatility": 3.0, "rsi": 1.5,
        "sectors": ["테마", "급등", "이슈"],
        "persona": "차트와 혼연일체된 단타 고수"
    },
    "역발상 투자": {
        "rsi": -4.0, "change_percent": -2.0,
        "sectors": ["전통", "생활", "유통"],
        "persona": "모두가 '아니'라고 할 때 '예'를 외치는 고독한 늑대"
    },
    "안전 자산": {
        "volatility": -4.0, "beta": -1.5, "market_cap": 1.0,
        "sectors": ["식품", "보험", "전기"],
        "persona": "내 돈은 소중해, 방어의 달인"
    },
    "글로벌 투자": {
        "market_cap": 3.0, "global": 2.0,
        "sectors": ["자동차", "반도체", "배", "물류"],
        "persona": "전세계를 누비는 거물"
    },
    "테마 투자": {
        "momentum": 3.0, "buzz": 2.5, "sector_match": 2.0,
        "sectors": ["게임", "웹툰", "드라마", "여행"],
        "persona": "트렌드 최전방의 유행 선도자"
    },
    "고위험 고수익": {
        "volatility": 5.0, "momentum": 2.5,
        "sectors": ["바이오", "코스닥", "벤처"],
        "persona": "하이리스크 하이리턴, 인생은 한방"
    },
    # Default fallback
    "default": {"sectors": [], "persona": "일반 투자자"}
}

def load_themes() -> List[Dict]:
    """Load themes from JSON file."""
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir, THEMES_PATH)
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading themes: {e}")
        return []

def get_themes_for_mbti(mbti: str) -> List[Dict]:
    all_themes = load_themes()
    return [t for t in all_themes if t['mbti'] == mbti.upper()]

def score_stock(stock_features: Dict, mbti: str, theme_category: str) -> (float, str):
    """
    Score a stock based on MBTI base profile + Theme Category modifier.
    Returns: (score, reason)
    """
    base_profile = MBTI_PROFILES.get(mbti.upper(), MBTI_PROFILES["INTJ"])
    theme_modifier = CATEGORY_WEIGHTS.get(theme_category, CATEGORY_WEIGHTS.get("default", {}))
    
    # Theme Persona 가중치를 극단적으로 강화 (Character identity dominant)
    THEME_MULTIPLIER = 4.0
    
    score = 50.0
    contributions = {} 
    
    # Extract Features
    change_pct = float(stock_features.get('change_percent') or stock_features.get('changePercent') or 0)
    vol_val = stock_features.get('volatility') or 'medium'
    div_yield = float(stock_features.get('dividend_yield') or 0)
    sector = str(stock_features.get('sector') or '')
    stock_name = str(stock_features.get('name') or '')
    
    # market_cap
    market_cap_raw = stock_features.get('market_cap') or 'medium'
    if isinstance(market_cap_raw, str):
        market_cap = market_cap_raw
    else:
        market_cap = float(market_cap_raw)
    
    # 1. Momentum & Volatility (Theme Persona 위주)
    w_mom = base_profile.get('momentum', 0) + theme_modifier.get('momentum', 0) * THEME_MULTIPLIER
    mom_score = change_pct * w_mom * 3.0
    score += mom_score
    contributions['momentum'] = mom_score
    
    vol_score_val = 1.0
    if vol_val == 'low': vol_score_val = 0.5
    elif vol_val == 'high': vol_score_val = 2.0
    elif vol_val == 'very-high': vol_score_val = 3.0
    
    w_vol = base_profile.get('volatility', 0) + theme_modifier.get('volatility', 0) * THEME_MULTIPLIER
    vol_contrib = vol_score_val * w_vol * 10.0 # 영향력 증대
    score += vol_contrib
    contributions['volatility'] = vol_contrib
    
    # 2. Dividend (Hard Constraint for Dividends)
    w_div = base_profile.get('dividend', 0) + theme_modifier.get('dividend', 0) * THEME_MULTIPLIER
    if w_div > 0:
        if div_yield > 0:
            div_score = div_yield * w_div * 6.0 
            score += div_score
            contributions['dividend'] = div_score
        else:
            if theme_modifier.get('dividend', 0) > 0:
                score -= 100 # 배당 없으면 아예 탈락 수준으로
                contributions['dividend_penalty'] = -100
    
    # 3. Sector & Name Persona Matching (The Strongest Factor)
    theme_fav_sectors = theme_modifier.get('sectors', [])
    theme_avoid_sectors = theme_modifier.get('avoid', [])
    
    # 테마에 어울리지 않는 섹터면 강력 감점
    if any(avoid in sector for avoid in theme_avoid_sectors):
        score -= 60
        contributions['persona_avoid'] = -60
        
    # 테마 섹터 일치시 압도적 가산점 (다른 모든 수치를 압도)
    theme_hit = any(fav in sector or fav in stock_name for fav in theme_fav_sectors)
    if theme_hit:
        theme_bonus = 60.0  # 사실상 이 종목들이 상위권을 독점하게 함
        score += theme_bonus
        contributions['theme_persona'] = theme_bonus
        
    # 4. Market Cap
    w_cap = base_profile.get('market_cap', 0) + theme_modifier.get('market_cap', 0) * THEME_MULTIPLIER
    if w_cap != 0:
        if isinstance(market_cap, str):
            is_large = market_cap == 'large'
            is_jumbo = market_cap == 'large'
        else:
            is_large = market_cap > 1000000000000
            is_jumbo = market_cap > 10000000000000
        
        if w_cap > 0:
            cap_score = w_cap * (30.0 if is_jumbo else (15.0 if is_large else 2.0))
        else:
            cap_score = abs(w_cap) * (20.0 if not is_large else 2.0)
        
        score += cap_score
        contributions['market_cap'] = cap_score
    
    # 5. 소량의 무작위 노이즈
    import random
    score += random.uniform(-2.0, 2.0)
    
    # Generate Persona-driven Reason
    persona_name = theme_modifier.get('persona', '분석가')
    top_factor = max(contributions, key=contributions.get)
    
    reason = ""
    if top_factor == 'theme_persona':
        reason = f"[{persona_name}]가 가장 사랑하는 {sector} 섹터의 핵심 종목입니다."
    elif top_factor == 'dividend':
        reason = f"[{persona_name}]를 미소 짓게 할 {div_yield}%의 환상적인 배당 수익률!"
    elif top_factor == 'momentum':
        reason = f"전형적인 상승 곡선! [{persona_name}]의 레이더망에 포착되었습니다."
    elif top_factor == 'volatility' and w_vol < 0:
        reason = f"[{persona_name}]의 철칙인 리스크 관리에 완벽히 부합하는 견고한 흐름입니다."
    else:
        reason = f"당신의 MBTI와 [{persona_name}]의 전략이 만난 최적의 교집합입니다."
         
    return max(0.0, min(100.0, score)), reason
