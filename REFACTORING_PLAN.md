# 리팩토링 실행 계획 V2

> **기반 문서**: `REFACTORING_REPORT_V2.md`
> **시작일**: 2026-01-15
> **목표**: 상태 관리 현대화 및 UI 구조 개선
> **현재 상태**: ✅ 전체 완료

---

## Phase 1: 상태 관리 현대화 (Custom Hooks) 🛠️
> `utils/storage.js`의 함수형 접근 방식을 리액티브한 커스텀 훅으로 전환

### Task 1.1: useLocalStorage 훅 생성 ✅
- **파일**: `src/hooks/useLocalStorage.js`
- **내용**: `useState`와 `useEffect`를 사용하여 localStorage 동기화 구현

### Task 1.2: 도메인 전용 훅 생성 ✅
- **파일**: `src/hooks/useMBTI.js`, `src/hooks/usePortfolio.js`, `src/hooks/useSettings.js`
- **내용**: `useLocalStorage`를 활용하여 각 도메인별 상태 관리 로직 캡슐화

### Task 1.3: 컴포넌트에 훅 적용 ✅
- **대상**: `App.jsx`, `MainPage.jsx`, `SettingsPage.jsx`, `PortfolioPage.jsx` 등
- **내용**: 기존 `getMBTI()`, `getSettings()` 등의 직조 호출을 훅(`useMBTI()`)으로 대체

---

## Phase 2: 랜딩 페이지 구조 개선 🧱
> 비대한 `LandingPage.jsx`를 섹션별로 분리하고 데이터 상수화

### Task 2.1: 상수 데이터 분리 ✅
- **파일**: `src/constants/landing.js`
- **내용**: `features`, `sampleMBTIs` 등의 하드코딩 데이터를 별도 파일로 이동

### Task 2.2: 섹션 컴포넌트 분리 ✅
- **폴더**: `src/pages/landing/`
- **컴포넌트**:
  - `HeroSection.jsx`: 메인 히어로 영역
  - `FeatureSection.jsx`: 특징 소개 영역
  - `PreviewSection.jsx`: MBTI 미리보기 영역
  - `DifferentiationSection.jsx`: 기존 방식과의 차이점 영역

### Task 2.3: LandingPage 재조립 ✅
- **파일**: `src/pages/LandingPage.jsx`
- **내용**: 분리된 섹션 컴포넌트들을 조립하여 간결하게 구성

---

## Phase 3: 온보딩 및 공통 상수화 📦
> 여러 곳에 흩어진 MBTI 관련 데이터를 공통 상수로 통합

### Task 3.1: MBTI 공통 상수 정의 ✅
- **파일**: `src/constants/mbti.js`
- **내용**: `OnboardingPage.jsx`에 있는 `MBTI_EMOJI`, `MBTI_DESC`, `groups` 데이터 이동

### Task 3.2: OnboardingPage 리팩토링 ✅
- **파일**: `src/pages/OnboardingPage.jsx`
- **내용**: `src/constants/mbti.js`를 import하여 사용하도록 수정

---

## Phase 4: UI/UX 고도화 (선택) 🎨
> 재사용 가능한 모달 및 접근성 개선

### Task 4.1: 공통 ConfirmModal 생성 ✅
- **파일**: `src/components/common/ConfirmModal.jsx`
- **내용**: `SettingsPage`의 초기화/변경 확인 모달을 공통 컴포넌트로 추출

### Task 4.2: SettingsPage 리팩토링 ✅
- **파일**: `src/pages/SettingsPage.jsx`
- **내용**: 인라인 모달 제거하고 `ConfirmModal` 사용

---

## 진행 로그

| 단계 | 작업 | 상태 | 시작 시간 |
|------|------|------|-----------|
| Phase 1 | Task 1.1: useLocalStorage 생성 | ✅ 완료 | - |
| Phase 1 | Task 1.2: 도메인 훅 생성 | ✅ 완료 | - |
| Phase 1 | Task 1.3: 훅 적용 | ✅ 완료 | - |
| Phase 2 | LandingPage 리팩토링 | ✅ 완료 | - |
| Phase 3 | OnboardingPage 리팩토링 | ✅ 완료 | - |
| Phase 4 | UI/UX 고도화 | ✅ 완료 | - |
