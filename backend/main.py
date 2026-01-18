from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware

# Custom Modules
from ranker import get_themes_for_mbti, score_stock
from logger import init_logger, get_logger
from hybrid_ranker import get_hybrid_ranker

# Load env variables from root directory
load_dotenv(dotenv_path="../.env")

app = FastAPI()

# CORS Setup
origins = [
    "http://localhost:5173", # Vite Dev Server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Client (global)
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Initialize Logger
if supabase_client:
    init_logger(supabase_client)

class ThemeRecommendationRequest(BaseModel):
    mbti: str

class StockItem(BaseModel):
    ticker: str
    name: str 
    price: float
    score: float
    reason: str 
    ai_message: str 
    metrics: Dict

class ThemeResponse(BaseModel):
    id: str
    title: str
    description: str
    emoji: str
    category: str
    stocks: List[StockItem]

@app.get("/")
def read_root():
    return {"message": "MBTI Theme Recommendation API is running!"}

@app.post("/recommend/themes")
def recommend_themes(request: ThemeRecommendationRequest):
    mbti = request.mbti.upper()
    print(f"[API] Generating Themes for {mbti}...")
    
    # 1. Get Themes for MBTI (from themes.json)
    themes = get_themes_for_mbti(mbti)
    if not themes:
        # Fallback if specific MBTI not found
        themes = get_themes_for_mbti("INTJ") 
        
    response_themes = []

    # Fetch Stock Data from Supabase DB directly
    try:
        # Initialize Supabase Client
        url = os.environ.get("VITE_SUPABASE_URL")
        key = os.environ.get("VITE_SUPABASE_ANON_KEY")
        if not url or not key:
            raise Exception("Supabase Env Vars missing")
            
        supabase: Client = create_client(url, key)
        
        # Fetch all stocks
        response = supabase.table('stocks').select('*').execute()
        db_stocks = response.data if response.data else []
        
        active_candidates = []
        for s in db_stocks:
             # Normalize keys if needed (DB sends snake_case)
             features = {
                 "rsi": 50, # Default (Not in DB)
                 "volatility": s.get('volatility', 'medium'),
                 "change_percent": float(s.get('change_percent') or 0),
                 "momentum": float(s.get('change_percent') or 0), # Proxy
                 "market_cap": s.get('market_cap', 0),
                 "close": float(s.get('price') or 0), # For price
                 "sector": s.get('sector', ''),
                 "dividend_yield": float(s.get('dividend_yield') or 0)
             }
             active_candidates.append({
                 "ticker": s.get('ticker'),
                 "name": s.get('name'),
                 "currency": "KRW",
                 "features": features
             })
             
    except Exception as e:
        print(f"DB Fetch Error: {e}")
        # Fallback to dummy if DB fails
        active_candidates = []

    # 2. Initialize Hybrid Ranker for this MBTI
    try:
        hybrid_ranker = get_hybrid_ranker(mbti)
        use_ml = hybrid_ranker.ml_ranker is not None
        print(f"[API] Using {'Hybrid (ML+Rule)' if use_ml else 'Rule-based only'} ranker for {mbti}")
    except Exception as e:
        print(f"[API] Hybrid ranker init failed: {e}, falling back to rule-based")
        hybrid_ranker = None
        use_ml = False
    
    # 3. For each theme, score all candidates and pick Top 10
    used_tickers = set() # To encourage diversity across themes
    
    for theme in themes:
        category = theme.get('category', 'default')
        
        # --- Pre-filtering Candidates based on Theme Persona ---
        candidates_for_theme = active_candidates
        
        if category == "배당 투자":
            # 배당이 0인 종목은 원천 배제
            candidates_for_theme = [c for c in active_candidates if c['features'].get('dividend_yield', 0) > 0]
        elif category == "안전 자산":
            # 변동성이 너무 높은 종목은 배제
            candidates_for_theme = [c for c in active_candidates if c['features'].get('volatility') not in ['high', 'very-high']]
        elif category == "기술주":
            # 기술 관련 키워드가 섹터에 있는 종목 우선 (완전 배제는 아니지만 가중치용 필터링)
            tech_keywords = ['반도체', 'IT', '소프트웨어', '과학', '기술']
            candidates_for_theme = [c for c in active_candidates if any(k in c['features'].get('sector', '') for k in tech_keywords)]
            # 기술주 후보가 너무 적으면 다시 전체 리스트 사용
            if len(candidates_for_theme) < 10:
                candidates_for_theme = active_candidates

        if hybrid_ranker and use_ml:
            # Use Hybrid Ranker (ML + Rule)
            # 테마의 개성을 살리기 위해 ML 비중을 0.5로 낮춤 (Rule persona 강화)
            ranked_stocks = hybrid_ranker.rank_stocks(
                candidates_for_theme,
                category,
                use_ml=True,
                ml_weight=0.5 
            )
            
            scored_candidates = []
            for stock_obj, score, reason in ranked_stocks:
                features = stock_obj['features']
                ticker = stock_obj['ticker']
                
                # 중복 패널티: 이미 다른 테마 상위권에 나온 종목은 점수를 약간 깎음
                final_score = score
                if ticker in used_tickers:
                    final_score *= 0.8
                
                scored_candidates.append({
                    "ticker": ticker,
                    "name": stock_obj['name'],
                    "price": features.get('close', 0),
                    "score": int(final_score),
                    "reason": f"{category} 적합도 {int(final_score)}점",
                    "ai_message": reason,
                    "metrics": features
                })
        else:
            # Fallback to Rule-based only
            scored_candidates = []
            for cand in candidates_for_theme:
                score, reason_text = score_stock(cand['features'], mbti, category)
                ticker = cand['ticker']
                
                final_score = score
                if ticker in used_tickers:
                    final_score *= 0.8 # Diversity penalty
                    
                scored_candidates.append({
                    "ticker": ticker,
                    "name": cand['name'],
                    "price": cand['features'].get('close', 0),
                    "score": int(final_score),
                    "reason": f"{category} 적합도 {int(final_score)}점",
                    "ai_message": reason_text,
                    "metrics": cand['features']
                })
        
        # Sort desc
        scored_candidates.sort(key=lambda x: x['score'], reverse=True)
        
        # Pick Top 10
        top_stocks = scored_candidates[:10]
        
        # 이번 테마의 Top 3는 다음 테마에서 살짝 밀려나도록 기록
        for s in top_stocks[:3]:
            used_tickers.add(s['ticker'])
        
        response_themes.append({
            "id": theme['id'],
            "title": theme['title'],
            "description": theme['description'],
            "emoji": theme['emoji'],
            "category": category,
            "stocks": top_stocks
        })
        
    return response_themes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
