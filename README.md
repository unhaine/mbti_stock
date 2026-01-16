# MBTI 투자 캐릭터 생성기

> MBTI로 알아보는 나의 투자 성향 - 성격 유형 기반 맞춤형 주식 추천 서비스

[![Status](https://img.shields.io/badge/status-planning-yellow)]()
[![Progress](https://img.shields.io/badge/progress-60%25-blue)]()

---

## 🎯 프로젝트 개요

MBTI 성격 유형을 투자 성향으로 재해석하여, 사용자에게 맞춤형 주식 테마와 종목을 추천하는 **엔터테인먼트 웹 서비스**입니다.

### 핵심 특징

- 🎭 **16개 MBTI 유형별** 투자 성향 분석
- 🏰 **80개 맞춤 테마** (각 MBTI당 5개)
- 💬 **144개 MBTI 코멘트** (상승/보합/하락장별)
- 📱 **모바일 앱 스타일 UI** (스와이프 제스처)
- 🎨 **은유 기반 설명** ("천천히 쌓이는 성", "로켓 발사" 등)

---

## 📚 문서

시작하기 전에 **[docs/00_START_HERE.md](./docs/00_START_HERE.md)**를 읽어주세요!

### 주요 문서

- [📖 서비스 개요](./docs/01_SERVICE_OVERVIEW.md) - 핵심 가치 제안, 타겟 사용자
- [⚙️ 기능 명세](./docs/02_FEATURES.md) - 14개 기능 상세 설명
- [💾 데이터 구조](./docs/03_DATABASE.md) - LocalStorage, JSON 스키마
- [🎨 UI 구조](./docs/05_UI_STRUCTURE.md) - 컴포넌트, 와이어프레임
- [🔧 기술 결정](./docs/99_DECISIONS.md) - 9개 주요 기술 선택 이유

### 개선 및 고도화

- [🚀 개선 전략 요약](./docs/개선_전략_요약.md) - 실행 가능한 개선 가이드 ⭐ NEW
- [📋 상세 개선 전략](./docs/개선_및_고도화_전략.md) - 종합 개선 및 고도화 전략 ⭐ NEW
- [📊 UI/UX 분석 보고서](./docs/보고서.md) - 현재 상태 평가 및 개선점

### 프로젝트 관리

- [📊 진행 상황](./PROGRESS.md) - 완료/진행/대기 작업
- [📝 세션 기록](./SESSION_LOG.md) - AI 협업 세션 로그
- [✅ TODO](./TODO.md) - 주차별 할 일 목록

---

## 🚀 빠른 시작

### 1. 프로젝트 셋업 (예정)

```bash
# 프로젝트 생성
npm create vite@latest . -- --template react

# 의존성 설치
npm install
npm install framer-motion react-router-dom
npm install -D tailwindcss postcss autoprefixer

# Tailwind 초기화
npx tailwindcss init -p

# 개발 서버 실행
npm run dev
```

### 2. 디렉토리 구조

```
mbti_stock/
├── docs/                  # 📚 문서
│   ├── 00_START_HERE.md
│   ├── 01_SERVICE_OVERVIEW.md
│   ├── 02_FEATURES.md
│   ├── 03_DATABASE.md
│   ├── 05_UI_STRUCTURE.md
│   ├── 99_DECISIONS.md
│   ├── plan/             # 상세 기획 문서
│   ├── data/             # 데이터 문서 (MBTI, 테마, 코멘트)
│   └── design/           # 와이어프레임
│
├── src/                  # 🚀 소스 코드 (예정)
│   ├── components/
│   ├── pages/
│   ├── data/
│   └── utils/
│
├── PROGRESS.md
├── SESSION_LOG.md
└── TODO.md
```

---

## 🛠️ 기술 스택

| 영역      | 기술            | 선택 이유             |
| --------- | --------------- | --------------------- |
| Frontend  | React 18 (Vite) | 빠른 HMR, 간단한 설정 |
| Routing   | React Router v6 | SPA 표준 라우팅       |
| Animation | Framer Motion   | 스와이프 제스처 지원  |
| Styling   | Tailwind CSS    | 모바일 우선 반응형    |
| State     | LocalStorage    | MVP 단계 간단한 저장  |
| Deploy    | Vercel          | 무료, 자동 배포       |

자세한 기술 결정 이유는 [99_DECISIONS.md](./docs/99_DECISIONS.md) 참조

---

## 📱 화면 구성

### 1. 랜딩페이지

- Hero Section + CTA
- 3가지 핵심 기능 소개
- 예시 결과 미리보기

### 2. 온보딩

- MBTI 선택 (16개 버튼)
- 로딩 화면 (3초)

### 3. 메인페이지 ⭐

- **가상 자산 카드** (MBTI 코멘트 포함)
- **5개 테마 스와이프**
- **테마별 10개 종목 리스트**
- 종목 상세 모달

### 4. 기타

- 커뮤니티 (목업)
- 자산현황 (목업)
- 설정

상세 와이어프레임은 [design/와이어프레임.md](./docs/design/와이어프레임.md) 참조

---

## 📊 현재 진행 상황

```
████████████░░░░░░░░ 60%
```

### ✅ 완료 (60%)

- [x] 기획 문서 작성 (100%)
- [x] 데이터 준비 (80%)
  - [x] MBTI 리스트 (16개)
  - [x] 투자 테마 (80개)
  - [x] MBTI 코멘트 (144개)
  - [x] 코스닥150 샘플 (50개)
- [x] 디자인 (100%)
  - [x] 와이어프레임 (8개 화면)
  - [x] 컴포넌트 구조
  - [x] 디자인 토큰
- [x] 문서화 (100%)

### 🚧 진행 중 (0%)

- [ ] 프로젝트 셋업
- [ ] JSON 데이터 파일 생성
- [ ] 컴포넌트 개발

### 📅 예상 완료일

**2026-02-10** (MVP 배포)

---

## 🎯 MVP 범위

### ✅ Phase 1 (현재 목표)

**UI/UX**: 모든 페이지 구조 완성  
**기능**: 핵심 기능만 구현  
**데이터**: 정적 JSON

- 랜딩페이지
- MBTI 선택 → 로딩 → 메인페이지
- 가상 자산 + MBTI 코멘트
- 5개 테마 스와이프
- 테마별 10개 종목 리스트
- 종목 상세 모달
- 설정 페이지

### ⏸️ Phase 2 (향후)

- AI 캐릭터 생성 (LLM 연동)
- 실시간 주가 데이터
- 북마크 기능
- 커뮤니티 실제 구현
- 가상 포트폴리오 관리

---

## 💡 차별화 포인트

### 기존 서비스 vs 우리 서비스

```
기존 방식:
"삼성전자는 PER 15배, PBR 1.2배입니다."

우리 방식:
"당신의 INTJ 성향에 맞는 '천천히 쌓이는 성' 같은 종목이에요.
단기 변동에 흔들리지 않고 장기적으로 견고하게 성장하는 스타일입니다."
```

### 주요 특징

1. **은유 기반 설명** - 숫자가 아닌 스토리로 전달
2. **MBTI 성향 반영** - 같은 종목도 MBTI별로 다른 설명
3. **모바일 앱 경험** - 스와이프, 애니메이션
4. **재미 + 실용성** - 가상 자산 + 시장 코멘트

---

## ⚠️ 면책 조항

> **본 서비스는 엔터테인먼트 목적으로 제공되며, 실제 투자 조언이나 금융 상담이 아닙니다.**  
> 투자 결정은 본인의 책임 하에 이루어져야 합니다.

---

## 📝 라이선스

조별과제 프로젝트 (교육 목적)

---

## 👥 팀

조별과제 프로젝트

---

_최종 업데이트: 2026-01-16_
