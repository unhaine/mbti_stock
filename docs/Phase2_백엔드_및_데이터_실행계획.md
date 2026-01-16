# Phase 2: 백엔드 구축 및 데이터 실체화 실행 계획

> **목표**: Supabase를 활용한 백엔드 구축, 사용자 인증 구현, 그리고 정교한 데이터 모델링을 통해 실제 서비스 가능한 수준으로 애플리케이션 고도화

---

## 📅 일정 및 단계 (예상 기간: 2주)

### Step 1: 백엔드 인프라 구축 (Supabase)

- [x] Supabase 프로젝트 생성 및 설정
- [x] 환경 변수 설정 (`.env.local`)
- [x] Supabase Client 연동 (`@supabase/supabase-js`)

### Step 2: 사용자 인증 (Auth) 구현

- [x] 로그인/회원가입 페이지 UI 구현
- [x] 이메일/비밀번호 인증 흐름 구현
- [ ] 소셜 로그인(구글/카카오) 검토
- [x] Protected Route (로그인 접근 제한) 설정
- [x] 프로필 관리 (MBTI 정보 저장)

### Step 3: 데이터베이스 모델링 및 구현

- [x] **Users Table**: 사용자 기본 정보, MBTI, 투자 성향
- [x] **Portfolios Table**: 사용자별 포트폴리오 (현금, 총 평가액)
- [x] **Holdings Table**: 보유 종목 및 수량, 평단가
- [x] **Transactions Table**: 매수/매도 거래 내역
- [w] **Stocks Table**: 종목 마스터 데이터 (SQL 생성 완료)

### Step 4: 애플리케이션 로직 연동

- [x] 로컬 스토리지(`useLocalStorage`) → Supabase DB로 마이그레이션 (자동 연동 완료)
- [x] 포트폴리오 데이터 CRUD 구현 (매수/매도 RPC 연동 완료)
- [ ] 실시간 데이터 구독 (Realtime Subscription) 검토
- [x] 거래 내역(Transactions) UI 연동

---

## 🛠️ 기술 스택

- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Frontend State**: React Query (Server State 관리)
- **Deployment**: Vercel

---

## 📊 데이터베이스 스키마 설계 (Draft)

### 1. profiles (Users)

| Column     | Type      | Description           |
| ---------- | --------- | --------------------- |
| id         | uuid      | Primary Key (Auth ID) |
| email      | text      | 이메일                |
| nickname   | text      | 닉네임                |
| mbti       | text      | MBTI 유형             |
| created_at | timestamp | 가입일                |

### 2. portfolios

| Column       | Type    | Description      |
| ------------ | ------- | ---------------- |
| id           | uuid    | PK               |
| user_id      | uuid    | FK (profiles.id) |
| cash_balance | numeric | 보유 현금        |
| total_assets | numeric | 총 자산 (캐싱용) |

### 3. holdings

| Column       | Type    | Description        |
| ------------ | ------- | ------------------ |
| id           | uuid    | PK                 |
| portfolio_id | uuid    | FK (portfolios.id) |
| ticker       | text    | 종목 코드          |
| quantity     | integer | 보유 수량          |
| avg_price    | numeric | 평단가             |

### 4. transactions

| Column       | Type      | Description        |
| ------------ | --------- | ------------------ |
| id           | uuid      | PK                 |
| portfolio_id | uuid      | FK (portfolios.id) |
| type         | text      | 'BUY' or 'SELL'    |
| ticker       | text      | 종목 코드          |
| quantity     | integer   | 거래 수량          |
| price        | numeric   | 거래 단가          |
| executed_at  | timestamp | 거래 일시          |

---

## 📝 Action Items (우선순위)

1. **[인프라]** Supabase 프로젝트 생성 및 키 발급 (User 수행 필요)
2. **[코드]** Supabase 클라이언트 설정 파일 생성 (`src/lib/supabase.js`)
3. **[UI]** 로그인/회원가입 페이지 컴포넌트 생성
4. **[DB]** 테이블 생성 SQL 작성

---

## 🚀 기대 효과

- **데이터 영속성**: 브라우저를 닫아도 데이터가 유지됨 (현재는 로컬 스토리지)
- **멀티 디바이스**: 어디서든 내 포트폴리오 확인 가능
- **확장성**: 추후 커뮤니티, 랭킹 시스템 등으로 확장 용이
