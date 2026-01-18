# MBTI Stock - MBTI 기반 AI 주식 추천 서비스

MBTI 성향에 맞는 주식을 AI가 추천해주는 웹 애플리케이션입니다.

## 📋 목차

- [시스템 구조](#시스템-구조)
- [사전 준비](#사전-준비)
- [환경 설정](#환경-설정)
- [실행 방법](#실행-방법)
- [데이터 업데이트](#데이터-업데이트)
- [배포](#배포)

---

## 🏗️ 시스템 구조

```
mbti_stock/
├── src/                    # 프론트엔드 (React + TypeScript + Vite)
├── backend/                # 백엔드 (FastAPI + Python)
│   ├── main.py            # API 서버
│   ├── ranker.py          # AI 추천 로직
│   └── venv/              # Python 가상환경
├── scripts/               # 유틸리티 스크립트
│   ├── proxy-server.js    # CORS 프록시 서버
│   └── update-stocks.js   # 주식 데이터 업데이트
└── .env                   # 환경 변수 (중요!)
```

**3개의 서버가 동시에 실행되어야 합니다:**

1. **프론트엔드 (Vite)**: `localhost:5173`
2. **백엔드 (FastAPI)**: `localhost:8000`
3. **프록시 서버 (Node.js)**: `localhost:3001`

---

## 🔧 사전 준비

### 필수 설치

- **Node.js** (v18 이상)
- **Python** (v3.9 이상)
- **npm** 또는 **yarn**

### 필수 계정

1. **Supabase** (https://supabase.com)
   - 무료 프로젝트 생성
   - `stocks` 테이블 및 `stock_prices_daily` 테이블 생성 필요
2. **Google Gemini API** (https://ai.google.dev)
   - API 키 발급 (무료 티어 사용 가능)
3. **공공데이터포털 API** (https://www.data.go.kr)
   - 금융위원회\_주식시세정보 API 신청
   - 승인까지 1-2일 소요
   - 주식 데이터 업데이트용 (필수)

---

## ⚙️ 환경 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 입력하세요:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_MODEL=gemini-1.5-flash

# 공공데이터포털 (주식 데이터 업데이트용)
VITE_DATA_GO_KR_API_KEY=your-data-go-kr-key
VITE_DATA_GO_KR_STOCK_ENDPOINT=https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService
```

> ⚠️ **주의**: `.env` 파일은 절대 Git에 커밋하지 마세요!

### 2. 의존성 설치

#### 프론트엔드

```bash
npm install
```

#### 백엔드

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🚀 실행 방법

### 개발 환경 실행 (3개 터미널 필요)

#### 터미널 1: 프론트엔드

```bash
npm run dev
```

→ http://localhost:5173 에서 접속

#### 터미널 2: 백엔드

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

→ http://localhost:8000/docs 에서 API 문서 확인 가능

#### 터미널 3: 프록시 서버

```bash
node scripts/proxy-server.js
```

→ CORS 우회용 프록시 (포트 3001)

### 한 번에 실행하기 (선택사항)

`package.json`에 스크립트를 추가하면 편리합니다:

```json
{
  "scripts": {
    "dev": "vite",
    "backend": "cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000",
    "proxy": "node scripts/proxy-server.js",
    "start:all": "concurrently \"npm run dev\" \"npm run backend\" \"npm run proxy\""
  }
}
```

그 후:

```bash
npm install -D concurrently
npm run start:all
```

---

## 📊 데이터 업데이트

### Supabase 테이블 구조

#### 1. `stocks` 테이블 (종목 마스터)

```sql
CREATE TABLE stocks (
  ticker TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT,
  price NUMERIC,
  change NUMERIC,
  change_percent NUMERIC,
  volume NUMERIC,
  open_price NUMERIC,
  high_price NUMERIC,
  low_price NUMERIC,
  volatility TEXT,
  market_cap TEXT,
  dividend_yield NUMERIC,
  last_sync_date TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `stock_prices_daily` 테이블 (일별 시세)

```sql
CREATE TABLE stock_prices_daily (
  ticker TEXT NOT NULL,
  trade_date DATE NOT NULL,
  open_price NUMERIC,
  high_price NUMERIC,
  low_price NUMERIC,
  close_price NUMERIC,
  volume BIGINT,
  change_amount NUMERIC,
  change_percent NUMERIC,
  PRIMARY KEY (ticker, trade_date)
);
```

### 주식 데이터 업데이트 스크립트

```bash
# TypeScript 스크립트 실행
npx tsx scripts/sync-daily-prices.ts
```

**자동화 (cron 설정 예시):**

```bash
# 매일 오후 6시에 실행 (장 마감 후)
0 18 * * 1-5 cd /path/to/mbti_stock && npx tsx scripts/sync-daily-prices.ts
```

---

## 🎯 주요 기능

### 1. MBTI 기반 추천

- 16가지 MBTI 유형별 맞춤 추천
- 각 MBTI당 5개의 테마 제공
- 테마당 10개 종목 추천

### 2. AI 분석

- **백엔드 AI (ranker.py)**:
  - 섹터 매칭
  - 배당 수익률
  - 모멘텀 분석
  - 변동성 평가
- **Gemini AI**:
  - 종목별 스토리텔링
  - 테마 기반 설명 생성
  - MBTI 맞춤 투자 조언

### 3. 실시간 데이터

- Supabase에서 주식 데이터 조회
- 커뮤니티 게시글 실시간 동기화
- 포트폴리오 관리

---

## 🐛 트러블슈팅

### 문제: 프론트엔드가 백엔드에 연결 안 됨

**해결**:

1. 백엔드가 `localhost:8000`에서 실행 중인지 확인
2. `.env` 파일의 Supabase 키 확인
3. CORS 에러 시 프록시 서버 실행 확인

### 문제: AI 추천이 로딩만 됨

**해결**:

1. 백엔드 터미널에서 에러 로그 확인
2. `backend/test_api.py` 실행해서 API 테스트
3. Supabase `stocks` 테이블에 데이터가 있는지 확인

### 문제: Gemini API 할당량 초과

**해결**:

1. 설정에서 "AI 기능" 끄기
2. 또는 Gemini API 키 재발급
3. 캐시 클리어: `localStorage.clear()`

---

## 📦 배포

### Vercel (프론트엔드)

```bash
npm run build
vercel --prod
```

환경 변수 설정:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`

### Railway/Render (백엔드)

```bash
cd backend
# Procfile 생성
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
```

환경 변수 설정:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📝 라이선스

MIT License

---

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

---

## 📧 문의

문제가 있으시면 이슈를 등록해주세요.
