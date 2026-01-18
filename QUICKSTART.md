ㅅ# 🚀 빠른 시작 가이드

## 최초 설정 (한 번만)

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어서 실제 키 값 입력
```

필수 항목:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_GEMINI_API_KEY`
- [ ] `VITE_DATA_GO_KR_API_KEY` (공공데이터포털)

### 2. 의존성 설치

```bash
# 프론트엔드
npm install

# 백엔드
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

### 3. Supabase 테이블 생성

Supabase 대시보드에서 SQL 에디터를 열고 실행:

```sql
-- 종목 마스터 테이블
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

-- 일별 시세 테이블
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

---

## 매일 개발 시작할 때

### 방법 1: 자동 스크립트 (추천)

```bash
./start-dev.sh
```

### 방법 2: 수동 실행 (3개 터미널)

**터미널 1 - 프론트엔드**

```bash
npm run dev
```

**터미널 2 - 백엔드**

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**터미널 3 - 프록시**

```bash
node scripts/proxy-server.js
```

---

## 체크리스트

### 서버 실행 확인

- [ ] 프론트엔드: http://localhost:5173 접속 가능
- [ ] 백엔드: http://localhost:8000/docs 접속 가능
- [ ] 프록시: 터미널에 "Proxy server running on port 3001" 메시지

### 기능 테스트

- [ ] MBTI 선택 후 메인 페이지 로딩
- [ ] AI 추천 테마 5개 표시
- [ ] 종목 클릭 시 상세 페이지 열림
- [ ] 매수/매도 기능 작동
- [ ] 커뮤니티 페이지 게시글 표시

### 문제 발생 시

1. 백엔드 터미널에서 에러 로그 확인
2. 브라우저 콘솔(F12)에서 에러 확인
3. `.env` 파일 키 값 재확인
4. `backend/test_api.py` 실행해서 API 테스트

---

## 주식 데이터 업데이트

### 수동 업데이트

```bash
npx tsx scripts/sync-daily-prices.ts
```

### 자동 업데이트 (cron)

```bash
# crontab 편집
crontab -e

# 매일 오후 6시 실행 추가 (평일만)
0 18 * * 1-5 cd /Users/y.h.heo/mbti_stock/mbti_stock && npx tsx scripts/sync-daily-prices.ts
```

---

## 배포 전 체크리스트

### 프론트엔드 (Vercel)

- [ ] `npm run build` 성공
- [ ] 환경 변수 Vercel에 등록
- [ ] API 엔드포인트 URL 업데이트

### 백엔드 (Railway/Render)

- [ ] `requirements.txt` 최신화
- [ ] `Procfile` 생성
- [ ] 환경 변수 플랫폼에 등록
- [ ] CORS 설정 프로덕션 URL 추가

---

## 유용한 명령어

```bash
# 백엔드 API 테스트
cd backend && source venv/bin/activate && python test_api.py

# 프론트엔드 빌드
npm run build

# 타입 체크
npm run type-check

# 린트
npm run lint

# 캐시 클리어 (브라우저 콘솔에서)
localStorage.clear()
```

---

## 긴급 문제 해결

### "AI 추천이 로딩만 됨"

```bash
# 1. 백엔드 재시작
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# 2. API 테스트
python test_api.py
```

### "Supabase 연결 안 됨"

1. `.env` 파일의 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 확인
2. Supabase 대시보드에서 프로젝트 활성 상태 확인
3. `stocks` 테이블 존재 여부 확인

### "Gemini API 에러"

1. API 키 유효성 확인
2. 할당량 초과 시 새 키 발급 또는 AI 기능 끄기
3. 브라우저 콘솔에서 `localStorage.clear()` 실행

---

**문제가 계속되면 `README.md`의 트러블슈팅 섹션을 참고하세요!**
