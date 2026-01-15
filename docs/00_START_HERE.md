# MBTI 투자 캐릭터 생성기

> MBTI로 알아보는 나의 투자 성향 - 성격 유형 기반 맞춤형 주식 추천 서비스

## 이 프로젝트는?

MBTI 성격 유형을 투자 성향으로 재해석하여, 사용자에게 맞춤형 주식 테마와 종목을 추천하는 엔터테인먼트 웹 서비스입니다. 복잡한 투자 개념을 은유적 표현으로 쉽게 전달하며, 모바일 앱과 같은 직관적인 UX를 제공합니다.

## 목표

- [x] MBTI 16개 유형별 투자 성향 정의 및 데이터 구축
- [x] 모바일 앱 스타일의 직관적인 UI/UX 설계
- [ ] React + Vite 기반 프론트엔드 구현
- [ ] 가상 포트폴리오 및 MBTI별 코멘트 시스템 구현
- [ ] 5개 테마 × 10개 종목 추천 시스템 구현

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| Frontend | React 18 (Vite) | 빠른 개발 환경, HMR 지원 |
| Routing | React Router v6 | SPA 라우팅 |
| Animation | Framer Motion | 스와이프 제스처, 부드러운 애니메이션 |
| Styling | Tailwind CSS | 모바일 우선 반응형 디자인 |
| State | LocalStorage | MVP 단계 간단한 상태 관리 |
| 배포 | Vercel | 무료, 자동 배포, 최적화 |

## 문서 목록

| 문서 | 설명 | 상태 |
|------|------|:----:|
| [00_START_HERE](./00_START_HERE.md) | 프로젝트 시작 가이드 | ✅ |
| [01_SERVICE_OVERVIEW](./01_SERVICE_OVERVIEW.md) | 서비스 개요 및 핵심 가치 | ✅ |
| [02_FEATURES](./02_FEATURES.md) | 기능 명세 (온보딩/메인/설정) | ✅ |
| [03_DATABASE](./03_DATABASE.md) | 데이터 구조 (MBTI/테마/종목) | ✅ |
| [05_UI_STRUCTURE](./05_UI_STRUCTURE.md) | UI 구조 및 와이어프레임 | ✅ |
| [99_DECISIONS](./99_DECISIONS.md) | 기술 결정 및 트레이드오프 | ✅ |

## 시작하려면

```bash
# 프로젝트 생성 (아직 미실행)
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

## 프로젝트 현황

- 📊 진행 상황: [PROGRESS.md](./PROGRESS.md)
- 📝 세션 기록: [SESSION_LOG.md](./SESSION_LOG.md)
- ✅ 할 일: [TODO.md](./TODO.md)

## 주요 특징

### 🎯 차별화 포인트
- **은유 기반 설명**: "천천히 쌓이는 성", "로켓 발사" 등 직관적 표현
- **MBTI 성향 반영**: 16개 유형별 맞춤 테마 (총 80개)
- **모바일 앱 경험**: 스와이프 제스처, 부드러운 애니메이션
- **재미 + 실용성**: 가상 자산 + MBTI별 시장 코멘트

### 📱 MVP 범위 (Phase 1)
- ✅ 모든 UI/UX 페이지 구조 완성
- ✅ 핵심 기능: MBTI 선택 → 가상 자산 → 테마별 종목 추천
- ⏸️ 목업: 커뮤니티, 자산현황 (껍데기만)
- ⏸️ Phase 2: AI 연동, 실시간 주가, 북마크

## 데이터 현황

### ✅ 완료된 데이터
- **MBTI 리스트**: 16개 유형별 투자 성향 정의
- **투자 테마**: 80개 (16 MBTI × 5 테마)
- **MBTI 코멘트**: 144개 (16 MBTI × 3 상황 × 3 변형)
- **코스닥150 샘플**: 50개 기업 리스트

### ⏳ 작업 필요
- 테마별 종목 매칭 (80개 테마 × 10개 종목)
- JSON 데이터 구조 생성
- 은유 표현 작성

## 디렉토리 구조

```
mbti_stock/
├── docs/                    # 📚 문서
│   ├── 00_START_HERE.md
│   ├── 01_SERVICE_OVERVIEW.md
│   ├── 02_FEATURES.md
│   ├── 03_DATABASE.md
│   ├── 05_UI_STRUCTURE.md
│   ├── 99_DECISIONS.md
│   │
│   ├── plan/               # 기획 문서
│   │   ├── 00_프로젝트_개요.md
│   │   ├── 01_비즈니스_요구사항.md
│   │   ├── 02_서비스_기획_랜딩페이지.md
│   │   ├── 02_서비스_기획_메인페이지.md
│   │   ├── 02_서비스_기획_온보딩.md
│   │   └── 기획_문서_검토_및_개선방안.md
│   │
│   ├── data/               # 데이터 문서
│   │   ├── MBTI_리스트.md
│   │   ├── MBTI별_투자_테마.md
│   │   ├── MBTI_코멘트_전체.md
│   │   └── 코스닥150_기업_리스트.md
│   │
│   └── design/             # 디자인 문서
│       └── 와이어프레임.md
│
├── src/                    # 🚀 소스 코드 (예정)
│   ├── components/         # React 컴포넌트
│   ├── pages/             # 페이지
│   ├── data/              # JSON 데이터
│   └── utils/             # 유틸리티
│
├── PROGRESS.md            # 진행 상황
├── SESSION_LOG.md         # 세션 기록
└── TODO.md                # 할 일 목록
```

---

*최종 업데이트: 2026-01-15*
*조별과제 프로젝트 | 개발 시작 예정*
