# 개발 로드맵 - Phase 1 준비 단계

> 프로젝트 셋업부터 페이지 개발 전까지의 상세 계획

**작성일**: 2026-01-15  
**예상 기간**: 3-4일  
**목표**: 개발 환경 완벽 구축 및 기반 코드 준비

---

## 📋 목차

1. [전체 로드맵](#1-전체-로드맵)
2. [Step 1: 프로젝트 초기화](#step-1-프로젝트-초기화)
3. [Step 2: 개발 환경 설정](#step-2-개발-환경-설정)
4. [Step 3: 폴더 구조 생성](#step-3-폴더-구조-생성)
5. [Step 4: JSON 데이터 파일 생성](#step-4-json-데이터-파일-생성)
6. [Step 5: 유틸리티 함수 작성](#step-5-유틸리티-함수-작성)
7. [Step 6: 기본 컴포넌트 스캐폴딩](#step-6-기본-컴포넌트-스캐폴딩)
8. [Step 7: 라우팅 설정](#step-7-라우팅-설정)
9. [Step 8: 개발 준비 완료 체크](#step-8-개발-준비-완료-체크)

---

## 1. 전체 로드맵

### 큰 틀의 흐름

```
Phase 0: 기획 및 문서화 ✅ (완료)
    ↓
Phase 1-A: 개발 준비 ⬅️ 현재 단계 (3-4일)
    ├── Step 1: 프로젝트 초기화 (30분)
    ├── Step 2: 개발 환경 설정 (1시간)
    ├── Step 3: 폴더 구조 생성 (30분)
    ├── Step 4: JSON 데이터 파일 (2-3시간)
    ├── Step 5: 유틸리티 함수 (2시간)
    ├── Step 6: 기본 컴포넌트 (2시간)
    ├── Step 7: 라우팅 설정 (1시간)
    └── Step 8: 준비 완료 체크 (30분)
    ↓
Phase 1-B: 페이지 개발 (7-10일)
    ├── 랜딩페이지
    ├── 온보딩 (MBTI 선택 + 로딩)
    ├── 메인페이지 (핵심)
    └── 설정 페이지
    ↓
Phase 1-C: 통합 및 배포 (2-3일)
    ├── 테스트
    ├── 버그 수정
    └── Vercel 배포
```

### 타임라인

```
Day 1 (오늘)
├── Step 1-3: 프로젝트 셋업 및 폴더 구조
└── Step 4 시작: JSON 데이터 파일 (일부)

Day 2
├── Step 4 완료: JSON 데이터 파일
└── Step 5: 유틸리티 함수

Day 3
├── Step 6: 기본 컴포넌트
└── Step 7: 라우팅 설정

Day 4
└── Step 8: 최종 체크 및 테스트
```

---

## Step 1: 프로젝트 초기화

### 목표
- Vite + React 프로젝트 생성
- 기본 의존성 설치
- Git 초기화

### 체크리스트

#### 1.1 Vite 프로젝트 생성
- [ ] 현재 디렉토리에 React 프로젝트 생성
- [ ] Package name: mbti-stock
- [ ] 기존 파일 덮어쓰기 확인

**예상 시간**: 5분

#### 1.2 의존성 설치
- [ ] 기본 의존성 설치
- [ ] framer-motion 설치 (애니메이션)
- [ ] react-router-dom 설치 (라우팅)
- [ ] tailwindcss, postcss, autoprefixer 설치 (스타일링)

**예상 시간**: 10분

#### 1.3 Tailwind CSS 초기화
- [ ] Tailwind 설정 파일 생성
- [ ] PostCSS 설정 파일 생성

**생성 파일**:
- `tailwind.config.js`
- `postcss.config.js`

**예상 시간**: 5분

#### 1.4 Git 초기화
- [ ] Git 저장소 초기화
- [ ] 첫 커밋 (Initial commit)

**예상 시간**: 5분

#### 1.5 개발 서버 테스트
- [ ] 개발 서버 실행
- [ ] 브라우저에서 접속 확인
- [ ] Vite + React 기본 화면 표시 확인
- [ ] HMR 작동 확인

**예상 시간**: 5분

---

## Step 2: 개발 환경 설정

### 목표
- Tailwind CSS 설정
- ESLint/Prettier 설정
- VS Code 설정

### 체크리스트

#### 2.1 Tailwind CSS 설정

**설정 내용**:
- [ ] content 경로 설정 (index.html, src/**/*.jsx)
- [ ] 커스텀 색상 정의 (primary, gray)
- [ ] 커스텀 spacing 정의 (header, footer 높이)
- [ ] 폰트 설정 (Pretendard)

**커스텀 스타일 정의**:
- [ ] Tailwind base, components, utilities 임포트
- [ ] 카드 스타일 (.card)
- [ ] 버튼 스타일 (.btn-primary, .btn-secondary)
- [ ] 종목 카드 스타일 (.stock-card)

**예상 시간**: 20분

#### 2.2 ESLint 설정 (선택)
- [ ] .eslintrc.cjs 수정
- [ ] react/prop-types 규칙 off

**예상 시간**: 10분

#### 2.3 Prettier 설정 (선택)
- [ ] .prettierrc 파일 생성
- [ ] 기본 포맷팅 규칙 설정

**예상 시간**: 5분

#### 2.4 VS Code 설정
- [ ] .vscode/settings.json 생성
- [ ] 저장 시 자동 포맷 설정
- [ ] .vscode/extensions.json 생성
- [ ] 추천 확장 목록 (ESLint, Prettier, Tailwind)

**예상 시간**: 10분

#### 2.5 환경 변수 설정
- [ ] .env.example 파일 생성
- [ ] 기본 환경 변수 정의

**예상 시간**: 5분

---

## Step 3: 폴더 구조 생성

### 목표
- 프로젝트 폴더 구조 생성
- 빈 파일 생성 (스캐폴딩)

### 체크리스트

#### 3.1 폴더 구조 생성

**생성할 폴더**:
- [ ] src/components/common
- [ ] src/components/layout
- [ ] src/components/features
- [ ] src/pages
- [ ] src/data
- [ ] src/utils
- [ ] src/hooks
- [ ] src/styles
- [ ] src/assets/images
- [ ] src/assets/icons

**최종 구조**:
```
src/
├── components/          # React 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── features/       # 기능별 컴포넌트
├── pages/              # 페이지 컴포넌트
├── data/               # JSON 데이터
├── utils/              # 유틸리티 함수
├── hooks/              # Custom Hooks
├── styles/             # 전역 스타일
└── assets/             # 이미지, 아이콘
```

**예상 시간**: 5분

#### 3.2 README 파일 생성

**생성할 파일**:
- [ ] src/components/README.md
- [ ] src/pages/README.md
- [ ] src/data/README.md
- [ ] src/utils/README.md

**예상 시간**: 10분

---

## Step 4: JSON 데이터 파일 생성

### 목표
- 4개 JSON 파일 생성
- 기존 마크다운 데이터를 JSON으로 변환

### 체크리스트

#### 4.1 MBTI 프로필 데이터

**파일**: `src/data/mbti-profiles.json`

**작업 내용**:
- [ ] docs/data/MBTI_리스트.md에서 16개 MBTI 데이터 추출
- [ ] JSON 형식으로 변환
- [ ] 각 MBTI별 필드 정의:
  - id, name, tagline, description
  - traits (배열)
  - riskTolerance, decisionStyle, investmentStyle
  - emoji, gradient (색상 배열)

**예상 시간**: 1시간

#### 4.2 테마 데이터

**파일**: `src/data/themes.json`

**작업 내용**:
- [ ] docs/data/MBTI별_투자_테마.md에서 80개 테마 추출
- [ ] 각 MBTI별 5개 테마 배열로 구성
- [ ] 각 테마별 필드 정의:
  - id, mbti, emoji, title, description
  - category, stocks (티커 배열 10개)

**예상 시간**: 1시간

#### 4.3 종목 데이터

**파일**: `src/data/stocks.json`

**작업 내용**:
- [ ] docs/data/코스닥150_기업_리스트.md에서 50개 종목 추출
- [ ] 각 종목별 기본 정보 입력
- [ ] 주요 종목 10개에 대해 MBTI별 은유 작성
- [ ] 각 종목별 필드 정의:
  - ticker, name, sector, marketCap
  - price, change, changePercent, volume
  - metaphors (MBTI별 객체)
  - matchScore (MBTI별 점수)
  - volatility, updatedAt

**예상 시간**: 2시간 (은유 작성 포함)

#### 4.4 MBTI 코멘트 데이터

**파일**: `src/data/mbti-comments.json`

**작업 내용**:
- [ ] docs/data/MBTI_코멘트_전체.md에서 144개 코멘트 추출
- [ ] 각 MBTI별 3가지 상황 (bull, neutral, bear)
- [ ] 각 상황별 3개 변형 배열로 구성

**예상 시간**: 30분

---

## Step 5: 유틸리티 함수 작성

### 목표
- 자주 사용할 유틸리티 함수 작성
- LocalStorage 관리
- 데이터 로더
- 포맷터

### 체크리스트

#### 5.1 LocalStorage 유틸리티

**파일**: `src/utils/storage.js`

**구현할 함수**:
- [ ] setMBTI() - MBTI 저장
- [ ] getMBTI() - MBTI 읽기
- [ ] isOnboardingCompleted() - 온보딩 완료 여부
- [ ] initPortfolio() - 포트폴리오 초기화
- [ ] getPortfolio() - 포트폴리오 읽기
- [ ] updatePortfolio() - 포트폴리오 업데이트
- [ ] clear() - 전체 초기화

**예상 시간**: 30분

#### 5.2 데이터 로더

**파일**: `src/utils/dataLoader.js`

**구현할 기능**:
- [ ] DataLoader 클래스 생성
- [ ] 캐시 메커니즘 구현
- [ ] loadProfiles() - MBTI 프로필 로드
- [ ] loadThemes() - 테마 로드
- [ ] loadStocks() - 종목 로드
- [ ] loadComments() - 코멘트 로드
- [ ] getMBTIData() - 특정 MBTI 데이터 가져오기
- [ ] getStock() - 종목 정보 가져오기

**예상 시간**: 30분

#### 5.3 포맷터

**파일**: `src/utils/formatters.js`

**구현할 함수**:
- [ ] formatCurrency() - 통화 포맷 (10,000원)
- [ ] formatChange() - 변동 금액 포맷 (+500원)
- [ ] formatPercent() - 퍼센트 포맷 (+2.50%)
- [ ] formatDate() - 날짜 포맷
- [ ] formatCompact() - 숫자 축약 (1K, 1M)

**예상 시간**: 20분

#### 5.4 검증 함수

**파일**: `src/utils/validators.js`

**구현할 함수**:
- [ ] isValidMBTI() - MBTI 유효성 검사
- [ ] validateMBTI() - MBTI 검증 (에러 throw)
- [ ] validatePortfolio() - 포트폴리오 검증

**예상 시간**: 20분

#### 5.5 헬퍼 함수

**파일**: `src/utils/helpers.js`

**구현할 함수**:
- [ ] randomChoice() - 배열에서 랜덤 선택
- [ ] getMBTIComment() - MBTI 코멘트 선택
- [ ] getChangeColor() - 변동 색상 반환
- [ ] getChangeArrow() - 변동 아이콘 반환
- [ ] swipePower() - 스와이프 파워 계산

**예상 시간**: 20분

---

## Step 6: 기본 컴포넌트 스캐폴딩

### 목표
- 공통 컴포넌트 빈 파일 생성
- 기본 구조만 작성 (상세 구현은 나중에)

### 체크리스트

#### 6.1 공통 컴포넌트

**생성할 파일**:
- [ ] src/components/common/Button.jsx
  - variant (primary/secondary)
  - onClick, disabled, className props
- [ ] src/components/common/Card.jsx
  - children, className props
- [ ] src/components/common/Spinner.jsx
  - size (sm/md/lg) props

**예상 시간**: 30분

#### 6.2 레이아웃 컴포넌트

**생성할 파일**:
- [ ] src/components/layout/Header.jsx
  - showIcons props
  - 로고, 알림, 설정 아이콘
- [ ] src/components/layout/FooterNav.jsx
  - 4개 메뉴 (홈, 커뮤니티, 자산, 설정)
  - 현재 경로 하이라이트

**예상 시간**: 30분

#### 6.3 페이지 스캐폴딩

**생성할 파일** (빈 구조만):
- [ ] src/pages/LandingPage.jsx
- [ ] src/pages/OnboardingPage.jsx
- [ ] src/pages/LoadingPage.jsx
- [ ] src/pages/MainPage.jsx
- [ ] src/pages/CommunityPage.jsx
- [ ] src/pages/PortfolioPage.jsx
- [ ] src/pages/SettingsPage.jsx

**각 파일 내용**: 제목만 표시하는 기본 구조

**예상 시간**: 20분

---

## Step 7: 라우팅 설정

### 목표
- React Router 설정
- 보호된 라우트 구현
- 기본 네비게이션 테스트

### 체크리스트

#### 7.1 라우터 설정

**파일**: `src/App.jsx`

**구현 내용**:
- [ ] BrowserRouter 설정
- [ ] Routes 정의
  - Public: /, /onboarding, /loading
  - Protected: /main, /community, /portfolio, /settings
- [ ] ProtectedRoute 컴포넌트 구현
  - 온보딩 완료 여부 체크
  - 미완료 시 /onboarding으로 리다이렉트
- [ ] Fallback 라우트 (404 → /)

**예상 시간**: 30분

#### 7.2 메인 엔트리 포인트 확인

**파일**: `src/main.jsx`

**확인 사항**:
- [ ] React.StrictMode 적용
- [ ] App 컴포넌트 렌더링
- [ ] index.css 임포트

**예상 시간**: 5분

#### 7.3 라우팅 테스트

**테스트 시나리오**:
- [ ] / → 랜딩페이지 표시
- [ ] /main → 온보딩 안 했으면 /onboarding으로 리다이렉트
- [ ] /onboarding → MBTI 선택 화면 표시
- [ ] 존재하지 않는 경로 → /로 리다이렉트

**예상 시간**: 15분

---

## Step 8: 개발 준비 완료 체크

### 목표
- 모든 설정 확인
- 빌드 테스트
- Git 커밋

### 체크리스트

#### 8.1 최종 확인

**파일 구조 확인**:
- [ ] package.json
- [ ] tailwind.config.js
- [ ] vite.config.js
- [ ] .gitignore
- [ ] src/components/ (3개 하위 폴더)
- [ ] src/pages/ (7개 페이지)
- [ ] src/data/ (4개 JSON 파일)
- [ ] src/utils/ (5개 JS 파일)
- [ ] src/App.jsx
- [ ] src/main.jsx
- [ ] src/index.css

**예상 시간**: 10분

#### 8.2 개발 서버 테스트

**확인 사항**:
- [ ] 에러 없이 실행
- [ ] 라우팅 작동
- [ ] Tailwind 스타일 적용
- [ ] HMR 작동

**예상 시간**: 10분

#### 8.3 빌드 테스트

**확인 사항**:
- [ ] 빌드 성공
- [ ] dist/ 폴더 생성
- [ ] 경고 없음

**예상 시간**: 5분

#### 8.4 Git 커밋

**커밋 내용**:
- [ ] 모든 변경사항 스테이징
- [ ] 의미 있는 커밋 메시지 작성
- [ ] 변경사항 요약 포함

**예상 시간**: 5분

---

## 📊 전체 체크리스트

### Step 1: 프로젝트 초기화 (30분)
- [ ] Vite 프로젝트 생성
- [ ] 의존성 설치
- [ ] Tailwind 초기화
- [ ] Git 초기화
- [ ] 개발 서버 테스트

### Step 2: 개발 환경 설정 (1시간)
- [ ] Tailwind 설정
- [ ] ESLint 설정
- [ ] Prettier 설정
- [ ] VS Code 설정
- [ ] 환경 변수 설정

### Step 3: 폴더 구조 생성 (30분)
- [ ] src 하위 폴더 생성
- [ ] README 파일 생성

### Step 4: JSON 데이터 파일 (2-3시간)
- [ ] mbti-profiles.json (16개)
- [ ] themes.json (80개)
- [ ] stocks.json (50개)
- [ ] mbti-comments.json (144개)

### Step 5: 유틸리티 함수 (2시간)
- [ ] storage.js
- [ ] dataLoader.js
- [ ] formatters.js
- [ ] validators.js
- [ ] helpers.js

### Step 6: 기본 컴포넌트 (2시간)
- [ ] Button, Card, Spinner
- [ ] Header, FooterNav
- [ ] 페이지 스캐폴딩 (7개)

### Step 7: 라우팅 설정 (1시간)
- [ ] App.jsx 라우터 설정
- [ ] ProtectedRoute 구현
- [ ] 라우팅 테스트

### Step 8: 최종 확인 (30분)
- [ ] 파일 구조 확인
- [ ] 개발 서버 테스트
- [ ] 빌드 테스트
- [ ] Git 커밋

---

## 🎯 완료 후 다음 단계

### Phase 1-B: 페이지 개발 시작

**Week 1 (Day 5-7)**:
- 랜딩페이지 구현
- 온보딩 플로우 구현

**Week 2 (Day 8-14)**:
- 메인페이지 구현 (핵심)
- 설정 페이지 구현

**Week 3 (Day 15-17)**:
- 통합 테스트
- 버그 수정
- Vercel 배포

---

## 📝 진행 상황 업데이트

각 Step 완료 시:
- [ ] PROGRESS.md 업데이트
- [ ] SESSION_LOG.md 기록
- [ ] TODO.md 체크

---

*작성일: 2026-01-15*  
*예상 완료: 2026-01-18*
